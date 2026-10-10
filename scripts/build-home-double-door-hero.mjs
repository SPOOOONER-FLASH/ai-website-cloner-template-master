#!/usr/bin/env node
/** Publish the client's selected B master, preserving the complete 306-D photo. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pack = join(root, "docs/design-references/home-hero-b-2026-10-09");
const receipt = JSON.parse(await readFile(join(pack, "receipt.json"), "utf8"));
const master = await readFile(join(pack, "master.png"));
const photo = await readFile(join(root, receipt.source));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(master), receipt.masterSha256, "Approved B master changed");
assert.equal(hash(photo), receipt.sourceSha256, "306-D customer source changed");
assert.deepEqual(
  await sharp(master).extract(receipt.masterPhotoBounds).removeAlpha().raw().toBuffer(),
  await sharp(photo).extract(receipt.sourceCrop).removeAlpha().raw().toBuffer(),
  "Customer photograph changed inside approved master",
);
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
  approvedDirection: "B — pale civic space; selected by client 2026-10-09",
  ...receipt,
  preservedMasterRgbPixels: receipt.sourceCrop.width * receipt.sourceCrop.height,
  changedMasterSourcePixels: 0,
  delivery: "Lossy WebP encoding and responsive resizing; pixel equality applies to the PNG master only.",
  independentlyVerifiedInstallation: false,
  outputs: derivatives.map(([target, bytes]) => ({ path: target.slice(root.length + 1).replaceAll("\\", "/"), sha256: hash(bytes), bytes: bytes.length })),
};
derivatives.push([join(editorialRoot, `${sourceName}.webp.json`), Buffer.from(JSON.stringify(provenance, null, 2) + "\n")]);
for (const [target, bytes] of derivatives) {
  if (check) assert.ok((await readFile(target)).equals(bytes), `${target} is stale`);
  else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
}
console.log(`${check ? "Verified" : "Wrote"} approved B hero and five derivatives; ${output.length} bytes; 393360 source RGB pixels protected before WebP encoding.`);
