#!/usr/bin/env node
/**
 * How much of the catalogue can answer a North American specifier in their own numbers.
 *
 * Prints, from content/products alone:
 *   - how many published records gain an ANSI/BHMA A156.18 finish number
 *   - which numbers, and how many records carry each
 *   - for the rest, the REASON there is no number, grouped
 *
 * The reason column is the point. "62% have no BHMA number" is a number nobody can act
 * on; "92 records are zinc alloy, which A156.18 has no base group for" and "148 records
 * say only `SS`, which does not state satin or polished" are two different jobs, one for
 * the factory and one for the data.
 *
 *   node scripts/audit-bhma-finishes.mjs
 *   node scripts/audit-bhma-finishes.mjs --gaps    # only the actionable list
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { UNMAPPED_FINISHES, bhmaBase, bhmaFinishesFor } from "../src/lib/bhma-finish.ts";

const DIR = "content/products";
const gapsOnly = process.argv.includes("--gaps");

const published = [];
for (const file of readdirSync(DIR)) {
  if (!file.endsWith(".json")) continue;
  const record = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  if (record.sites && !record.sites.includes("hyde")) continue;
  if (!record.heroImage?.src) continue;
  published.push(record);
}

const counts = new Map();
const gaps = new Map();
const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);

let withNumber = 0;
let noFinishRecorded = 0;

for (const record of published) {
  const found = bhmaFinishesFor(record);
  if (found.length) {
    withNumber += 1;
    for (const finish of found) bump(counts, `${finish.bhma}  ${finish.us}  ${finish.name}`);
    continue;
  }

  const finishes = record.finishes ?? [];
  if (!finishes.length) {
    noFinishRecorded += 1;
    bump(gaps, "no finish recorded on the record at all → ask the factory");
    continue;
  }

  const base = bhmaBase(record.material);
  if (!base) {
    /* Say WHICH material, because zinc and "brass or stainless" are different problems. */
    const material = (record.material ?? "").trim();
    if (!material) bump(gaps, "material field empty → ask the factory");
    else if (/zinc|zamak/i.test(material)) bump(gaps, "zinc alloy — A156.18 has no base group for it");
    else if (/alumin/i.test(material)) bump(gaps, "aluminium — A156.18 has no base group for it");
    else bump(gaps, "material names more than one metal → buyer has not chosen a base yet");
    continue;
  }

  /* Base is known, so the blocker is the finish code itself. */
  const codes = finishes
    .flatMap((entry) => entry.split(/[.,/]|\s+or\s+/i))
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean);
  const reason = codes.map((code) => UNMAPPED_FINISHES[code]).find(Boolean);
  bump(gaps, reason ? `${base} base, but: ${reason}` : `${base} base, unrecognised finish code: ${codes.join(" ")}`);
}

const pct = (n) => `${Math.round((n / published.length) * 100)}%`;

if (!gapsOnly) {
  console.log(`published HYDE records: ${published.length}`);
  console.log(`gain a BHMA/US finish number: ${withNumber} (${pct(withNumber)})\n`);
  console.log("numbers published, by record count:");
  for (const [key, n] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${key}`);
  }
  console.log("");
}

console.log("no number, grouped by the reason (this is the work list):");
for (const [key, n] of [...gaps].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${key}`);
}
console.log(`\n  of which ${noFinishRecorded} have no finish recorded at all.`);
