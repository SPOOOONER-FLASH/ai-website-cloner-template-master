#!/usr/bin/env node
/**
 * Writes `featuresEs` on the product records whose feature list is COMPLETELY translated.
 *
 * ---------------------------------------------------------------------------
 * ALL OR NOTHING, PER RECORD
 *
 * A record with four Spanish bullets and two English ones is a list that looks finished
 * and is not — the same failure the article bodies avoid by falling back whole. So a record
 * is written only when every line of it resolves in src/data/es-features.ts, and the rest
 * are reported with the exact lines that are blocking them.
 *
 * That report is the point of the script. The lines are ranked by how many RECORDS each one
 * unblocks rather than by how often it occurs, because a line used ten times inside records
 * that are already blocked by six other lines is worth nothing until those six are done.
 *
 * ---------------------------------------------------------------------------
 * THE SPANISH SIBLING CAME SECOND, AND THAT IS THE INTERESTING PART
 *
 * This is the Portuguese script with two words changed. Portuguese was filled in on
 * 2026-09-17 and reached 216/216 the same day; Spanish had been at 0/216 since the tree
 * shipped, because `ProductDetail` hid the block entirely on non-English pages and nobody
 * could see what was missing. The newer locale is what made the older one's gap visible.
 *
 * Generalise it: a fallback nobody can COUNT is a fallback that becomes permanent. The
 * count is the fix — `npm run audit:pt` and these two scripts all exist to make an empty
 * field say so out loud.
 *
 * Usage:
 *   node scripts/translate-product-features-es.mjs           # report only
 *   node scripts/translate-product-features-es.mjs --write
 *   node scripts/translate-product-features-es.mjs --all     # every blocking line
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const write = process.argv.includes("--write");
const showAll = process.argv.includes("--all");

/*
  The table is read as TEXT rather than imported.

  `node --test` and plain `node` disagree about TypeScript imports depending on the flags
  in play, and this script has to run from npm scripts, from CI and by hand. Parsing the
  keys out is uglier and it works everywhere, which is the trade this repo has made before
  (see scripts/translate-products-es.mjs and its `grab`).
*/
function loadTable() {
  const source = readFileSync("src/data/es-features.ts", "utf8");
  const table = new Map();
  /* `"key":\n  "value",` and `Key: "value",` — the shorthand TypeScript allows. */
  const pattern = /^ {2}(?:"((?:[^"\\]|\\.)*)"|([A-Za-z][A-Za-z0-9_]*)):\s*\n?\s*"((?:[^"\\]|\\.)*)",$/gm;
  let match;
  while ((match = pattern.exec(source))) {
    const key = (match[1] ?? match[2]).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const value = match[3].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    table.set(key, value);
  }
  return table;
}

const table = loadTable();

const records = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ file: join(DIR, f), data: JSON.parse(readFileSync(join(DIR, f), "utf8")) }))
  .filter(({ data }) => data.features?.length);

let written = 0;
let complete = 0;
/** line -> how many RECORDS it is blocking. */
const blocking = new Map();

for (const { file, data } of records) {
  const missing = data.features.filter((line) => !table.has(line));
  if (!missing.length) {
    complete += 1;
    if (write) {
      data.featuresEs = data.features.map((line) => table.get(line));
      writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
      written += 1;
    }
    continue;
  }
  for (const line of new Set(missing)) blocking.set(line, (blocking.get(line) ?? 0) + 1);
}

console.log(
  `${write ? "wrote" : "would write"} featuresEs on ${complete} of ${records.length} records ` +
    `(${table.size} lines in the table)`,
);
if (write) console.log(`  files written: ${written}`);

if (blocking.size) {
  const ranked = [...blocking.entries()].sort((a, b) => b[1] - a[1]);
  console.log(
    `\n${blocking.size} line(s) are blocking the other ${records.length - complete} records.`,
  );
  console.log("Ranked by RECORDS unblocked, not by frequency:\n");
  for (const [line, count] of ranked.slice(0, showAll ? ranked.length : 30)) {
    const short = line.length > 92 ? `${line.slice(0, 89)}…` : line;
    console.log(`  ${String(count).padStart(3)}  ${short}`);
  }
  if (!showAll && ranked.length > 30) {
    console.log(`\n  … ${ranked.length - 30} more (--all)`);
  }
  console.log("\nAdd them to src/data/es-features.ts.");
}
