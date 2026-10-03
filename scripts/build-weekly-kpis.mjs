/**
 * 周报 KPI 表：本周、上周、周环比、同比 —— 从 docs/research/analytics/<日期>/raw/ 里已归档的导出算出来。
 *
 * 为什么是脚本：周报里的每个数字都得能重算。甲方每周导出的文件口径各不相同（GSC 按天、
 * GA4 按「第 N 天 / 第 N 周」、Bing AI 按天、Clarity 按区间），手算一次就错一次。这里把
 * 所有期的 raw/ 合在一起，按日期去重（新一期覆盖旧一期），再切成周一到周日的整周。
 *
 * 同比：只在数据真有去年同期时才算。GSC 导出默认 3 个月、GA4 2026-08 才装，所以现在打印
 * 「无去年同期」并说明要什么导出 —— 不编数字。
 *
 * 用法：
 *   node scripts/build-weekly-kpis.mjs                     # 自动取 GSC 最近一个整周
 *   node scripts/build-weekly-kpis.mjs --week 2026-09-21   # 指定周一
 *   node scripts/build-weekly-kpis.mjs --write             # 同时写到最新一期目录的 KPI-WOW.md
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "docs/research/analytics";
const periods = readdirSync(ROOT)
  .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && statSync(join(ROOT, d)).isDirectory())
  .sort();
const latest = periods.at(-1);

// ---------- CSV ----------
function parseLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
const read = (p) => readFileSync(p, "utf8").replace(/^﻿/, "").split(/\r?\n/);
const rows = (p) => read(p).filter((l) => l.trim() && !l.startsWith("#")).map(parseLine);
const num = (s) => Number(String(s ?? "").replace(/[%,]/g, "")) || 0;

function rawFiles(re) {
  const out = [];
  for (const d of periods) {
    const dir = join(ROOT, d, "raw");
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) if (re.test(f)) out.push({ period: d, path: join(dir, f), name: f });
  }
  return out;
}

// ---------- dates ----------
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(`${s}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const monday = (s) => { const d = new Date(`${s}T00:00:00Z`); const w = (d.getUTCDay() + 6) % 7; return addDays(s, -w); };
const normDate = (s) => {
  const m = String(s).match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` : null;
};
const week = (mon) => Array.from({ length: 7 }, (_, i) => addDays(mon, i));

// ---------- daily series, later period wins ----------
function mergeDaily(files, pick) {
  const series = new Map();
  for (const f of files) for (const r of rows(f.path)) {
    const d = normDate(r[0]);
    if (d) series.set(d, pick(r));
  }
  return series;
}
function sumWeek(series, mon, keys) {
  const days = week(mon).filter((d) => series.has(d));
  const tot = Object.fromEntries(keys.map((k) => [k, 0]));
  for (const d of days) for (const k of keys) tot[k] += series.get(d)[k] ?? 0;
  return { days: days.length, ...tot };
}

// GSC 网页搜索（过滤器 = 网络）
const gscWeb = rawFiles(/Performance-on-Search-\d{4}-\d{2}-\d{2}(\(\d+\))?__图表\.csv$/).filter((f) => {
  const filt = f.path.replace("__图表.csv", "__过滤器.csv");
  return existsSync(filt) && /搜索类型,网络/.test(readFileSync(filt, "utf8"));
});
const gsc = mergeDaily(gscWeb, (r) => ({ clicks: num(r[1]), impr: num(r[2]), posW: num(r[4]) * num(r[2]) }));
const bing = mergeDaily(rawFiles(/SearchPerformanceOverview/), (r) => ({ clicks: num(r[1]), impr: num(r[2]) }));
const bingAi = mergeDaily(rawFiles(/AIPerformanceOverviewStats/), (r) => ({ cites: num(r[1]), pages: num(r[2]) }));

// GA4：每期「发掘潜在客户概览」里的周同类群组（周日–周六），第 0 周 = 该周新用户
const ga4Weekly = new Map();
for (const f of rawFiles(/^发掘潜在客户概览\.csv$/)) {
  let inCohort = false;
  for (const line of read(f.path)) {
    if (line.startsWith("日期,第 0 周")) { inCohort = true; continue; }
    if (inCohort) {
      if (!line.trim() || line.startsWith("#")) { inCohort = false; continue; }
      const r = parseLine(line);
      const m = r[0].match(/(\d+)月(\d+)日\s*-\s*(\d+)月(\d+)日/);
      if (m) ga4Weekly.set(`${m[1]}/${m[2]}–${m[3]}/${m[4]}`, num(r[1]));
    }
  }
}
// GA4：最新一期「第 N 天」日序列
const ga4Daily = new Map();
for (const f of rawFiles(/^查看用户互动度和留存率概览\.csv$/)) {
  let start = null;
  let key = null;
  for (const line of read(f.path)) {
    const s = line.match(/开始日期：(\d{4})(\d{2})(\d{2})/);
    if (s) start = `${s[1]}-${s[2]}-${s[3]}`;
    if (/^第 N 天,活跃用户/.test(line)) { key = "active"; continue; }
    if (/^第 N 天,新用户数/.test(line)) { key = "new"; continue; }
    if (key && /^\d{4},/.test(line)) {
      const [n, v] = parseLine(line);
      const d = addDays(start, Number(n));
      ga4Daily.set(d, { ...(ga4Daily.get(d) ?? {}), [key]: num(v) });
    } else if (key && !/^\d{4},/.test(line)) key = null;
  }
}

// Clarity：SoA 与引用；机器人占比
function clarityRange(p) {
  const l = read(p).find((x) => x.startsWith('"Date range"'));
  const m = l?.match(/(\d{2})\/(\d{2})\/(\d{4}).*?(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  const a = `${m[3]}-${m[1]}-${m[2]}`;
  const b = `${m[6]}-${m[4]}-${m[5]}`;
  return { from: a, to: b, days: Math.round((Date.parse(b) - Date.parse(a)) / 864e5) + 1 };
}
const soa = [];
for (const f of rawFiles(/^Clarity_hyde_(Dashboard|Share of authority|Query topics)/)) {
  const lines = read(f.path);
  const range = clarityRange(f.path);
  const you = lines.find((l) => l.startsWith('"","You"'));
  if (you) { const r = parseLine(you); soa.push({ period: f.period, range, soa: num(r[3]), cites: num(r[2]) }); }
  const single = lines.find((l) => l.startsWith('"Metric","Share of authority (SoA)"'));
  if (single && /^[\d.]+$/.test(parseLine(single)[2])) soa.push({ period: f.period, range, soa: num(parseLine(single)[2]) });
  if (/Query topics/.test(f.name)) {
    const cites = rows(f.path).filter((r) => r.length >= 3 && /^\d+$/.test(r[1])).reduce((a, r) => a + num(r[1]), 0);
    soa.push({ period: f.period, range, cites });
  }
}
const bots = [];
for (const f of rawFiles(/^Clarity_hyde_Dashboard/)) {
  const lines = read(f.path);
  const human = lines.find((l) => l.startsWith('"","Likely Human Traffic"'));
  const total = lines.find((l) => l.startsWith('"Metric","Number of requests"'));
  if (!human || !total) continue;
  const meta = lines.find((l) => l.startsWith('"","Meta"'));
  bots.push({
    period: f.period,
    range: clarityRange(f.path),
    total: num(parseLine(total)[2]),
    human: num(parseLine(human)[3]),
    meta: meta ? num(parseLine(meta)[2]) : 0,
  });
}

// ---------- report week ----------
const argWeek = process.argv.indexOf("--week");
const gscDates = [...gsc.keys()].sort();
let W = argWeek !== -1 ? monday(process.argv[argWeek + 1]) : monday(addDays(gscDates.at(-1), -6));
if (argWeek === -1 && week(W).some((d) => !gsc.has(d))) W = addDays(W, -7);
const P = addDays(W, -7);

const pct = (a, b) => (b ? `${a >= b ? "+" : ""}${(((a - b) / b) * 100).toFixed(1)}%` : "—");
const pp = (a, b) => `${a >= b ? "+" : ""}${(a - b).toFixed(2)} pp`;
const f0 = (n) => Math.round(n).toLocaleString("en-US");
const f2 = (n) => n.toFixed(2);
const NO_YOY = "无去年同期";

const out = [];
const p = (s = "") => out.push(s);
p(`# 周报 KPI · ${W} → ${addDays(W, 6)}（对比 ${P} → ${addDays(P, 6)}）`);
p();
p(`由 \`scripts/build-weekly-kpis.mjs\` 从 \`${ROOT}/*/raw/\` 生成（${periods.join("、")} 各期合并，同一天以新一期为准）。`);
p("周 = 周一至周日。「天数」不足 7 说明那几天没有导出，环比按实有天数的日均算。");
p();

