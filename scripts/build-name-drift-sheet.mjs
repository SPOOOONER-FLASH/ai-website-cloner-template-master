#!/usr/bin/env node
/**
 * The sheet for the client: 18 products our site and stahlock disagree about.
 *
 * Generated from the audit rather than typed, so it cannot go stale silently — rename a
 * product and its row disappears on the next run.
 *
 * Output: docs/research/NAME_DRIFT.html, prints to A4.
 *
 * Usage: node scripts/build-name-drift-sheet.mjs [--out "<dir>"]
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const CACHE = "docs/research/stahlock-features.json";
const DIR = "content/products";
const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");

/* Reuse the audit's own logic by running it, so the two can never disagree. */
const report = execFileSync("node", ["scripts/audit-name-drift.mjs", "--all"], { encoding: "utf8" });

const cache = JSON.parse(readFileSync(CACHE, "utf8"));
const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

const rows = [];
const lines = report.split("\n");
for (let i = 0; i < lines.length; i += 1) {
  const ours = lines[i].match(/^\s{2}(\S.*?)\s+ours:\s+(.+)$/);
  const theirs = lines[i + 1]?.match(/^\s+them:\s+(.+?)(\s+\(unpublished here\))?$/);
  if (!ours || !theirs) continue;
  const model = ours[1].trim();
  const product = products.find((p) => p.model === model);
  rows.push({
    model,
    ours: ours[2].trim(),
    theirs: theirs[1].trim(),
    slug: product?.slug ?? "",
    category: product?.categoryPath?.[0] ?? "",
    url: cache[product?.slug]?.url ?? "",
  });
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>产品命名不一致清单 — Canton Hyland</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; color: #11110f; font-size: 11pt; line-height: 1.55; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4px; }
  h2 { font-size: 13pt; margin: 22px 0 6px; padding-top: 10px; border-top: 1.5px solid #11110f; page-break-after: avoid; }
  p.lead { margin: 0 0 14px; color: #444; }
  .alert { background: #fdf6f6; border: 1px solid #e3cfcf; padding: 10px 12px; margin: 12px 0 16px; }
  .rule { color: #7a6f4f; background: #faf8f2; border: 1px solid #ddd5bd; padding: 8px 10px; margin: 10px 0 14px; font-size: 10pt; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 6px; }
  th, td { border: 1px solid #c9c9c4; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #f2f2ef; font-weight: 600; }
  td.m { font-family: ui-monospace, Consolas, monospace; white-space: nowrap; }
  td.w { min-width: 130px; background: #fffdf7; }
  .small { font-size: 9.5pt; color: #555; }
  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #c9c9c4; font-size: 9.5pt; color: #555; }
</style>
</head>
<body>

<h1>产品命名不一致清单</h1>
<p class="lead">Canton Hyland · cantonlock.com 与 stahlock.com 对同一个型号的叫法不同 · 共 ${rows.length} 个 · 由 scripts/build-name-drift-sheet.mjs 生成</p>

<div class="alert">
  <strong>为什么这件事值得单独看一眼。</strong>
  Bing 的关键词工具显示 <code>abs-015</code> 有 <strong>169 次展示</strong>，
  是目前全站最大的单个关键词信号。而 015 这一页在我们网站上叫
  <strong>Panic Exit Device（逃生锁）</strong>，在贵司自己的 stahlock 网站上叫
  <strong>Trim Handle（外装执手）</strong>。
  <br><br>
  这两个不是同义词：逃生推杆是装在门内侧、人一撞就开的那根杆；
  外装执手是配合它使用的门外侧把手。
  <strong>搜逃生锁的买家点进来看到的是一个把手。</strong>
</div>

<div class="rule">
  <strong>四处独立证据都指向「外装执手」：</strong>
  <br>1. stahlock 页面标题（贵司自己的站，甲方 9 月 4 日确认过是人工核对的）
  <br>2. 我们自己 015 的规格行：<em>Used in combination with push bar and lock</em>
  <br>3. 027 从 stahlock 搬来的描述：<em>External handle for panic bar systems</em>
  <br>4. 016 从 stahlock 搬来的描述：<em>Outside Lever Trim with Key … designed for panic exit devices</em>
</div>

<div class="rule">
  <strong>我没有直接改名。</strong> 改名会改动 URL，而 015 这个 URL 正在有排名 ——
  移动一个正在排名的 URL 是有代价的决定：需要配 301，页面历史会重置，
  而依据只是另一个站的页面标题。<strong>怎么改，请贵司定。</strong>
</div>

<h2>一、${rows.length} 个叫法不一致的型号</h2>
<p class="small">
  最后一栏请写：<strong>A</strong> = 以我们网站为准（stahlock 那边改）；
  <strong>B</strong> = 以 stahlock 为准（我们改名，我会一并配好 301 跳转）；
  <strong>C</strong> = 两边都不对，正确名称是 ____。
</p>
<table>
  <tr><th>型号</th><th>cantonlock 叫法</th><th>stahlock 叫法</th><th>现在归在哪个类目</th><th>A / B / C</th></tr>
  ${rows
    .map(
      (r) =>
        `<tr><td class="m">${esc(r.model)}</td><td>${esc(r.ours)}</td><td><strong>${esc(r.theirs)}</strong></td><td class="m">${esc(r.category)}</td><td class="w"></td></tr>`,
    )
    .join("\n")}
</table>

<h2>二、如果选 B，会连带发生什么</h2>
<p class="small">
  把这 ${rows.length} 个改名为执手/其他类型，<strong>逃生锁类目的产品数会从 43 掉到 28 左右</strong>。
  那不是损失 —— 现在的 43 里混着配件，买家点进逃生锁类目看到一半是把手，
  比数字小更伤信任。改完每一个旧 URL 都会 301 到新 URL，排名会跟过去，
  这套跳转机制站上已经有了（<code>content/taxonomy-moves.json</code>），不需要额外开发。
</p>

<footer>
  由 <code>scripts/build-name-drift-sheet.mjs</code> 生成，数据来自
  <code>scripts/audit-name-drift.mjs</code>。改完名字重跑，这份清单会自动变短。
</footer>

</body>
</html>
`;

const OUT = "docs/research/NAME_DRIFT.html";
writeFileSync(OUT, html);
console.log(`wrote ${OUT} — ${rows.length} disagreements`);

if (outFlag > -1 && args[outFlag + 1]) {
  const dir = args[outFlag + 1];
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "产品命名不一致清单.html"), html);
  console.log(`copied to ${join(dir, "产品命名不一致清单.html")}`);
}
