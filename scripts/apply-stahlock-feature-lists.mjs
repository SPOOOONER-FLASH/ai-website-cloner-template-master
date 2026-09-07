#!/usr/bin/env node
/**
 * Writes the client's own verified Features bullets from stahlock into the catalogue.
 *
 * ---------------------------------------------------------------------------
 * THE GAP THIS CLOSES
 *
 * `fetch-stahlock-features.mjs` has cached 305 pages since 2026-09-04, and 200 of them
 * carry a Features block — four bullets each, written and checked by the client's own
 * people on their own storefront. Nothing has ever written them into a product record, so
 * that copy has been sitting in `docs/research/stahlock-features.json` doing nothing while
 * lever-handles ran 0/40 and knob-locks 0/67 on having any feature text at all.
 *
 * `apply-stahlock-features.mjs` is a different job — it fills the one-line `summary`, and
 * reports "193 already had one". The bullets are a separate field and were never applied.
 *
 * ---------------------------------------------------------------------------
 * WHY A LIST FIELD AND NOT MORE SPEC ROWS
 *
 * Fifty-four products already carry a single `Feature` spec row holding one sentence. Four
 * more rows all labelled "Feature" would read as a broken table, and joining four bullets
 * into one cell with separators throws away the structure that makes them scannable.
 *
 * So they go in their own `features` array and render as a list. That is what they are.
 *
 * ---------------------------------------------------------------------------
 * ENGLISH ONLY, ON PURPOSE
 *
 * These bullets are English prose from the client's English storefront. They are NOT
 * written to any Spanish field and the Spanish page does not render them, because putting
 * English sentences on a Spanish product page is the same error as English answers in
 * Spanish FAQ markup — see src/lib/product-faq.ts. They go to the translator with
 * everything else; until then the Spanish page simply does not carry this block.
 *
 * Usage:
 *   node scripts/apply-stahlock-feature-lists.mjs --report
 *   node scripts/apply-stahlock-feature-lists.mjs --write
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WRITE = process.argv.includes("--write");
const CACHE = "docs/research/stahlock-features.json";
const DIR = "content/products";

const cache = JSON.parse(readFileSync(CACHE, "utf8"));

/** A bullet worth publishing. */
function usable(line) {
  const text = String(line ?? "").trim();
  if (text.length < 12 || text.length > 200) return false;
  /*
    Marketing filler that says nothing a buyer can act on. These appear verbatim on the
    source pages and are the only lines that would make the block worse than empty.
  */
  if (/^(high quality|good quality|best price|welcome to|any question)/i.test(text)) return false;
  return true;
}

let written = 0;
let already = 0;
let nothing = 0;
const samples = [];

for (const [slug, entry] of Object.entries(cache)) {
  const file = join(DIR, `${slug}.json`);
  if (!existsSync(file)) continue;

  const bullets = (entry?.features ?? []).map((f) => String(f).trim()).filter(usable);
  if (!bullets.length) {
    nothing += 1;
    continue;
  }

  const product = JSON.parse(readFileSync(file, "utf8"));
  if (product.features?.length) {
    already += 1;
    continue;
  }

  /*
    Provenance travels with the copy. This is the client's own verified text from their
    own site, and six months from now the only way to know that — rather than assuming
    somebody wrote it here — is if the record says so.
  */
  product.features = bullets;
  product.featuresSource = {
    site: "stahlock.com",
    url: entry.url,
    model: entry.stahlockModel,
    fetchedAt: entry.fetchedAt,
  };

  if (WRITE) writeFileSync(file, `${JSON.stringify(product, null, 2)}\n`);
  written += 1;
  if (samples.length < 3) samples.push({ slug, bullets });
}

console.log(
  `${WRITE ? "" : "[report] "}${written} product(s) gain a feature list · ` +
    `${already} already had one · ${nothing} had nothing usable cached`,
);
for (const s of samples) {
  console.log(`\n  ${s.slug}`);
  for (const b of s.bullets) console.log(`    · ${b}`);
}
if (!WRITE) console.log("\n--write not given; nothing written.");
