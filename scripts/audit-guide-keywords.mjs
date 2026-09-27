#!/usr/bin/env node
/**
 * Which guides and articles compete for the same search.
 *
 * Client, 2026-09-27, from the QuickCreator article on keyword expansion and layout: one
 * page per primary keyword, or two pages split the ranking between them. This compares the
 * search-facing title of every HYDE guide and news article (seoTitle, else title, with the
 * year and brand stripped) and lists the pairs whose content words overlap most, so a
 * person can decide whether each pair answers two questions or one.
 *
 *   node scripts/audit-guide-keywords.mjs            print pairs with overlap ≥ 0.5
 *   node scripts/audit-guide-keywords.mjs --min 0.4  lower the bar
 *   node scripts/audit-guide-keywords.mjs --write    also write docs/copy/guide-keyword-overlap.md
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const MIN = Number(args[args.indexOf("--min") + 1]) || 0.5;

const STOP = new Set(
  "a an and the of for to in on at by with vs versus or what which how why when your our we is are it its from into guide 2026 canton hyland door doors hardware".split(" "),
);
const stem = (w) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, "");
const words = (s) =>
  new Set(
    String(s)
      .toLowerCase()
      .replace(/\|.*$/, "")
      .split(/[^a-z0-9]+/)
      .filter((w) => w && !STOP.has(w))
      .map(stem),
  );

const pages = [];
for (const dir of ["guides", "news"]) {
  for (const f of readdirSync(`content/${dir}`).filter((n) => n.endsWith(".json"))) {
    const j = JSON.parse(readFileSync(`content/${dir}/${f}`, "utf8"));
    if (j.draft) continue;
    const head = j.seoTitle || j.title;
    pages.push({ path: `/${dir}/${j.slug}/`, head, w: words(head) });
  }
}

const pairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let k = i + 1; k < pages.length; k++) {
    const a = pages[i].w;
    const b = pages[k].w;
    const shared = [...a].filter((x) => b.has(x));
    const score = shared.length / Math.min(a.size, b.size);
    if (shared.length >= 2 && score >= MIN) pairs.push({ a: pages[i], b: pages[k], shared, score });
  }
}
pairs.sort((x, y) => y.score - x.score);

const lines = [
  "# 文章与指南的搜索词重叠",
  "",
  "生成：`node scripts/audit-guide-keywords.mjs --write`（不要手改本文件）。",
  `口径：${pages.length} 篇（guides + news），比较 seoTitle（没有则 title）的实词，去掉年份、品牌和 door/hardware；重叠 = 共同词 ÷ 较短标题的词数，≥ ${MIN} 列出。`,
  "",
  "| 重叠 | 共同词 | 页面 A | 页面 B |",
  "|---|---|---|---|",
  ...pairs.map((p) => `| ${p.score.toFixed(2)} | ${p.shared.join(" ")} | ${p.a.path}<br>${p.a.head} | ${p.b.path}<br>${p.b.head} |`),
  "",
];
const out = lines.join("\n");
console.log(out);
if (args.includes("--write")) writeFileSync("docs/copy/guide-keyword-overlap.md", out);
