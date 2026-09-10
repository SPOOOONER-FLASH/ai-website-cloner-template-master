#!/usr/bin/env node
/**
 * Compares the crawled stahlock.com catalogue against ours, model by model.
 *
 * Answers three questions the client has asked in different forms since 2026-09-09:
 *
 *   1. Which models does stahlock publish that cantonlock does not carry at all?
 *   2. For the models we share, which SPEC ROWS does stahlock state and we do not?
 *   3. Where do the two sites DISAGREE about the same field on the same model?
 *
 * Question 3 is the one that matters most and the one nobody asks. Two of the client's
 * own storefronts contradicting each other on a backset is worse than either being
 * silent, because a buyer who checks both concludes the factory does not know.
 *
 * ---------------------------------------------------------------------------
 * NOTHING IS WRITTEN INTO THE CATALOGUE HERE
 *
 * This reports. Applying goes through scripts/apply-stahlock-*.mjs and
 * stahlock-cited-policy.mjs, which is what stops a certification claim on their page
 * becoming a certification claim on ours — see that module and its test. A CE or EN 1125
 * line on stahlock is evidence about a model tested years ago, not a licence for us to
 * print it on a different SKU.
 *
 *   node scripts/compare-stahlock-catalogue.mjs
 *   node scripts/compare-stahlock-catalogue.mjs --missing   # models we do not carry
 *   node scripts/compare-stahlock-catalogue.mjs --gaps      # spec rows we are missing
 *   node scripts/compare-stahlock-catalogue.mjs --conflicts # where the two sites disagree
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { canonicalLabel, certificationClaim } from "./stahlock-cited-policy.mjs";

const CATALOGUE = "docs/research/stahlock-catalogue.json";
const PRODUCT_DIR = "content/products";

const only = process.argv.find((a) => a.startsWith("--"))?.slice(2) ?? null;
const stahlock = Object.values(JSON.parse(readFileSync(CATALOGUE, "utf8")));

/** Model numbers compare loosely: "023 ET" and "023ET" and "023-et" are one model. */
const key = (model) =>
  String(model ?? "")
    .toUpperCase()
    .replace(/[\s_\-×*]/g, "")
    /*
      Trailing MM goes — the same normalisation scripts/import-client-product-photos.mjs
      settled on. Our lock cases are recorded as "LC02 85-40mm" and stahlock writes
      "Lc02 8540"; without this they read as two different models, and ten LC cases we
      obviously do carry were reported as absent from our own catalogue.
    */
    .replace(/MM$/, "");

const ours = new Map();
for (const file of readdirSync(PRODUCT_DIR)) {
  if (!file.endsWith(".json")) continue;
  const record = JSON.parse(readFileSync(join(PRODUCT_DIR, file), "utf8"));
  if (record.sites && !record.sites.includes("hyde")) continue;
  ours.set(key(record.model), record);
}

const missing = [];
const gaps = [];
const conflicts = [];

