/**
 * Pad tall and wide RAYEN product plates onto a square field, so the site never crops one.
 *
 * THE BUG THIS FIXES
 * Every product tile and every product hero on the RAYEN site is a 1:1 box with
 * object-cover (src/components/rayen/primitives.tsx). Cover fills the box and throws away
 * the overflow. For a square plate that is free. For PRE_W160 — a pull handle photographed
 * at 110 × 950 — it means the page shows a 110 × 110 sliver of the middle of the tube,
 * blown up to fill the tile. The client saw it as "缩放有问题", and they were right: the
 * product was not in the picture any more. 327 images were being cropped this way, including
 * every grab bar (150 × 600) and both upright paper holders.
 *
 * WHY PAD THE FILE RATHER THAN SWITCH THE CSS TO object-contain
 * Two reasons, and the second is the real one.
 *
 *   1. object-contain leaves the tile's own background showing around the image. Our plates
 *      are cut out on white, so a tall handle would sit in a white letterbox inside a grey
 *      tile — visibly a different treatment from the square plates beside it.
 *   2. Consistency IS the argument (AGENTS.md). Fifteen plates that all present the product
 *      the same way say "this is a factory with a process". Fifteen where some are centred
 *      on white and some are edge-to-edge say "these came from somewhere". Baking the field
 *      into the asset makes every tile identical no matter which component renders it, now
 *      or later.
 *
 * WHAT IT WILL NOT TOUCH
 * Only plates — images whose four corners are already near-white, i.e. a product cut out on
 * a white field. A bathroom interior or a video still is a photograph that is SUPPOSED to
 * fill its tile, and letterboxing one would put white bars across a scene. Those keep the
 * cover crop.
 *
 * Naturally idempotent: the output is square, so a second run no longer matches the
 * aspect-ratio test. The ledger exists to make re-runs cheap, not to make them correct.
 *
 * Usage:
 *   node scripts/square-rayen-plates.mjs          # pad what needs it
 *   node scripts/square-rayen-plates.mjs --check  # CI: fail if anything is still croppable
 *   node scripts/square-rayen-plates.mjs --dry    # list without writing
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(root, "public", "images", "products-rayen");
const LEDGER = join(root, "content", "rayen", "plate-squaring.json");

const argv = process.argv.slice(2);
const CHECK = argv.includes("--check");
const DRY = argv.includes("--dry");

/*
  The window that a 1:1 box can show without losing anything worth keeping.

  Not 1.0 exactly: a plate at 0.95 loses a 5% sliver off the top and bottom, which is
  padding, not product. 0.8–1.25 is the band where the crop stays inside the margin the
  photographer already left. Outside it, the crop starts eating metal.
*/
const MIN_RATIO = 0.8;
const MAX_RATIO = 1.25;

/** A corner is "white" if every channel is above this. Plates are shot on paper, not on #fff. */
const WHITE_FLOOR = 238;

async function cornersAreWhite(source, width, height) {
  const probe = Math.max(2, Math.round(Math.min(width, height) * 0.04));
  const corners = [
    { left: 0, top: 0 },
    { left: width - probe, top: 0 },
    { left: 0, top: height - probe },
    { left: width - probe, top: height - probe },
  ];
  for (const corner of corners) {
    const { data, info } = await sharp(source)
      .extract({ ...corner, width: probe, height: probe })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let sum = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      sum += data[i] + data[i + 1] + data[i + 2];
      n += 3;
    }
    if (sum / n < WHITE_FLOOR) return false;
  }
  return true;
}

/**
 * The exact white the plate is already sitting on.
 *
 * Padding a 249-grey plate with pure #fff leaves a visible rectangle where the original
 * image ends — the seam is faint on a screen and obvious in print, and either way it says
 * somebody pasted this together. Sampling the top-left corner and padding with THAT makes
 * the join invisible.
 */
async function fieldColour(source) {
  const { data, info } = await sharp(source)
    .extract({ left: 0, top: 0, width: 8, height: 8 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n), alpha: 1 };
}

/*
  Breathing room, as a fraction of the square side.

  A handle padded to exactly square touches the tile's top and bottom edges while the square
  plates beside it sit inside their own margin, and the row reads as ragged. 6% each way
  lines the long ones up with the rest.
*/
const MARGIN = 0.06;

/*
  Read the bytes before writing them back.

  sharp(path) keeps the source file open until its pipeline finishes, and on Windows an
  open handle makes writing the SAME path fail with `UNKNOWN, errno -4094` — which is what
  this did on its first real run. Passing a Buffer means the file is closed the moment it is
  read, and in-place output is safe.
*/
async function squareOne(file, source, meta) {
  const side = Math.round(Math.max(meta.width, meta.height) * (1 + MARGIN * 2));
  const background = await fieldColour(source);
  const resized = await sharp(source)
    .resize({
      width: side,
      height: side,
      fit: "contain",
      background,
    })
    .webp({ quality: 90 })
    .toBuffer();
  if (!DRY) writeFileSync(file, resized);
  return side;
}

