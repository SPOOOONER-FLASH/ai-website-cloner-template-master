#!/usr/bin/env node
/**
 * Do the articles AI engines cite most send a reader on to a product?
 *
 * W39 report (docs/research/analytics/2026-09-30/): Bing and Clarity record AI citations
 * of guides only, never of product pages. The one link from an article to a product is
 * its `relatedModels` list, rendered as "Mentioned" by NewsDetail.tsx, which keeps a model
 * only if it resolves to a HYDE record that is published (has a photograph). This lists,
 * for the most-cited articles in a Bing AIPageStats export, which models link and which
 * are silently dropped, and writes docs/copy/cited-guides-models.md.
 *
 *   node scripts/audit-cited-guides-models.mjs [--csv <AIPageStats.csv>] [--top 10]
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : fallback; };
const RAW = "docs/research/analytics";
const latestCsv = () => {
  const days = readdirSync(RAW).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().reverse();
  for (const d of days) {
    const dir = `${RAW}/${d}/raw`;
    if (!existsSync(dir)) continue;
    const f = readdirSync(dir).find((n) => n.includes("AIPageStatsReport"));
    if (f) return `${dir}/${f}`;
  }
  throw new Error("no AIPageStatsReport export found under " + RAW);
};
const csv = arg("--csv", latestCsv());
const top = Number(arg("--top", "10"));

const rows = readFileSync(csv, "utf8").replace(/^﻿/, "").split(/\r?\n/).slice(1).filter(Boolean)
  .map((l) => l.match(/"([^"]*)","([^"]*)"/)).filter(Boolean)
  .map(([, url, n]) => ({ url, n: Number(n) }));
/* The same article cited under /es/ or /pt/ counts once, under its English slug. */
const bySlug = new Map();
for (const { url, n } of rows) {
  const m = url.match(/\/(guides|news)\/([^/?#]+)\/?$/);
  if (!m) continue;
  const key = `${m[1]}/${m[2]}`;
  bySlug.set(key, (bySlug.get(key) ?? 0) + n);
}
const ranked = [...bySlug.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);

const products = readdirSync("content/products").map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")))
  .filter((p) => !p.sites || p.sites.includes("hyde"));
const byModel = (m) => products.find((p) => p.model === m);

const out = [
  "# 被 AI 引用最多的文章：能不能一跳到产品",
  "",
  `由 \`scripts/audit-cited-guides-models.mjs\` 生成，数据源：\`${csv}\`（Bing AI 引用，同一篇文章的英西葡合并计数）。`,
  "文章页的“对应型号”（Mentioned）栏来自 `relatedModels`；型号不在 HYDE 目录或没有照片时，页面会悄悄丢掉那条链接。",
  "",
  "| # | 文章 | 引用 | 会显示的型号链接 | 被丢掉的型号 |",
  "|---:|---|---:|---|---|",
];
let gaps = 0;
ranked.forEach(([key, n], i) => {
  const [kind, slug] = key.split("/");
  const path = `content/${kind}/${slug}.json`;
  if (!existsSync(path)) { out.push(`| ${i + 1} | ${key} | ${n} | （文件不存在） | |`); gaps++; return; }
  const models = JSON.parse(readFileSync(path, "utf8")).relatedModels ?? [];
  const live = models.filter((m) => byModel(m)?.heroImage?.src);
  const dropped = models.filter((m) => !live.includes(m)).map((m) => `${m}（${byModel(m) ? "无照片" : "非 HYDE / 不存在"}）`);
  if (!live.length) gaps++;
  out.push(`| ${i + 1} | ${key} | ${n} | ${live.join(", ") || "**无**"} | ${dropped.join(", ")} |`);
});
out.push("", `前 ${ranked.length} 篇中 ${gaps} 篇没有任何可点击的型号链接。`, "");
/* Held on purpose, not forgotten: the two most-cited guides are in title experiment E1 until
   its 10-14 reading (docs/collaboration/DATA-DASHBOARDS.md), so neither body nor revision date
   moves before then. Neither names a model in its text today. */
out.push("暂缓：`door-hardware-hs-codes-2026`、`door-preparation-161-and-86-2026` 在标题实验 E1 中（10-14 读数），读数前正文和修订日期都不动；两篇正文目前都没点名型号，读数后再补。", "");
writeFileSync("docs/copy/cited-guides-models.md", out.join("\n"));
console.log(out.join("\n"));
