#!/usr/bin/env node
/**
 * Renames one product's name and slug, and takes its photographs, videos and old URL with
 * it.
 *
 * ---------------------------------------------------------------------------
 * WHY A SCRIPT FOR A ONE-LINE CHANGE
 *
 * Renaming a product looks like editing one field and is actually five edits that must all
 * land together, four of which are silent when they do not:
 *
 *   1. the record's `name` and `slug`
 *   2. every image file, whose filename IS the slug
 *   3. the `src` of every image reference inside the record
 *   4. the video and its poster, same reason
 *   5. a 301 from the old URL, or the page Google already indexed becomes a 404
 *
 * Miss (2) and the page renders with no photographs. Miss (5) and an indexed URL dies
 * quietly. Doing it by hand once means doing it by hand every time, and the client renames
 * products as the factory clarifies them — DS011 on 2026-09-08 was the first.
 *
 * The redirect goes into content/taxonomy-moves.json as a `productMerges` entry, which is
 * the existing mechanism for "this slug moved inside its category": one file feeds both
 * the export-time redirect stub and the real nginx 301. See that file's own header.
 *
 * Usage:
 *   node scripts/rename-product-slug.mjs --model "DS011" --name "Door Stopper" [--write]
 */

import { existsSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const IMAGE_DIRS = ["public/images/products", "public/images/products-hyde"];
const VIDEO_DIR = "public/videos/products";
const MOVES = "content/taxonomy-moves.json";

const args = process.argv.slice(2);
const write = args.includes("--write");
const arg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};

const model = arg("--model");
const newName = arg("--name");
const why = arg("--why") ?? "";
if (!model || !newName) {
  console.error('Usage: node scripts/rename-product-slug.mjs --model "DS011" --name "Door Stopper" [--write]');
  process.exit(1);
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
const file = files.find((f) => {
  const record = JSON.parse(readFileSync(join(DIR, f), "utf8"));
  return record.model.replace(/\s+/g, "").toUpperCase() === model.replace(/\s+/g, "").toUpperCase();
});
if (!file) {
  console.error(`× 目录里没有型号 ${model}`);
  process.exit(1);
}

const record = JSON.parse(readFileSync(join(DIR, file), "utf8"));
const oldSlug = record.slug;
const newSlug = `${slugify(record.model)}-${slugify(newName)}`;

if (oldSlug === newSlug) {
  console.log(`${model} 已经是 ${newSlug}，无需改动`);
  process.exit(0);
}
if (existsSync(join(DIR, `${newSlug}.json`))) {
  console.error(`× ${newSlug} 已存在，拒绝覆盖`);
  process.exit(1);
}

/** Every asset whose filename starts with the old slug, across both image trees. */
const assetMoves = [];
for (const dir of [...IMAGE_DIRS, VIDEO_DIR]) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (name !== `${oldSlug}` && !name.startsWith(`${oldSlug}.`) && !name.startsWith(`${oldSlug}-`)) {
      continue;
    }
    assetMoves.push([join(dir, name), join(dir, name.replace(oldSlug, newSlug))]);
  }
}

/** Rewrite every `src` in the record that pointed at the old slug. */
const retarget = (value) => {
  if (typeof value === "string") return value.split(oldSlug).join(newSlug);
  if (Array.isArray(value)) return value.map(retarget);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, retarget(v)]));
  }
  return value;
};

/*
  Retarget FIRST, then set name and slug.

  The previous order — `retarget({ ...record, name, slug: newSlug })` — fed the new slug
  through the very replacement that rewrites the old one, and a new slug that CONTAINS the
  old one as a prefix got rewritten too:

    old  001-panic-exit-device
    new  001-panic-exit-device-trim
    out  001-panic-exit-device-trim-trim     ← written into record.slug

  The filename was correct, so the record and its file disagreed and every renamed page
  404ed. It stayed hidden because the first use of this script (DS011 → Door Stopper on
  2026-09-08) replaced the descriptive half rather than extending it, so the old slug was
  not a substring of the new one. Renaming 15 panic-device records on 2026-09-10 — where
  every new name appends "Trim" — hit it 13 times at once, and `npm run content`'s
  slug/filename check is what caught it.
*/
const updated = { ...retarget(record), name: newName, slug: newSlug };

console.log(`${model}: ${record.name} → ${newName}`);
console.log(`  slug   ${oldSlug} → ${newSlug}`);
console.log(`  assets ${assetMoves.length} 个文件`);
console.log(`  301    /products/${record.categoryPath[0]}/${oldSlug}/ → ${newSlug}/`);

if (!write) {
  console.log("\n--write not given; nothing changed.");
  process.exit(0);
}

for (const [from, to] of assetMoves) renameSync(from, to);
writeFileSync(join(DIR, `${newSlug}.json`), `${JSON.stringify(updated, null, 2)}\n`);
if (existsSync(join(DIR, file))) renameSync(join(DIR, file), join(DIR, `${newSlug}.json.bak`));
/* The record is written under its new name; remove the old file rather than leave a twin. */
const { unlinkSync } = await import("node:fs");
if (existsSync(join(DIR, `${newSlug}.json.bak`))) unlinkSync(join(DIR, `${newSlug}.json.bak`));

const moves = JSON.parse(readFileSync(MOVES, "utf8"));
moves.productMerges = moves.productMerges ?? [];
moves.productMerges.push({
  from: oldSlug,
  to: newSlug,
  category: record.categoryPath[0],
  why: why || `Renamed ${record.name} → ${newName}.`,
});
writeFileSync(MOVES, `${JSON.stringify(moves, null, 2)}\n`);

console.log("\n✔ 完成。接着跑 npm run content，再重出 out/。");
