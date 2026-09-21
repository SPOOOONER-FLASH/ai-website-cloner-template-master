#!/usr/bin/env node
/**
 * Fills in the Spanish spec rows that are still, byte for byte, the English ones.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS AND NOT `translate-products-es.mjs --write`
 *
 * AGENTS.md forbids that script on this catalogue, and the reason is on the record: on
 * 2026-09-11 a one-field fix re-ran it and 830 Spanish spec rows REVERTED to English,
 * because its "no glossary entry, keep the English row" branch cannot tell a row nobody
 * translated from a row somebody improved by hand after the generator last ran.
 *
 * So this one is targeted, and its rule is the narrowest that can do the job:
 *
 *     a row is written ONLY when the Spanish value is still identical to the English one.
 *
 * A row whose Spanish differs from the English in any way — translated, corrected,
 * reworded, hand-typed — is left exactly as it is. The script cannot revert anything,
 * because it only ever touches rows where there is nothing to revert.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT FIXES
 *
 * `npm run audit:es:pages` on 2026-09-17: 25 distinct English phrases across 104 Spanish
 * pages, the top four being "35mm to 45mm adjustable" (29 pages), "60mm / 70mm
 * adjustable" (26), the panic-bar trim line (14) and the door-thickness variant (12).
 * All of them are spec values that now resolve in `src/data/es-glossary.ts` and did not
 * when the rows were written.
 *
 * Usage:
 *   node scripts/fill-spec-values-es.mjs           # report only
 *   node scripts/fill-spec-values-es.mjs --write
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const write = process.argv.includes("--write");

/*
  The tables are read as TEXT rather than imported, the same trade every other script in
  this directory makes: `node --test` and plain `node` disagree about TypeScript imports
  depending on the flags in play, and these scripts run from npm, from CI and by hand.
*/
function table(source, name) {
  const start = source.indexOf(`export const ${name}`);
  if (start === -1) return new Map();
  const end = source.indexOf("\n};", start);
  const body = source.slice(start, end);
  const map = new Map();
  const pattern =
    /^ {2}(?:"((?:[^"\\]|\\.)*)"|([A-Za-z][A-Za-z0-9_]*)):\s*\n?\s*"((?:[^"\\]|\\.)*)",$/gm;
  let match;
  while ((match = pattern.exec(body))) {
    const key = (match[1] ?? match[2]).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    map.set(key, match[3].replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
  }
  return map;
}

const glossary = readFileSync("src/data/es-glossary.ts", "utf8");
const TABLES = [
  table(glossary, "SPEC_VALUES_ES"),
  table(glossary, "MATERIAL_NAMES_ES"),
  table(glossary, "FINISH_NAMES_ES"),
];
const LABELS = table(glossary, "SPEC_LABELS_ES");

function lookup(value) {
  for (const t of TABLES) {
    const hit = t.get(value);
    if (hit) return hit;
  }
  return undefined;
}

/** The same rule as src/lib/spanish-product.ts: a separator makes a list, a bracket a code. */
const SEPARATORS = /(\s*[/+,]\s*)/;

function coded(value) {
  const match = /^(.*?)\s*\(([^)]+)\)$/.exec(value.trim());
  if (!match) return undefined;
  const name = lookup(match[1].trim());
  return name ? `${name} (${match[2]})` : undefined;
}

function localise(value) {
  const whole = lookup(value);
  if (whole) return whole;

  const withCode = coded(value);
  if (withCode) return withCode;

  const parts = value.split(SEPARATORS);
  if (parts.length < 3) return undefined;

  let any = false;
  const rebuilt = parts.map((part, index) => {
    if (index % 2 === 1) return part;
    const hit = lookup(part.trim()) ?? coded(part);
    if (hit) any = true;
    return hit ?? part;
  });
  return any ? rebuilt.join("") : undefined;
}

let touched = 0;
let rows = 0;
const stillEnglish = new Map();

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = join(DIR, file);
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (!data.specsEs?.length || !data.specs?.length) continue;

  /*
    Paired by LABEL, not by index. 072 has ten English rows and six Spanish ones — the two
    arrays drift as a record gains fields — and pairing those by position would translate a
    value into a field it does not belong to.
  */
  const englishByLabel = new Map();
  for (const row of data.specs) {
    englishByLabel.set(row.label, row);
    const spanishLabel = LABELS.get(row.label);
    if (spanishLabel) englishByLabel.set(spanishLabel, row);
  }

  let changed = false;
  data.specsEs.forEach((row) => {
    const english = englishByLabel.get(row.label);
    if (!english) return;

    /* The label and the value are two separate decisions; a row can need either. */
    if (row.label === english.label) {
      const label = LABELS.get(english.label);
      /* A label that translates to itself ("Material") is not a change worth counting. */
      if (label && label !== english.label) {
        row.label = label;
        changed = true;
        rows += 1;
      }
    }

    if (row.value !== english.value) return;
    const value = localise(english.value);
    if (!value || value === english.value) {
      stillEnglish.set(english.value, (stillEnglish.get(english.value) ?? 0) + 1);
      return;
    }
    row.value = value;
    changed = true;
    rows += 1;
  });

  if (changed) {
    touched += 1;
    if (write) writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  }
}

console.log(
  `${write ? "wrote" : "would write"} ${rows} row(s) across ${touched} record(s)`,
);

if (stillEnglish.size) {
  const ranked = [...stillEnglish.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\n${ranked.length} value(s) still English and not in the glossary:\n`);
  for (const [value, count] of ranked.slice(0, 25)) {
    const label = value.length > 88 ? `${value.slice(0, 85)}…` : value;
    console.log(`  ${String(count).padStart(4)}  ${label}`);
  }
  if (ranked.length > 25) console.log(`\n  … ${ranked.length - 25} more`);
  console.log("\nAdd them to SPEC_VALUES_ES in src/data/es-glossary.ts.");
}
