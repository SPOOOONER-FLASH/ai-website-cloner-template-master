#!/usr/bin/env node
/**
 * Adds a `Type` spec row naming what these models are on the client's own other site.
 *
 * ---------------------------------------------------------------------------
 * THE PROBLEM, AND WHY RENAMING WAS THE WRONG FIX
 *
 * `abs-015` is the largest single keyword signal the site has — 169 impressions on Bing's
 * keyword tool. On cantonlock the 015 page is called Panic Exit Device; on the client's
 * own stahlock.com it is called Trim Handle. Those are not synonyms: a panic bar is the
 * rail on the inside of the door that opens when someone falls against it, and a trim
 * handle is the lever on the OUTSIDE that works with it. A buyer searching for a panic
 * bar arrives and finds a handle.
 *
 * Four independent sources say "trim handle", all of them the client's own: the stahlock
 * page title, 015's own spec row ("Used in combination with push bar and lock"), and the
 * descriptions carried over onto 027 and 016.
 *
 * The obvious fix — rename — is the expensive one. That URL is ranking. Moving it costs a
 * 301, resets the page's history, and the evidence for the move is another site's page
 * title. So the client's instruction was to keep whatever ranks and add the missing term
 * somewhere useful, which is better than either extreme:
 *
 *   - the URL, the H1 and the ranking stay exactly as they are;
 *   - "Trim Handle" becomes searchable text on the page and in the Product schema's
 *     additionalProperty;
 *   - the buyer who lands from a panic-bar search sees, in the spec table, that this is
 *     the outside trim — which is the thing they actually needed to know;
 *   - productFaqItems picks it up automatically, because `Type` is already one of the
 *     labels it asks about, so the same edit also lands in the FAQPage markup.
 *
 * Nothing is renamed and no route moves. Run again after the client decides A/B/C on
 * docs — this only ever adds a row that is not already there.
 *
 * Usage:  node scripts/add-trim-handle-type.mjs [--dry]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DRY = process.argv.includes("--dry");
const DIR = "content/products";

/*
  The eighteen from scripts/audit-name-drift.mjs, with what stahlock calls each. Listed
  rather than re-derived so the file records exactly which models were touched and on
  what date; audit-name-drift stays the source of truth for finding new ones.
*/
const NAMING = {
  "001-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "015-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "016-exterior-trim": "Trim handle · outside lever with key for panic exit devices",
  "023-et-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "023-etan-anti-pick-panic-exit-device": "Trim handle · anti-pick outside lever for panic exit devices",
  "023-ps-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "026-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "027-panic-exit-device": "Trim handle · external handle for panic bar systems",
  "028-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "030-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "033-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "035-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "037-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "039-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "72-panic-exit-device": "Profile lock case for panic exit devices",
  "9080e-panic-exit-device": "Trim handle · outside lever for panic exit devices",
  "9082e-stainless-steel-handle": "Trim handle · outside lever for panic exit devices",
  "x2-panic-exit-device": "Trim handle · outside lever for panic exit devices",
};

/* Spanish, from the same glossary the rest of the catalogue is composed from. */
const NAMING_ES = {
  "Trim handle · outside lever for panic exit devices":
    "Guarnición exterior · manija exterior para barras antipánico",
  "Trim handle · outside lever with key for panic exit devices":
    "Guarnición exterior · manija exterior con llave para barras antipánico",
  "Trim handle · anti-pick outside lever for panic exit devices":
    "Guarnición exterior · manija exterior antiganzúa para barras antipánico",
  "Trim handle · external handle for panic bar systems":
    "Guarnición exterior · manija externa para sistemas de barra antipánico",
  "Profile lock case for panic exit devices": "Cerradura de perfil para barras antipánico",
};

const LABEL = "Type";
const LABEL_ES = "Tipo";

let changed = 0;
let already = 0;
let missing = 0;

for (const [slug, value] of Object.entries(NAMING)) {
  const file = join(DIR, `${slug}.json`);
  let product;
  try {
    product = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    console.log(`  !! ${slug}: no such record`);
    missing += 1;
    continue;
  }

  if ((product.specs ?? []).some((s) => s.label === LABEL)) {
    already += 1;
    continue;
  }

  /*
    First row, not appended. The spec table is read top-down and this is the row that
    answers "what am I actually looking at" — which is the whole point of adding it.
  */
  product.specs = [{ label: LABEL, value }, ...(product.specs ?? [])];
  if (product.specsEs?.length) {
    product.specsEs = [
      { label: LABEL_ES, value: NAMING_ES[value] ?? value },
      ...product.specsEs,
    ];
  }

  if (!DRY) writeFileSync(file, `${JSON.stringify(product, null, 2)}\n`);
  changed += 1;
}

console.log(
  `${DRY ? "[dry] " : ""}${changed} updated, ${already} already had a Type row, ${missing} missing`,
);
