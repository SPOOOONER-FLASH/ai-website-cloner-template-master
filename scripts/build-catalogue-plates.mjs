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

import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
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

const files = readdirSync(SOURCE).filter((f) => f.endsWith(".webp") && !/-\d+\.webp$/.test(f));
let done = 0;
let fallback = 0;
const report = {};

for (const file of files) {
  const slug = basename(file, ".webp");
  const dest = join(outDir, `${slug}.jpg`);
  const src = join(SOURCE, file);
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
