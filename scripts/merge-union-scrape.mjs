/**
 * Fold the images scraped from UNION into the staging directories the manifests read.
 *
 * WHY THIS STEP EXISTS AT ALL
 * scripts/scrape-artunion-images.mjs deliberately writes nowhere near the catalogue — it
 * drops files in a staging root and stops. This is the step that decides where each one
 * belongs, and that decision is not the same for every model.
 *
 * WHAT THE COUNTS SHOWED, AND WHY THIS SCRIPT IS NARROWER THAN IT FIRST LOOKED
 * The first draft rebuilt every batch 1–4 model from its published webp and added the
 * scraped frames alongside. Then the counts came in:
 *
 *   G1234   站上 13   UNION 13
 *   G1159   站上 11   UNION  9
 *   G1105   站上  9   UNION  5
 *
 * The client's WeChat packs for those batches were themselves UNION material. Scraping the
 * same model again returns the photographs the site is already showing, under the supplier's
 * own filenames. Merging them would have produced galleries of near-duplicates, re-encoded
 * webp→jpg→webp for nothing, with synthetic filenames that no longer match the `drawing`
 * and `excludeImages` fields those manifests key on. So batches 1–4 are left alone.
 *
 * THE FOUR EXCEPTIONS, AND WHY THEY EARN ONE
 * A handful of batch 1–4 models arrived with no drawing at all, and their spec tables are
 * empty in consequence — deliberately, because no drawing means no dimension worth printing.
 * UNION publishes a drawing for four of them, and only for those four does this script build
 * a staging folder:
 *
 *   G1216   G1216xD900SZXW.jpg                     P=425, 总长 600
 *   G2110   G2110x5D921SZW.jpg + x5D922SZW.jpg     P=660/700 与 P=260/300
 *   G1266   G1266xD900SZW.jpg                      P=540, 总长 600
 *   G2888   G2888xD920SZW.jpg                      P=580, 总长 800
 *
 * Nothing else from the scrape goes into those folders — the published frames are kept as
 * they are and only the drawing is added, so no image arrives twice. T2973 still has no
 * drawing anywhere and keeps its empty table; it did gain a product plate, which is a
 * separate matter for the client to confirm.
 *
 * BATCHES 5, 6, 7 AND THE PIVOTS
 * Those packs ARE on this machine, and there the scrape adds real coverage: G1265 and G1286
 * shipped with a single photograph each and UNION has six apiece, drawing included. Scraped
 * frames are copied into the pack folder and the batch is re-ingested normally.
 *
 * NOTHING IS OVERWRITTEN
 * A file already in the destination folder is left alone. The client's own photograph of a
 * model always wins over UNION's of the same name, because it is the one the factory sent.
 *
 * Usage:
 *   node scripts/merge-union-scrape.mjs --dry
 *   node scripts/merge-union-scrape.mjs
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const PUBLISHED = join(root, "public", "images", "products");
const SCRAPE = "C:/Users/86132/rayen-union-scrape";
const REBUILT = "C:/Users/86132/rayen-union-rebuilt";
const PACKS = [
  "C:/Users/86132/rayen-batch5-by-model",
  "C:/Users/86132/rayen-batch6-by-model",
  "C:/Users/86132/rayen-batch7-by-model",
  "C:/Users/86132/rayen-pivot-by-model",
];

/*
  The batch 1–4 models worth staging, and exactly which scraped files may join them.

  Named one file at a time on purpose. "Every drawing UNION has for this model" would be a
  rule, and a rule here would quietly pull in the frames the site already publishes the next
  time somebody re-runs this. These two lists were checked against the published galleries
  by hand; anything not named stays out.
*/
const REBUILD_ONLY = {
  G1216: ["G1216xD900SZXW.jpg"],
  G2110: ["G2110x5D921SZW.jpg", "G2110x5D922SZW.jpg"],
  G1266: ["G1266xD900SZW.jpg"],
  G2888: ["G2888xD920SZW.jpg"],
};

/*
  How many non-drawing frames one model's gallery may hold once the scrape is folded in.

  UNION photographs a handle once per length and once per finish and files them all under the
  same model number: G500 comes back with 34 plates of the same D-handle on the same frosted
  glass, G1170 with 11. They are variants, not views — a buyer scrolling 34 of them learns
  less than from eight.

  The cap is on the FINISHED gallery, not on what this run adds, and that distinction matters.
  Capping additions would have taken G500 — which already publishes 11 frames and a complete
  spec table — to 19, while a model like G1265 that shipped with a single photograph would
  get the same allowance. What each page needs is a sane total, so the pack's own count is
  what fills the budget first; the client's photographs are never displaced by UNION's.

  Drawings are outside the budget entirely. A drawing is the one image on the page carrying
  information no photograph does, there are at most four per model, and G1265's arrived today
  after the page had shipped without one. Every drawing is taken.

  Frames are taken in UNION's own filename order, which runs D000 upward — their lead shot
  first. This is a judgement about presentation, so the run prints every model it trimmed
  rather than applying it quietly.
*/
const MAX_FRAMES = 12;
const isDrawing = (file) => /(D|L)9\d\dSZ/i.test(file);

const DRY = process.argv.includes("--dry");

