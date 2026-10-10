#!/usr/bin/env node
/** Preserve the photographed hardware; replace only the rejected office destination. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pack = join(root, "docs/design-references/home-hero-b-egress-2026-10-09");
const receipt = JSON.parse(await readFile(join(pack, "receipt.json"), "utf8"));
const base = await readFile(join(root, receipt.baseMaster));
const courtyard = await readFile(join(pack, "empty-courtyard.png"));
const photo = await readFile(join(root, receipt.source));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(base), receipt.baseMasterSha256, "Approved B architecture changed");
assert.equal(hash(courtyard), receipt.courtyardSha256, "Empty exterior plate changed");
assert.equal(hash(photo), receipt.sourceSha256, "306-D customer source changed");
assert.deepEqual(
  await sharp(base).extract(receipt.masterPhotoBounds).removeAlpha().raw().toBuffer(),
  await sharp(photo).extract(receipt.sourceCrop).removeAlpha().raw().toBuffer(),
  "Original B no longer contains the customer photograph",
);
const { width: cropWidth, height: cropHeight } = receipt.sourceCrop;
const points = receipt.environmentPolygon.map(([x, y]) => `${x - receipt.sourceCrop.left},${y - receipt.sourceCrop.top}`).join(" ");
const mask = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cropWidth}" height="${cropHeight}"><rect width="100%" height="100%" fill="black"/><polygon points="${points}" fill="white"/></svg>`)).toColourspace("b-w").raw().toBuffer();
const field = await sharp(courtyard).resize({ width: 255, height: 624, fit: "fill" })
  .extend({ left: 45, top: 34, right: 296, bottom: 2, background: "black" })
  .removeAlpha().png().toBuffer();
const patch = await sharp(field).joinChannel(mask, { raw: { width: cropWidth, height: cropHeight, channels: 1 } }).png().toBuffer();
const master = await sharp(base).composite([{ input: patch, left: receipt.masterPhotoBounds.left, top: receipt.masterPhotoBounds.top }]).png().toBuffer();
assert.equal(hash(master), receipt.masterSha256, "Reviewed egress master changed");
const actual = await sharp(master).extract(receipt.masterPhotoBounds).removeAlpha().raw().toBuffer();
const original = await sharp(photo).extract(receipt.sourceCrop).removeAlpha().raw().toBuffer();
let protectedPixels = 0;
for (let pixel = 0; pixel < mask.length; pixel++) {
  if (mask[pixel]) continue;
  protectedPixels++;
  for (let channel = 0; channel < 3; channel++) assert.equal(actual[pixel * 3 + channel], original[pixel * 3 + channel], `Photographed product changed at pixel ${pixel}`);
}
assert.equal(protectedPixels, receipt.protectedSourceRgbPixels);
const check = process.argv.includes("--check");
// The existing desktop cover/entry zoom and phone crop must retain both rod ends.
const desktopHeight = receipt.width / (1920 / 754) / 1.015;
assert.ok(receipt.masterPhotoBounds.top >= (receipt.height - desktopHeight) / 2);
assert.ok(receipt.masterPhotoBounds.top + receipt.masterPhotoBounds.height <= (receipt.height + desktopHeight) / 2);
const mobileWidth = receipt.height * 4 / 3;
assert.ok(receipt.masterPhotoBounds.left >= (receipt.width - mobileWidth) / 2);
assert.ok(receipt.masterPhotoBounds.left + receipt.masterPhotoBounds.width <= (receipt.width + mobileWidth) / 2);
const editorialRoot = join(root, "public/images/editorial");
const sourceName = "home-panic-exit-bars";
const output = await sharp(master).webp({ quality: 86, effort: 6 }).toBuffer();
const derivatives = [[join(editorialRoot, `${sourceName}.webp`), output]];
for (const width of [480, 800, 1600]) {
  derivatives.push([
    join(editorialRoot, "responsive", `${sourceName}-${width}w.webp`),
    await sharp(output).resize({ width }).webp({ quality: 80, effort: 6, smartSubsample: true }).toBuffer(),
  ]);
}
for (const width of [400, 800]) {
  derivatives.push([
    join(editorialRoot, "mobile-hero", `${sourceName}-${width}w-4x3.webp`),
    await sharp(output).resize({ width, height: width * 3 / 4, fit: "cover", position: "centre" })
      .webp({ quality: 80, effort: 6 }).toBuffer(),
  ]);
}
const provenance = {
  kind: "client-approved-photograph-in-generated-architecture",
  approvedDirection: "B — pale civic space, corrected to an outdoor escape destination by client 2026-10-09",
  ...receipt,
  preservedMasterRgbPixels: protectedPixels,
  changedProtectedSourcePixels: 0,
  delivery: "Lossy WebP encoding and responsive resizing; pixel equality applies to the PNG master only.",
  independentlyVerifiedInstallation: false,
  outputs: derivatives.map(([target, bytes]) => ({ path: target.slice(root.length + 1).replaceAll("\\", "/"), sha256: hash(bytes), bytes: bytes.length })),
};
derivatives.push([join(editorialRoot, `${sourceName}.webp.json`), Buffer.from(JSON.stringify(provenance, null, 2) + "\n")]);
derivatives.push([join(pack, "master.png"), master]);
for (const [target, bytes] of derivatives) {
  if (check) assert.ok((await readFile(target)).equals(bytes), `${target} is stale`);
  else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
}
console.log(`${check ? "Verified" : "Wrote"} B outdoor egress hero and five derivatives; ${output.length} bytes; ${protectedPixels} source RGB pixels protected before WebP encoding.`);
