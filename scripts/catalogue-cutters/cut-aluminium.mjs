/*
 * 《雷茵五金》p57–p60 豪华氧化铝门锁系列的切图。
 *
 * 这一章的版式和前面三个系列都不一样：一格 = 一个型号的一个表面（AL-114 BL、AL-114 OX、
 * AL-114 SG 是三格），每格自带规格栏和尺寸图。p57–p59 是圆座/方座执手（每半页一个大格 +
 * 2×2 小格），p60 是长面板执手（2×2，尺寸图画在面板右下的空白里）。所以不走
 * cut-rayen-catalogue.mjs 的「主图 + 色样网格」，而是按格子坐标切，每格内再按墨迹找边界。
 *
 * 输出：<out>/<型号>/2-drawing.jpg（取该型号第一格的图）、3-finish-a.jpg …（每格一张，
 * 顺序 = 清单里 finishes 的顺序）。没有 1-hero：首图由 ingest 取第一张色样。
 *
 * 用法：node scripts/catalogue-cutters/cut-aluminium.mjs "<雷茵五金.pdf>" <输出目录>
 */
import { readFileSync, mkdirSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

const SRC = process.argv.find((a) => /\.pdf$/i.test(a));
const OUT = process.argv.slice(2).find((a) => !/\.pdf$/i.test(a));
if (!SRC || !OUT) {
  console.error("用法：node cut-aluminium.mjs <雷茵五金.pdf> <输出目录>");
  process.exit(1);
}
const doc = mupdf.PDFDocument.openDocument(readFileSync(SRC), "application/pdf");

/* 页面分数坐标，从 1700px 缩略页量出、再用联络表逐格核对。 */
const SMALL = {
  // [产品图 x0, x1, 尺寸图 x0, x1]
  LL: [0.045, 0.163, 0.168, 0.25],
  LR: [0.265, 0.383, 0.388, 0.47],
  RL: [0.545, 0.663, 0.668, 0.75],
  RR: [0.765, 0.883, 0.888, 0.97],
};
const SMALL_ROW = {
  r2: { prod: [0.525, 0.7], draw: [0.603, 0.7] },
  r3: { prod: [0.74, 0.915], draw: [0.818, 0.915] },
};
const BIG = {
  L: { prod: [0.05, 0.14, 0.29, 0.46], draw: [0.3, 0.355, 0.465, 0.47] },
  R: { prod: [0.55, 0.14, 0.785, 0.46], draw: [0.8, 0.355, 0.965, 0.47] },
};
const PLATE = {
  // [列起点, 面板右缘, 执手右缘]
  LL: [0.05, 0.106, 0.225],
  LR: [0.27, 0.325, 0.445],
  RL: [0.553, 0.609, 0.722],
  RR: [0.773, 0.827, 0.945],
};
const PLATE_ROW = {
  r1: { top: 0.165, leverBottom: 0.302, plateBottom: 0.452, titleTop: 0.422 },
  r2: { top: 0.555, leverBottom: 0.693, plateBottom: 0.843, titleTop: 0.817 },
};

/* 型号、表面代号、页、所在格。同一型号的格子顺序即它 finishes 的顺序。 */
const CELLS = [
  ["AL-114", "BL", 57, { big: "R" }],
  ["AL-111", "BL", 57, { small: ["RL", "r2"] }],
  ["AL-113", "BL", 57, { small: ["RR", "r2"] }],
  ["AL-115", "BL", 57, { small: ["RL", "r3"] }],
  ["AL-122", "BL", 57, { small: ["RR", "r3"] }],
  ["AL-139", "BL", 58, { big: "L" }],
  ["AL-114", "OX", 58, { big: "R" }],
  ["AL-138", "BL", 58, { small: ["LL", "r2"] }],
  ["AL-142", "BL", 58, { small: ["LR", "r2"] }],
  ["AL-111", "OX", 58, { small: ["RL", "r2"] }],
  ["AL-113", "OX", 58, { small: ["RR", "r2"] }],
  ["AL-120", "BL", 58, { small: ["LL", "r3"] }],
  ["AL-143", "BL", 58, { small: ["LR", "r3"] }],
  ["AL-115", "OX", 58, { small: ["RL", "r3"] }],
  ["AL-126", "OX", 58, { small: ["RR", "r3"] }],
  ["AL1-141", "BL", 59, { big: "L" }],
  ["AL-117", "SG", 59, { big: "R" }],
  ["AL1-114", "BL", 59, { small: ["LL", "r2"] }],
  ["AL1-144", "BL", 59, { small: ["LR", "r2"] }],
  ["AL-114", "SG", 59, { small: ["RL", "r2"] }],
  ["AL-115", "SG", 59, { small: ["RR", "r2"] }],
  ["AL-10", "OXB", 59, { small: ["LL", "r3"] }],
  ["AL-11", "OXB", 59, { small: ["LR", "r3"] }],
  ["AL-111", "SG", 59, { small: ["RL", "r3"] }],
  ["AL-124", "SG", 59, { small: ["RR", "r3"] }],
  ["AL5802-111", "BL", 60, { plate: ["LL", "r1"] }],
  ["AL5802-115", "BL", 60, { plate: ["LR", "r1"] }],
  ["AL5803-114", "OX", 60, { plate: ["RL", "r1"] }],
  ["AL5802-111", "OX", 60, { plate: ["RR", "r1"] }],
  ["AL5803-114", "BL", 60, { plate: ["LL", "r2"] }],
  ["AL5803-141", "BL", 60, { plate: ["LR", "r2"] }],
  ["AL5801-117", "OX", 60, { plate: ["RL", "r2"] }],
  ["AL5802-113", "OX", 60, { plate: ["RR", "r2"] }],
];

const pages = {};
async function page(n) {
  if (pages[n]) return pages[n];
  const p = doc.loadPage(n - 1);
  let buf = null;
  p.getObject().get("Resources").get("XObject").forEach((v) => {
    if (buf || String(v.get("Subtype")) !== "/Image") return;
    buf = Buffer.from(doc.loadImage(v).toPixmap().asPNG());
  });
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  return (pages[n] = { buf, g: data, W: info.width, H: info.height });
}

/** 分数矩形内的墨迹边界；skip(xf, yf) 为真的像素不计（页面分数坐标）。 */
function ink(P, [fx0, fy0, fx1, fy1], skip) {
  const { g, W, H } = P;
  const x0 = Math.round(W * fx0), x1 = Math.round(W * fx1), y0 = Math.round(H * fy0), y1 = Math.round(H * fy1);
  let a = x1, b = y1, c = x0, d = y0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (g[y * W + x] >= 240) continue;
      if (skip && skip(x / W, y / H)) continue;
      if (x < a) a = x;
      if (x > c) c = x;
      if (y < b) b = y;
      if (y > d) d = y;
    }
  }
  return c < a ? null : { l: a, t: b, r: c, b: d };
}

