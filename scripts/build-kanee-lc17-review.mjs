import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pack = "docs/design-references/kanee-lc17-native-photo-2026-10-09";
const sourcePath = `${pack}/sources/lc17-view-3.webp`;
const output = resolve(process.argv[2] ?? `${root}/${pack}/preview`);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sourceBytes = await readFile(resolve(root, sourcePath));
const sourceHash = sha256(sourceBytes);
assert.equal(sourceHash, "2dbb3cee9f1b486bf7cc280e4f6da5348deb2a8723e2bbfc9d76fe5c587a9af3", "Source changed; re-review model, framing and grounding first");
const source = await sharp(sourceBytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
assert.equal(source.info.width, 1000);
assert.equal(source.info.height, 1000);
const crop = { left: 0, top: 150, width: 1000, height: 850 };
const gain = 0.94;
// This original already contains grounding: preserve it instead of inventing a cast shadow.
const retained = source.data.subarray(crop.top * crop.width * 4);
const graded = Buffer.from(retained);
for (let i = 0; i < graded.length; i++) {
  if (i % 4 !== 3) graded[i] = Math.round(graded[i] * gain);
}
const image = () => sharp(graded, { raw: { width: crop.width, height: crop.height, channels: 4 } }).withIccProfile("srgb");
await mkdir(output, { recursive: true });
const png = await image().png().toBuffer();
const decoded = await sharp(png).ensureAlpha().raw().toBuffer();
assert.ok(decoded.equals(graded), "PNG round-trip changed the documented pixel mapping");
const webp = await image().webp({ quality: 94 }).toBuffer();
await writeFile(resolve(output, "lc17-pale-native-photo.png"), png);
await writeFile(resolve(output, "lc17-pale-native-photo.webp"), webp);
const provenance = {
  model: "LC17", view: 3, clientApproval: "pending", factoryVersionApproval: "pending",
  source: { path: sourcePath, repositoryOriginal: "public/images/products/lc17-lock-case-3.webp", sha256: sourceHash, width: 1000, height: 1000 },
  recipe: { crop, uniformRgbGain: gain, originalComponentPositions: true, resize: false, geometryEdits: false, generatedPixels: false, replacementBackground: false, replacementShadow: false, colourSpace: "sRGB", webpQuality: 94 },
  qa: { verifiedRgbaChannels: decoded.length, retainedPixels: crop.width * crop.height, coordinateMapping: "output(x,y) = source(x,y+150), RGB round(source*0.94), alpha unchanged", pngRoundTripExact: true, webpIsLossyNotPixelProof: true },
  outputs: { "lc17-pale-native-photo.png": sha256(png), "lc17-pale-native-photo.webp": sha256(webp) },
  limitations: ["Photo finishing, not a new viewpoint or 3D render", "Photographed finish code unconfirmed", "Cylinder model, internal pin count and sold-kit composition unconfirmed; keep the photographed accessories without asserting a sold set", "Repository model mapping is not current factory approval"]
};
await writeFile(resolve(output, "provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(JSON.stringify({ output, retainedPixels: provenance.qa.retainedPixels, generatedPixels: 0, clientApproval: provenance.clientApproval }));
