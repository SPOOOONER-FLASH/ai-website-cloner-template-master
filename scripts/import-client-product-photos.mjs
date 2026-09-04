#!/usr/bin/env node
/**
 * Imports the photograph sets the client organises as `<model>/主图.jpg` + `<model>/图库/`.
 *
 * WHY A SCRIPT AND NOT A ONE-OFF COPY. The client is now producing these folders per
 * category — panic exit devices first, more to follow — and the mapping from a folder
 * name to a product record is the part that needs judgement, not the copying. Doing it by
 * hand once means doing it by hand every time, and the failure mode is silent: a hero
 * written to the wrong slug looks completely normal until a buyer orders the wrong part.
 *
 * WHAT IT DOES
 *   主图.jpg          -> public/images/products/<slug>.webp
 *   图库/<n>-<x>.jpg  -> public/images/products/<slug>-2.webp, -3, -4 …
 *
 * The gallery filenames carry their own order (`2-001.jpg`, `3-001.jpg`, `6-001.jpg`) and
 * the numbering has gaps. That order is the client's, so it is respected — but the output
 * is renumbered contiguously, because a gap in the file series reads as a missing image
 * to anyone later checking the folder against the page.
 *
 * MATCHING IS EXACT, NOT FUZZY. A folder is matched to a product by normalised model
 * number (case and separators ignored) and nothing else. `308` does NOT become `308-D`:
 * we carry 308-D and 308-S, the folder says 308, and guessing which one the photographs
 * show is precisely the mistake that puts the wrong picture on a product page. Unmatched
 * folders are reported for the client to resolve — see --report.
 *
 * WRITING OVER AN EXISTING PHOTOGRAPH IS SAFE HERE because public/images/products is
 * tracked by git: a bad import is one `git checkout` away. The watermarked derivatives in
 * products-hyde/ are regenerated afterwards by `npm run assets:watermark`, so this script
 * deliberately does not touch them — running it does not invalidate the 1,485 repaired
 * derivatives, the watermark pass does, and that pass is the thing that should own them.
 *
 * Usage:
 *   node scripts/import-client-product-photos.mjs --from "<folder>" [--from "<folder>"] --report
 *   node scripts/import-client-product-photos.mjs --from "<folder>" --write
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const PRODUCTS_DIR = "content/products";
const IMAGE_DIR = "public/images/products";
/** The catalogue's established size; every existing product photograph is square. */
const SIZE = 1000;

const args = process.argv.slice(2);
const write = args.includes("--write");
const roots = args.flatMap((a, i) => (a === "--from" && args[i + 1] ? [args[i + 1]] : []));

if (!roots.length) {
  console.error('Give at least one folder: --from "<path to the model folders>"');
  process.exit(1);
}

const normalise = (s) => String(s ?? "").toUpperCase().replace(/[\s_-]/g, "");

/* --------------------------------------------------------------- catalogue */

const products = readdirSync(PRODUCTS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((file) => ({ file, ...JSON.parse(readFileSync(join(PRODUCTS_DIR, file), "utf8")) }));

const byModel = new Map();
for (const p of products) if (p.model) byModel.set(normalise(p.model), p);

/* ------------------------------------------------------------------ source */

function galleryFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.jpe?g$/i.test(f))
    /*
      Sort by the number the client put at the front of the filename. Falling back to a
      plain string sort would put `10-` before `2-`, silently reordering the set.
    */
    .map((f) => ({ file: f, order: Number.parseInt(f, 10) || Number.MAX_SAFE_INTEGER }))
    .sort((a, b) => a.order - b.order || a.file.localeCompare(b.file))
    .map((x) => x.file);
}

const folders = [];
for (const root of roots) {
  if (!existsSync(root)) {
    console.error(`Not found: ${root}`);
    process.exit(1);
  }
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(root, entry.name);
    const hero = ["主图.jpg", "主图.jpeg", "主图.JPG"]
      .map((n) => join(dir, n))
      .find((p) => existsSync(p));
    folders.push({
      model: entry.name,
      dir,
      hero,
      gallery: galleryFiles(join(dir, "图库")),
      videos: existsSync(join(dir, "视频"))
        ? readdirSync(join(dir, "视频")).filter((f) => /\.mp4$/i.test(f))
        : [],
    });
  }
}

/* ------------------------------------------------------------------ report */

const matched = [];
const unmatched = [];
const noHero = [];

for (const f of folders) {
  const product = byModel.get(normalise(f.model));
  if (!product) {
    unmatched.push(f);
    continue;
  }
  if (!f.hero) noHero.push(f);
  matched.push({ ...f, product });
}

console.log(
  `${folders.length} folders · ${matched.length} matched to a product · ${unmatched.length} unmatched`,
);
console.log(
  `${matched.reduce((n, m) => n + m.gallery.length, 0)} gallery images · ` +
    `${folders.reduce((n, f) => n + f.videos.length, 0)} videos found`,
);

if (unmatched.length) {
  console.log(`\nNo product carries these model numbers — nothing is imported for them:`);
  for (const f of unmatched) {
    console.log(
      `  ${f.model.padEnd(10)} ${f.gallery.length} gallery, ${f.videos.length} video(s)`,
    );
  }
}
if (noHero.length) {
  console.log(`\nMatched but no 主图.jpg: ${noHero.map((f) => f.model).join(", ")}`);
}

if (!write) {
  console.log("\n--write not given; nothing written.");
  process.exit(0);
}

/* ------------------------------------------------------------------- write */

mkdirSync(IMAGE_DIR, { recursive: true });

/** Square, 1000px, WebP — matching every other product photograph on the site. */
async function convert(source, destination) {
  await sharp(source)
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .webp({ quality: 88 })
    .toFile(destination);
}

let heroes = 0;
let galleryCount = 0;
const touched = [];

for (const m of matched) {
  const { product, slug } = { ...m, slug: m.product.slug };
  const name = product.name ?? slug;
  const label = `Hyland ${product.model} ${name}`;

  if (m.hero) {
    await convert(m.hero, join(IMAGE_DIR, `${slug}.webp`));
    product.heroImage = { src: `/images/products/${slug}.webp`, ratio: "1 / 1", label };
    heroes += 1;
  }

  const gallery = [];
  for (const [index, file] of m.gallery.entries()) {
    const position = index + 2; // the hero is 1
    const out = `${slug}-${position}.webp`;
    await convert(join(m.dir, "图库", file), join(IMAGE_DIR, out));
    gallery.push({
      src: `/images/products/${out}`,
      ratio: "1 / 1",
      label: `${label}, view ${position}`,
    });
    galleryCount += 1;
  }
  if (gallery.length) product.gallery = gallery;

  const { file, ...record } = product;
  writeFileSync(join(PRODUCTS_DIR, file), `${JSON.stringify(record, null, 2)}\n`);
  touched.push(`${product.model} → ${slug} (${m.hero ? "hero" : "no hero"}, ${gallery.length} gallery)`);
}

console.log(`\nwrote ${heroes} hero image(s) and ${galleryCount} gallery image(s):`);
for (const t of touched) console.log(`  ${t}`);
console.log(
  `\n⚠ Now run: npm run assets:watermark  — the site serves the watermarked derivatives, not these.`,
);
