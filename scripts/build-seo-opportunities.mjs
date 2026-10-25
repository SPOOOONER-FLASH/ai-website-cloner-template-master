/**
 * 每周 SEO 复盘的第 ②③④ 步，接在 build-weekly-kpis.mjs（第 ① 步：总数周环比）后面。
 *
 *   ② 有曝光、点击少的网页：先改标题和描述，因为已经有人看到它了
 *   ③ 排第 8–20 名的查询词：内容再补一节、加内链，最有希望进前排
 *   ④ 这一周上线改了什么：从上线日志里取，过几周回头对照数据变化
 *
 * 数据：最新一期 docs/research/analytics/<日期>/raw/ 里的 GSC xlsx 导出（甲方每周一发）。
 * 有几份就看几份，按「图表」页的天数挑最接近 28 天的一份；28 天比 7 天稳，单日波动不会误导。
 *
 * 用法：
 *   node scripts/build-seo-opportunities.mjs           # 打印
 *   node scripts/build-seo-opportunities.mjs --write   # 同时写到最新一期目录的 SEO-OPPORTUNITIES.md
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";

const ROOT = "docs/research/analytics";
const RELEASES = "docs/collaboration/上线日志-RELEASES.md";
const latest = readdirSync(ROOT)
  .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && statSync(join(ROOT, d)).isDirectory())
  .sort()
  .at(-1);
const RAW = join(ROOT, latest, "raw");

const unxml = (s) =>
  s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");

/** { 工作表名: 行[][] }，只读出值，够用即可。 */
async function readXlsx(path) {
  const z = await JSZip.loadAsync(readFileSync(path));
  const shared = await z.file("xl/sharedStrings.xml")?.async("string");
  const strings = shared ? [...shared.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => unxml(m[1])) : [];
  const wb = await z.file("xl/workbook.xml").async("string");
  const rels = await z.file("xl/_rels/workbook.xml.rels").async("string");
  const sheets = {};
  for (const [, name, rid] of wb.matchAll(/<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)) {
    const target = new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"|Target="([^"]+)"[^>]*Id="${rid}"`).exec(rels);
    const xml = await z.file(`xl/${target[1] ?? target[2]}`).async("string");
    sheets[name] = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((r) =>
      [...r[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map(([, attrs, body = ""]) => {
        const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
        if (/t="s"/.test(attrs)) return strings[Number(v)];
        if (/t="inlineStr"/.test(attrs)) return unxml(body);
        return v === undefined ? "" : unxml(v);
      }),
    );
  }
  return sheets;
}

const num = (s) => Number(String(s ?? "").replace(/[,%]/g, "")) || 0;
/** GSC 的点击率有时是 0.0123，有时是 "1.23%"。统一成百分数。 */
const pctOf = (s) => (String(s).includes("%") ? num(s) : num(s) * 100);

/*
  2026-10-25：数据源优先用 API 拉回的 raw/api/gsc-*.json（scripts/pull-analytics-api.mjs，28 天）。
  没有 API 数据的那一期，照旧读甲方导出的 xlsx。
*/
const API = join(RAW, "api");
const apiRows = (name) => {
  try {
    return JSON.parse(readFileSync(join(API, `gsc-${name}.json`), "utf8")).rows ?? [];
  } catch {
    return null;
  }
};
const exports = [];
let pick;
let rows;
if (apiRows("page") && apiRows("query")) {
  const dates = (apiRows("date") ?? []).map((r) => r.keys[0]).sort();
  pick = { f: "api/gsc-*.json", days: dates.length, from: dates[0], to: dates.at(-1) };
  rows = (name) =>
    apiRows(name === "网页" || name === "Pages" ? "page" : "query").map((r) => ({
      key: r.keys[0], clicks: r.clicks, impr: r.impressions, ctr: r.ctr * 100, pos: r.position,
    }));
} else {
  for (const f of readdirSync(RAW).filter((n) => /Performance-on-Search.*\.xlsx$/.test(n))) {
    const sheets = await readXlsx(join(RAW, f));
    const chart = sheets["图表"] ?? sheets.Dates ?? [];
    const dates = chart.slice(1).map((r) => r[0]).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
    exports.push({ f, sheets, days: dates.length, from: dates[0], to: dates.at(-1) });
  }
  if (!exports.length) throw new Error(`${RAW} 里没有 GSC 的 Performance-on-Search xlsx，也没有 raw/api/gsc-*.json`);
  pick = exports.sort((a, b) => Math.abs(a.days - 28) - Math.abs(b.days - 28))[0];
  rows = (name) =>
    (pick.sheets[name] ?? []).slice(1).map(([key, clicks, impr, ctr, pos]) => ({
      key, clicks: num(clicks), impr: num(impr), ctr: pctOf(ctr), pos: num(pos),
    }));
}

const pages = rows("网页").length ? rows("网页") : rows("Pages");
const queries = rows("查询数").length ? rows("查询数") : rows("Queries");

/*
  门槛按本站现在的量定（28 天几万次曝光）：太低会把单次波动列进来，太高清单就空了。
  ② 排名已在前 15，却几乎没人点 → 搜索结果里那两行没说清楚这页解决什么。
  ③ 排 8–20 名 → 已经被认为相关，差一点；补内容、补内链比写新文章快。
*/
const lowCtr = pages
  .filter((p) => p.impr >= 100 && p.pos <= 15 && p.ctr < 1)
  .sort((a, b) => b.impr - a.impr)
  .slice(0, 15);
const nearTop = queries
  .filter((q) => q.impr >= 20 && q.pos > 7.5 && q.pos <= 20)
  .sort((a, b) => b.impr - a.impr)
  .slice(0, 20);

/* ④：上线日志里落在这段日期内的版本。 */
const log = readFileSync(RELEASES, "utf8");
const shipped = [...log.matchAll(/^### (v(\d{4})\.(\d{2})\.(\d{2})\.\d+) · (\w+)[^\n]*\n\n[^\n]*\n\n((?:- [^\n]*\n)+)/gm)]
  .filter(([, , y, m, d]) => `${y}-${m}-${d}` >= pick.from && `${y}-${m}-${d}` <= pick.to)
  .map(([, version, y, m, d, type, items]) => ({
    day: `${y}-${m}-${d}`, version, type,
    items: items.trim().split("\n").map((l) => l.replace(/^- /, "").replace(/\s*`[0-9a-f]{12}`$/, "")).filter((l) => !l.startsWith("（")),
  }));
/* 一天可能发十几版，按天合并：几版、几条改动、头两条写的是什么。 */
const byDay = new Map();
for (const s of shipped) byDay.set(s.day, [...(byDay.get(s.day) ?? []), s]);

const path = (u) => u.replace(/^https?:\/\/[^/]+/, "") || "/";
const f1 = (n) => n.toFixed(1);
const out = [];
const p = (s = "") => out.push(s);
p(`# SEO 复盘清单 · ${pick.from} → ${pick.to}（${pick.days} 天）`);
p();
p(`由 \`scripts/build-seo-opportunities.mjs\` 从 \`${RAW}/${pick.f}\` 生成。第 ① 步（总数周环比）见 \`node scripts/build-weekly-kpis.mjs\`。`);
p();
p(`## ② 有曝光、点击少：先改标题和描述（${lowCtr.length}）`);
p();
p("排名已在前 15 名、28 天曝光 ≥ 100、点击率 < 1%。");
p();
p("| 网页 | 曝光 | 点击 | 点击率 | 排名 |");
p("|---|---|---|---|---|");
for (const r of lowCtr) p(`| ${path(r.key)} | ${r.impr} | ${r.clicks} | ${r.ctr.toFixed(2)}% | ${f1(r.pos)} |`);
p();
p(`## ③ 排第 8–20 名的查询词：补内容、补内链（${nearTop.length}）`);
p();
p("28 天曝光 ≥ 20。对应网页在 GSC 里点这个词 →「网页」查看。");
p();
const qp = apiRows("query-page") ?? [];
const rankingPage = (q) => {
  const best = qp.filter((r) => r.keys[0] === q).sort((a, b) => b.impressions - a.impressions)[0];
  return best ? `${path(best.keys[1])}（${f1(best.position)}）` : "—";
};
p("| 查询词 | 曝光 | 点击 | 排名 | 排名的网页（该页排名） |");
p("|---|---|---|---|---|");
for (const r of nearTop) p(`| ${r.key} | ${r.impr} | ${r.clicks} | ${f1(r.pos)} | ${rankingPage(r.key)} |`);
p();
/* ⑤ AI 助手带来的访问（GA4 落地页 × 来源，API 才有）：被 AI 引用的页面，要保证事实写在页面上。 */
let ai = [];
try {
  ai = JSON.parse(readFileSync(join(API, "ga4-landing-source.json"), "utf8")).rows
    .map((r) => ({ page: r.dimensionValues[0].value, source: r.dimensionValues[1].value, sessions: Number(r.metricValues[0].value), key: Number(r.metricValues[2].value) }))
    .filter((r) => /chatgpt|perplexity|copilot|gemini|claude|openai/i.test(r.source))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 15);
} catch {}
if (ai.length) {
  p(`## ⑤ AI 助手带来的访问：落地页（${ai.length}）`);
  p();
  p("GA4 落地页 × 来源，来源含 chatgpt / perplexity / copilot / gemini。这些页面是 AI 读过并推荐的，事实要写在页面上、能被引用。");
  p();
  p("| 落地页 | 来源 | 会话 | 关键事件 |");
  p("|---|---|---|---|");
  for (const r of ai) p(`| ${r.page} | ${r.source} | ${r.sessions} | ${r.key} |`);
  p();
}
p(`## ④ 这段时间上线了什么（${shipped.length} 版）`);
p();
p(`每版明细见 \`${RELEASES}\`。看数据变化时，对照变化前 1–2 周这里改了什么。`);
p();
p("| 日期 | 版数 | 改动条数 | 举例 |");
p("|---|---|---|---|");
for (const [day, list] of [...byDay].sort((a, b) => b[0].localeCompare(a[0]))) {
  const items = list.flatMap((s) => s.items);
  const eg = items.slice(0, 2).map((t) => (t.length > 40 ? `${t.slice(0, 40)}…` : t)).join("；");
  p(`| ${day} | ${list.length} | ${items.length} | ${eg.replace(/\|/g, "/")} |`);
}

const text = `${out.join("\n")}\n`;
console.log(text);
if (process.argv.includes("--write")) {
  writeFileSync(join(ROOT, latest, "SEO-OPPORTUNITIES.md"), text);
  console.log(`→ 写入 ${join(ROOT, latest, "SEO-OPPORTUNITIES.md")}`);
}
