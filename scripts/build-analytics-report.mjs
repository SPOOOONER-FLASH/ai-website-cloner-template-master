#!/usr/bin/env node
/**
 * 四个数据看板 → 一份所有会话都能读的报告：node scripts/build-analytics-report.mjs "<导出目录>" [--date YYYY-MM-DD]
 *
 * 甲方 2026-09-24：「clarity ga4 那四个数据看板集群，所有 chat 都看得见，共享」
 *               「数据看板集群本身和分析的结果也要共享通知所有人」。
 *
 * 四个看板 = Google Search Console、Bing Webmaster、Microsoft Clarity、GA4（账号「hyde数据看板」）。
 * 甲方从各看板导出 CSV 放进一个文件夹（格式见 docs/collaboration/DATA-DASHBOARDS.md），本脚本：
 *   1. 把原始 CSV 复制进 docs/research/analytics/<日期>/raw/ —— 进 git，换电脑、换会话都能读；
 *   2. 生成 docs/research/analytics/<日期>/REPORT.md：每个看板每张表的前几行 + 自动算出的机会清单；
 *   3. 改写 docs/research/analytics/LATEST.md 指向最新一期。
 *
 * 数字全部来自 CSV，脚本不写结论。结论写在 DATA-DASHBOARDS.md 的「本期结论」，并注明日期。
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const args = process.argv.slice(2);
const DIR = args.find((a) => !a.startsWith("--"));
if (!DIR || !existsSync(DIR)) {
  console.error('用法: node scripts/build-analytics-report.mjs "<导出目录>" [--date YYYY-MM-DD]');
  process.exit(1);
}
const dateAt = args.indexOf("--date");
// The export date, not today: pass --date when the folder is older than the run.
const DATE = dateAt !== -1 ? args[dateAt + 1] : new Date().toISOString().slice(0, 10);
const OUT = join("docs/research/analytics", DATE);
const TOP = 12;

/* ── CSV ── */
function splitRow(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') (cur += '"'), i++;
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") out.push(cur), (cur = "");
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
const num = (s) => Number(String(s ?? "").replace(/[%,]/g, "")) || 0;

function parse(file) {
  const text = readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r/g, "");
  const meta = [];
  const blocks = [];
  let cur = [];
  for (const line of text.split("\n")) {
    if (line.startsWith("#")) {
      const m = line.replace(/^#\s*/, "").trim();
      if (m && !/^-+$/.test(m)) meta.push(m);
      continue;
    }
    if (!line.trim()) {
      if (cur.length) blocks.push(cur), (cur = []);
      continue;
    }
    cur.push(splitRow(line));
  }
  if (cur.length) blocks.push(cur);
  return { meta, blocks };
}

/* ── 找文件，按看板归类 ── */
function walk(d) {
  return readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : /\.csv$/i.test(n) ? [p] : [];
  });
}
function sourceOf(p) {
  const rel = relative(DIR, p);
  if (/^Clarity_/i.test(basename(p))) return "Clarity";
  if (/Performance-on-Search/i.test(rel)) return "Search Console";
  if (/_(AIPageStats|AISearchQueries|Keyword|PageTraffic|SearchPerformance)/i.test(basename(p))) return "Bing Webmaster";
  return "GA4";
}
const files = walk(DIR);
const bySource = {};
for (const f of files) (bySource[sourceOf(f)] ??= []).push(f);

/* ── 输出 ── */
mkdirSync(join(OUT, "raw"), { recursive: true });
const out = [];
const say = (s = "") => out.push(s);
const esc = (s) => String(s).replace(/\|/g, "\\|");
const table = (rows, n = TOP) => {
  const [head, ...body] = rows;
  say(`| ${head.map(esc).join(" | ")} |`);
  say(`| ${head.map(() => "---").join(" | ")} |`);
  for (const r of body.slice(0, n)) say(`| ${r.map(esc).join(" | ")} |`);
  if (body.length > n) say(`\n_共 ${body.length} 行，上面是前 ${n} 行；全表在 raw/_`);
  say();
};

say(`# 四个数据看板 · ${DATE}`);
say();
say(`由 \`scripts/build-analytics-report.mjs\` 从甲方导出的 ${files.length} 个 CSV 生成。**这是数据，不是结论**；`);
say(`结论见 \`docs/collaboration/DATA-DASHBOARDS.md\`「本期结论」。原始 CSV 在同目录 \`raw/\`。`);
say();

/* 机会清单：放最前面，这是所有会话最常用的一张表 */
const gscPages = (bySource["Search Console"] ?? []).find((f) => /网页\.csv$/.test(f) && !/Generative/.test(f));
if (gscPages) {
  const [, ...rows] = parse(gscPages).blocks[0];
  const opp = rows
    .filter((r) => num(r[2]) >= 30 && num(r[3]) < 1)
    .sort((a, b) => num(b[2]) - num(a[2]));
  say(`## 机会清单：Google 上被看见、没被点击的页（展示 ≥30、点击率 <1%）`);
  say();
  say(`先改这些页的标题和描述（长尾词方案第七节 7.5）。`);
  say();
  table([["页面", "点击", "展示", "点击率", "排名"], ...opp], 30);
}

for (const src of ["Search Console", "Bing Webmaster", "Clarity", "GA4"]) {
  const list = (bySource[src] ?? []).sort();
  if (!list.length) continue;
  say(`## ${src}`);
  say();
  for (const f of list) {
    const rel = relative(DIR, f).replace(/\\/g, "/");
    const dest = join(OUT, "raw", rel.replace(/\//g, "__"));
    copyFileSync(f, dest);
    const { meta, blocks } = parse(f);
    say(`### ${rel}`);
    if (meta.length) say(`_${meta.filter((m) => !/账号|媒体资源/.test(m)).join(" · ")}_`);
    say();
    for (const b of blocks) {
      if (b.length === 1 || b.every((r) => r.length <= 2)) {
        for (const r of b) say(`- ${r.filter(Boolean).map(esc).join("：")}`);
        say();
      } else table(b);
    }
  }
}

writeFileSync(join(OUT, "REPORT.md"), out.join("\n"));
writeFileSync(
  "docs/research/analytics/LATEST.md",
  `# 最新一期数据\n\n→ [${DATE}](${DATE}/REPORT.md)\n\n看板说明、谁看什么、本期结论：\`docs/collaboration/DATA-DASHBOARDS.md\`。\n`,
);
console.log(`✓ ${files.length} 个 CSV → ${OUT}/REPORT.md（${Object.entries(bySource).map(([k, v]) => `${k} ${v.length}`).join("，")}）`);
