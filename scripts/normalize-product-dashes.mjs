#!/usr/bin/env node
/**
 * Removes em dashes from the product records, in every language, without breaking the lookups.
 *
 *   node scripts/normalize-product-dashes.mjs           report (exit 1 if any record still has one)
 *   node scripts/normalize-product-dashes.mjs --write   apply
 *
 * ---------------------------------------------------------------------------
 * WHY
 *
 * The client's rule since 2026-09-22 is no em dashes in client-facing copy: to a buyer they read
 * as machine-written. The news and guides were converted then (mechanically, and the table
 * damage from that pass was only repaired on 2026-09-24). The product records were left alone
 * with about 2,700 of them, in seoTitle ("9015 Stainless Steel Handle — OEM | Canton Hyland"),
 * spec values ("Entrance — keyed outside"), image labels and summaries.
 *
 * The spec values are why this was not done in the same sweep: "Entrance — keyed outside" is
 * also a KEY in src/data/es-glossary.ts and src/data/pt-glossary.ts, which turn an English spec
 * value into its Spanish and Portuguese row. Change the value and not the key, and every Spanish
 * row falls back to English. So this script rewrites the records AND the glossary string
 * literals with the same rules, and the generators that wrote the dashes
 * (generate-product-seo, fill-missing-spanish, translate-products-pt, import-client-product-
 * videos, add-photographed-models) were changed to stop writing them.
 *
 * RULES, in order, per string:
 *   1. "…markets — request a quotation." and its ES/PT twins become two sentences.
 *   2. "—entrada…" (Spanish style, no space) becomes "función: entrada…".
 *   3. A trailing " —" (a truncated feature) is dropped.
 *   4. "word—word" becomes "word, word".
 *   5. " — " becomes ", " (no double comma if a comma was already there).
 * src/data/product-dashes.test.ts fails if an em dash comes back into a record.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const D = "—";

export function undash(s) {
  if (!s.includes(D)) return s;
  return s
    .replace(new RegExp(` ${D} (request a quotation)`, "g"), ". Request a quotation")
    .replace(new RegExp(` ${D} (solicite una cotización)`, "g"), ". Solicite una cotización")
    .replace(new RegExp(` ${D} (solicite (?:uma|um) (?:cotação|orçamento))`, "g"), (m, t) => ". " + t.charAt(0).toUpperCase() + t.slice(1))
    .replace(new RegExp(` ${D}(?=\\p{Ll})`, "gu"), ": ")
    .replace(new RegExp(`\\s*${D}\\s*$`), "")
    .replace(new RegExp(`(\\S)${D}(\\S)`, "g"), "$1, $2")
    .replace(new RegExp(`,?\\s+${D}\\s+`, "g"), ", ")
    .replace(new RegExp(D, "g"), ",");
}

/* Chinese fields keep their dashes: "——" is ordinary Chinese punctuation, and they render on RAYEN. */
const isZh = (k) => /Zh$/.test(k) || k === "zh";
function walk(v, tally) {
  if (typeof v === "string") { const n = undash(v); if (n !== v) tally.n++; return n; }
  if (Array.isArray(v)) return v.map((x) => walk(x, tally));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, isZh(k) ? x : walk(x, tally)]));
  return v;
}

const GLOSSARIES = ["src/data/es-glossary.ts", "src/data/pt-glossary.ts"];
/*
  Data files whose sentences build-product-titles.mjs stitches into seoTitle / seoDescription.
  Found 2026-09-24 when the HYDE release failed `titles:check`: the records had been cleaned but
  the generator's own phrases ("from any point along the bar — the only…") still carried dashes,
  so every regenerated description disagreed with the stored one.
*/
const SOURCE_JSON = ["src/data/category-positioning.json"];

/** [{ file, n, next }] for every file that would change. */
export function scan() {
  const out = [];
  const dir = path.join(ROOT, "content/products");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const file = path.join(dir, f);
    const raw = fs.readFileSync(file, "utf8");
    if (!raw.includes(D)) continue;
    const record = JSON.parse(raw);
    /* RAYEN-only records are the RAYEN lane's (AGENTS.md wall): not ours to rewrite */
    if (record.sites && !record.sites.includes("hyde")) continue;
    const tally = { n: 0 };
    const data = walk(record, tally);
    const eol = raw.includes("\r\n") ? "\r\n" : "\n";
    if (tally.n) out.push({ file, n: tally.n, next: JSON.stringify(data, null, 2).split("\n").join(eol) + eol });
  }
  for (const rel of SOURCE_JSON) {
    const file = path.join(ROOT, rel);
    const raw = fs.readFileSync(file, "utf8");
    if (!raw.includes(D)) continue;
    const tally = { n: 0 };
    const data = walk(JSON.parse(raw), tally);
    const eol = raw.includes("\r\n") ? "\r\n" : "\n";
    if (tally.n) out.push({ file, n: tally.n, next: JSON.stringify(data, null, 2).split("\n").join(eol) + eol });
  }
  for (const rel of GLOSSARIES) {
    const file = path.join(ROOT, rel);
    const raw = fs.readFileSync(file, "utf8");
    let n = 0;
    /* only string literals: the comments explain the rule and may quote the old form */
    const next = raw.replace(/"(?:[^"\\\n]|\\.)*"/g, (lit) => { const u = undash(lit); if (u !== lit) n++; return u; });
    if (n) out.push({ file, n, next });
  }
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const changes = scan();
  const strings = changes.reduce((a, c) => a + c.n, 0);
  console.log(`${strings} strings in ${changes.length} files ${process.argv.includes("--write") ? "rewritten" : "still carry an em dash"}`);
  if (process.argv.includes("--write")) for (const c of changes) fs.writeFileSync(c.file, c.next);
  else if (changes.length) process.exitCode = 1;
}
