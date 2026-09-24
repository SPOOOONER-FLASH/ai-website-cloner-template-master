/*
 * 《雷茵五金》p61–p64 不锈钢空管分体锁系列的切图。
 *
 * 版式两种：
 *   p61 / p62 / p64 —— 每半页上下两个型号，各一张照片（执手 + 锁盖）和一张尺寸图（在照片右上），
 *                     共用右侧一栏中英规格；底部一条 SN/SW 配件（不在这里切，见清单 heldBack）。
 *   p63           —— 一格一个表面：S-K210 四格、S-K401 四格。每格执手在上、锁盖在左下、
 *                     尺寸图在右下（和 p60 长面板同一种处理：尺寸图那块涂白再裁产品）。
 *
 * 输出：<out>/<型号>/2-drawing.jpg（有的话）、3-finish-a.jpg …（顺序 = 清单 finishes）。
 * S-K401 不出尺寸图：它的四格里一格印 136、三格印 135，放哪一张都等于替甲方选了一个数。
 *
 * 用法：node scripts/catalogue-cutters/cut-stainless-tube.mjs "<雷茵五金.pdf>" <输出目录>
 */
import { readFileSync, mkdirSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

const SRC = process.argv.find((a) => /\.pdf$/i.test(a));
const OUT = process.argv.slice(2).find((a) => !/\.pdf$/i.test(a));
if (!SRC || !OUT) {
  console.error("用法：node cut-stainless-tube.mjs <雷茵五金.pdf> <输出目录>");
  process.exit(1);
}
const doc = mupdf.PDFDocument.openDocument(readFileSync(SRC), "application/pdf");

/* p61/p62/p64：照片区、尺寸图区（页面分数坐标）。尺寸图压在照片区的右上角，裁照片时把它排除。 */
/*
  尺寸图不是矩形：上半（执手视图）占满宽，下半只有左边一窄条锁盖圆圈。它的下沿和下方照片里
  上翘的执手末端（S-10）在同一高度，一个矩形要么把锁盖圈留在照片里、要么把执手末端切进图纸。
  所以尺寸图 = 上半整条 [x0, y0, x1, yMid] ∪ 锁盖圈窄条 [x0, yMid, x0 + 0.037, y1]。
*/
const PAIR = {
  LA: { photo: [0.045, 0.265, 0.262, 0.4], draw: [0.19, 0.195, 0.275, 0.275, 0.302] },
  LB: { photo: [0.045, 0.51, 0.262, 0.66], draw: [0.19, 0.452, 0.275, 0.53, 0.562] },
  RA: { photo: [0.545, 0.265, 0.765, 0.4], draw: [0.69, 0.195, 0.775, 0.275, 0.302] },
  RB: { photo: [0.545, 0.51, 0.765, 0.66], draw: [0.69, 0.452, 0.775, 0.53, 0.562] },
};
const inDrawing = ([x0, y0, x1, yMid, y1], xf, yf) =>
  (xf >= x0 - 0.005 && xf <= x1 && yf >= y0 && yf <= yMid) || (xf >= x0 - 0.005 && xf <= x0 + 0.045 && yf > yMid && yf <= y1);
/* p63：列 [左缘, 尺寸图左缘, 右缘]，行 [上缘, 执手下缘, 下缘（标题之上）]。 */
/* 尺寸图左缘取在「53」那条竖向标注线的左边，否则线头会留在产品图里。 */
const K_COL = { LA: [0.04, 0.118, 0.225], LB: [0.28, 0.352, 0.462], RA: [0.555, 0.632, 0.742], RB: [0.775, 0.852, 0.962] };
const K_ROW = { r1: [0.195, 0.296, 0.405], r2: [0.455, 0.546, 0.66], r3: [0.705, 0.786, 0.905] };

// [型号, 页, 位置, 是否出尺寸图]
const CELLS = [
  ["S-01", 61, { pair: "LA" }, true], ["S-02", 61, { pair: "LB" }, true],
  ["S-03", 61, { pair: "RA" }, true], ["S-04", 61, { pair: "RB" }, true],
  ["S-09", 62, { pair: "LA" }, true],
  /* S-10 的照片比同版其它格高：锁盖顶边在 y≈0.55，正好落在上方尺寸图锁盖圈的高度。
     这一格尺寸图的下沿单独收到 0.548，照片就不会被涂掉一口、图纸也不会带进照片。 */
  ["S-10", 62, { pair: "LB", draw: [0.19, 0.452, 0.275, 0.53, 0.548] }, true],
  ["S-K400", 62, { pair: "RA" }, true], ["S-K400", 62, { pair: "RB" }, false],
  ["S-K210", 63, { k: ["LA", "r1"] }, true], ["S-K210", 63, { k: ["LA", "r2"] }, false],
  ["S-K210", 63, { k: ["LA", "r3"] }, false], ["S-K210", 63, { k: ["LB", "r3"] }, false],
  ["S-K401", 63, { k: ["RA", "r1"] }, false], ["S-K401", 63, { k: ["RA", "r2"] }, false],
  ["S-K401", 63, { k: ["RA", "r3"] }, false], ["S-K401", 63, { k: ["RB", "r3"] }, false],
  ["SF-15", 64, { pair: "LA" }, true], ["SF-18", 64, { pair: "LB" }, true],
  ["SF-22", 64, { pair: "RA" }, true], ["SF-24", 64, { pair: "RB" }, true],
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
async function save(P, box, file, blank, size = 1400, near) {
  const { buf, W, H } = P;
  const w = box.r - box.l + 1, h = box.b - box.t + 1, pad = Math.round(Math.max(w, h) * 0.05);
  const left = Math.max(0, box.l - pad), top = Math.max(0, box.t - pad);
  const ew = Math.min(w + pad * 2, W - left), eh = Math.min(h + pad * 2, H - top);
  const img = await sharp(buf).extract({ left, top, width: ew, height: eh }).flatten({ background: "#fff" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
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
  if (near) despeckle(img.data, ew, eh, img.info.channels, (x, y) => near((left + x) / W, (top + y) / H));
  const side = Math.min(size, Math.max(ew, eh));
  await sharp(img.data, { raw: img.info }).resize(side, side, { fit: "contain", background: "#fff" }).jpeg({ quality: 90 }).toFile(file);
}

/*
  产品图里和主体不相连的零碎墨迹涂白。尺寸图和照片挨得太近（S-10 的锁盖圈、K401 的「53」标注线），
  按区域涂白总会在某一格漏一段线头。线头是细线、面积小、和执手不相连；执手、锁盖、螺丝都是
  连成一片的大块。所以按连通块算：小于最大块 2% 的块视为线头。只动白底上的孤立墨迹，
  不改产品本身的任何像素。

  而且只清理「整块都落在尺寸图边上」的碎块（near）。第一版对整张图清理，把 S-K401 镜光锁盖
  误删了：镜面锁盖几乎全是高光，暗像素本来就碎，看起来和线头一样小。离尺寸图远的一律不碰。
*/
function despeckle(d, w, h, ch, near) {
  const dark = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) dark[i] = (d[i * ch] + d[i * ch + 1] + d[i * ch + 2]) / 3 < 235 ? 1 : 0;
  const label = new Int32Array(w * h).fill(-1);
  const sizes = [];
  const stack = [];
  for (let i = 0; i < w * h; i++) {
    if (!dark[i] || label[i] >= 0) continue;
    const id = sizes.length;
    let n = 0;
    stack.push(i);
    label[i] = id;
    while (stack.length) {
      const p = stack.pop();
      n++;
      const x = p % w, y = (p - x) / w;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const q = ny * w + nx;
          if (dark[q] && label[q] < 0) { label[q] = id; stack.push(q); }
        }
      }
    }
    sizes.push(n);
  }
  const allNear = sizes.map(() => true);
  for (let i = 0; i < w * h; i++) {
    if (label[i] >= 0 && allNear[label[i]] && !near(i % w, (i - (i % w)) / w)) allNear[label[i]] = false;
  }
  const floor = Math.max(...sizes, 0) * 0.02;
  for (let i = 0; i < w * h; i++) {
    if (label[i] >= 0 && sizes[label[i]] < floor && allNear[label[i]]) d[i * ch] = d[i * ch + 1] = d[i * ch + 2] = 255;
  }
}

const count = {};
for (const [model, pg, where, withDrawing] of CELLS) {
  const P = await page(pg);
  const dir = `${OUT}/${model}`;
  mkdirSync(dir, { recursive: true });
  const k = (count[model] = (count[model] ?? -1) + 1);
  let prod, draw, blank;
  if (where.pair) {
    const C = { ...PAIR[where.pair], ...(where.draw ? { draw: where.draw } : {}) };
    /* 尺寸图压在照片区右上：它的区域内的墨迹不算照片。 */
    blank = (xf, yf) => inDrawing(C.draw, xf, yf);
    prod = ink(P, C.photo, blank);
    draw = ink(P, [C.draw[0] - 0.005, C.draw[1], C.draw[2], C.draw[4]], (xf, yf) => !inDrawing(C.draw, xf, yf));
  } else {
    const [x0, split, x1] = K_COL[where.k[0]];
    const [y0, leverBottom, y1] = K_ROW[where.k[1]];
    blank = (xf, yf) => xf > split && yf > leverBottom;
    prod = ink(P, [x0, y0, x1, y1], blank);
    draw = ink(P, [split + 0.004, leverBottom + 0.004, x1, y1]);
  }
  if (!prod) throw new Error(`${model} 第 ${k + 1} 格：没找到产品图`);
  const near = where.pair
    ? (xf, yf) => { const D = { ...PAIR[where.pair], ...(where.draw ? { draw: where.draw } : {}) }.draw; return xf >= D[0] - 0.015 && yf <= D[4] + 0.012; }
    : (xf, yf) => xf >= K_COL[where.k[0]][1] - 0.01 && yf >= K_ROW[where.k[1]][1] - 0.01;
  await save(P, prod, `${dir}/${k + 3}-finish-${"abcdefghi"[k]}.jpg`, blank, 1000, near);
  if (withDrawing) {
    if (!draw) throw new Error(`${model}: 没找到尺寸图`);
    await save(P, draw, `${dir}/2-drawing.jpg`);
  }
}
console.log(`${Object.keys(count).length} 个型号，${CELLS.length} 格`);
