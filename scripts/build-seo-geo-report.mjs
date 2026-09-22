/**
 * 把一次 SEO/GEO 数据导出(GA4 + Search Console + Bing + Clarity)读成一份摘要。
 *
 * 为什么是脚本:
 * 这些 CSV 在仓库外(客户的下载目录),下个月再导一次文件名和行数都会变。把数字
 * 手抄进报告,三周后没人能判断「AI 引用 184 次」还成不成立。脚本读目录、写
 * docs/research/ 下带日期的摘要,所以每一份报告都能重跑、能对比。
 *
 * 分析不在这里。脚本只负责把数字取准。
 *
 * 用法:
 *   node scripts/build-seo-geo-report.mjs "C:/Users/johns/Downloads/SEOGEO 922"
 *   node scripts/build-seo-geo-report.mjs <dir> --out docs/research/SEO-GEO-DIGEST-2026-09-22.md
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";

const args = process.argv.slice(2);
const DIR = args.find((a) => !a.startsWith("--"));
const outAt = args.indexOf("--out");
if (!DIR || !existsSync(DIR)) {
  console.error("用法: node scripts/build-seo-geo-report.mjs <导出目录> [--out <md 路径>]");
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const OUT = outAt !== -1 ? args[outAt + 1] : `docs/research/SEO-GEO-DIGEST-${today}.md`;

/* ── CSV ─────────────────────────────────────────────────────────────────── */

