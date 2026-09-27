#!/usr/bin/env node
/**
 * Which HYDE product records say the same thing as each other.
 *
 * Client, 2026-09-27, from the QuickCreator articles on Google's August spam update and on
 * programmatic SEO: a page that differs from its neighbours only by model number is the
 * pattern Google calls scaled content abuse. Ours are real products with real spec tables,
 * but their prose was partly produced from templates, so this measures it rather than
 * guessing.
 *
 * A text is compared after masking the record's own model number, name and every number, so
 * "The 587 SSET lever ... 60mm" and "The 587 PBET lever ... 70mm" count as one template.
 *
 *   node scripts/audit-duplicate-copy.mjs            print the report
 *   node scripts/audit-duplicate-copy.mjs --write    also write docs/copy/duplicate-copy-audit.md
 *   node scripts/audit-duplicate-copy.mjs --min 5    only groups of at least 5 (default 3)
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const MIN = Number(args[args.indexOf("--min") + 1]) || 3;
const DIR = "content/products";

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mask = (text, p) => {
  let t = String(text ?? "").toLowerCase();
  for (const token of [p.model, p.name].filter(Boolean).sort((a, b) => b.length - a.length)) {
    t = t.replace(new RegExp(escape(String(token).toLowerCase()), "g"), "§");
  }
  return t.replace(/\d+([.,]\d+)?/g, "#").replace(/\s+/g, " ").trim();
};

const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")))
  .filter((p) => !p.sites || p.sites.includes("hyde"));

function groups(field) {
  const by = new Map();
  for (const p of products) {
    const key = mask(p[field], p);
    if (!key || key.length < 20) continue;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(p);
  }
  return [...by.values()].filter((g) => g.length >= MIN).sort((a, b) => b.length - a.length);
}

const lines = [
  "# HYDE 产品文案重复审计",
  "",
  "生成：`node scripts/audit-duplicate-copy.mjs --write`（不要手改本文件）。",
  `口径：HYDE 站 ${products.length} 条记录；遮掉型号、产品名和所有数字后，完全相同的文字算一组；只列 ≥ ${MIN} 条的组。`,
  "",
];
for (const field of ["summary", "description"]) {
  const gs = groups(field);
  const covered = gs.reduce((n, g) => n + g.length, 0);
  lines.push(`## ${field}：${gs.length} 组，涉及 ${covered} 条`, "");
  lines.push("| 条数 | 类目 | 型号（前 8 个） | 文字开头 |", "|---|---|---|---|");
  for (const g of gs) {
    const cats = [...new Set(g.map((p) => p.categoryPath.join("/")))].join(", ");
    const models = g.slice(0, 8).map((p) => p.model).join(", ") + (g.length > 8 ? " …" : "");
    const head = String(g[0][field]).replace(/\|/g, "/").slice(0, 90);
    lines.push(`| ${g.length} | ${cats} | ${models} | ${head}… |`);
  }
  lines.push("");
}
/*
  The publish gate from the same articles: a page with no facts of its own. These are real
  products with real photographs, so whether they stay indexed is the client's call, not a
  copy fix — the list is here so the call is made on a number rather than a feeling.
*/
const bare = products.filter((p) => !(p.specs ?? []).length);
const byCat = new Map();
for (const p of bare) {
  const c = p.categoryPath.join("/");
  byCat.set(c, [...(byCat.get(c) ?? []), p.model]);
}
lines.push(`## 没有任何规格行的记录：${bare.length} 条`, "", "| 条数 | 类目 | 型号 |", "|---|---|---|");
for (const [c, ms] of [...byCat].sort((a, b) => b[1].length - a[1].length)) {
  lines.push(`| ${ms.length} | ${c} | ${ms.join(", ")} |`);
}
lines.push("");
const out = lines.join("\n");
console.log(out);
if (args.includes("--write")) writeFileSync("docs/copy/duplicate-copy-audit.md", out);