for (const page of stahlock) {
  const mine = ours.get(key(page.model));
  if (!mine) {
    missing.push(page);
    continue;
  }

  /* Our spec rows, keyed by the canonical label so "Center distance" meets "Centre distance". */
  const mineByLabel = new Map();
  for (const row of mine.specs ?? []) {
    mineByLabel.set(canonicalLabel(row.label).toLowerCase(), String(row.value ?? "").trim());
  }

  for (const row of page.specs) {
    /*
      Certification claims are never reported as a gap. `certificationClaim` matches whole
      claims rather than substrings — the test in stahlock-cited-policy.test.mjs pins that
      "UL listed later" is a claim and "Surface" is not — and a claim on their page is
      evidence about the model THAT page describes, not about ours.
    */
    if (certificationClaim(row.value) || certificationClaim(row.label)) continue;

    const label = canonicalLabel(row.label);
    const lower = label.toLowerCase();
    const value = String(row.value ?? "").trim();
    if (!value) continue;

    if (!mineByLabel.has(lower)) {
      gaps.push({ model: mine.model, slug: mine.slug, label, value, url: page.url });
      continue;
    }

    const existing = mineByLabel.get(lower);
    /* Compare loosely: whitespace, case and trailing punctuation are not disagreements. */
    const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").replace(/[.。]$/, "").trim();
    if (norm(existing) === norm(value)) continue;

    /*
      SEPARATE WORDING FROM FACT, or this report is unusable.

      The first run produced 491 "conflicts" and almost all of them were the same fact in
      different English: "Fully reversible, left or right hand" against "Fully Reversible
      for Left or Right-Handed Doors". Nobody can act on 491 rows of that, and burying the
      real disagreements inside them is how a wrong backset survives.

      A disagreement is treated as SUBSTANTIVE when the two sides state different numbers.
      Dimensions, backsets, pin counts, cycle counts and door thicknesses are what a buyer
      orders against and what a factory can be wrong about; adjectives are not. Where the
      numbers agree and only the prose differs, it is filed as wording — still worth a
      tidy one day, never worth stopping for.
    */
    /*
      SORTED, because the two sites write the same dimension in opposite orders:
        cantonlock  Adjustable 1-3/8" to 1-3/4" (35mm–45mm)
        stahlock    Adjustable 35–45mm (1-3/8" to 1-3/4")
      Identical facts, and an order-sensitive comparison called them a conflict. Sorting
      leaves only the cases where one side states a number the other does not — which is
      how "35–45mm" against "35–50mm" on model 808 stayed in the list, and that one is a
      real disagreement about which doors the lock fits.
    */
    const numbers = (s) =>
      (s.match(/\d+(?:\.\d+)?/g) ?? [])
        .map(Number)
        .sort((a, b) => a - b)
        .join(",");
    const substantive = numbers(existing) !== numbers(value);
    conflicts.push({
      model: mine.model,
      slug: mine.slug,
      label,
      ours: existing,
      theirs: value,
      url: page.url,
      substantive,
    });
  }
}

const show = (name) => !only || only === name;

console.log(`stahlock pages crawled: ${stahlock.length}`);
console.log(`matched to a cantonlock model: ${stahlock.length - missing.length}`);
console.log(`stahlock models we do not carry: ${missing.length}`);
console.log(`spec rows stahlock states and we do not: ${gaps.length}`);
const real = conflicts.filter((c) => c.substantive);
console.log(`fields where the two sites disagree in WORDING only: ${conflicts.length - real.length}`);
console.log(`fields where the two sites state a DIFFERENT NUMBER: ${real.length}   ← act on these\n`);

if (show("missing") && missing.length) {
  console.log("== models on stahlock, absent from cantonlock ==");
  const byCategory = new Map();
  for (const page of missing) {
    const list = byCategory.get(page.category ?? "(none)") ?? [];
    list.push(page.model);
    byCategory.set(page.category ?? "(none)", list);
  }
  for (const [category, models] of [...byCategory].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${String(models.length).padStart(3)}  ${category}: ${models.slice(0, 14).join(", ")}${models.length > 14 ? " …" : ""}`);
  }
  console.log("");
}

if (show("gaps") && gaps.length) {
  console.log("== spec rows we could add, grouped by field ==");
  const byLabel = new Map();
  for (const gap of gaps) byLabel.set(gap.label, (byLabel.get(gap.label) ?? 0) + 1);
  for (const [label, n] of [...byLabel].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${String(n).padStart(4)}  ${label}`);
  }
  console.log("");
}

if (show("conflicts")) {
  console.log("== the two sites state DIFFERENT NUMBERS — resolve before publishing either ==");
  if (!real.length) console.log("  none");
  for (const c of real.slice(0, 40)) {
    console.log(`  ${c.model} · ${c.label}`);
    console.log(`      cantonlock: ${c.ours}`);
    console.log(`      stahlock:   ${c.theirs}`);
  }
  if (real.length > 40) console.log(`  … and ${real.length - 40} more`);
  console.log(`
  (${conflicts.length - real.length} wording-only differences not listed — same numbers, different English.)`);
}