/** 裁出墨迹框，白底补成正方形；blank 为真的像素涂白。size 是上限，不放大。 */
async function save(P, box, file, blank, size = 1400) {
  const { buf, W, H } = P;
  const w = box.r - box.l + 1, h = box.b - box.t + 1, pad = Math.round(Math.max(w, h) * 0.05);
  const left = Math.max(0, box.l - pad), top = Math.max(0, box.t - pad);
  const ew = Math.min(w + pad * 2, W - left), eh = Math.min(h + pad * 2, H - top);
  const img = await sharp(buf)
    .extract({ left, top, width: ew, height: eh })
    .flatten({ background: "#fff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (blank) {
    const d = img.data, ch = img.info.channels;
    for (let y = 0; y < eh; y++) {
      for (let x = 0; x < ew; x++) {
        if (!blank((left + x) / W, (top + y) / H)) continue;
        const i = (y * ew + x) * ch;
        d[i] = d[i + 1] = d[i + 2] = 255;
      }
    }
  }
  const side = Math.min(size, Math.max(ew, eh));
  await sharp(img.data, { raw: img.info })
    .resize(side, side, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(file);
}

const count = {};
for (const [model, code, pg, where] of CELLS) {
  const P = await page(pg);
  const dir = `${OUT}/${model}`;
  mkdirSync(dir, { recursive: true });
  const k = (count[model] = (count[model] ?? -1) + 1);
  let prod, draw, blank;
  if (where.big) {
    const B = BIG[where.big];
    prod = ink(P, B.prod);
    draw = ink(P, B.draw);
  } else if (where.small) {
    const [px0, px1, dx0, dx1] = SMALL[where.small[0]];
    const R = SMALL_ROW[where.small[1]];
    prod = ink(P, [px0, R.prod[0], px1, R.prod[1]]);
    draw = ink(P, [dx0, R.draw[0], dx1, R.draw[1]]);
  } else {
    const [cx0, plateR, leverR] = PLATE[where.plate[0]];
    const R = PLATE_ROW[where.plate[1]];
    /* 产品 = 面板（左侧整列）+ 执手（上半段整行）；面板右下那块是尺寸图和标题，不算产品。 */
    blank = (xf, yf) => xf > plateR + 0.004 && yf > R.leverBottom + 0.004;
    prod = ink(P, [cx0, R.top, leverR, R.plateBottom + 0.01], blank);
    draw = ink(P, [plateR + 0.012, R.leverBottom + 0.006, leverR, R.titleTop - 0.004]);
  }
  if (!prod) throw new Error(`${model} ${code}: 没找到产品图`);
  await save(P, prod, `${dir}/${k + 3}-finish-${"abcdefghi"[k]}.jpg`, blank, 1000);
  if (k === 0) {
    if (!draw) throw new Error(`${model}: 没找到尺寸图`);
    await save(P, draw, `${dir}/2-drawing.jpg`);
  }
}
console.log(`${Object.keys(count).length} 个型号，${CELLS.length} 格`);
