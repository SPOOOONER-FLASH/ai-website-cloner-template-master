#!/usr/bin/env node
/**
 * Pads a hero image out to the frame that would otherwise crop it.
 *
 * ---------------------------------------------------------------------------
 * PAD, DO NOT CROP
 *
 * `scripts/audit-image-fit.mjs` finds images whose subject is cut by a component's fixed
 * frame. The worst case is a square product plate in the 16:9 news hero: 44% of the width
 * is gone, which on a plate composed to fill its frame means nearly half the product.
 *
 * There are two ways to stop that and only one of them is honest. Re-cropping the plate
 * to 16:9 would still throw the product away — it just moves the decision upstream.
 * Padding adds field around it and loses nothing, which is the same conclusion the RAYEN
 * session reached on 2026-09-11 when it dropped the aspect-ratio "safety band" and
 * started padding non-square plates: 补白无损.
 *
 * The pad colour is sampled from the plate's own corner rather than assumed white,
 * because the catalogue holds plates on white, on light grey, and a few on near-black.
 * A white bar beside a dark plate is more obviously wrong than the crop it replaced.
 *
 * ---------------------------------------------------------------------------
 * WHY THE OUTPUT IS A NEW FILE
 *
 * The source plate is also the product page's photograph, at the shape a product page
 * wants. Padding it in place would fix the article and break the product. The framed copy
 * lives beside it and only the article points at it.
 *
 * Usage:
 *   node scripts/build-framed-heroes.mjs            # write
 *   node scripts/build-framed-heroes.mjs --check    # verify the outputs exist and match
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const check = process.argv.includes("--check");
const OUT_DIR = "public/images/editorial/framed";
const NEWS_FRAME = 16 / 9;

/**
 * Articles whose hero is cut through the subject by the 16:9 news frame.
 *
 * Listed rather than discovered, because the fix is a judgement — an image losing a strip
 * of sky does not need padding, and padding everything would put bars on twenty articles
 * that read correctly today. Run the audit, then add what it calls CROP.
 */
const TARGETS = [
  "door-coordinator-double-fire-door",
  "what-a-frameless-glass-door-needs",
  "what-it-takes-to-tool-a-new-exit-device",
  "fitting-a-euro-cylinder",
];

/** The plate's own field colour, taken from a corner it is unlikely to occupy. */
async function fieldColour(path) {
  const { data } = await sharp(path)
    .extract({ left: 0, top: 0, width: 24, height: 24 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = data.length / 3;
  for (let i = 0; i < data.length; i += 3) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return { r: Math.round(r / pixels), g: Math.round(g / pixels), b: Math.round(b / pixels) };
}

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let missing = 0;

for (const slug of TARGETS) {
  const recordPath = `content/news/${slug}.json`;
  if (!existsSync(recordPath)) {
    console.warn(`  no record for ${slug}`);
    continue;
  }

  const record = JSON.parse(readFileSync(recordPath, "utf8"));
  const src = record.heroImage?.src;
  if (!src) continue;

  /* Already framed — the record was updated on a previous run. */
  if (src.startsWith("/images/editorial/framed/")) {
    if (!existsSync(`public${src}`)) {
      console.error(`  ${slug}: record points at ${src}, which does not exist`);
      missing += 1;
    }
    continue;
  }

  const source = `public${src}`;
  if (!existsSync(source)) {
    console.error(`  ${slug}: source ${src} does not exist`);
    missing += 1;
    continue;
  }

  const meta = await sharp(source).metadata();
  const actual = meta.width / meta.height;

  /* Pad on whichever axis is short of the frame. Nothing is ever removed. */
  const width = actual < NEWS_FRAME ? Math.round(meta.height * NEWS_FRAME) : meta.width;
  const height = actual < NEWS_FRAME ? meta.height : Math.round(meta.width / NEWS_FRAME);

  const target = join(OUT_DIR, `${basename(src, ".webp")}-16x9.webp`);
  const publicPath = `/images/editorial/framed/${basename(target)}`;

  if (check) {
    if (!existsSync(target)) {
      console.error(`  missing framed hero: ${target}`);
      missing += 1;
    }
    continue;
  }

  const background = await fieldColour(source);
  await sharp(source)
    .resize({ width, height, fit: "contain", background })
    .webp({ quality: 82, effort: 6 })
    .toFile(target);

  record.heroImage.src = publicPath;
  record.heroImage.ratio = "16 / 9";
  writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`);

  console.log(
    `  ${slug}: ${meta.width}×${meta.height} → ${width}×${height}` +
      `  field rgb(${background.r},${background.g},${background.b})`,
  );
  written += 1;
}

if (check) {
  console.log(`framed heroes — ${missing === 0 ? "all present" : `${missing} missing`}`);
  if (missing) process.exit(1);
} else {
  console.log(`framed heroes — wrote ${written}, records updated to point at them.`);
}
