#!/usr/bin/env node
/**
 * Pre-crops the homepage carousel slides to the 4:3 frame a phone actually shows.
 *
 *   node scripts/build-mobile-hero-crops.mjs            # write
 *   node scripts/build-mobile-hero-crops.mjs --check    # verify they exist
 *
 * ---------------------------------------------------------------------------
 * THE MEASUREMENT THIS EXISTS FOR
 *
 * On a 375×812 phone, measured against the production export on 2026-09-15:
 *
 *   frame rendered        343 × 257 CSS px   (the `aspect-[4/3]` mobile frame)
 *   candidate downloaded  home-panic-exit-bars-1600w.webp, 43 KB
 *
 * 1600 source pixels to paint 343 CSS pixels. The `sizes` hint that asks for it is not
 * wrong — it says `184vw`, and that is close to correct arithmetic: the source is 2.55:1,
 * the frame is 4:3, and `object-cover` has to scale the image until its HEIGHT covers the
 * frame, which makes it ~1.9× the frame's width. Roughly half of every byte downloaded is
 * then cropped off the sides and never seen.
 *
 * The browser cannot avoid that. It is being handed a panorama and asked to fill a
 * portrait-ish box, and it does the only correct thing. The fix is to stop handing it a
 * panorama on phones.
 *
 * A 4:3 crop at 800×600 is ~13 KB against 43 KB, and it is the SAME PICTURE the visitor
 * already sees — `object-cover` was performing this exact crop at paint time. Nothing is
 * composed, recoloured or invented; the crop is centred, which is where object-cover
 * takes it from. This is a delivery change, not a design change, and that distinction is
 * why it is safe to do without a design review.
 *
 * ⚠ Not applied above 640px. There the frame is `aspect-[1920/754]`, near the source's own
 * shape, and the full-width image is both correct and what the design intends.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/images/editorial/mobile-hero";
const MOBILE_WIDTHS = [400, 800];
const FRAME = 4 / 3;

/**
 * The carousel slides, read from the homepage data rather than listed here.
 *
 * Listing them would go stale the first time somebody changes a slide, and the failure
 * would be silent: the `<picture>` source would 404 and the browser would fall back to
 * the panorama, which looks exactly like success.
 */
function carouselSources() {
  const home = readFileSync("src/data/home.ts", "utf8");
  const block = home.match(/heroCarousel[\s\S]{0,3000}/)?.[0] ?? "";
  return [...block.matchAll(/src: "(\/images\/editorial\/[^"]+\.webp)"/g)].map((m) => m[1]);
}

const check = process.argv.includes("--check");
if (!check) mkdirSync(OUT_DIR, { recursive: true });

let missing = 0;
let written = 0;

for (const source of carouselSources()) {
  const input = `public${source}`;
  if (!existsSync(input)) {
    console.error(`  source missing: ${source}`);
    missing += 1;
    continue;
  }

  const stem = basename(source, ".webp");

  for (const width of MOBILE_WIDTHS) {
    const target = join(OUT_DIR, `${stem}-${width}w-4x3.webp`);

    if (check) {
      if (!existsSync(target)) {
        console.error(`  missing mobile crop: ${target}`);
        missing += 1;
      }
      continue;
    }

    const height = Math.round(width / FRAME);
    /*
      `cover` with the default centre position reproduces what the browser's object-cover
      was doing at paint time, so the visible picture does not change.
    */
    await sharp(input)
      .resize({ width, height, fit: "cover", position: "centre" })
      .webp({ quality: 80, effort: 6 })
      .toFile(target);
    written += 1;
  }

  if (!check) console.log(`  ${stem}: ${MOBILE_WIDTHS.map((w) => `${w}×${Math.round(w / FRAME)}`).join(", ")}`);
}

if (check) {
  console.log(`mobile hero crops — ${missing === 0 ? "all present" : `${missing} missing`}`);
  if (missing) process.exit(1);
} else {
  console.log(`mobile hero crops — wrote ${written}`);
  if (missing) process.exit(1);
}