const g = sumWeek(gsc, W, ["clicks", "impr", "posW"]);
const gp = sumWeek(gsc, P, ["clicks", "impr", "posW"]);
// 同比：去年同一个周一（往前 52 周 = 364 天，星期对齐）。GSC 导出「过去 16 个月」后才会有。
const Y = addDays(W, -364);
const gy = sumWeek(gsc, Y, ["clicks", "impr", "posW"]);
const ctr = (x) => (x.impr ? (x.clicks / x.impr) * 100 : 0);
const pos = (x) => (x.impr ? x.posW / x.impr : 0);
const perDay = (x, k) => (x.days ? x[k] / x.days : 0);
p("## 一、搜索（Google 网页搜索，GSC）");
p();
p("环比按日均比（上周若缺天，不会因为少一天而虚增）。");
p();
p("| 指标 | 本周 | 上周 | 周环比 | 同比 |");
p("|---|---:|---:|---:|---|");
p(`| 点击 | ${f0(g.clicks)} | ${f0(gp.clicks)} | ${pct(perDay(g, "clicks"), perDay(gp, "clicks"))} | ${gy.days ? `${f0(gy.clicks)}（${pct(perDay(g, "clicks"), perDay(gy, "clicks"))}）` : NO_YOY} |`);
p(`| 展示 | ${f0(g.impr)} | ${f0(gp.impr)} | ${pct(perDay(g, "impr"), perDay(gp, "impr"))} | ${gy.days ? `${f0(gy.impr)}（${pct(perDay(g, "impr"), perDay(gy, "impr"))}）` : NO_YOY} |`);
p(`| 点击率 | ${f2(ctr(g))}% | ${f2(ctr(gp))}% | ${pp(ctr(g), ctr(gp))} | ${gy.days ? `${f2(ctr(gy))}%（${pp(ctr(g), ctr(gy))}）` : NO_YOY} |`);
p(`| 平均排名（展示加权，越小越好） | ${f2(pos(g))} | ${f2(pos(gp))} | ${(pos(g) - pos(gp)).toFixed(2)} | ${gy.days ? f2(pos(gy)) : NO_YOY} |`);
p(`| 天数 | ${g.days} | ${gp.days} | | |`);
p();
p("近六周（点击 / 展示 / 点击率）：");
p();
p("| 周一 | 天数 | 点击 | 展示 | 点击率 | 排名 |");
p("|---|---:|---:|---:|---:|---:|");
for (let i = 5; i >= 0; i--) {
  const m = addDays(W, -7 * i);
  const x = sumWeek(gsc, m, ["clicks", "impr", "posW"]);
  if (!x.days) continue;
  p(`| ${m} | ${x.days} | ${f0(x.clicks)} | ${f0(x.impr)} | ${f2(ctr(x))}% | ${f2(pos(x))} |`);
}
p();

