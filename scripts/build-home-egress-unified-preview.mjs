/** Freeze the reviewed photographic treatment; repair only the unobstructed outdoor view. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pack = join(root, "docs/design-references/home-hero-b-unified-2026-10-11");
const original = await readFile(join(pack, "retouch-trial.png"));
const repair = await readFile(join(pack, "outdoor-repair-source.png"));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(original), "2956021ba2b9f5640ae173b79ab985f7158957532cc5572b23741d76dcacf6eb", "Reviewed photographic treatment changed");
assert.equal(hash(repair), "e1079d42eb7870aa20b6b2534d3285aad9a770c1bda2fb511984cf2ac2562480", "Reviewed outdoor repair changed");
const size = await sharp(original).metadata();
const repairSize = await sharp(repair).metadata();
assert.deepEqual([size.width, size.height], [1774, 887]);
assert.deepEqual([repairSize.width, repairSize.height], [1774, 887]);
// The rectangle is entirely beyond the photographed metal and the open door's edge.
const bounds = { left: 636, top: 503, width: 201, height: 120 };
const alpha = Buffer.alloc(bounds.width * bounds.height);
for (let y = 0; y < bounds.height; y++) {
  for (let x = 0; x < bounds.width; x++) {
    alpha[y * bounds.width + x] = Math.round(255 * Math.min(1, x / 2, (bounds.width - 1 - x) / 2, y / 4, (bounds.height - 1 - y) / 4));
  }
}
const patch = await sharp(repair).extract(bounds).removeAlpha().joinChannel(alpha, { raw: { width: bounds.width, height: bounds.height, channels: 1 } }).png().toBuffer();
const preview = await sharp(original).composite([{ input: patch, left: bounds.left, top: bounds.top }]).png().toBuffer();
const before = await sharp(original).removeAlpha().raw().toBuffer();
const after = await sharp(preview).removeAlpha().raw().toBuffer();
let frozenPixels = 0;
for (let y = 0; y < size.height; y++) {
  for (let x = 0; x < size.width; x++) {
    if (x >= bounds.left && x < bounds.left + bounds.width && y >= bounds.top && y < bounds.top + bounds.height) continue;
    frozenPixels++;
    const offset = (y * size.width + x) * 3;
    for (let c = 0; c < 3; c++) assert.equal(after[offset + c], before[offset + c], `Reviewed photo changed outside outdoor repair at ${x},${y}`);
  }
}
await writeFile(join(pack, "preview.png"), preview);
await writeFile(join(pack, "repair-qa.json"), JSON.stringify({
  status: "Review image; not a verified installed project or product dimension drawing",
  method: "Whole-image photographic retouch, followed by an outdoor-only correction. No original-photo pixel-identity claim applies to the retouch.",
  geometryReview: "Independent visual comparison found no identifiable changed components or door pose; tiny fastener texture is not certified.",
  repairBounds: bounds, frozenPixels, changedFrozenPixels: 0,
  retouchSha256: hash(original), repairSourceSha256: hash(repair), previewSha256: hash(preview),
}, null, 2) + "\n");
console.log(`Unified review preview written; ${frozenPixels} pixels outside the outdoor repair unchanged.`);
