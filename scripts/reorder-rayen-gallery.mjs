/**
 * Put the dimension drawing first in every RAYEN product's gallery.
 *
 * WHY
 * Client instruction, 2026-09-11, with a screenshot of their own listing sheet:
 *   窗口图片 → 参数图 → 其他表面处理颜色展示图 → 安装实景效果图
 * and, twice over, 「参数图放第一张」/「确保参数尺寸是第一张图」.
 *
 * Batch 5 is generated in that order by scripts/ingest-union-handles.mjs (the manifest sets
 * "imageOrder": "drawing-first"). The 75 models published in batches 1–4 cannot be
 * regenerated on this machine — their source packs live on the client's other drive — so
 * this reorders the records themselves.
 *
 * WHAT IT TOUCHES AND WHAT IT DOES NOT
 * Only the ORDER of `gallery`, and only for products with sites including "rayen".
 * heroImage is left where it is: the hero is the listing thumbnail, which is the 窗口图片
 * row of the client's sheet, not the 参数图 row. Nothing is added, removed or renamed, so
 * every image path already audited by the dead-link and branding checks still resolves.
 *
 * A drawing is identified by its own label ("…, dimension drawing"), which the ingest
 * script writes from the supplier's D9xx/L9xx filename code. Products whose gallery has no
 * drawing are left exactly as they are rather than shuffled on a guess.
 *
 * Idempotent: run it again and it reports 0 changes. Run it after any future ingest of an
 * older manifest, because that would write the old order back.
 *
 * Usage:
 *   node scripts/reorder-rayen-gallery.mjs --dry   # list what would move
 *   node scripts/reorder-rayen-gallery.mjs         # write
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const DRY = process.argv.includes("--dry");

const isDrawing = (image) => /dimension drawing/i.test(image?.label ?? "");

const moved = [];
const noDrawing = [];

for (const file of readdirSync(PRODUCTS)) {
  if (!file.endsWith(".json")) continue;
  const path = join(PRODUCTS, file);
  const product = JSON.parse(readFileSync(path, "utf8"));
  if (!(product.sites ?? []).includes("rayen")) continue;

  const gallery = product.gallery ?? [];
  const at = gallery.findIndex(isDrawing);
  if (at < 0) {
    noDrawing.push(product.model);
    continue;
  }
  if (at === 0) continue;

  /* Every drawing moves, in the order it already had — some models carry two. */
  const drawings = gallery.filter(isDrawing);
  const rest = gallery.filter((image) => !isDrawing(image));
  product.gallery = [...drawings, ...rest];

  moved.push(`${product.model}: 参数图 第${at + 2}张 → 第2张`);
  if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`, "utf8");
}

console.log(moved.length ? moved.join("\n") : "没有需要调整的：参数图都已经在第一张。");
console.log(`\n${DRY ? "（--dry，未写入）" : "已写入"} ${moved.length} 个型号。`);
if (noDrawing.length) {
  console.log(`${noDrawing.length} 个型号图库里没有参数图，原样不动：${noDrawing.join("、")}`);
}