p("## 二、Bing 网页搜索");
p();
const b = sumWeek(bing, W, ["clicks", "impr"]);
const bp = sumWeek(bing, P, ["clicks", "impr"]);
if (!b.days) {
  p(`本周没有 Bing「搜索效果」日趋势导出（上周 ${bp.days} 天：点击 ${f0(bp.clicks)}、展示 ${f0(bp.impr)}）。**缺口**：导出 Bing Webmaster → 搜索效果 → 下载（按日期）。`);
} else {
  p("| 指标 | 本周 | 上周 | 周环比 |");
  p("|---|---:|---:|---:|");
  p(`| 点击 | ${f0(b.clicks)} | ${f0(bp.clicks)} | ${pct(perDay(b, "clicks"), perDay(bp, "clicks"))} |`);
  p(`| 展示 | ${f0(b.impr)} | ${f0(bp.impr)} | ${pct(perDay(b, "impr"), perDay(bp, "impr"))} |`);
}
p();

p("## 三、AI 引用（Bing Copilot 类引用）");
p();
const ba = sumWeek(bingAi, W, ["cites", "pages"]);
const bap = sumWeek(bingAi, P, ["cites", "pages"]);
p("| 指标 | 本周 | 上周 | 周环比 |");
p("|---|---:|---:|---:|");
p(`| 引用次数（日均） | ${f0(perDay(ba, "cites"))}（${ba.days} 天） | ${bap.days ? f0(perDay(bap, "cites")) : "未导出"} | ${bap.days ? pct(perDay(ba, "cites"), perDay(bap, "cites")) : "—"} |`);
p(`| 被引页数（日均） | ${f0(perDay(ba, "pages"))} | ${bap.days ? f0(perDay(bap, "pages")) : "未导出"} | |`);
p();
p("按天：" + [...bingAi.entries()].sort().map(([d, v]) => `${d.slice(5)} ${v.cites}`).join(" · "));
p();

