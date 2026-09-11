/**
 * Put the RAYEN drawings into Chinese, and take other companies' part codes off them.
 *
 * WHY
 * The dimension drawings came from UNION's Japanese sheets. Most of what is on them is
 * numbers, which need no translation, but a handful still carry katakana — 「切カキ」
 * (cut-out), 「ドア切カキ図」 (door cut-out diagram), 「※( )内サイズは45mm用です」 — and one
 * carries 「BRN-HB001」, a part number belonging to somebody else's catalogue.
 *
 * Both are the same problem wearing different clothes. A Chinese buyer who opens a drawing
 * and finds Japanese concludes the drawing is not ours; a buyer who finds another firm's
 * part code concludes the product is not ours either. The client has asked twice for the
 * Japanese to come off, and once for every mark on a product to be RAYEN's.
 *
 * WHY TRANSLATE RATHER THAN ERASE
 * 「切カキ326」 is a cut-out width, and it is the number a joiner needs to machine the door.
 * Whiting out the label to get rid of the kana would take the dimension with it, which is
 * the one thing AGENTS.md says never to do to a drawing. So each label is replaced with the
 * same statement in Chinese: 「开孔 326」. Tolerances are carried across, not dropped.
 *
 * The exception is BRN-HB001. We cannot rename another firm's component to a RAYEN code we
 * have not assigned — that would be inventing a part number, which is the same sin as
 * inventing a dimension. It becomes 「安装底座」, which describes what the leader line points
 * at and claims nothing.
 *
 * HOW IT IS SAFE
 * Coordinates are in source pixels and every entry declares the canvas it was measured on.
 * If an image no longer has those dimensions — a pipeline change, a re-crop — the edit is
 * SKIPPED and reported rather than applied at the wrong place. Silently painting a white
 * box over a dimension line is worse than not running at all.
 *
 * ORDER MATTERS: this must run BEFORE scripts/square-rayen-plates.mjs, because padding a
 * plate to square moves every coordinate here. npm run rayen:images chains them correctly.
 *
 * Re-running is safe: the regions are painted over whatever is beneath them, so a second
 * pass simply redraws the same Chinese text in the same place.
 *
 * Usage:
 *   node scripts/delocalize-drawings.mjs          # apply
 *   node scripts/delocalize-drawings.mjs --check  # CI: fail if any edit could not be applied
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(root, "public", "images", "products-rayen");
const CHECK = process.argv.includes("--check");

/*
  Every edit, measured on the canvas named in `canvas`.

  `rotate: -90` is for the labels UNION sets running up the side of a drawing; the text is
  rendered horizontally and turned, so the Chinese reads the same way the Japanese did.
*/
const EDITS = [
  {
    file: "pre150-stainless-steel-handle.webp",
    canvas: [544, 532],
    regions: [
      { x: 350, y: 34, w: 92, h: 26, text: "门扇开孔图", size: 15 },
      { x: 176, y: 206, w: 188, h: 24, text: "※ 括号内尺寸适用 45mm 门厚", size: 12 },
    ],
  },
  {
    file: "oas-pth01-bathroom-accessories.webp",
    canvas: [544, 532],
    regions: [
      { x: 96, y: 42, w: 120, h: 30, text: "开孔 327", size: 18 },
      { x: 280, y: 50, w: 28, h: 162, text: "开孔 134 以上", size: 14, rotate: -90 },
      { x: 480, y: 324, w: 28, h: 112, text: "开孔 316", size: 14, rotate: -90 },
    ],
  },
  {
    file: "oassnb03-bathroom-accessories.webp",
    canvas: [544, 532],
    regions: [
      { x: 60, y: 154, w: 118, h: 28, text: "开孔 326 +2/−0", size: 14 },
      { x: 229, y: 38, w: 28, h: 148, text: "开孔 180 以上", size: 15, rotate: -90 },
      { x: 475, y: 314, w: 26, h: 110, text: "开孔 638 +2/−0", size: 13, rotate: -90 },
    ],
  },
  {
    file: "oashb3000-flip-up-grab-bar-8.webp",
    canvas: [544, 532],
    /*
      Not a translation. BRN-HB001 is a component code from another manufacturer's
      catalogue; we have not assigned a RAYEN number to this bracket, and making one up
      would be inventing a part. The leader line keeps its meaning by naming the thing.
    */
    regions: [{ x: 416, y: 361, w: 122, h: 28, text: "安装底座", size: 14 }],
  },
];

