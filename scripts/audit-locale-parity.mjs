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
 *   6 rendered    导出页面上看得见的句子里英文句子的占比 ≤ 2%（且不超过西语的两倍）
 *
 * 第 6 项是 2026-09-26 加的：1–5 项全过、看板十列 100% 的那一版，法语页面上仍有 27% 的句子是英文——
 * 文章正文的译文在旁挂文件里，页面组件却没读；首页、服务页、图片放大提示、页脚标语等界面句子
 * 没有进 ui.json。字段「有没有」不等于读者「看没看到」，所以最后一项直接量发布出来的 HTML。
 * 产品、系列、对比页数量大，按排序每 10 页抽 1 页；其余页面全量。
 *
 * 译文可以放在两种位置，脚本都认：
 *   a. 记录里的后缀字段：nameFr / summaryFr / specsFr / titleFr / bodyFr（沿用西葡的做法）
 *   b. 旁挂文件（多语言会话 2026-09-25 的方案）：content/i18n/<code>/products.json、guides.json、news.json，
 *      一类一个文件，以记录的 slug 为键，值里字段名不带后缀（name / summary / specs / title / body）。
 *      也认每条一个文件的写法 content/i18n/<code>/<kind>/<file>.json。
 *
 * 「翻译全对」机器只能查一部分：这里另外报告译文里残留的英文句子数（英文虚词占四分之一以上的句子），
 * 作为警示，不计入及格判定；准确性靠母语审校。
 *
 * 用法:
 *   node scripts/audit-locale-parity.mjs          # 表格
 *   node scripts/audit-locale-parity.mjs --json   # 机器读（Stop hook 用）
 *   node scripts/audit-locale-parity.mjs --check  # 有任何语种未完成则退出码 1
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

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
  let entries;
  try { entries = readdirSync(dir); } catch { return 0; }
  for (const e of entries) {
    const p = join(dir, e);
    // A build running at the same time can delete a file between readdir and stat.
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) n += count(p, test);
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
  // A sentence counts as English when at least a quarter of its words are English function
  // words. (A plain ASCII-run test flagged ordinary French and German; function words do not.)
  const EN = new Set("the and with for of is are to from this that which our we your it be by on as an at or into its their can will".split(" "));
  let n = 0;
  const scanText = (t) => {
    for (const sentence of t.split(/[.;:!?\n]+/)) {
      const words = sentence.toLowerCase().match(/[a-z]+/g) ?? [];
      if (words.length < 6) continue;
      const hits = words.filter((w) => EN.has(w)).length;
      if (hits >= 2 && hits / words.length >= 0.25) n += 1;
    }
  };
  const scan = (v) => {
    if (typeof v === "string") scanText(v);
    else if (Array.isArray(v)) v.forEach(scan);
    else if (v && typeof v === "object") Object.values(v).forEach(scan);
  };
  if (code === "en") return 0;
  for (const [f, p] of products) scan(field(p, sidecarOf("products", code, f, p), "summary", code));
  for (const [kind, f, a] of articles) scan(field(a, sidecarOf(kind, code, f, a), "body", code));
  return n;
}

