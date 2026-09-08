#!/usr/bin/env node
/**
 * Repairs `relatedModels` entries that name a model the catalogue does not hold.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS WAS INVISIBLE
 *
 * `getRelatedProducts` in src/data/products.ts resolves each entry and silently drops
 * whatever it cannot find. That is the right runtime behaviour — a broken reference
 * should not take a page down — but it means a mistyped model number costs a slot in the
 * related-products block and reports nothing. On 2026-09-08 twelve entries across six
 * articles were dead, seven of them nothing worse than case and spacing: "LC07 85×45mm"
 * for "Lc07 85×45mm", "301-S-S" for "301-S", "LC02 85-40" for "Lc02 85×40mm".
 *
 * Those six articles include the two most-cited pages on the site. Every dead entry was a
 * link a reader did not get offered, on exactly the pages that earn readers.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT WILL AND WILL NOT DO
 *
 * It repairs an entry only when normalising case, spaces, and the separators the
 * catalogue mixes (`-`, `*`, `×`, `.`, `_`) plus an optional trailing `mm` produces
 * exactly one catalogue model. Anything ambiguous, or matching nothing, is REPORTED and
 * left alone — a related-products block quietly pointing at the wrong lock is worse than
 * one pointing at nothing, because the second is a gap and the first is a wrong answer.
 *
 * Usage:
 *   node scripts/fix-related-models.mjs            report only
 *   node scripts/fix-related-models.mjs --write     apply the unambiguous repairs
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const WRITE = process.argv.includes("--write");
const DIRS = ["content/products", "content/news"];

/** Case, whitespace, separator style and a trailing unit all vary; identity does not. */
const key = (s) =>
  s
    .toLowerCase()
    .replace(/[\s._*×x/-]/g, "")
    .replace(/mm$/, "");

const models = new Set();
const candidates = new Map();

for (const file of readdirSync("content/products")) {
  if (!file.endsWith(".json")) continue;
  const { model } = JSON.parse(readFileSync(`content/products/${file}`, "utf8"));
  models.add(model);
  const k = key(model);
  if (!candidates.has(k)) candidates.set(k, []);
  candidates.get(k).push(model);
}

const repaired = [];
const unresolved = [];

for (const dir of DIRS) {
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const path = `${dir}/${file}`;
    const record = JSON.parse(readFileSync(path, "utf8"));
    if (!Array.isArray(record.relatedModels)) continue;

    let changed = false;
    record.relatedModels = record.relatedModels.map((entry) => {
      if (models.has(entry)) return entry;

      const matches = candidates.get(key(entry)) ?? [];
      if (matches.length === 1) {
        repaired.push({ path, from: entry, to: matches[0] });
        changed = true;
        return matches[0];
      }
      unresolved.push({ path, entry, matches });
      return entry;
    });

    if (changed && WRITE) writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
  }
}

for (const r of repaired) {
  console.log(`${WRITE ? "fixed " : "would fix "}${r.path}: "${r.from}" → "${r.to}"`);
}
for (const u of unresolved) {
  const why = u.matches.length ? `ambiguous: ${u.matches.join(", ")}` : "no catalogue model";
  console.log(`LEFT   ${u.path}: "${u.entry}" — ${why}`);
}

console.log(
  `\n${repaired.length} ${WRITE ? "repaired" : "repairable"}, ${unresolved.length} left for a human.`,
);
if (!WRITE && repaired.length) console.log("Re-run with --write to apply.");

process.exitCode = unresolved.length ? 1 : 0;