if (!existsSync(SCRAPE)) {
  console.error(`没有 ${SCRAPE} —— 先跑 scripts/scrape-artunion-images.mjs`);
  process.exit(1);
}

/** model -> the pack folder that already holds its photographs, if one is on this machine. */
function packFolders() {
  const map = new Map();
  for (const pack of PACKS) {
    if (!existsSync(pack)) continue;
    for (const model of readdirSync(pack)) {
      if (!map.has(model)) map.set(model, join(pack, model));
    }
  }
  return map;
}

/** model -> its published record, so a staged folder can be filled from what is live. */
function records() {
  const map = new Map();
  for (const file of readdirSync(PRODUCTS)) {
    if (!file.endsWith(".json")) continue;
    let product;
    try {
      product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    } catch {
      continue;
    }
    if (!(product.sites ?? []).includes("rayen")) continue;
    map.set(String(product.model ?? "").trim(), product);
  }
  return map;
}

const packs = packFolders();
const live = records();

const intoPack = [];
const staged = [];
const leftAlone = [];
let copied = 0;

for (const model of readdirSync(SCRAPE)) {
  const from = join(SCRAPE, model);
  const files = readdirSync(from).filter((f) => /\.(jpe?g|png)$/i.test(f));
  if (!files.length) continue;

  const pack = packs.get(model);
  if (pack) {
    const fresh = files.filter((f) => !existsSync(join(pack, f))).sort();
    const drawings = fresh.filter(isDrawing);
    const frames = fresh.filter((f) => !isDrawing(f));

    /* The pack's own frames fill the budget first — the client's photographs never lose. */
    const held = readdirSync(pack).filter((f) => /\.jpg$/i.test(f) && !isDrawing(f)).length;
    const room = Math.max(0, MAX_FRAMES - held);
    const take = [...drawings, ...frames.slice(0, room)];
    const dropped = frames.length - Math.min(frames.length, room);

    for (const file of take) {
      if (!DRY) copyFileSync(join(from, file), join(pack, file));
    }
    copied += take.length;
    if (take.length) {
      const batch = pack.replaceAll("\\", "/").split("/").at(-2);
      intoPack.push(
        `${model}: +${take.length}（图纸 ${drawings.length}）→ ${batch}` +
          (dropped ? `　※ 另有 ${dropped} 张同款不同长度/颜色的产品图没收` : ""),
      );
    }
    continue;
  }

  const wanted = REBUILD_ONLY[model];
  if (!wanted) {
    leftAlone.push(model);
    continue;
  }

  const product = live.get(model);
  if (!product) {
    leftAlone.push(`${model}（站上没有记录）`);
    continue;
  }

  /*
    Stage this one model: everything the site already publishes, plus the named drawing.

    The published files are webp and the ingest reads jpg, so each is decoded back to jpg
    here — a re-encode of an image that has already been through the pipeline, which costs a
    little quality and is still the right trade, because this machine holds no other copy of
    the client's own photographs of these two models.

    Naming: the published frames all predate the drawing and are all non-drawings, so they
    take D0nn names, which shotRank() reads as product plates and sorts in the order they
    already appear. The drawing keeps its real UNION filename, so isDrawing() finds it and
    the manifest's `drawing` field can name it exactly as every other batch does.
  */
  const dir = join(REBUILT, model);
  const existing = [product.heroImage, ...(product.gallery ?? [])]
    .map((image) => image?.src)
    .filter(Boolean)
    .map((src) => String(src).slice(String(src).lastIndexOf("/") + 1));

  let kept = 0;
  if (!DRY) mkdirSync(dir, { recursive: true });
  for (const [index, name] of existing.entries()) {
    const source = join(PUBLISHED, name);
    if (!existsSync(source)) continue;
    const target = join(dir, `${model}xD0${String(index).padStart(2, "0")}ZHP.jpg`);
    if (!DRY && !existsSync(target)) await sharp(source).jpeg({ quality: 92 }).toFile(target);
    kept += 1;
  }

  let added = 0;
  for (const file of wanted) {
    if (!existsSync(join(from, file))) {
      leftAlone.push(`${model}/${file} 没抓到`);
      continue;
    }
    if (existsSync(join(dir, file))) continue;
    if (!DRY) copyFileSync(join(from, file), join(dir, file));
    added += 1;
  }
  copied += added;
  staged.push(`${model}: 站上 ${kept} 张 + UNION 图纸 ${added} 张`);
}

if (!DRY) {
  writeFileSync(
    join(root, "content", "rayen", "union-scrape-report.json"),
    `${JSON.stringify({ ranAt: new Date().toISOString(), intoPack, staged, leftAlone }, null, 2)}\n`,
    "utf8",
  );
}

console.log(`${DRY ? "（--dry，未复制）" : `复制 ${copied} 张`}`);
console.log(`\n并入已有素材包的 ${intoPack.length} 个型号：`);
for (const line of intoPack) console.log(`  ${line}`);
console.log(`\n为补图纸单独搭的 ${staged.length} 个型号（b1，源盘不在本机）：`);
for (const line of staged) console.log(`  ${line}`);
console.log(
  `\n${leftAlone.length} 个 b1–b4 型号原样不动 —— UNION 上就是站上已有的那几张，` +
    `合进来只会出现重复图：\n  ${leftAlone.join("、")}`,
);