/** Every image filename cited by a product the RAYEN site publishes. */
function rayenImageNames() {
  const dir = join(root, "content", "products");
  const names = new Set();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    let product;
    try {
      product = JSON.parse(readFileSync(join(dir, file), "utf8"));
    } catch {
      continue;
    }
    if (!(product.sites ?? []).includes("rayen")) continue;
    /*
      The gallery field is `gallery`. `images` does not exist on these records — an earlier
      version of this read `product.images`, found nothing, and quietly scoped itself to the
      75 hero shots while reporting success. Every extra view on every product page was left
      cropped. Both names are read here so a rename cannot silently shrink the job again.
    */
    const cited = [product.heroImage, ...(product.gallery ?? []), ...(product.images ?? [])].filter(
      Boolean,
    );
    for (const image of cited) {
      const src = String(image.src ?? "");
      if (src) names.add(src.slice(src.lastIndexOf("/") + 1));
    }
  }
  return names;
}

async function main() {
  if (!existsSync(DIR)) {
    console.error(`${DIR} 不存在 —— 先跑 npm run rayen:images。`);
    process.exit(1);
  }

  /*
    Only the images this site actually shows.

    products-rayen/ is generated for all 659 catalogue models, but the RAYEN site publishes
    the ~75 scoped to it. Padding a HYDE panic-bar plate here changes nothing a RAYEN
    visitor sees and puts a diff on 200 files nobody asked about.
  */
  const wanted = rayenImageNames();
  const files = readdirSync(DIR).filter(
    (f) =>
      /\.(webp|png|jpe?g)$/i.test(f) &&
      wanted.has(f) &&
      /*
        Video posters keep the cover crop. A still lifted from a 16:9 clip is a frame of
        footage, not a plate — the white in its corners is a wall, and letterboxing it puts
        bars across a scene.
      */
      !/-video\.[a-z]+$/i.test(f),
  );
  const padded = [];
  const skippedScene = [];
  const unreadable = [];

  for (const name of files) {
    const file = join(DIR, name);
    /* One read, reused for metadata, corner probe, field colour and the resize itself. */
    let source;
    let meta;
    try {
      source = readFileSync(file);
      meta = await sharp(source).metadata();
    } catch (error) {
      /* Another session may be mid-write; report rather than die. */
      unreadable.push(`${name} (${error.code ?? "unknown"})`);
      continue;
    }
    if (!meta.width || !meta.height) continue;
    const ratio = meta.width / meta.height;
    if (ratio >= MIN_RATIO && ratio <= MAX_RATIO) continue;

    let isPlate;
    try {
      isPlate = await cornersAreWhite(source, meta.width, meta.height);
    } catch {
      continue;
    }
    if (!isPlate) {
      skippedScene.push(`${name} ${meta.width}×${meta.height}`);
      continue;
    }

    if (CHECK) {
      padded.push(`${name} ${meta.width}×${meta.height} (${ratio.toFixed(2)})`);
      continue;
    }
    /*
      A file another process is holding must not end the run. The image pipelines here share
      a checkout with a second agent, and losing a whole pass over one locked file is how
      2026-09-06 turned a cosmetic step into an aborted release.
    */
    try {
      const side = await squareOne(file, source, meta);
      padded.push(`${name} ${meta.width}×${meta.height} → ${side}×${side}`);
    } catch (error) {
      unreadable.push(`${name} (write: ${error.code ?? "unknown"})`);
    }
  }

  if (CHECK) {
    if (padded.length) {
      console.error(`⚠ ${padded.length} 张产品图仍会被 1:1 方框裁掉主体：`);
      for (const line of padded.slice(0, 12)) console.error(`   ${line}`);
      console.error("   跑 node scripts/square-rayen-plates.mjs 补白边。");
      process.exit(1);
    }
    console.log(`产品图缩放检查通过：${files.length} 张，没有会被方框裁掉的。`);
    return;
  }

  if (!DRY) {
    writeFileSync(
      LEDGER,
      `${JSON.stringify(
        {
          _readme: [
            "square-rayen-plates.mjs 的运行记录。",
            "站上的产品图框是 1:1 + object-cover，会把超出的部分裁掉。",
            "竖长的拉手、扶手被裁成一小截钢管放大 —— 产品本身就不在画面里了。",
            "所以在这里把白底产品图补成正方形；实景照和视频截图不动，它们本来就该铺满。",
          ],
          ranAt: new Date().toISOString(),
          padded: padded.length,
          keptAsScene: skippedScene.length,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  console.log(
    `${DRY ? "（试运行）" : ""}补白边 ${padded.length} 张（竖长/超宽的白底产品图），` +
      `实景照保持铺满 ${skippedScene.length} 张。`,
  );
  for (const line of padded.slice(0, 10)) console.log(`   ${line}`);
  if (unreadable.length) {
    console.warn(`⚠ ${unreadable.length} 张读不到（可能被别的进程占用），本次跳过。`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