p("## 四、Clarity AI 可见度（权威份额 SoA、引用）");
p();
p("| 期 | 区间 | 天数 | SoA | 引用 | 引用/天 |");
p("|---|---|---:|---:|---:|---:|");
const byRange = new Map();
for (const s of soa) {
  const k = `${s.period}|${s.range?.from}`;
  byRange.set(k, { ...(byRange.get(k) ?? {}), ...s });
}
for (const s of [...byRange.values()].sort((a, b2) => a.range.from.localeCompare(b2.range.from))) {
  p(`| ${s.period} | ${s.range.from} → ${s.range.to} | ${s.range.days} | ${s.soa != null ? `${f2(s.soa)}%` : "—"} | ${s.cites ?? "—"} | ${s.cites ? (s.cites / s.range.days).toFixed(1) : "—"} |`);
}
p();

p("## 五、GA4（注意：大部分「用户」是机器人，见周报洞察）");
p();
p("周同类群组新用户（GA4 的周 = 周日到周六）：");
p();
p("| 周 | 新用户 | 周环比 |");
p("|---|---:|---:|");
let prev = null;
for (const [k, v] of ga4Weekly) {
  if (!v) { prev = v; continue; }
  p(`| ${k} | ${f0(v)} | ${prev ? pct(v, prev) : "—"} |`);
  prev = v;
}
p();
const gd = week(W).filter((d) => ga4Daily.has(d));
if (gd.length) {
  const nu = gd.reduce((a, d) => a + (ga4Daily.get(d).new ?? 0), 0);
  const au = gd.reduce((a, d) => a + (ga4Daily.get(d).active ?? 0), 0);
  p(`本周（周一至周日，${gd.length} 天）：新用户 ${f0(nu)}；日活跃用户之和 ${f0(au)}（跨天会重复计人，只看趋势）。`);
  p();
}

p("## 六、机器人与 AI 爬虫（Clarity Bot Activity）");
p();
p("区间很长的一期，Clarity 并非整段都在收爬虫数据，「请求/天」只作量级参考。");
p();
p("| 期 | 区间 | 天数 | 请求 | 请求/天 | 真人占比 | Meta 请求 |");
p("|---|---|---:|---:|---:|---:|---:|");
for (const x of bots.sort((a, b2) => a.range.from.localeCompare(b2.range.from))) {
  p(`| ${x.period} | ${x.range.from} → ${x.range.to} | ${x.range.days} | ${f0(x.total)} | ${f0(x.total / x.range.days)} | ${x.human}% | ${f0(x.meta)} |`);
}
p();
p("## 同比");
p();
p(gy.days ? `GSC 同比已按去年同一周（${Y} 起，${gy.days} 天）算在第一节。GA4 自 2026-08 才开始收数，没有同比。` : `${NO_YOY}。GSC 已归档的导出最早 ${gscDates[0]}（默认只导 3 个月），GA4 自 2026-08 才开始收数。`);
p("要同比：GSC → 效果 → 日期 → 比较 →「与去年同期比较」，按「网页」「查询」各导一次（GSC 保留 16 个月，");
p("去年同期是旧 PHP 站，比出来就是「新站 vs 旧站」）。GA4 的同比最早 2027-09 才有。");

const text = out.join("\n") + "\n";
if (process.argv.includes("--write")) {
  const dest = join(ROOT, latest, "KPI-WOW.md");
  writeFileSync(dest, text);
  console.log(`wrote ${dest}`);
} else process.stdout.write(text);
