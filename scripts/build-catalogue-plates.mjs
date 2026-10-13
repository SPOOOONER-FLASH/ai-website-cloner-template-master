#!/usr/bin/env node
/**
 * Pre-renders every catalogue photograph as a trimmed PNG for the PDF generator.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS INSTEAD OF DOING IT IN PYTHON
 *
 * build_catalogue.py needs the product cut out of its white backdrop with the supplier's
 * burned-in watermark removed. That logic already exists, is tested, and is the place
 * where the never-invent-a-product rule is enforced — scripts/lib/product-cutout.mjs says
 * in its own header not to copy it into a second file, because a duplicated guard is a
 * guard that drifts.
 *
 * A naive white-trim in Pillow was the first attempt and it kept the watermark: the oval
 * is not white, so trimming to the non-white bounding box preserves it and every
 * thumbnail in the book carried a floating Hyland logo. Rather than reimplement the
 * connected-component isolation test in a second language, the cut-out runs once here
 * and the PDF generator consumes files.
 *
 * Usage:  node scripts/build-catalogue-plates.mjs [--out tmp/catalogue-plates] [--size 460]
 */

import { readdirSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import sharp from "sharp";
import { cutOut } from "./lib/product-cutout.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i > -1 ? args[i + 1] : d;
};

const SOURCE = "public/images/products";
const outDir = flag("out", "tmp/catalogue-plates");
const size = Number(flag("size", 460));
mkdirSync(outDir, { recursive: true });

/*
  Every product's own heroImage, plus the top-level photographs.

  The directory scan alone missed five products' main photographs on 2026-10-08, so the
  catalogue printed them with no picture: BH01's hero is bh01-grab-bar-3.webp, which the
  "-N.webp is a gallery variant" rule skipped, and the four Argentina AR4 records keep
  theirs in the argentina-ar4/ subfolder, which readdirSync never entered. A product's
  heroImage is the one photograph the book must have, so it is listed by name.
*/
const heroSources = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join("content/products", f), "utf8")).heroImage?.src)
  .filter((src) => typeof src === "string" && src.startsWith("/images/products/") && src.endsWith(".webp"))
  .map((src) => src.slice("/images/products/".length));
const files = [
  ...new Set([
    ...readdirSync(SOURCE).filter((f) => f.endsWith(".webp") && !/-\d+\.webp$/.test(f)),
    ...heroSources.filter((rel) => existsSync(join(SOURCE, rel))),
  ]),
].map((file) => ({ file, src: join(SOURCE, file) }));
/*
  Products added after the 2026-09 import keep only the HYDE-marked copy (SH02's hero is
  /images/products-hyde/sh02-spring-hinge-pin.webp, with no as-shot original), so the
  directory pass never saw them and the flyer could not print them (2026-10-13). The
  cut-out isolates the product and drops the floating mark, as it drops the old oval.
*/
const BRANDED = "public/images/products-hyde";
for (const f of readdirSync("content/products").filter((x) => x.endsWith(".json"))) {
  const src = JSON.parse(readFileSync(join("content/products", f), "utf8")).heroImage?.src;
  if (typeof src !== "string" || !src.startsWith("/images/products-hyde/") || !src.endsWith(".webp")) continue;
  const file = src.slice("/images/products-hyde/".length);
  if (files.some((x) => basename(x.file) === basename(file)) || !existsSync(join(BRANDED, file))) continue;
  files.push({ file, src: join(BRANDED, file) });
}
let done = 0;
let fallback = 0;
const report = {};

for (const { file, src } of files) {
  const slug = basename(file, ".webp");
  const dest = join(outDir, `${slug}.jpg`);
  try {
    const cut = await cutOut(src);
    await sharp(cut.buffer)
      .resize(size, size, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true })
      .toFile(dest);
    report[slug] = "cut-out";
    done += 1;
  } catch (error) {
    /*
      A source that refuses the cut-out — a photograph on a desk, a dimension drawing —
      still belongs in the book; it is a real photograph of a real product and the
      catalogue is worse without it. It is simply used as shot, and recorded as such, so
      the difference is visible rather than silently averaged away.
    */
    await sharp(src)
      .resize(size, size, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true })
      .toFile(dest);
    report[slug] = `as-shot (${error.message})`;
    fallback += 1;
  }
}

writeFileSync(join(outDir, "index.json"), `${JSON.stringify(report, null, 1)}\n`);
console.log(`${done} cut out, ${fallback} used as shot -> ${outDir}`);
