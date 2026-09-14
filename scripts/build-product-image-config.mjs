#!/usr/bin/env node
/**
 * Writes product-images.config.json from the products the homepage can actually show.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS GENERATED AND NOT MAINTAINED BY HAND
 *
 * The homepage shows product photographs in three rails, and one of them — the demand
 * showcase — chooses its models from the client's enquiry data. So the set of product
 * images on the homepage changes when the client sends a new back-office export, and a
 * hand-written list of which images need responsive variants is wrong the moment that
 * happens. It went wrong twice in one day on 2026-09-13: once when the columns rail put a
 * 1000px plate on the homepage, and again when the demand showcase put eight more there.
 *
 * The srcset test in static-export-performance.test.ts catches it, which is the safety
 * net working — but a safety net that fires on every data update is a chore, and this
 * removes the chore rather than the net.
 *
 * Variants are 320/480/640/840: the widest a card gets is 420 CSS px, so 840 covers a 2×
 * display and the source stays as the largest candidate above that.
 *
 * Usage:  node scripts/build-product-image-config.mjs [--check]
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFIG = "src/components/site/product-images.config.json";
const PRODUCT_DIR = "content/products";
const VARIANTS = [320, 480, 640, 840];
const check = process.argv.includes("--check");

const products = readdirSync(PRODUCT_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(readFileSync(join(PRODUCT_DIR, name), "utf8")));

const byModel = new Map(products.map((product) => [String(product.model).toUpperCase(), product]));

/**
 * Every model any homepage rail can put on screen.
 *
 * Kept in one place here rather than imported from the components, because the components
 * are TypeScript with path aliases that a plain node script cannot resolve — the same
 * reason the catalogue-count tests read JSON from disk. If a rail changes its source,
 * this list changes with it, and the srcset test fails loudly if somebody forgets.
 */
function homepageModels() {
  const models = new Set();

  /* FlagshipTooling — the pair the client tooled here. */
  for (const model of ["307", "311"]) models.add(model);

  /* ArgentinaAr4Showcase — the seasonal market collection. */
  for (const model of ["AR4-110", "AR4-140", "AR4-101", "AR4-1121"]) models.add(model);

  /* FeatureColumns — the door coordinator card carries a product plate. */
  models.add("DC02");

  /*
    DemandShowcase — ranked from the client's Alibaba enquiry data. Read from the same
    research file the component reads, so the two cannot disagree.
  */
  const demand = JSON.parse(
    readFileSync("docs/research/2026-09-11-alibaba-product-performance.json", "utf8"),
  );
  for (const row of demand.products) {
    if (row.model) models.add(row.model);
  }

  return models;
}

/*
  The catalogue records point at /images/products/; the page renders the watermarked
  /images/products-hyde/ copy. The substitution happens at render time in
  src/data/product-image-branding.ts, so the config has to be written against the branded
  path — the unbranded one never reaches a browser and generating variants for it would
  produce four files per product that nothing requests.
*/
const PRODUCT_PREFIX = "/images/products/";
const BRANDED_PREFIX = "/images/products-hyde/";
const branded = (src) =>
  src?.startsWith(PRODUCT_PREFIX) ? `${BRANDED_PREFIX}${src.slice(PRODUCT_PREFIX.length)}` : src;

const config = {};
for (const model of homepageModels()) {
  const product = byModel.get(String(model).toUpperCase());
  const src = branded(product?.heroImage?.src);
  if (!src?.startsWith(BRANDED_PREFIX)) continue;
  config[src] = { sourceWidth: 1000, variants: VARIANTS };
}

/* Sources are 1000px square for panic devices and 1100px for the AR-4 plates. */
for (const [src, entry] of Object.entries(config)) {
  if (src.includes("/argentina-ar4/")) entry.sourceWidth = 1100;
}

const sorted = Object.fromEntries(Object.entries(config).sort(([a], [b]) => a.localeCompare(b)));
const next = `${JSON.stringify(sorted, null, 2)}\n`;

if (check) {
  const current = readFileSync(CONFIG, "utf8");
  if (current !== next) {
    console.error(
      `${CONFIG} is stale. Run: node scripts/build-product-image-config.mjs`,
    );
    process.exit(1);
  }
  console.log(`product image config is current — ${Object.keys(sorted).length} images.`);
} else {
  writeFileSync(CONFIG, next);
  console.log(`product image config -> ${Object.keys(sorted).length} images, ${VARIANTS.length} variants each.`);
}
