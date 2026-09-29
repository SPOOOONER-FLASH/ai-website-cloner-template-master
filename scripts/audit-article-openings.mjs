#!/usr/bin/env node
/**
 * Does each article give a concrete answer before the reader (or an answer engine) has to
 * scroll?
 *
 * Client, 2026-09-28, from the QuickCreator articles on AI citation: the first ~30% of a page
 * carries most of the citations and the last 10% almost none, and engines lift specific,
 * checkable statements rather than framing. So this looks at the summary and the first two
 * body paragraphs (headings skipped) of every published HYDE guide and news article, in
 * English, and flags the ones with no number, dimension, standard or model in them.
 *
 *   node scripts/audit-article-openings.mjs           print the report
 *   node scripts/audit-article-openings.mjs --write   also write docs/copy/article-openings-audit.md
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const isHeading = (p) => /^#{1,6}\s/.test(p) || (p.length < 80 && p === p.toUpperCase() && /[A-Z]/.test(p));
// A concrete anchor: a number, a standard (EN 1125, ANSI A156.3), a model code, a grade.
const ANCHOR = /\d|\bEN\s?\d|\bANSI\b|\bBHMA\b|\bISO\b|\bUL\b/;

const rows = [];
for (const dir of ["guides", "news"]) {
  for (const f of readdirSync(`content/${dir}`).filter((n) => n.endsWith(".json"))) {
    const j = JSON.parse(readFileSync(`content/${dir}/${f}`, "utf8"));
    if (j.draft) continue;
    const opening = (j.body ?? []).filter((p) => typeof p === "string" && !isHeading(p.trim())).slice(0, 2);
    const summaryHas = ANCHOR.test(j.summary ?? "");
    const openingHas = opening.some((p) => ANCHOR.test(p));
    rows.push({ path: `/${dir}/${j.slug}/`, summaryHas, openingHas, first: (opening[0] ?? "").slice(0, 110) });
  }
}
const weak = rows.filter((r) => !r.openingHas);
const lines = [
  "# 文章开头是否先给具体答案",
  "",
  "生成：`node scripts/audit-article-openings.mjs --write`（不要手改）。",
  `口径：${rows.length} 篇 HYDE guides + news（英文）；看摘要和正文前两段（跳过小标题）里有没有数字、尺寸、标准号或型号。`,
  "",
  `前两段没有任何具体锚点：**${weak.length} 篇**；其中摘要也没有：${weak.filter((r) => !r.summaryHas).length} 篇。`,
  "",
  "| 页面 | 摘要有锚点 | 第一段开头 |",
  "|---|---|---|",
  ...weak.map((r) => `| ${r.path} | ${r.summaryHas ? "有" : "无"} | ${r.first.replace(/\|/g, "/")}… |`),
  "",
];
const out = lines.join("\n");
console.log(out);
if (process.argv.includes("--write")) writeFileSync("docs/copy/article-openings-audit.md", out);
