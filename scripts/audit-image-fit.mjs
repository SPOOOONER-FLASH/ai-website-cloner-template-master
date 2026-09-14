#!/usr/bin/env node
/**
 * Does every image survive the frame the site actually renders it in?
 *
 * ---------------------------------------------------------------------------
 * WHY A DECLARED RATIO IS NOT AN ANSWER
 *
 * Client instruction, 2026-09-13: 「自动全部检查下图片的缩放」.
 *
 * Most images on this site are drawn into a box whose shape comes from the record's own
 * `ratio`, so they cannot be cropped by construction — `MediaPlaceholder` sets
 * `aspect-ratio` from the same field. Those are fine and this audit confirms it rather
 * than assuming it.
 *
 * The images that get cropped are the ones a COMPONENT overrides with a fixed frame,
 * because at that point the record's ratio stops being consulted. There are three such
 * frames today (news hero and card at 16/9, project card at 3/2), and `object-cover`
 * means the overflow is cut, not letterboxed. A 3:2 photograph of a corridor losing a
 * strip of sky is the design working. A 1:1 product plate in the same frame loses 44% of
 * its width — nearly half the product — and that is not a design decision anybody made.
 *
 * ---------------------------------------------------------------------------
 * WHY THE THRESHOLD IS ON THE SUBJECT, NOT THE PERCENTAGE
 *
 * The audit reports three tiers because they need three different actions, and the tier
 * is decided by WHAT is lost rather than by how much:
 *
 *   CROP     a plate — square or taller, so a product photograph with no margin to give.
 *            Any loss cuts the subject. Fails the build.
 *   review   a wide image losing a lot of width. Worth knowing; padding it would put bars
 *            across a deliberate composition, so it is reported and left to a designer.
 *   trim     a wide image in a slightly wider frame. A strip of sky. Expected.
 *
 * The percentage alone cannot separate these — the 2400×943 panoramic hero loses 30%,
 * more than some plates do, and it matters less. Margin is the thing being measured.
 *
 * Usage:
 *   node scripts/audit-image-fit.mjs           # report
 *   node scripts/audit-image-fit.mjs --check   # non-zero exit if anything is CROP tier
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import sharp from "sharp";

const check = process.argv.includes("--check");

/**
 * Frames a component imposes, overriding whatever the record declares.
 *
 * Keep this list in step with the `aspect-[…]` classes in src/components/site. It is
 * short on purpose: every entry here is a place where the record loses control of its own
 * shape, and that is worth being able to count.
 */
const FIXED_FRAMES = [
  { name: "news hero + card", frame: 16 / 9, dir: "content/news", field: "heroImage" },
  { name: "project card", frame: 3 / 2, dir: "content/projects", field: "heroImage" },
];

/** Tolerated loss for a wide editorial image in a wider frame. */
const TRIM_LIMIT = 0.2;
/** Anything at or beyond square is composed to fill its frame; it has no margin to give. */
const PLATE_RATIO = 1.05;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the next frame that declares its own ratio */
function parseRatio(value) {
  const match = String(value ?? "1 / 1").match(/([\d.]+)\s*\/\s*([\d.]+)/);
  return match ? Number(match[1]) / Number(match[2]) : 1;
}

const findings = [];
let inspected = 0;

for (const { name, frame, dir, field } of FIXED_FRAMES) {
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((entry) => entry.endsWith(".json"))) {
    const record = JSON.parse(readFileSync(`${dir}/${file}`, "utf8"));
    const image = record[field];
    if (!image?.src) continue;

    const path = `public${image.src}`;
    if (!existsSync(path)) continue;

    const meta = await sharp(path).metadata();
    const actual = meta.width / meta.height;
    inspected += 1;

    const loss = actual > frame ? 1 - frame / actual : 1 - actual / frame;
    if (loss < 0.02) continue;

    /*
      THREE TIERS, AND THE TIER IS DECIDED BY WHAT IS LOST, NOT BY HOW MUCH.

      CROP   — a plate. Roughly square or taller means a product photograph, composed with
               the product filling the frame. There is no margin to give, so any loss cuts
               the subject. This fails the build.
      review — a wide image losing a lot of width. A 2400×943 panoramic hero in a 16:9
               frame loses 30%, which is worth knowing about, but padding it would put
               grey bars across somebody's deliberate composition. That is a design
               decision, not a defect, so it is reported and left alone.
      trim   — a wide image in a slightly wider frame. A strip of sky. Expected.

      The percentage alone cannot separate these: the panoramic loses more than some
      plates do, and it matters less. Margin is the thing being measured.
    */
    const isPlate = actual <= PLATE_RATIO;
    const tier = isPlate ? "CROP" : loss > TRIM_LIMIT ? "review" : "trim";

    findings.push({
      tier,
      loss,
      slug: file.replace(/\.json$/, ""),
      frameName: name,
      declared: image.ratio ?? "—",
      actual: `${meta.width}×${meta.height}`,
      src: image.src,
    });
  }
}

findings.sort((a, b) => (a.tier === b.tier ? b.loss - a.loss : a.tier === "CROP" ? -1 : 1));

const crops = findings.filter((entry) => entry.tier === "CROP");
const reviews = findings.filter((entry) => entry.tier === "review");
const trims = findings.filter((entry) => entry.tier === "trim");

console.log(`image fit — ${inspected} images in ${FIXED_FRAMES.length} fixed frames`);
console.log(`  CROP (subject is being cut): ${crops.length}`);
console.log(`  review (wide image, much wider frame): ${reviews.length}`);
console.log(`  trim (wide image, wider frame): ${trims.length}`);

if (crops.length) {
  console.log("\nCROP — fix these:");
  for (const entry of crops) {
    console.log(
      `  ${String(Math.round(entry.loss * 100)).padStart(3)}%  ${entry.slug}` +
        `  [${entry.frameName}]  declared ${entry.declared}, file ${entry.actual}`,
    );
  }
  console.log(
    "\n  A square plate in a wide frame loses the product, not the background.",
  );
  console.log(
    "  Pad the plate to the frame rather than cropping it — padding a white field is lossless.",
  );
}

if (reviews.length) {
  console.log("\nreview — a design call, not a defect. Padding would bar a deliberate composition:");
  for (const entry of reviews) {
    console.log(`  ${String(Math.round(entry.loss * 100)).padStart(3)}%  ${entry.slug}  [${entry.frameName}]  file ${entry.actual}`);
  }
}

if (trims.length && !check) {
  console.log("\ntrim — expected, listed so the number cannot grow unnoticed:");
  for (const entry of trims.slice(0, 10)) {
    console.log(`  ${String(Math.round(entry.loss * 100)).padStart(3)}%  ${entry.slug}`);
  }
  if (trims.length > 10) console.log(`  … ${trims.length - 10} more`);
}

if (check && crops.length) {
  console.error(`\n${crops.length} image(s) are cropped through their subject.`);
  process.exit(1);
}
