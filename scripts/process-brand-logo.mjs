import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = resolve("public/images/brand/canton-hyland-logo-source.png");
const output = resolve("public/images/brand/hyland-mark.png");

await mkdir(dirname(output), { recursive: true });

// Preserve the client's oval trademark exactly. The legacy company-name strip and
// tagline are cropped away; the clean Archivo wordmark is rendered as live HTML.
await sharp(source)
  // Stop before the legacy company-name strip begins. The previous 508 px crop
  // included the first dark pixels of its capital C, which appeared as a black edge.
  .extract({ left: 0, top: 0, width: 500, height: 300 })
  .resize({ width: 254, height: 150, fit: "fill" })
  .png({ compressionLevel: 9, palette: true, quality: 100 })
  .toFile(output);

console.log(`Created ${output}`);