// Criterion 6: English sentences in the rendered HTML (see the header note).
const FN = new Set("the and of to for with a an in on is are that this by from or as be it your our we you at which can not have has".split(" "));
const isEnglishLine = (line) => {
  const w = line.toLowerCase().match(/[a-z']+/g) ?? [];
  if (w.length < 5) return false;
  const letters = line.replace(/[^\p{L}]/gu, "");
  const latin = line.replace(/[^a-zA-Z]/g, "");
  if (latin.length / Math.max(1, letters.length) < 0.95) return false;
  if (/[àâçéèêëîïôûùüÿœæäöüßğış]/i.test(line)) return false;
  return w.filter((x) => FN.has(x)).length / w.length >= 0.25;
};
const visibleLines = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<(br|\/p|\/div|\/li|\/h\d|\/a|\/span|\/button|\/dt|\/dd|\/td|\/th|\/figcaption|\/summary)[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
    .split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => (l.match(/\p{L}+/gu) ?? []).length >= 5);
const htmlFiles = (dir) => {
  const out = [];
  const walk = (d) => {
    let entries;
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) out.push(p);
    }
  };
  walk(dir);
  return out.sort();
};
const SAMPLED = new Set(["products", "collections", "compare"]);
function renderedEnglish(code) {
  const dir = join("out", code);
  const bySection = {};
  for (const f of htmlFiles(dir)) (bySection[relative(dir, f).split(sep)[0]] ||= []).push(f);
  let en = 0, all = 0;
  const top = new Map();
  for (const [section, files] of Object.entries(bySection)) {
    for (const [i, f] of files.entries()) {
      if (SAMPLED.has(section) && i % 10) continue;
      let html;
      try { html = readFileSync(f, "utf8"); } catch { continue; }
      for (const line of visibleLines(html)) {
        all += 1;
        if (isEnglishLine(line)) { en += 1; const k = line.slice(0, 90); top.set(k, (top.get(k) ?? 0) + 1); }
      }
    }
  }
  return { share: all ? en / all : 1, top: [...top].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, n]) => `${n}× ${k}`) };
}

const routesOf = (code) => count(join("src/app", code), (e) => e === "page.tsx");
const pagesOf = (code) => count(join("out", code), (e) => e.endsWith(".html"));

const base = {
  routes: routesOf(BASE),
  pages: pagesOf(BASE),
  products: productCoverage(BASE),
  articles: articleCoverage(BASE),
  rendered: renderedEnglish(BASE).share,
};
const RENDERED_MAX = Math.max(0.02, base.rendered * 2);

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
  const rendered = renderedEnglish(code);
  r.rendered = rendered.share;
  r.renderedTop = rendered.top;
  r.pass = {
    registered: r.registered,
    routes: r.routes >= base.routes,
    // A baseline of 0 means out/ is being rebuilt right now: unknown, so not a pass.
    pages: base.pages > 0 && r.pages >= Math.floor(base.pages * 0.98),
    products: r.products >= base.products - 1e-9,
    articles: r.articles >= base.articles - 1e-9,
    rendered: r.pages > 0 && r.rendered <= RENDERED_MAX,
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
        ratio(r.articles, base.articles) +
        (r.pages > 0 ? Math.max(0, 1 - Math.max(0, r.rendered - RENDERED_MAX) / (1 - RENDERED_MAX)) : 0)) /
      6,
  );
  return r;
});

const summary = { base: { code: BASE, ...base }, rows, allDone: rows.every((r) => r.done) };

if (JSON_OUT) {
  console.log(JSON.stringify(summary));
} else {
  const pct = (x) => `${Math.round(x * 100)}%`;
  console.log(`基准 ${BASE}: routes ${base.routes}, pages ${base.pages}, products ${pct(base.products)}, articles ${pct(base.articles)}, 页面英文 ${(base.rendered * 100).toFixed(1)}%（及格线 ≤ ${(RENDERED_MAX * 100).toFixed(1)}%）`);
  console.log("code  locales  routes  pages   products  articles  页面英文  字段英文  进度  完成");
  for (const r of rows) {
    const m = (ok) => (ok ? "✓" : "✗");
    console.log(
      `${r.code.padEnd(5)} ${m(r.pass.registered).padEnd(8)} ${`${r.routes}${m(r.pass.routes)}`.padEnd(7)} ${`${r.pages}${m(r.pass.pages)}`.padEnd(7)} ${`${pct(r.products)}${m(r.pass.products)}`.padEnd(9)} ${`${pct(r.articles)}${m(r.pass.articles)}`.padEnd(9)} ${`${(r.rendered * 100).toFixed(1)}%${m(r.pass.rendered)}`.padEnd(9)} ${String(r.englishLeftovers).padEnd(8)} ${String(r.progress).padStart(3)}%  ${r.done ? "是" : "否"}`,
    );
  }
  for (const r of rows) if (!r.pass.rendered) console.log(`  ${r.code} 页面上最多的英文句子: ${r.renderedTop.join(" | ")}`);
}
if (CHECK && !summary.allDone) process.exitCode = 1;
