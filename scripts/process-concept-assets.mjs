import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const sourceRoot = "C:/Users/johns/Downloads";
const outputRoot = path.resolve("public/images/concepts");
const maxBytes = 300 * 1024;

const assets = [
  ["Gemini_Generated_Image_z58n53z58n53z58n.png", "hero-panic-exit-device.webp"],
  ["Gemini_Generated_Image_eghjtoeghjtoeghj.png", "hero-heavy-duty-fire-door-lock.webp"],
  ["Gemini_Generated_Image_l5tfetl5tfetl5tf.png", "deadbolt-application.webp"],
  ["Gemini_Generated_Image_efkxkqefkxkqefkx.png", "panic-exit-application.webp"],
  ["Gemini_Generated_Image_74dbcl74dbcl74db.png", "glass-patch-fitting-application.webp"],
  ["Gemini_Generated_Image_t2at4et2at4et2at.png", "lever-handle-application.webp"],
  ["Gemini_Generated_Image_oemunioemunioemu.png", "smart-lock-residential-application.webp"],
  ["Gemini_Generated_Image_r07m2or07m2or07m.png", "double-door-coordinator-application.webp"],
  ["Gemini_Generated_Image_p0q80ap0q80ap0q8.png", "commercial-panic-exit-application.webp"],
];

async function encodeWithinBudget(source, destination) {
  const metadata = await sharp(source).metadata();
  const originalWidth = metadata.width ?? 2400;
  let width = Math.min(originalWidth, 2400);

  for (const quality of [78, 72, 66, 60, 54]) {
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(destination);

    const output = await stat(destination);
    if (output.size <= maxBytes) {
      return { bytes: output.size, width, quality };
    }

    width = Math.max(1280, Math.round(width * 0.88));
  }

  throw new Error(`Unable to compress ${path.basename(source)} below 300KB`);
}

await mkdir(outputRoot, { recursive: true });

for (const [sourceName, outputName] of assets) {
  const source = path.join(sourceRoot, sourceName);
  const destination = path.join(outputRoot, outputName);
  const result = await encodeWithinBudget(source, destination);
  const kilobytes = Math.round(result.bytes / 1024);
  console.log(`${outputName}: ${kilobytes}KB, width ${result.width}px, q${result.quality}`);
}
