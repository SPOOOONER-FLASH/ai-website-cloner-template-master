import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { composeSourceShadow, extractExteriorPaper, recoverSourceShadow } from "../../../../scripts/build-kanee-source-shadow.mjs";

const base = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.argv[2] ?? `${base}/../preview`);
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const source = await readFile(resolve(base, "65-snkt-view-3.webp"));
assert.equal(sha(source), "aa8f55ccb15dd7d4179d7572e25cf667feae51dc00777aefd529f1245c6f0b0a");
const crop = { left: 0, top: 160, width: 1000, height: 740 };
const photo = await sharp(source).extract(crop).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
// Reviewer-derived outline, not native alpha: all RGB is copied from the photograph.
const outline = "M155 310 C150 299 153 283 161 270 C182 244 226 219 267 205 C287 200 317 191 336 197 C369 207 394 231 411 254 C419 264 423 273 424 282 L439 290 L848 578 C860 587 867 602 870 621 L872 633 C883 636 894 640 899 648 C904 659 900 675 898 685 C893 707 881 730 864 741 C849 753 827 757 806 749 L623 610 L606 624 L588 642 L581 639 L537 603 C534 598 532 593 532 589 C532 579 541 566 555 557 L559 557 L402 430 C398 424 393 418 390 414 C381 423 371 424 354 419 C316 415 287 406 262 394 C242 384 214 370 200 355 L163 322 Z";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="740"><g transform="translate(0,-160)"><path d="${outline}" fill="white"/></g></svg>`;
const mask = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
const ground = Buffer.from(photo.data);
let excluded = 0;
for (let y = 0; y < crop.height; y++) for (let x = 0; x < crop.width; x++) {
  if ((x - 226) ** 2 + (y - 534) ** 2 > 192 ** 2) continue;
  const p = (y * crop.width + x) * 4;
  assert.equal(mask[p + 3], 0, "Supplemental inset removal overlaps main product");
  ground.fill(255, p, p + 4);
  excluded++;
}
const groundPng = await sharp(ground, { raw: { width: 1000, height: 740, channels: 4 } }).png().toBuffer();
const pale = Buffer.from(ground);
for (let i = 0; i < pale.length; i++) if (i % 4 !== 3) pale[i] = Math.round(pale[i] * 0.94);
const paleImage = await sharp(pale, { raw: { width: 1000, height: 740, channels: 4 } }).withIccProfile("srgb").png().toBuffer();
assert.ok((await sharp(paleImage).ensureAlpha().raw().toBuffer()).equals(pale), "Native pale-photo round-trip changed pixels");
const exterior = await sharp(await extractExteriorPaper(groundPng)).ensureAlpha().raw().toBuffer();
const product = Buffer.from(photo.data);
for (let p = 0; p < crop.width * crop.height; p++) {
  if (exterior[p * 4 + 3] === 0) mask[p * 4 + 3] = 0;
  product[p * 4 + 3] = mask[p * 4 + 3];
}
// White-paper decontamination is confined to reviewed optical edges; opaque metal RGB remains original.
let opticalEdgePixels = 0;
const originalAlpha = Buffer.from(mask);
for (let y = 1; y < 739; y++) for (let x = 1; x < 999; x++) {
  const p = (y * 1000 + x) * 4;
  if (mask[p + 3] !== 255) continue;
  const thumb = x >= 150 && x <= 425 && y <= 170;
  const foot = x >= 530 && x <= 626 && y >= 393 && y <= 484;
  const light = (photo.data[p] + photo.data[p + 1] + photo.data[p + 2]) / 3;
  if ((!thumb && !foot) || light < (thumb ? 225 : 130)) continue;
  const radius = thumb ? 3 : 8;
  let exteriorNear = false;
  let reference = null;
  let nearest = Infinity;
  for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
    const q = ((y + dy) * 1000 + x + dx) * 4;
    if (originalAlpha[q + 3] === 0) exteriorNear = true;
    if (originalAlpha[q + 3] !== 255 || [q - 4, q + 4, q - 4000, q + 4000].some(n => originalAlpha[n + 3] !== 255)) continue;
    const value = (photo.data[q] + photo.data[q + 1] + photo.data[q + 2]) / 3;
    const distance = dx * dx + dy * dy;
    if (value < light - 20 && distance < nearest) { reference = value; nearest = distance; }
  }
  if (!exteriorNear || reference === null) continue;
  const alpha = (255 - light) / (255 - reference);
  mask[p + 3] = product[p + 3] = Math.round(alpha * 255);
  for (let c = 0; c < 3; c++) product[p + c] = Math.max(0, Math.min(255, Math.round((photo.data[p + c] - (1 - alpha) * 255) / alpha)));
  opticalEdgePixels++;
}
const productPng = await sharp(product, { raw: { width: 1000, height: 740, channels: 4 } }).png().toBuffer();
const transmission = await recoverSourceShadow(groundPng, productPng, { paperLevel: 255, strength: 1, partialEdgeSupport: true });
const empty = await readFile(resolve(base, "../empty-fields/charcoal.png"));
const field = await sharp(empty).resize(1000, 740).blur(0.65).png().toBuffer();
const image = await composeSourceShadow(field, productPng, transmission);
const pixels = await sharp(image).ensureAlpha().raw().toBuffer();
let compared = 0;
for (let p = 0; p < crop.width * crop.height; p++) {
  if (mask[p * 4 + 3] !== 255) continue;
  compared++;
  assert.ok(pixels.subarray(p * 4, p * 4 + 3).equals(photo.data.subarray(p * 4, p * 4 + 3)), `Opaque source RGB changed at ${p}`);
}
await mkdir(output, { recursive: true });
await writeFile(resolve(output, "65-snkt-pale-native-photo.png"), paleImage);
await sharp(paleImage).webp({ quality: 94 }).toFile(resolve(output, "65-snkt-pale-native-photo.webp"));
await writeFile(resolve(output, "pale-provenance.json"), `${JSON.stringify({ model: "65 SNKT", view: 3, source: "public/images/products/65-snkt-lock-cylinder-3.webp", sourceSha256: sha(source), crop, uniformRgbGain: 0.94, supplementaryInsetExclusion: { circle: [226, 534, 192], pixels: excluded, mainProductOverlap: 0, reason: "Separate blue-bordered supplementary view, not a photographed component of the main still-life" }, nativeMainPhotoPixelsRetained: 740000 - excluded, coordinateMapping: "source(x,y+160), original main-photo RGB*0.94 rounded, alpha unchanged; supplementary inset only replaced with native white field before uniform grade", productMaskUsed: false, productResize: false, productRotation: false, productRegeneration: false, replacementShadow: false, pngRoundTripExact: true, masterSha256: sha(paleImage), factoryApproval: "pending", pinCountConfirmed: false, clientApproval: "pending", aestheticLimit: "Conservative native-photo catalogue treatment, not KANEE-level photographic refinement" }, null, 2)}\n`);
await writeFile(resolve(output, "65-snkt-charcoal-trial.png"), image);
await sharp(image).webp({ quality: 94 }).toFile(resolve(output, "65-snkt-charcoal-trial.webp"));
await writeFile(resolve(output, "derived-product-mask.png"), productPng);
await writeFile(resolve(output, "ground-without-inset.png"), groundPng);
await writeFile(resolve(output, "shadow-transmission.png"), transmission);
await writeFile(resolve(output, "provenance.json"), `${JSON.stringify({ model: "65 SNKT", view: 3, status: "HELD internal mask experiment; do not deliver as usable client preview", holdReason: "Independent QA after correction: added stippled thumb fringe and pale cam-foot bevel absent from source", sourceSha256: sha(source), crop, outline, derivedAlphaNotNative: true, opticalEdgeDecontamination: { pixels: opticalEdgePixels, method: "Reviewed thumb/cam white-paper optical perimeter only, local original interior RGB reference and white-matte inversion; not unchanged boundary RGB", independentQa: "FAIL contour; opaque interior fidelity is insufficient" }, supplementaryInsetExclusion: { circle: [226, 534, 192], pixels: excluded, productOverlap: 0 }, backgroundSha256: sha(empty), opaqueRgbPixelsCompared: compared, opaqueRgbDifferences: 0, productResize: false, productRotation: false, productRegeneration: false, shadow: "Original ground luminance transmission, no fabricated cast", masterSha256: sha(image), pinCountConfirmed: false, factoryFinishApproval: "pending", clientApproval: "not requested; held" }, null, 2)}\n`);
console.log(JSON.stringify({ output, compared, excluded, pale: "Native-photo review; factory/client approval pending", charcoal: "HELD: contour QA failed" }));
