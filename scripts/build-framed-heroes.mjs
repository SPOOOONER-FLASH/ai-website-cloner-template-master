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
  /*
    Added 2026-09-14, for a different reason from the four above: not because the frame
    cut the subject, but because these five articles were sharing four images between
    nine of them and the client could see it on the News index — the same mortise-lock
    photograph three times, the same cylinder plate twice, the same door schedule twice.

    They are catalogue plates rather than editorial scenery, so they arrive here for the
    original reason anyway: a 1000×1000 plate in a 16:9 frame loses 44% of its width.

    WHY A PRODUCT PLATE AND NOT A NEW COMPOSITION. Codex replaced these with purpose-made
    compositions on 2026-09-14 and the client rejected them on sight and asked for the
    originals back — which is what put the duplicates back on the page. A photograph of a
    model the article already names is not a new composition: it is the part the paragraph
    is about, shot the way the catalogue shoots everything. Each source below is in its
    own article's `relatedModels`.

    They are taken from products-hyde/, not products/, so the framed copy inherits the
    HYDE mark. A news hero does not pass through brandProductImageRef — that runs on
    product records — so pointing at the unbranded root here would have quietly published
    five unmarked photographs the week after marking 3,956 of them.
  */
  "handing-left-right-and-universal",
  "what-a-test-report-actually-covers",
  "narrow-stile-aluminium-door-lock-sag",
  "six-values-an-order-needs",
  "master-key-systems-how-many-levels-you-need",
  /*
    The Applications index had it worse than News: one scene, `project-commercial-egress`,
    on three of the five packages — and the five sit in a single grid, so the repeat was
    the first thing the page showed.

    Commercial fire-egress keeps that scene; it is the one the picture is actually of.
    The other two take a photograph of a part from their own `productModels`, chosen as
    the piece that package exists to explain: a closer for the double-leaf set, because a
    pair of fire doors needs one on each leaf before a coordinator has anything to
    sequence, and the outside trim for the panic-bar set, because the trim is the half
    that arrives missing from a schedule.
  */
  "projects/double-leaf-fire-door-set",
  "projects/panic-bar-with-outside-trim-set",
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

/*
  A target is a slug in content/news, or "projects/<slug>" for an application package.
  The two collections carry the same heroImage shape and the same 16:9 card, so the only
  thing that differs is the directory — and the Applications index had the same duplicate
  problem the News index had, from the same cause.
*/
for (const target of TARGETS) {
  const [collection, slug] = target.includes("/")
    ? target.split("/")
    : ["news", target];
  const recordPath = `content/${collection}/${slug}.json`;
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

  const outputPath = join(OUT_DIR, `${basename(src, ".webp")}-16x9.webp`);
  const publicPath = `/images/editorial/framed/${basename(outputPath)}`;

  if (check) {
    if (!existsSync(outputPath)) {
      console.error(`  missing framed hero: ${outputPath}`);
      missing += 1;
    }
    continue;
  }

  const background = await fieldColour(source);
  await sharp(source)
    .resize({ width, height, fit: "contain", background })
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath);

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