/** 一行 CSV → 字段数组。处理引号、引号内逗号、"" 转义。 */
function splitRow(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const num = (v) => {
  const n = Number(String(v ?? "").replace(/[",%\s]/g, ""));
  return Number.isFinite(n) ? n : null;
};

/**
 * 一个文件 → 若干张表。GA4 的导出是「# 注释块 + 表头 + 数据」,而且一个文件里
 * 可能有好几张表(空行分隔,后面又是一行表头)。Clarity 是「"Metric",标题,...」
 * 起头的分段。两种都归成 {title, header, rows}。
 */
function parseTables(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const tables = [];
  let cur = null;
  const flush = () => {
    if (cur && cur.rows.length) tables.push(cur);
    cur = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    if (line.startsWith("#")) continue; // GA4 注释块

    const cells = splitRow(line);
    const looksNumeric = cells.slice(1).some((c) => num(c) !== null && c !== "");

    if (!cur) {
      cur = { header: cells, rows: [] };
      continue;
    }
    // Clarity:一行 "Metric",... 开一张新表
    if (cells[0] === "Metric") {
      flush();
      cur = { header: cells, rows: [] };
      continue;
    }
    // 列数对不上且不像数据 → 视为新表头
    if (cells.length !== cur.header.length && !looksNumeric) {
      flush();
      cur = { header: cells, rows: [] };
      continue;
    }
    cur.rows.push(cells);
  }
  flush();
  return tables;
}

/* ── 读目录 ──────────────────────────────────────────────────────────────── */

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );

const all = walk(DIR);
const csvs = all.filter((f) => /\.csv$/i.test(f));
const others = all.filter((f) => !/\.csv$/i.test(f));

const docs = csvs.map((f) => ({
  path: f,
  rel: relative(DIR, f).split("\\").join("/"),
  name: basename(f, ".csv"),
  tables: parseTables(readFileSync(f, "utf8")),
}));

/** 按相对路径片段找一个文件。 */
const find = (...frags) =>
  docs.find((d) => frags.every((s) => d.rel.toLowerCase().includes(s.toLowerCase())));

/** 一张表 → markdown,最多 n 行。 */
function table(t, n = 15) {
  if (!t) return "_(没有这张表)_\n";
  const head = `| ${t.header.join(" | ")} |`;
  const sep = `| ${t.header.map(() => "---").join(" | ")} |`;
  const body = t.rows.slice(0, n).map((r) => `| ${r.join(" | ")} |`);
  const more = t.rows.length > n ? `\n\n_共 ${t.rows.length} 行,上面是前 ${n} 行_` : "";
  return [head, sep, ...body].join("\n") + more + "\n";
}

/** 某一列求和。 */
const sum = (t, col) =>
  t ? t.rows.reduce((s, r) => s + (num(r[col]) ?? 0), 0) : 0;

const out = [];
const say = (s = "") => out.push(s);

say(`# SEO / GEO 数据摘要 — ${today}`);
say();
say(`由 \`scripts/build-seo-geo-report.mjs\` 生成,源目录 \`${DIR}\`。`);
say(`**这是数字,不是结论。** 重跑即可对比下一次导出。`);
say();
say(`来源文件:**${csvs.length} 个 CSV**` + (others.length ? `,另有 ${others.length} 个非 CSV(${others.map((f) => basename(f)).join(", ")})` : ""));
say();

/* ── 1. Google Search Console:自然搜索 ──────────────────────────────────── */
say(`## 1. Google Search Console — 自然搜索(过去 3 个月)`);
say();
const gscChart = find("Performance-on-Search-2026", "图表");
const gscQuery = find("Performance-on-Search-2026", "查询数");
const gscPage = find("Performance-on-Search-2026", "网页");
const gscCountry = find("Performance-on-Search-2026", "国家");
const gscDevice = find("Performance-on-Search-2026", "设备");

if (gscChart) {
  const t = gscChart.tables[0];
  const clicks = sum(t, 1);
  const impr = sum(t, 2);
  say(`区间合计:**点击 ${clicks}**,**展示 ${impr}**,整体点击率 ${impr ? ((clicks / impr) * 100).toFixed(2) : 0}%`);
  say();
  // 按月分组,看趋势
  const byMonth = {};
  for (const r of t.rows) {
    const m = String(r[0]).slice(0, 7);
    byMonth[m] = byMonth[m] ?? { c: 0, i: 0, d: 0 };
    byMonth[m].c += num(r[1]) ?? 0;
    byMonth[m].i += num(r[2]) ?? 0;
    byMonth[m].d += 1;
  }
  say(`| 月份 | 天数 | 点击 | 展示 | 点击率 | 日均展示 |`);
  say(`| --- | --- | --- | --- | --- | --- |`);
  for (const [m, v] of Object.entries(byMonth).sort())
    say(`| ${m} | ${v.d} | ${v.c} | ${v.i} | ${v.i ? ((v.c / v.i) * 100).toFixed(2) : 0}% | ${(v.i / v.d).toFixed(1)} |`);
  say();
}
say(`### 热门查询`);
say(table(gscQuery?.tables[0], 20));
say(`### 排名靠前的网页`);
say(table(gscPage?.tables[0], 20));
say(`### 国家/地区`);
say(table(gscCountry?.tables[0], 12));
say(`### 设备`);
say(table(gscDevice?.tables[0], 5));

/* ── 2. Google AI 功能(AI Overview) ─────────────────────────────────────── */
say(`## 2. Google 生成式 AI 功能 — AI Overview 展示`);
say();
const aiChart = find("Generative-AI", "图表");
const aiPage = find("Generative-AI", "网页");
const aiCountry = find("Generative-AI", "国家");
const aiDevice = find("Generative-AI", "设备");
if (aiChart) {
  const t = aiChart.tables[0];
  say(`区间合计展示:**${sum(t, 1)}**`);
  const byMonth = {};
  for (const r of t.rows) {
    const m = String(r[0]).slice(0, 7);
    byMonth[m] = (byMonth[m] ?? 0) + (num(r[1]) ?? 0);
  }
  say();
  say(`| 月份 | AI 展示 |`);
  say(`| --- | --- |`);
  for (const [m, v] of Object.entries(byMonth).sort()) say(`| ${m} | ${v} |`);
  say();
}
say(`### 被 AI 功能引用最多的页面`);
say(table(aiPage?.tables[0], 20));
say(`### 国家`);
say(table(aiCountry?.tables[0], 10));
say(`### 设备`);
say(table(aiDevice?.tables[0], 5));

/* ── 3. Bing ─────────────────────────────────────────────────────────────── */
say(`## 3. Bing Webmaster`);
say();
const bOverview = find("SearchPerformanceOverview");
const bKeyword = find("KeywordReport");
const bPage = find("PageTrafficReport");
if (bOverview) {
  const t = bOverview.tables[0];
  say(`区间合计:**点击 ${sum(t, 1)}**,**展示 ${sum(t, 2)}**,覆盖 ${t.rows.length} 天`);
  say();
}
say(`### 关键词`);
say(table(bKeyword?.tables[0], 20));
say(`### 页面`);
say(table(bPage?.tables[0], 20));

/* ── 4. Bing AI 引用 ─────────────────────────────────────────────────────── */
say(`## 4. Bing AI 引用`);
say();
const aiPageStats = find("AIPageStatsReport");
const aiQueries = find("AISearchQueriesReport");
if (aiPageStats) {
  const t = aiPageStats.tables[0];
  say(`被 AI 引用的页面:**${t.rows.length} 个**,引用合计 **${sum(t, 1)}** 次`);
  say();
}
say(`### 引用最多的页面`);
say(table(aiPageStats?.tables[0], 25));
say(`### AI 搜索查询`);
say(table(aiQueries?.tables[0], 10));

/* ── 5. Clarity ──────────────────────────────────────────────────────────── */
say(`## 5. Microsoft Clarity`);
say();
for (const d of docs.filter((x) => /Clarity/i.test(x.rel))) {
  say(`### \`${d.rel}\``);
  for (const t of d.tables) {
    if (!t.rows.length) continue;
    say(table(t, 20));
    say();
  }
}

/* ── 6. GA4 ──────────────────────────────────────────────────────────────── */
say(`## 6. GA4`);
say();
const ga = [
  ["着陆页", find("着陆页_着陆页"), 20],
  ["流量来源/媒介", find("流量获取情况_带来会话的来源_媒介"), 15],
  ["首次互动渠道组", find("用户获取情况_带来用户首次互动的主渠道组"), 12],
  ["事件", find("事件_事件名称"), 15],
  ["国家/地区", find("受众特征详情_国家_地区"), 15],
  ["语言", find("受众特征详情_语言"), 10],
  ["设备类别", find("技术详情_设备类别"), 6],
  ["Google 自然搜索查询", find("查询_Google_搜索自然查询.csv"), 20],
];
for (const [title, doc, n] of ga) {
  say(`### ${title}`);
  say(table(doc?.tables[0], n));
  say();
}

/* ── 7. 文件清单 ─────────────────────────────────────────────────────────── */
say(`## 7. 这次导出的全部文件`);
say();
say(`| 文件 | 表数 | 数据行数 |`);
say(`| --- | --- | --- |`);
for (const d of docs.sort((a, b) => a.rel.localeCompare(b.rel)))
  say(`| \`${d.rel}\` | ${d.tables.length} | ${d.tables.reduce((s, t) => s + t.rows.length, 0)} |`);
say();

writeFileSync(OUT, out.join("\n"));
console.log(`seo-geo-digest: ${OUT}`);
console.log(`  读入 ${csvs.length} 个 CSV,共 ${docs.reduce((s, d) => s + d.tables.length, 0)} 张表`);
