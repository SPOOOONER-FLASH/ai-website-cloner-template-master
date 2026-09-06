/**
 * Import the RAYEN 雷茵 photography from the client's drives into public/images/rayen/.
 *
 * Reads content/rayen/assets.json — the curated list, with a `cleared` note on every
 * entry saying why that photograph may appear on a RAYEN page. The curation is the
 * point of this script; the resizing is incidental.
 *
 * WHY A CURATED MANIFEST AND NOT "COPY THE FOLDER"
 * The client's rule (2026-09-06) is 「没有露出商标水印的实拍都可以用」. Applying it needs a
 * person to look at each frame, because the trademarks in this material belong to other
 * companies and are architectural, not watermarks that can be retouched out: Hydeland
 * 海得五金 signage above a display wall, a JUSTOR 开达 brand wall in a showroom, and the
 * Stahlock trade-show stand. Stahlock is one of this factory's own export brands, which
 * makes it the easiest one to wave through and the worst one to publish — a Chinese buyer
 * on the RAYEN site seeing a Stahlock stand concludes the pages were assembled from
 * whatever was lying around.
 *
 * Re-run it whenever the manifest changes. The output is committed; the source drives are
 * not in the repo, so a machine without them cannot regenerate and will say so.
 *
 * Usage: node scripts/import-rayen-assets.mjs [--check]
 */

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(root, "public", "images", "rayen");
const manifest = JSON.parse(readFileSync(join(root, "content", "rayen", "assets.json"), "utf8"));

/** One width per role. Nothing here is displayed above 1600 CSS px. */
const WIDTHS = { hero: 2000, feature: 1600, grid: 1000 };

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");

mkdirSync(OUT_DIR, { recursive: true });

const missingSources = [];
const written = [];

async function emit(sourcePath, outName, width) {
  if (!existsSync(sourcePath)) {
    missingSources.push(sourcePath);
    return;
  }
  const target = join(OUT_DIR, `${outName}.webp`);
  if (checkOnly) {
    if (!existsSync(target)) missingSources.push(`${target} (未生成)`);
    return;
  }
  await sharp(sourcePath)
    .rotate() // honour EXIF; phone shots from the factory floor are often rotated
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(target);
  written.push(`${outName}.webp`);
}

const sourceRoot = manifest.sourceRoot;

await emit(resolve(manifest.logo.source), manifest.logo.out, manifest.logo.width);

for (const photo of manifest.photos) {
  const width = WIDTHS[photo.role] ?? WIDTHS.grid;
  await emit(resolve(sourceRoot, photo.source), photo.out, width);
}

if (missingSources.length) {
  console.error(
    `找不到 ${missingSources.length} 个源文件（这台机器上没挂对应的盘就会这样）：\n  ` +
      missingSources.slice(0, 10).join("\n  "),
  );
  if (checkOnly) process.exit(1);
}

if (!checkOnly) {
  console.log(`public/images/rayen/：写入 ${written.length} 张 webp`);
}
