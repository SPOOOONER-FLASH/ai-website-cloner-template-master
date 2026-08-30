/**
 * Adds spec rows sourced from stahlock.com, the client's other storefront.
 *
 * PROVENANCE. Every row comes from kimi's dry-run mapping, committed alongside this
 * script at docs/collaboration/reviews/2026-08-29-kimi-seo-stahlock/. That CSV carries
 * the stahlock URL and the evidence line for each row, so any value here can be traced
 * back to the page it was read from. The CSV is read at runtime rather than transcribed
 * into a literal table — 592 rows is past the point where hand-copying is the safer
 * option, and the file in the repo is the same one that was reviewed.
 *
 * THE RULES, unchanged from enrich-product-specs.mjs:
 *   - only labels this product does not already have; nothing is ever overwritten
 *   - `conflict` rows are never written, only counted
 *   - exact model match plus a category gate, both already applied upstream
 *
 * THREE CARVE-OUTS ADDED AT REVIEW (2026-08-30):
 *
 *   1. AMBIGUOUS KEYS. F101, 587 SSET and 5870 SSET each match two stahlock records and
 *      there is no rule for choosing between them. Excluded entirely; the client decides.
 *
 *   2. LABEL COLLISIONS. stahlock writes "Latch: 60mm / 70mm" where we already hold
 *      "Latch: Deadlocking on keyed functions". Those are two different attributes filed
 *      under one word, not a disagreement — but merging them would put a dimension where
 *      a behaviour is documented. Rows whose label we already hold are skipped by the
 *      no-overwrite rule anyway; this note exists so the next reader does not "fix" it.
 *
 *   3. CERTIFICATION AND STANDARDS. Any row whose label or value reaches for a standard
 *      is dropped. stahlock is a storefront, not a certificate, and the Standard rows in
 *      the mapping would re-introduce exactly the claims removed from this site on
 *      2026-08-27. See the certificates block in src/data/company.ts.
 *
 * Run: node scripts/stahlock-cited.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";

import {
  canonicalGroupKey,
  canonicalLabel,
  certificationClaim,
  conflictingCanonicalGroups,
} from "./stahlock-cited-policy.mjs";

const DIR = "content/products";
const CSV = "docs/collaboration/reviews/2026-08-29-kimi-seo-stahlock/stahlock_mapping_dryrun.csv";
const DRY = process.argv.includes("--dry");

/** Matches two stahlock records each; no rule picks a winner, so none is picked. */
const AMBIGUOUS = new Set(["F101", "587 SSET", "5870 SSET"]);

/**
 * stahlock names the same attributes differently. Left alone, a product ends up holding
 * both "Door thickness" and "Door Thickness" — the no-overwrite check is exact, so a
 * capital letter is enough to slip a duplicate row past it — and both "Material" and
 * "Lock Body Material" for one fact.
 *
 * Mapped only where the two clearly mean the same thing. A stahlock label with no entry
 * here is kept verbatim: "Spindle Hole" and "Opening Angle" are attributes this
 * catalogue does not carry yet, and inventing a home for them would lose information.
 */
/** Minimal RFC-4180 reader: quoted fields, doubled quotes, embedded commas. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const table = parseCsv(readFileSync(CSV, "utf8"));
const header = table[0].map((h) => h.replace(/^﻿/, "").trim());
const index = Object.fromEntries(header.map((h, i) => [h, i]));
const records = table
  .slice(1)
  .filter((r) => r.length >= header.length)
  .map((r) => Object.fromEntries(header.map((h) => [h, r[index[h]]])));

const proposed = records.filter((r) => r.type === "new");
const conflicts = records.filter((r) => r.type === "conflict").length;

/** slug -> rows to add. */
const bySlug = new Map();
const skipped = { ambiguous: 0, certification: 0, conflictingGroup: 0 };

const eligible = proposed.filter((row) => {
  if (AMBIGUOUS.has(row.cantonlock_model?.trim())) {
    skipped.ambiguous += 1;
    return false;
  }
  if (certificationClaim(row.label) || certificationClaim(row.stahlock_value)) {
    skipped.certification += 1;
    return false;
  }
  return true;
});
const conflictingGroups = conflictingCanonicalGroups(eligible);

for (const row of eligible) {
  if (conflictingGroups.has(canonicalGroupKey(row))) {
    skipped.conflictingGroup += 1;
    continue;
  }
  if (!bySlug.has(row.cantonlock_slug)) bySlug.set(row.cantonlock_slug, []);
  bySlug.get(row.cantonlock_slug).push(row);
}

let updated = 0;
let added = 0;
let alreadyHeld = 0;
const missingFiles = [];
const samples = [];

for (const [slug, rows] of bySlug) {
  const path = `${DIR}/${slug}.json`;
  let product;
  try {
    product = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    missingFiles.push(slug);
    continue;
  }

  const specs = [...(product.specs ?? [])];
  const before = specs.length;
  for (const row of rows) {
    const label = canonicalLabel(row.label);
    // Case-insensitive: "Door Thickness" must not slip past "Door thickness".
    if (specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) {
      alreadyHeld += 1;
      continue;
    }
    specs.push({ label, value: row.stahlock_value });
    if (samples.length < 12) samples.push(`${product.model} · ${label} = ${row.stahlock_value}`);
  }
  if (specs.length === before) continue;

  product.specs = specs;
  added += specs.length - before;
  updated += 1;
  if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

console.log(`mapping rows      : ${records.length} (${proposed.length} new, ${conflicts} conflict)`);
console.log(`skipped ambiguous : ${skipped.ambiguous}`);
console.log(`skipped standards : ${skipped.certification}`);
console.log(`held disagreements: ${skipped.conflictingGroup} rows in ${conflictingGroups.size} field groups`);
console.log(`label already held: ${alreadyHeld}`);
console.log(`products updated  : ${updated}`);
console.log(`rows added        : ${added}`);
if (missingFiles.length) console.log(`slug not found    : ${missingFiles.length} — ${missingFiles.slice(0, 5).join(", ")}`);
console.log(`\nsample:\n  ${samples.join("\n  ")}`);
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
