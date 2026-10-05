#!/usr/bin/env node
/**
 * Reframe the existing 309-D product-gallery application image for the home carousel.
 *
 * The source's full height is visible: the right leaf's upper and lower rod latches
 * must not be cropped out. No hardware is generated, moved or recoloured.
 * The dark side panels carry the approved HYDE vector lockup and model/application
 * lettering. The photo's legacy oval badge is replaced in its existing corner
 * watermark area. The tiny slogan below it is removed by vertically interpolating
 * through its 18-pixel strip; hardware geometry stays put.
 *
 * It also refreshes the three desktop srcset widths and the centred 4:3 phone crops,
 * using the same settings as the shared editorial asset generators.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public/images/products/309-d-double-door-panic-exit-device-7.webp");
const editorialRoot = join(root, "public/images/editorial");
const destination = join(editorialRoot, "home-panic-exit-bars.webp");
const width = 2400;
const height = 943;
const photoLeft = Math.round((width - height) / 2);
const check = process.argv.includes("--check");

const hydeBrandRoot = join(root, "public/images/brand/hyde");
const lockup = await sharp(join(hydeBrandRoot, "hyde-logo-horizontal-white.svg"))
  .resize({ width: 250 })
  .png()
  .toBuffer();
const icon = await sharp(join(hydeBrandRoot, "hyde-logo-icon-white.svg"))
  .resize({ width: 70 })
  .png()
  .toBuffer();
const { data: sourcePixels, info: sourceInfo } = await sharp(source)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
if (sourceInfo.width !== 1000 || sourceInfo.height !== 1000 || sourceInfo.channels !== 3) {
  throw new Error("309-D gallery source dimensions changed; review the legacy-logo cleanup bounds");
}
// The legacy slogan crosses a wall mullion and the left closer. Interpolate
// along each column so both vertical shapes continue through the text strip.
for (let x = 35; x <= 186; x += 1) {
  for (let channel = 0; channel < sourceInfo.channels; channel += 1) {
    const upper = sourcePixels[((101 * sourceInfo.width + x) * sourceInfo.channels) + channel];
    const lower = sourcePixels[((120 * sourceInfo.width + x) * sourceInfo.channels) + channel];
    for (let y = 102; y < 120; y += 1) {
      const blend = (y - 101) / 19;
      sourcePixels[((y * sourceInfo.width + x) * sourceInfo.channels) + channel] =
        Math.round(upper * (1 - blend) + lower * blend);
    }
  }
}
const cleanedSource = await sharp(sourcePixels, {
  raw: { width: sourceInfo.width, height: sourceInfo.height, channels: sourceInfo.channels },
})
  .png()
  .toBuffer();
const legacyBadgeCover = Buffer.from(`<svg width="172" height="86" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="86" cy="43" rx="84" ry="42" fill="#22272a"/>
</svg>`);
const photo = await sharp(cleanedSource)
  .resize(height, height)
  .composite([
    { input: legacyBadgeCover, left: 20, top: 7 },
    { input: icon, left: 71, top: 20 },
  ])
  .png()
  .toBuffer();
const lettering = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { fill: #e5e7e5; font-family: Arial, Helvetica, sans-serif; }
    .small { font-size: 22px; letter-spacing: 4px; }
  </style>
  <line x1="90" y1="190" x2="565" y2="190" stroke="#778080" stroke-width="2"/>
  <text x="82" y="500" font-size="144px" font-weight="600" letter-spacing="-6px">309-D</text>
  <text x="90" y="565" class="small">DOUBLE-LEAF EXIT</text>
  <text x="90" y="606" class="small">APPLICATION</text>
  <text x="1840" y="760" class="small">01 / RIM EXIT</text>
  <text x="1840" y="802" class="small">02 / VERTICAL ROD</text>
  <line x1="1840" y1="826" x2="2315" y2="826" stroke="#778080" stroke-width="2"/>
</svg>`);

const output = await sharp({
  create: { width, height, channels: 3, background: "#22272a" },
})
  .composite([
    { input: photo, left: photoLeft, top: 0 },
    { input: lettering, left: 0, top: 0 },
    { input: lockup, left: 90, top: 112 },
  ])
  .webp({ quality: 86, effort: 6 })
  .toBuffer();

const derivatives = [[destination, output]];
for (const candidateWidth of [480, 800, 1600]) {
  derivatives.push([
    join(editorialRoot, "responsive", `home-panic-exit-bars-${candidateWidth}w.webp`),
    await sharp(output)
      .resize({ width: candidateWidth, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6, smartSubsample: true })
      .toBuffer(),
  ]);
}
for (const candidateWidth of [400, 800]) {
  derivatives.push([
    join(editorialRoot, "mobile-hero", `home-panic-exit-bars-${candidateWidth}w-4x3.webp`),
    await sharp(output)
      .resize({ width: candidateWidth, height: Math.round(candidateWidth * 3 / 4), fit: "cover", position: "centre" })
      .webp({ quality: 80, effort: 6 })
      .toBuffer(),
  ]);
}

for (const [path, bytes] of derivatives) {
  if (check) {
    const published = await readFile(path);
    if (!published.equals(bytes)) throw new Error(`${path} is stale`);
  } else {
    await writeFile(path, bytes);
  }
}
console.log(`${check ? "Verified" : "Wrote"} 309-D home hero and five responsive derivatives.`);
