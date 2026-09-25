#!/usr/bin/env node
/**
 * 七个新语种是否已经和西语（全站基准）对齐？（2026-09-24）
 *
 * 甲方 09-24：「七个新语言全部对齐英西葡的内容量，翻译全对，内容都齐全」，
 * 并且要全栈全站上线，而不是现在每种语言 7 页的市场落地站（西语、葡语各 746 页）。
 *
 * 基准是西语：它是英文之外覆盖最全的一种。每一项都拿新语种和西语比，不拿绝对数：
 * 西语以后变多，新语种的及格线跟着变高。
 *
 * 五项，全部达到才算这一语种完成：
 *   1 registered  src/data/locales.ts 的 `locales` 里有它（界面、hreflang、sitemap 都从这里来）
 *   2 routes      src/app/<code>/ 下 page.tsx 数量 ≥ 西语
 *   3 pages       out/<code>/ 导出的 HTML 数量 ≥ 西语的 98%（发布产物；本地没构建时读仓库里的 out/）
 *   4 products    HYDE 在售产品中「名称 + 摘要 + 规格」都有该语种的比例 ≥ 西语
 *   5 articles    指南 + 新闻中「标题 + 摘要 + 正文」都有该语种的比例 ≥ 西语
 *
 * 译文可以放在两种位置，脚本都认：
 *   a. 记录里的后缀字段：nameFr / summaryFr / specsFr / titleFr / bodyFr（沿用西葡的做法）
 *   b. 旁挂文件（多语言会话 2026-09-25 的方案）：content/i18n/<code>/products.json、guides.json、news.json，
 *      一类一个文件，以记录的 slug 为键，值里字段名不带后缀（name / summary / specs / title / body）。
 *      也认每条一个文件的写法 content/i18n/<code>/<kind>/<file>.json。
 *
 * 「翻译全对」机器只能查一部分：这里另外报告译文里残留的英文句子数（连续 6 个以上英文单词），
 * 作为警示，不计入及格判定；准确性靠母语审校。
 *
 * 用法:
 *   node scripts/audit-locale-parity.mjs          # 表格
 *   node scripts/audit-locale-parity.mjs --json   # 机器读（Stop hook 用）
 *   node scripts/audit-locale-parity.mjs --check  # 有任何语种未完成则退出码 1
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const TARGETS = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const BASE = "es";
const JSON_OUT = process.argv.includes("--json");
const CHECK = process.argv.includes("--check");

const suffix = (code) => code.charAt(0).toUpperCase() + code.slice(1);
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const nonEmpty = (v) =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null && typeof v === "object" ? Object.keys(v).length > 0 : false;

function count(dir, test) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) n += count(p, test);
    else if (test(e)) n += 1;
  }
  return n;
}

const localesSrc = readFileSync("src/data/locales.ts", "utf8");
const registered = new Set((localesSrc.match(/export const locales = \[([^\]]*)\]/)?.[1] ?? "").match(/"([a-z-]+)"/g)?.map((s) => s.slice(1, -1)) ?? []);

// field lookup: suffixed field on the record, else sidecar without suffix
function field(record, sidecar, base, code) {
  if (code === "en") return record[base];
  const v = record[base + suffix(code)];
  if (nonEmpty(v)) return v;
  return sidecar?.[base];
}
const bundles = new Map();
function bundle(kind, code) {
  const key = kind + "/" + code;
  if (!bundles.has(key)) {
    const p = join("content/i18n", code, kind + ".json");
    let data = null;
    if (existsSync(p)) { try { data = readJson(p); } catch { data = null; } }
    bundles.set(key, data);
  }
  return bundles.get(key);
}
const sidecarOf = (kind, code, file, record) => {
  const b = bundle(kind, code);
  const slug = record?.slug ?? file.replace(/\.json$/, "");
  if (b && b[slug]) return b[slug];
  const p = join("content/i18n", code, kind, file);
  return existsSync(p) ? readJson(p) : null;
};

const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => [f, readJson(join("content/products", f))])
  .filter(([, p]) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);

const articles = ["guides", "news"].flatMap((kind) =>
  existsSync(join("content", kind))
    ? readdirSync(join("content", kind))
        .filter((f) => f.endsWith(".json"))
        .map((f) => [kind, f, readJson(join("content", kind, f))])
    : [],
);

function productCoverage(code) {
  let ok = 0;
  for (const [f, p] of products) {
    const s = code === "en" ? null : sidecarOf("products", code, f, p);
    if (["name", "summary", "specs"].every((k) => nonEmpty(field(p, s, k, code)))) ok += 1;
  }
  return ok / products.length;
}
function articleCoverage(code) {
  let ok = 0;
  for (const [kind, f, a] of articles) {
    const s = code === "en" ? null : sidecarOf(kind, code, f, a);
    if (["title", "summary", "body"].every((k) => nonEmpty(field(a, s, k, code)))) ok += 1;
  }
  return ok / articles.length;
}
// English leftovers inside translated product summaries and article bodies (warning only)
function englishLeftovers(code) {
  const re = /\b(?:[A-Za-z]{2,}[ ,]+){5,}[A-Za-z]{2,}\b/g;
  const skip = /\b(HYDE|Canton Hyland|EN \d|ISO \d|mm\b)/;
  let n = 0;
  const scan = (v) => {
    if (typeof v === "string") n += (v.match(re) ?? []).filter((m) => !skip.test(m)).length;
    else if (Array.isArray(v)) v.forEach(scan);
    else if (v && typeof v === "object") Object.values(v).forEach(scan);
  };
  if (code === "en") return 0;
  for (const [f, p] of products) scan(field(p, sidecarOf("products", code, f, p), "summary", code));
  for (const [kind, f, a] of articles) scan(field(a, sidecarOf(kind, code, f, a), "body", code));
  return n;
}

const routesOf = (code) => count(join("src/app", code), (e) => e === "page.tsx");
const pagesOf = (code) => count(join("out", code), (e) => e.endsWith(".html"));

const base = {
  routes: routesOf(BASE),
  pages: pagesOf(BASE),
  products: productCoverage(BASE),
  articles: articleCoverage(BASE),
};

const rows = TARGETS.map((code) => {
  const r = {
    code,
    registered: registered.has(code),
    routes: routesOf(code),
    pages: pagesOf(code),
    products: productCoverage(code),
    articles: articleCoverage(code),
    englishLeftovers: englishLeftovers(code),
  };
  r.pass = {
    registered: r.registered,
    routes: r.routes >= base.routes,
    pages: r.pages >= Math.floor(base.pages * 0.98),
    products: r.products >= base.products - 1e-9,
    articles: r.articles >= base.articles - 1e-9,
  };
  r.done = Object.values(r.pass).every(Boolean);
  // 0–100 progress, equal weight per criterion, partial credit by ratio to the baseline
  const ratio = (a, b) => (b ? Math.min(1, a / b) : 1);
  r.progress = Math.round(
    100 *
      ((r.registered ? 1 : 0) +
        ratio(r.routes, base.routes) +
        ratio(r.pages, base.pages) +
        ratio(r.products, base.products) +
        ratio(r.articles, base.articles)) /
      5,
  );
  return r;
});

const summary = { base: { code: BASE, ...base }, rows, allDone: rows.every((r) => r.done) };

if (JSON_OUT) {
  console.log(JSON.stringify(summary));
} else {
  const pct = (x) => `${Math.round(x * 100)}%`;
  console.log(`基准 ${BASE}: routes ${base.routes}, pages ${base.pages}, products ${pct(base.products)}, articles ${pct(base.articles)}`);
  console.log("code  locales  routes  pages   products  articles  英文残留  进度  完成");
  for (const r of rows) {
    const m = (ok) => (ok ? "✓" : "✗");
    console.log(
      `${r.code.padEnd(5)} ${m(r.pass.registered).padEnd(8)} ${`${r.routes}${m(r.pass.routes)}`.padEnd(7)} ${`${r.pages}${m(r.pass.pages)}`.padEnd(7)} ${`${pct(r.products)}${m(r.pass.products)}`.padEnd(9)} ${`${pct(r.articles)}${m(r.pass.articles)}`.padEnd(9)} ${String(r.englishLeftovers).padEnd(8)} ${String(r.progress).padStart(3)}%  ${r.done ? "是" : "否"}`,
    );
  }
}
if (CHECK && !summary.allDone) process.exitCode = 1;
