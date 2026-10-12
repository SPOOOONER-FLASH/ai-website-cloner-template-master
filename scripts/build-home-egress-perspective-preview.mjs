/** Review-only: one calibrated empty scene, then the unchanged photographed door group. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pack = join(root, "docs/design-references/home-hero-b-perspective-2026-10-10");
const previous = JSON.parse(await readFile(join(root, "docs/design-references/home-hero-b-egress-2026-10-09/receipt.json"), "utf8"));
const calibration = JSON.parse(await readFile(join(pack, "calibration.json"), "utf8"));
const photo = await readFile(join(root, previous.source));
const plate = await readFile(join(pack, "empty-architecture.png"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(photo), previous.sourceSha256, "Customer photograph changed");
assert.deepEqual(calibration.canvas, [1800, 900]);
assert.equal(calibration.camera.projection, "PERSP");
assert.ok(calibration.maximum_corner_error_px <= 2, "Scene opening moved");
assert.ok(Math.abs(calibration.depth_vanishing_point_px[0] - 871) < 1);
assert.ok(Math.abs(calibration.depth_vanishing_point_px[1] - 486) < 1);
const bounds = previous.masterPhotoBounds;
assert.deepEqual(calibration.target_bounds, bounds);
assert.equal((await sharp(plate).metadata()).width, 1800);
assert.equal((await sharp(plate).metadata()).height, 900);
const crop = previous.sourceCrop;
const points = previous.environmentPolygon.map(([x, y]) => `${(x === 401 ? 404 : x) - crop.left},${(y >= 747 ? 750 : y) - crop.top}`).join(" ");
const mask = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${crop.width}" height="${crop.height}"><rect width="100%" height="100%" fill="black"/><polygon points="${points}" fill="white"/></svg>`)).toColourspace("b-w").raw().toBuffer();
const alpha = Buffer.alloc(mask.length);
// Remove the old environmental floor strip while retaining jamb feet and the lower rod shoe.
for (let i = 0; i < alpha.length; i++) {
  const x = crop.left + i % crop.width;
  const y = crop.top + Math.floor(i / crop.width);
  alpha[i] = 255 - mask[i];
  if (y > 740 && x > 140 && x < 686 && !(x >= 404 && x <= 450)) {
    alpha[i] = Math.min(alpha[i], Math.round(255 * (750 - y) / 10));
  }
}
const photoCrop = await sharp(photo).extract(crop).removeAlpha().png().toBuffer();
const product = await sharp(photoCrop).joinChannel(alpha, { raw: { width: crop.width, height: crop.height, channels: 1 } }).png().toBuffer();
const preview = await sharp(plate).composite([{ input: product, left: bounds.left, top: bounds.top }]).png().toBuffer();
const retained = await sharp(preview).extract(bounds).removeAlpha().raw().toBuffer();
const original = await sharp(photoCrop).removeAlpha().raw().toBuffer();
let protectedPixels = 0;
for (let pixel = 0; pixel < mask.length; pixel++) {
  if (alpha[pixel] !== 255) continue;
  protectedPixels++;
  for (let channel = 0; channel < 3; channel++) assert.equal(retained[pixel * 3 + channel], original[pixel * 3 + channel], `Photographed geometry changed at ${pixel}`);
}
assert.ok(protectedPixels > 260000, "Product protection was reduced unexpectedly");
await writeFile(join(pack, "product-mask.png"), await sharp(alpha, { raw: { width: crop.width, height: crop.height, channels: 1 } }).png().toBuffer());
await writeFile(join(pack, "preview.png"), preview);
await writeFile(join(pack, "pixel-qa.json"), JSON.stringify({
  status: "Client review only; not installation certification or aesthetic acceptance",
  source: previous.source, sourceSha256: hash(photo), sourceCrop: crop,
  masterPhotoBounds: bounds, sourceResized: false, protectedRgbPixels: protectedPixels,
  changedProtectedPixels: 0, previewSha256: hash(preview), plateSha256: hash(plate),
  sceneVanishingPointPx: calibration.depth_vanishing_point_px,
  sceneMaximumOpeningErrorPx: calibration.maximum_corner_error_px,
  limitation: "Camera inferred from photo edges. Environment and scenery are synthetic; no actual site, dimension, compatibility or fire-rating claim.",
}, null, 2) + "\n");
console.log(`Review preview: ${protectedPixels} source RGB pixels unchanged; camera/opening assertions passed. No public image or route edited.`);
