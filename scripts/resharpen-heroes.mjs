/**
 * Rebuilds the homepage hero images from their PNG originals at full resolution.
 *
 * Why: heroes render 1440+ CSS px wide, so they are what a visitor judges the site by,
 * but the first pass encoded them at q=78 and capped them at 2400px. Slide 1 ended up
 * at 59 KB for a 1920px interior scene — 0.33 bit/px, visibly mushy — while the two
 * banner slides sat at 0.23-0.25 bit/px. The Gemini PNG originals are 3168-3364px wide,
 * so most of that resolution was simply being discarded.
 *
 * This re-crops from the PNG originals, encodes at q=90 with a light unsharp mask, and
 * never upscales. Where a source cannot reach 2x the display width, the report says so.
 *
 *   node scripts/resharpen-heroes.mjs
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { statSync, existsSync } from "node:fs";

const DL = "C:/Users/johns/Downloads";

/** dest, PNG original, target ratio, CSS width the slot renders at */
const JOBS = [
  // Carousel slide 1 — lever on a walnut door. 2048x2048 source, so 2048x804 is its ceiling.
  [
    "public/images/company/hero-modern-tubular-lock.webp",
    `${DL}/Gemini_Generated_Image_t2at4et2at4et2at.png`,
    1920 / 754,
    1440,
  ],
  // Carousel slide 2 — panic exit device. 3364x1248 original, was capped at 2400.
  [
    "public/images/concepts/hero-panic-exit-device.webp",
    `${DL}/Gemini_Generated_Image_z58n53z58n53z58n.png`,
    1920 / 754,
    1440,
  ],
  // Carousel slide 3 — heavy duty fire door lock. 3168x1344 original, was capped at 2400.
  [
    "public/images/concepts/hero-heavy-duty-fire-door-lock.webp",
    `${DL}/Gemini_Generated_Image_eghjtoeghjtoeghj.png`,
    1920 / 754,
    1440,
  ],
  // Editorial hero at the foot of the page.
  [
    "public/images/company/hero-storefront-banner.webp",
    `${DL}/Gemini_Generated_Image_p0q80ap0q80ap0q8.png`,
    2880 / 1757,
    1440,
  ],
];

const rows = [];
for (const [dest, src, ratio, displayW] of JOBS) {
  if (!existsSync(src)) {
    console.log(`skip (missing original): ${src.split("/").pop()}`);
    continue;
  }
  const meta = await sharp(src).metadata();
  let w = meta.width;
  let h = Math.round(w / ratio);
  if (h > meta.height) {
    h = meta.height;
    w = Math.round(h * ratio);
  }
  const before = existsSync(dest) ? statSync(dest).size / 1024 : 0;
  const buf = await sharp(src)
    .resize(w, h, { fit: "cover", position: "centre", kernel: "lanczos3" })
    // Light unsharp mask: restores edge contrast a downscale softens, without halos.
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.6 })
    .webp({ quality: 90, effort: 6 })
    .toBuffer();
  await writeFile(dest, buf);
  const kb = buf.length / 1024;
  rows.push({
    file: dest.split("/").pop(),
    px: `${w}x${h}`,
    density: +(w / displayW).toFixed(2),
    bpp: +((buf.length * 8) / (w * h)).toFixed(2),
    before: +before.toFixed(0),
    after: +kb.toFixed(0),
  });
}

console.log("file".padEnd(34), "output".padEnd(12), "density", "bit/px", " before →  after");
for (const r of rows) {
  console.log(
    r.file.padEnd(34),
    r.px.padEnd(12),
    `${r.density}x`.padEnd(8),
    String(r.bpp).padEnd(7),
    `${String(r.before).padStart(4)}KB → ${String(r.after).padStart(4)}KB`,
  );
}
const thin = rows.filter((r) => r.density < 1.5);
console.log(thin.length ? `\nbelow 1.5x (source-limited): ${thin.map((r) => r.file).join(", ")}` : "\nall at 1.5x or better");
