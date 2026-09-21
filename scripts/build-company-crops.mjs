#!/usr/bin/env node
/**
 * Crops a square factory photograph to the 3:2 the company rail renders.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS CROPS WHERE build-framed-heroes.mjs PADS
 *
 * They look like the same job and are the opposite one, and the difference is what is in
 * the frame.
 *
 * `build-framed-heroes` pads, because its inputs are product PLATES: a lock photographed
 * to fill a square, with no margin to give. Any crop takes the product, so it adds field
 * instead — 补白无损.
 *
 * This crops, because its inputs are PHOTOGRAPHS of a room. A press hall or a laser cutter
 * has ceiling above it and floor below it, and taking 17% off each is what a photographer
 * would have done in the camera. Padding one would put white bars around a factory, which
 * announces that the picture was the wrong shape rather than showing the factory.
 *
 * The crop is centred vertically with a slight lift, because machinery sits on the floor
 * and the interesting half is the upper two thirds — a dead-centre crop on these takes
 * lit ceiling and leaves green floor.
 *
 * Usage:
 *   node scripts/build-company-crops.mjs            # write
 *   node scripts/build-company-crops.mjs --check    # verify the outputs exist
 */
import { existsSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const check = process.argv.includes("--check");
const OUT_DIR = "public/images/company";
const FRAME = 3 / 2;

/**
 * `lift` shifts the crop window up as a fraction of the discarded height: 0 is centred,
 * 1 puts the window at the very top. 0.6 keeps the machines and loses floor.
 */
const TARGETS = [
  {
    source: "public/images/rayen/factory-laser-cutter.webp",
    name: "factory-laser-cutter",
    lift: 0.55,
    why: "Fibre laser cutter. The only capital-equipment photograph in the set, and the one thing the press/polish/assembly trio does not show.",
  },
];

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let missing = 0;

for (const target of TARGETS) {
  const output = `${OUT_DIR}/${target.name}.webp`;

  if (!existsSync(target.source)) {
    console.error(`  source missing: ${target.source}`);
    missing += 1;
    continue;
  }
  if (check) {
    if (!existsSync(output)) {
      console.error(`  missing crop: ${output}`);
      missing += 1;
    }
    continue;
  }

  const meta = await sharp(target.source).metadata();
  const actual = meta.width / meta.height;

  /* Only ever removes; a source already wider than the frame is left alone. */
  const width = actual > FRAME ? Math.round(meta.height * FRAME) : meta.width;
  const height = actual > FRAME ? meta.height : Math.round(meta.width / FRAME);
  const top = Math.round((meta.height - height) * (1 - target.lift));
  const left = Math.round((meta.width - width) / 2);

  await sharp(target.source)
    .extract({ left, top, width, height })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  console.log(`  ${target.name}: ${meta.width}×${meta.height} → ${width}×${height} (top ${top})`);
  written += 1;
}

if (check) {
  console.log(`company crops — ${missing === 0 ? "all present" : `${missing} missing`}`);
  if (missing) process.exit(1);
} else {
  console.log(`company crops — wrote ${written}`);
}