const FONT = "Microsoft YaHei, Noto Sans SC, SimHei, sans-serif";

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Draw one label as its own little image, so it can be rotated before it is pasted.
 *
 * The text is rendered into a box the size of the region it replaces and told to fill that
 * width (`textLength`). Measuring CJK advance widths by hand would be guesswork, and a
 * label that overflows its white patch onto a dimension line is worse than the Japanese.
 */
async function label({ text, w, h, size, rotate }) {
  /* For a rotated label the drawing box is the region turned on its side. */
  const boxW = rotate ? h : w;
  const boxH = rotate ? w : h;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boxW}" height="${boxH}">
    <rect width="${boxW}" height="${boxH}" fill="#ffffff"/>
    <text x="${boxW / 2}" y="${boxH / 2}" font-family="${FONT}" font-size="${size}"
      fill="#000000" text-anchor="middle" dominant-baseline="central"
      textLength="${Math.max(8, boxW - 4)}" lengthAdjust="spacingAndGlyphs">${escape(text)}</text>
  </svg>`;
  let image = sharp(Buffer.from(svg));
  if (rotate) image = image.rotate(rotate, { background: "#ffffff" });
  return image.png().toBuffer();
}

async function main() {
  const applied = [];
  const skipped = [];

  for (const edit of EDITS) {
    const file = join(DIR, edit.file);
    if (!existsSync(file)) {
      skipped.push(`${edit.file}：文件不存在`);
      continue;
    }
    let source;
    let meta;
    try {
      source = readFileSync(file);
      meta = await sharp(source).metadata();
    } catch (error) {
      skipped.push(`${edit.file}：读不到（${error.code ?? "unknown"}）`);
      continue;
    }

    /*
      The coordinates below were measured on one specific canvas. If the image is not that
      canvas any more, the boxes land somewhere else — most likely on top of a dimension.
      Refuse rather than deface.
    */
    const [cw, ch] = edit.canvas;
    if (meta.width !== cw || meta.height !== ch) {
      skipped.push(
        `${edit.file}：尺寸是 ${meta.width}×${meta.height}，坐标是按 ${cw}×${ch} 量的 —— 跳过，不乱涂`,
      );
      continue;
    }

    const composites = [];
    for (const region of edit.regions) {
      composites.push({
        input: await label({ ...region, rotate: region.rotate ?? 0 }),
        left: region.x,
        top: region.y,
      });
    }

    if (CHECK) {
      applied.push(`${edit.file}（${edit.regions.length} 处）`);
      continue;
    }

    const out = await sharp(source).composite(composites).webp({ quality: 92 }).toBuffer();
    try {
      writeFileSync(file, out);
      applied.push(`${edit.file}：${edit.regions.map((r) => r.text).join("、")}`);
    } catch (error) {
      skipped.push(`${edit.file}：写不进去（${error.code ?? "unknown"}）`);
    }
  }

  if (CHECK) {
    if (skipped.length) {
      console.error(`⚠ ${skipped.length} 张图的日文/他厂编号改不掉：`);
      for (const line of skipped) console.error(`   ${line}`);
      process.exit(1);
    }
    console.log(`图纸本地化检查通过：${applied.length} 张都能定位。`);
    return;
  }

  console.log(`图纸本地化：改写 ${applied.length} 张。`);
  for (const line of applied) console.log(`   ${line}`);
  if (skipped.length) {
    console.error(`⚠ 跳过 ${skipped.length} 张：`);
    for (const line of skipped) console.error(`   ${line}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
