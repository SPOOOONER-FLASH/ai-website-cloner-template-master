/*
 * 按区域切图：图册每一章版式都不一样（主图 + 色样网格、一格一表面、上下两款共用规格栏、
 * 长面板配右侧图纸……），为每一章写一个切图脚本不值。这个脚本只认一份坐标配置：
 *
 *   {
 *     "pdf": "雷茵五金.pdf",           // 仅作记录；实际路径由命令行给
 *     "items": [
 *       { "model": "SA-243", "page": 65, "kind": "finish", "box": [x0,y0,x1,y1], "blank": [[...], ...] },
 *       { "model": "SA-243", "page": 65, "kind": "drawing", "keep": [[...], ...] }
 *     ]
 *   }
 *
 * 坐标一律是 1700px 宽缩略页上的像素（页面原图 5031×3437，缩略页 1700×1161）——人照着缩略页量，
 * 脚本自己换算。
 *
 *   finish  —— 产品图。box 内按墨迹收紧；blank 里的像素（尺寸图、标题、别的型号）不算、并涂白；
 *              再把「整块都落在 blank 边上、又很小」的碎墨迹涂白（线头）。离 blank 远的一律不碰：
 *              镜面锁盖的暗部本来就碎，整图清理会把它当线头删掉（2026-09-24 S-K401 踩过）。
 *   drawing —— 尺寸图。只取 keep 各矩形并集里的墨迹，并集之外的涂白（尺寸图常常不是矩形）。
 *
 * 同一型号的 finish 按出现顺序编号 3-finish-a、4-finish-b …，顺序 = 清单 finishes 的顺序；
 * drawing 一个型号最多一张，写成 2-drawing.jpg。
 *
 * 用法：node scripts/catalogue-cutters/cut-regions.mjs <配置.json> "<图册.pdf>" <输出目录>
 */
import { readFileSync, mkdirSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

const args = process.argv.slice(2);
const CONFIG = args.find((a) => /\.json$/i.test(a));
const SRC = args.find((a) => /\.pdf$/i.test(a));
const OUT = args.find((a) => a !== CONFIG && a !== SRC);
if (!CONFIG || !SRC || !OUT) {
  console.error("用法：node cut-regions.mjs <配置.json> <图册.pdf> <输出目录>");
  process.exit(1);
}
const config = JSON.parse(readFileSync(CONFIG, "utf8"));
const doc = mupdf.PDFDocument.openDocument(readFileSync(SRC), "application/pdf");
const THUMB_W = 1700;

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
  return (pages[n] = { buf, g: data, W: info.width, H: info.height, k: info.width / THUMB_W });
}
const scale = (P, r) => r.map((v) => Math.round(v * P.k));
const inAny = (rects, x, y) => rects.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d);

function inkBox(P, [x0, y0, x1, y1], accept) {
  const { g, W } = P;
  let a = x1, b = y1, c = x0, d = y0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (g[y * W + x] >= 240 || !accept(x, y)) continue;
      if (x < a) a = x;
      if (x > c) c = x;
      if (y < b) b = y;
      if (y > d) d = y;
    }
  }
  return c < a ? null : { l: a, t: b, r: c, b: d };
}

async function write(P, box, file, whiten, near, size) {
  const { buf, W, H } = P;
  const w = box.r - box.l + 1, h = box.b - box.t + 1, pad = Math.round(Math.max(w, h) * 0.05);
  const left = Math.max(0, box.l - pad), top = Math.max(0, box.t - pad);
  const ew = Math.min(w + pad * 2, W - left), eh = Math.min(h + pad * 2, H - top);
  const img = await sharp(buf).extract({ left, top, width: ew, height: eh }).flatten({ background: "#fff" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const d = img.data, ch = img.info.channels;
  for (let y = 0; y < eh; y++) {
    for (let x = 0; x < ew; x++) {
      if (!whiten(left + x, top + y)) continue;
      const i = (y * ew + x) * ch;
      d[i] = d[i + 1] = d[i + 2] = 255;
    }
  }
  if (near) despeckle(d, ew, eh, ch, (x, y) => near(left + x, top + y));
  const side = Math.min(size, Math.max(ew, eh));
  await sharp(d, { raw: img.info }).resize(side, side, { fit: "contain", background: "#fff" }).jpeg({ quality: 90 }).toFile(file);
}

/* 小于最大连通块 2%、且整块都在 near 区域内的墨迹涂白。 */
function despeckle(d, w, h, ch, near) {
  const dark = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) dark[i] = (d[i * ch] + d[i * ch + 1] + d[i * ch + 2]) / 3 < 235 ? 1 : 0;
  const label = new Int32Array(w * h).fill(-1);
  const sizes = [], allNear = [], stack = [];
  for (let i = 0; i < w * h; i++) {
    if (!dark[i] || label[i] >= 0) continue;
    const id = sizes.length;
    let n = 0, ok = true;
    stack.push(i);
    label[i] = id;
    while (stack.length) {
      const p = stack.pop();
      n++;
      const x = p % w, y = (p - x) / w;
      if (ok && !near(x, y)) ok = false;
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
    allNear.push(ok);
  }
  const floor = Math.max(0, ...sizes) * 0.02;
  for (let i = 0; i < w * h; i++) {
    const id = label[i];
    if (id >= 0 && sizes[id] < floor && allNear[id]) d[i * ch] = d[i * ch + 1] = d[i * ch + 2] = 255;
  }
}

const count = {};
for (const it of config.items) {
  const P = await page(it.page);
  const dir = `${OUT}/${it.model}`;
  mkdirSync(dir, { recursive: true });
  if (it.kind === "drawing") {
    const keep = it.keep.map((r) => scale(P, r));
    const bound = [Math.min(...keep.map((r) => r[0])), Math.min(...keep.map((r) => r[1])), Math.max(...keep.map((r) => r[2])), Math.max(...keep.map((r) => r[3]))];
    const box = inkBox(P, bound, (x, y) => inAny(keep, x, y));
    if (!box) throw new Error(`${it.model}: 尺寸图区域里没有墨迹`);
    await write(P, box, `${dir}/2-drawing.jpg`, (x, y) => !inAny(keep, x, y), null, 1400);
  } else {
    /* file：不按表面编号的照片（多色摆拍、锁舌、场景），照原名写；ingest 不会给它标表面名。 */
    const k = it.file ? -1 : (count[it.model] = (count[it.model] ?? -1) + 1);

    const blank = (it.blank ?? []).map((r) => scale(P, r));
    const m = Math.round(12 * P.k);
    const nearRects = blank.map(([a, b, c, d]) => [a - m, b - m, c + m, d + m]);
    const box = inkBox(P, scale(P, it.box), (x, y) => !inAny(blank, x, y));
    if (!box) throw new Error(`${it.model} 第 ${k + 1} 张：区域里没有墨迹`);
    await write(P, box, it.file ? `${dir}/${it.file}` : `${dir}/${k + 3}-finish-${"abcdefghi"[k]}.jpg`, (x, y) => inAny(blank, x, y), blank.length ? (x, y) => inAny(nearRects, x, y) : null, 1000);
  }
}
console.log(`${new Set(config.items.map((i) => i.model)).size} 个型号，${config.items.length} 张`);
