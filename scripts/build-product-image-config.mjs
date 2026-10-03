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
import sharp from "sharp";
import { studioShowcase } from "../src/lib/studio-showcase.ts";

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

  // Native home catalogue atlas: two direct product photographs alongside editorial plates.
  for (const model of ["Stainless Steel Flush Bolt", "600"]) models.add(model);

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

  /*
    StudioShowcase — one model in every finish, chosen from the order-code families by
    src/lib/studio-showcase.ts. That module is plain TypeScript with relative imports, so
    node's type stripping loads it here and the component cannot pick a family this list
    does not know about. Filtered to HYDE the way src/data/products.ts does (a record with
    no `sites` field, or one naming "hyde"; a photograph is required to publish).
  */
  const hyde = products.filter(
    (product) => (!product.sites || product.sites.includes("hyde")) && product.heroImage?.src,
  );
  for (const member of studioShowcase(hyde)?.members ?? []) models.add(member.model);

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

/**
 * Image paths the homepage hard-codes rather than looking up by model.
 *
 * EditorialAtlas writes its five subjects as literal /images/products-hyde/… paths, so no
 * amount of adding models to homepageModels() above will cover them: one of its entries is
 * labelled "Flush bolts", which is not a model number at all.
 *
 * On 2026-09-15 that rail put two images on the homepage with no srcset —
 * stainless-steel-flush-bolt and 600-concealed-sliding-door-handle — and
 * static-export-performance.test.ts failed exactly as the note above promised it would.
 * Rather than copy those two names into the list and wait for the next rail to be added,
 * the literals are read straight out of the component. It is a regex over a source file,
 * which is crude, but it cannot drift from what the component actually renders — and that
 * is the whole failure being fixed.
 */
function hardCodedHomepageImages() {
  const found = new Set();
  for (const file of ["src/components/site/EditorialAtlas.tsx"]) {
    let source;
    try {
      source = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const m of source.matchAll(/["'](\/images\/products-hyde\/[^"']+\.webp)["']/g)) {
      found.add(m[1]);
    }
  }
  return found;
}

/*
  The source width is measured, not assumed. Most plates are 1000px square and the AR-4
  plates 1100px, but the D101 deadbolt in antique brass — which the studio showcase put on
  the homepage on 2026-09-29 — is an 800px photograph, and the srcset generator refuses a
  candidate as wide as its source. Measuring costs one header read per image and means a
  smaller photograph simply gets fewer candidates instead of failing the build.
*/
async function sourceEntry(src) {
  const { width } = await sharp(join("public", ...src.split("/").filter(Boolean))).metadata();
  return { sourceWidth: width, variants: VARIANTS.filter((w) => w < width) };
}

const config = {};
for (const model of homepageModels()) {
  const product = byModel.get(String(model).toUpperCase());
  const src = branded(product?.heroImage?.src);
  if (!src?.startsWith(BRANDED_PREFIX)) continue;
  config[src] = await sourceEntry(src);
}
for (const src of hardCodedHomepageImages()) {
  config[src] = await sourceEntry(src);
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
