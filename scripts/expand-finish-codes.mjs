#!/usr/bin/env node
/**
 * Expands bare finish codes into "Full Name (CODE)" on the product records.
 *
 * WHY. 45 records say `SSS/PSS`, 17 say `PB/AB/AC/SS/SN, all available`, 13 say
 * `PB.AB.AC.CP.SN`. A buyer searching "polished brass mortise lock" or "satin nickel
 * lever handle" matches none of them, and an answer engine asked "what finishes does this
 * come in" has two letters to work with. The codes are what goes on a purchase order, so
 * they stay — they are simply no longer the only thing present.
 *
 * WHERE THE TABLE COMES FROM. The client's own price list spells several of these out in
 * its finish column (PB=Polish Brass on the 6094, SN=Satin Nickel on the 70710,
 * SC=Satin Chrome on the 70610, BN Black Nickle on the 9211), and the rest are the
 * industry-standard set documented in content/news/reading-door-hardware-model-numbers.json.
 * A code that is not in the table below is LEFT ALONE and counted, exactly as the Spanish
 * glossary does — an unknown code is a gap to fill, never a guess to publish.
 *
 * Usage:
 *   node scripts/expand-finish-codes.mjs          # report
 *   node scripts/expand-finish-codes.mjs --write  # apply
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const DIR = "content/products";
const write = process.argv.includes("--write");

/** Code → the words a buyer actually types. Sourced as described above. */
const FINISH = {
  PB: "Polished Brass",
  AB: "Antique Brass",
  AC: "Antique Copper",
  SN: "Satin Nickel",
  SC: "Satin Chrome",
  CP: "Chrome Plated",
  SB: "Satin Brass",
  SP: "Bright Polished",
  BN: "Black Nickel",
  MB: "Matt Black",
  SS: "Stainless Steel",
  SSS: "Satin Stainless Steel",
  PSS: "Polished Stainless Steel",
  NP: "Nickel Plated",
  ORB: "Oil Rubbed Bronze",
};

/** Codes seen in the data that we cannot source. Reported, never expanded. */
const missing = new Map();

/**
 * A finish VALUE is a list of codes if every token is a short all-caps code.
 * Prose values ("Satin stainless steel (US32D)", "Painting") are already readable and
 * are left untouched — rewriting them would only churn the diff.
 */
const CODE = /^[A-Z]{1,3}$/;

function expand(value) {
  const trailing = /,?\s*(all available|other available)\.?$/i.exec(value);
  const tail = trailing ? trailing[1].toLowerCase() : null;
  const body = trailing ? value.slice(0, trailing.index) : value;

  const tokens = body.split(/[/.,]/).map((t) => t.trim()).filter(Boolean);
  if (tokens.length < 2) return null;
  if (!tokens.every((t) => CODE.test(t))) return null;

  const parts = tokens.map((code) => {
    const name = FINISH[code];
    if (!name) {
      missing.set(code, (missing.get(code) ?? 0) + 1);
      return code;
    }
    return `${name} (${code})`;
  });

  const joined = parts.join(", ");
  return tail ? `${joined} — ${tail}` : joined;
}

let changed = 0;
const examples = [];

for (const file of readdirSync(DIR)) {
  if (!file.endsWith(".json")) continue;
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));

  let touched = false;
  for (const row of product.specs ?? []) {
    if (row.label !== "Finish") continue;
    const next = expand(row.value);
    if (!next || next === row.value) continue;
    if (examples.length < 8) examples.push(`${row.value}\n      → ${next}`);
    row.value = next;
    touched = true;
  }

  if (touched) {
    changed += 1;
    if (write) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

console.log(`products with an expanded Finish row : ${changed}`);
if (missing.size) {
  console.log(`codes with no sourced name (left as-is): ${[...missing.entries()].map(([c, n]) => `${c}×${n}`).join(", ")}`);
} else {
  console.log("every code in the catalogue is in the table");
}
console.log("");
for (const e of examples) console.log(`   ${e}\n`);
if (!write) console.log("Report only. Re-run with --write.");
