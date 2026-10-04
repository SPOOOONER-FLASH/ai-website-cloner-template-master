#!/usr/bin/env node
/**
 * Reframe the existing 309-D product-gallery application image for the home carousel.
 *
 * The source's full height is visible: the right leaf's upper and lower rod latches
 * must not be cropped out. No hardware is generated, retouched, moved or recoloured.
 * The dark side panels carry only model/application lettering.
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

const photo = await sharp(source).resize(height, height).toBuffer();
const lettering = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { fill: #e5e7e5; font-family: Arial, Helvetica, sans-serif; }
    .small { font-size: 22px; letter-spacing: 4px; }
  </style>
  <text x="90" y="160" class="small">CANTON HYLAND</text>
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
