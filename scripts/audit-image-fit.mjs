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
  /*
    ⚠ The homepage column rail, added 2026-09-15 after it shipped a visibly cropped image.

    The two surfaces above are found by scanning content/. This one is not: its images are
    named in src/data/feature-columns.ts and its frame is a `ratio="3 / 2"` written inside
    FeatureColumns.tsx. A content scan cannot see either, which is why a 1000×1000 plate
    sat in a 3:2 frame losing a third of its height until the client noticed on the live
    site.

    The general shape of the miss: a fixed aspect ratio inside a component is a crop that
    no content-driven audit is watching. When a new surface pins a ratio, it belongs here
    the same day.
  */
  { name: "homepage column rail", frame: 3 / 2, module: "src/data/feature-columns.ts" },
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

/**
 * Every image a surface puts through its fixed frame, with the name to report it under.
 *
 * Two sources, because the site has two ways of naming an image: a content record's
 * field, and a `src:` literal inside a TypeScript data module. The second was invisible
 * to this audit until 2026-09-15 and shipped a visibly cropped plate because of it.
 */
function imagesFor(surface) {
  if (surface.dir) {
    if (!existsSync(surface.dir)) return [];
    return readdirSync(surface.dir)
      .filter((entry) => entry.endsWith(".json"))
      .map((file) => JSON.parse(readFileSync(`${surface.dir}/${file}`, "utf8")))
      .map((record) => ({ src: record[surface.field]?.src, id: record.slug ?? "?" }))
      .filter((entry) => entry.src);
  }

  if (!existsSync(surface.module)) return [];
  const source = readFileSync(surface.module, "utf8");
  /* `src: "/images/…"` — the same literal a reader would grep for. */
  return [...source.matchAll(/src:\s*"(\/images\/[^"]+)"/g)].map((match) => ({
    src: match[1],
    id: match[1].slice(match[1].lastIndexOf("/") + 1),
  }));
}

// NewsVisual uses reviewed subject viewports and contains their rotated bounds.
// These sources do not pass through object-cover; validate the actual viewport instead.
const newsVisuals = JSON.parse(readFileSync("src/data/news-visuals.json", "utf8"));
for (const surface of FIXED_FRAMES) {
  const { name, frame } = surface;

  for (const image of imagesFor(surface)) {
    const visual = surface.dir === "content/news" ? newsVisuals[image.id] : undefined;
    if (visual) {
      const meta = await sharp(`public${visual.src}`).metadata();
      const [x, y, width, height] = visual.crop;
      if (meta.width !== visual.width || meta.height !== visual.height ||
          !visual.crop.every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 ||
          x + width > meta.width || y + height > meta.height || !Number.isFinite(visual.angle)) {
        throw new Error(`Invalid reviewed NewsVisual viewport: ${image.id}`);
      }
      inspected += 1;
      continue;
    }
    const file = image.id;
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
