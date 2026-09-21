/**
 * Record the real pixel size of every image the RAYEN site renders.
 *
 * WHY
 * Lighthouse on https://rayen.cn/ (2026-09-15): "Image elements do not have explicit width
 * and height". Without those attributes the browser cannot reserve the right box before the
 * bytes arrive, so the page reflows as each photograph lands — the layout shift a buyer sees
 * as text jumping while they are reading it.
 *
 * The attributes have to be the image's OWN size, not the size of the box it is drawn into.
 * A width and height that merely restate the CSS box would satisfy the audit and still be a
 * lie about the file, and it would hide the second finding rather than fix it: "Displays
 * images with incorrect aspect ratio", which is the browser noticing that a 1000 × 1000
 * factory photograph is being rendered in a 4:3 frame.
 *
 * So the numbers are measured from the files, here, at build time. A component cannot read
 * them at render time — this is a static export with no image optimiser — and hand-typing
 * them next to each <Photo> would go stale the first time somebody re-crops a photograph.
 *
 * Usage:
 *   node scripts/build-rayen-image-dims.mjs
 *   node scripts/build-rayen-image-dims.mjs --check   # CI: fail if stale
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src", "data", "generated", "rayen-image-dims.json");
const CHECK = process.argv.includes("--check");

/* The directories the RAYEN pages draw from. Product images are square by construction —
   scripts/square-rayen-plates.mjs guarantees it — but they are measured too rather than
   assumed, because "guaranteed by another script" is how a wrong number survives. */
const DIRS = [
  join(root, "public", "images", "rayen"),
  join(root, "public", "images", "products-rayen"),
  join(root, "public", "images", "products-rayen-en"),
];

const dims = {};
for (const dir of DIRS) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (!/\.(webp|png|jpe?g|svg)$/i.test(file)) continue;
    if (file.endsWith(".svg")) continue; // vector: no intrinsic pixel size worth stating
    const path = join(dir, file);
    try {
      const meta = await sharp(path).metadata();
      if (!meta.width || !meta.height) continue;
      const key = `/${relative(join(root, "public"), path).replaceAll("\\", "/")}`;
      dims[key] = [meta.width, meta.height];
    } catch {
      /* unreadable file: leave it out rather than guess a size for it */
    }
  }
}

const sorted = Object.fromEntries(Object.entries(dims).sort(([a], [b]) => a.localeCompare(b)));
const json = `${JSON.stringify(sorted, null, 0)}\n`;

if (CHECK) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (current !== json) {
    console.error(
      `⚠ rayen-image-dims.json 与 public/images 不一致 —— 跑 node scripts/build-rayen-image-dims.mjs`,
    );
    process.exit(1);
  }
  console.log(`图片尺寸表检查通过：${Object.keys(sorted).length} 张。`);
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json, "utf8");
  const square = Object.values(sorted).filter(([w, h]) => w === h).length;
  console.log(
    `图片尺寸表：${Object.keys(sorted).length} 张（其中 ${square} 张是正方形）-> ${relative(root, OUT)}`,
  );
}
