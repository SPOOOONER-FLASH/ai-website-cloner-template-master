#!/usr/bin/env node
/**
 * Removes byte-identical repeats from a product's own image list.
 *
 * A colleague reviewing the site wrote "有重复的图片" against 70SN — the same photograph
 * appears twice in its gallery. That is not a typo to fix once: the galleries were
 * assembled from a bulk import, so wherever it happened once it happened silently, and
 * a buyer scrolling a gallery that repeats itself reads it as a padded listing.
 *
 * Identity is the SHA-1 of the file on disk, not the filename. The duplicates are
 * separate files with different names and identical bytes (…-5.webp and …-12.webp), so
 * comparing paths finds nothing at all.
 *
 * The first occurrence wins, and the hero image counts as an occurrence — a gallery entry
 * that merely repeats the hero adds nothing to the page.
 *
 * Usage:
 *   node scripts/dedupe-product-gallery.mjs           # report only
 *   node scripts/dedupe-product-gallery.mjs --write   # rewrite the JSON
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "content/products";
const write = process.argv.includes("--write");

const hashes = new Map();
function hashOf(src) {
  if (hashes.has(src)) return hashes.get(src);
  let h = null;
  try {
    h = createHash("sha1").update(readFileSync(`public${src}`)).digest("hex");
  } catch {
    /* A record pointing at a missing file is a different problem; leave it alone. */
  }
  hashes.set(src, h);
  return h;
}

let changed = 0;
let removed = 0;

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const gallery = product.gallery ?? [];
  if (!gallery.length) continue;

  const seen = new Set();
  const heroHash = product.heroImage?.src ? hashOf(product.heroImage.src) : null;
  if (heroHash) seen.add(heroHash);

  const dropped = [];
  const kept = gallery.filter((image) => {
    const h = hashOf(image.src);
    if (!h) return true;
    if (seen.has(h)) {
      dropped.push(image.src);
      return false;
    }
    seen.add(h);
    return true;
  });

  if (!dropped.length) continue;
  changed += 1;
  removed += dropped.length;
  console.log(`${product.model ?? file}`);
  for (const src of dropped) console.log(`   drop ${src.split("/").pop()}`);

  if (write) {
    product.gallery = kept;
    writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

console.log("");
console.log(
  changed
    ? `${removed} duplicate image${removed === 1 ? "" : "s"} across ${changed} product${changed === 1 ? "" : "s"}` +
        (write ? " — rewritten." : " — run with --write to remove them.")
    : "No duplicate images.",
);
