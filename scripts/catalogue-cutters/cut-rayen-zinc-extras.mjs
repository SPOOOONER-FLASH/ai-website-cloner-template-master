/*
 * 锌合金分体门锁系列 (《雷茵五金》p33–p52) — the parts cut-rayen-catalogue.mjs cannot do.
 *
 * Run cut-rayen-catalogue.mjs first, from the same working folder, with the 31 standard
 * panels in panels.json. This script then finishes the job in four places where the book
 * leaves its own layout, each for a reason written next to it:
 *
 *   1. Two panels carry TWO models (p35, p47): one lever on a square rose (A9-) and on a round
 *      rose (A5-). The panel's hero and dimension drawing show only the square one, so the
 *      round model gets its three finish shots and nothing else — a square-rose drawing on a
 *      round-rose product page is how a buyer orders the wrong escutcheon.
 *   2. A40-2205 / A40-2206 are rose-less levers photographed side-on; their finish renders are
 *      about 30px tall on the page and fall under the main cutter's height floor.
 *   3. p33–p39 face a full-page installed photograph with 「RAYEN 雷茵」 printed top-right.
 *      Cropped as a bottom-anchored square — every one stands the lever at the bottom of the
 *      frame — which also keeps the printed Chinese out, because Chinese baked into a picture
 *      is Chinese the English site cannot translate.
 *   4. p52 is a grid of twelve cards (six models × two finishes), each card its own hero,
 *      escutcheon, drawing and caption. No spec block is printed there, so no lock case and
 *      no door thickness are recorded for those six.
 *
 * Usage (from the working folder that holds out/):
 *   node <repo>/scripts/catalogue-cutters/cut-rayen-zinc-extras.mjs "<雷茵五金.pdf 的完整路径>"
 */
import { existsSync, mkdirSync, readFileSync, renameSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

const SRC = process.argv.find((a) => /\.pdf$/i.test(a));
if (!SRC) {
  console.error("用法：node cut-rayen-zinc-extras.mjs <雷茵五金.pdf 的完整路径>（在放 out/ 的工作目录里运行）");
  process.exit(1);
}
const doc = mupdf.PDFDocument.openDocument(readFileSync(SRC), "application/pdf");

function pageBuffer(n) {
  const page = doc.loadPage(n - 1);
  let out = null;
  page.getObject().get("Resources").get("XObject").forEach((value) => {
    if (out || String(value.get("Subtype")) !== "/Image") return;
    out = Buffer.from(doc.loadImage(value).toPixmap().asPNG());
  });
  return out;
}

async function load(n) {
  const buf = pageBuffer(n);
  const img = sharp(buf);
  const { width: W, height: H } = await img.metadata();
  const { data: grey } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  return { buf, W, H, grey };
}

function inkBox(grey, W, x0, y0, x1, y1, cut = 242) {
  let minX = x1, minY = y1, maxX = x0, maxY = y0;
  for (let y = y0; y < y1; y++) {
    const row = y * W;
    for (let x = x0; x < x1; x++) {
      if (grey[row + x] < cut) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < minX ? null : { left: minX, top: minY, right: maxX, bottom: maxY };
}

function runs(grey, W, x0, y0, x1, y1, gap, axis, cut = 242) {
  const out = [];
  let start = -1, blank = 0;
  const [a0, a1, b0, b1] = axis === "y" ? [y0, y1, x0, x1] : [x0, x1, y0, y1];
  for (let a = a0; a < a1; a++) {
    let inked = false;
    for (let b = b0; b < b1 && !inked; b++) {
      const v = axis === "y" ? grey[a * W + b] : grey[b * W + a];
      if (v < cut) inked = true;
    }
    if (inked) {
      if (start < 0) start = a;
      blank = 0;
    } else if (start >= 0 && ++blank >= gap) {
      out.push([start, a - blank]);
      start = -1;
    }
  }
  if (start >= 0) out.push([start, a1 - 1]);
  return out;
}

/* Same rule as the main cutter: pad to a square, never enlarge past native resolution. */
async function write({ buf, W, H }, box, path, size = 1400) {
  const w = box.right - box.left + 1, h = box.bottom - box.top + 1;
  const pad = Math.round(Math.max(w, h) * 0.04);
  const left = Math.max(0, box.left - pad), top = Math.max(0, box.top - pad);
  const side = Math.min(size, Math.max(w, h) + pad * 2);
  await sharp(buf)
    .extract({ left, top, width: Math.min(w + pad * 2, W - left), height: Math.min(h + pad * 2, H - top) })
    .flatten({ background: "#ffffff" })
    .resize(side, side, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 90 })
    .toFile(path);
}

const dirOf = (m) => {
  const d = `out/${m}`;
  mkdirSync(d, { recursive: true });
  return d;
};

/* ---- 1. split the two square/round pairs ---------------------------------------------- */
for (const [square, round] of [["A9-2009", "A5-2009"], ["A9-653", "A5-653"]]) {
  const from = dirOf(square), to = dirOf(round);
  /* The book prints the square rose's three finishes in the top row and the round rose's in
     the bottom row; the main cutter numbered them a–f in reading order. */
  const moves = [["6-finish-d", "3-finish-a"], ["7-finish-e", "4-finish-b"], ["8-finish-f", "5-finish-c"]];
  for (const [a, b] of moves) {
    if (existsSync(`${from}/${a}.jpg`)) renameSync(`${from}/${a}.jpg`, `${to}/${b}.jpg`);
  }
  console.log(`${round}: 3 finishes split off ${square} (no hero, no drawing — the panel draws the square rose only)`);
}

/* ---- 2. A40-2205 / A40-2206 finish shots ----------------------------------------------- */
for (const [model, page] of [["A40-2205", 38], ["A40-2206", 39]]) {
  const pg = await load(page);
  const { W, H, grey } = pg;
  const x0 = Math.round(W * 0.04), x1 = Math.round(W * 0.45);
  /* The one finish row sits between the Finishes rule and the spec block. Its renders are
     thin, so look for the first ink row under the rule that is taller than a line of type. */
  const rows = runs(grey, W, x0, Math.round(H * 0.5), x1, Math.round(H * 0.62), Math.round(H * 0.006), "y")
    .filter(([a, b]) => b - a > H * 0.006);
  const [ry0, ry1] = rows[0];
  const cellW = (x1 - x0) / 3;
  let k = 0;
  for (let c = 0; c < 3; c++) {
    const cx0 = Math.round(x0 + c * cellW), cx1 = Math.round(x0 + (c + 1) * cellW) - 2;
    const box = inkBox(grey, W, cx0, ry0, cx1, ry1 + 1);
    if (!box) continue;
    await write(pg, box, `${dirOf(model)}/${k + 3}-finish-${"abc"[k]}.jpg`, 1000);
    k += 1;
  }
  console.log(`${model}: ${k} finishes (row ${ry0}–${ry1})`);
}

/* ---- 3. installed photographs, p33–p39 ------------------------------------------------- */
const SCENES = [
  ["A5-2012", 33], ["A5-2014", 34], ["A9-2009", 35], ["A39-2010", 36],
  /* p37's photograph props the levers against a shelf of magazines, and the spines carry
     their titles — KINFOLK among them, a real publication. Another firm's name has no place
     on a RAYEN product page, so this one is cut from the bottom-LEFT and stops short of the
     shelf. Checked by eye; the other six carry no lettering in the kept square. */
  ["A5-2011", 37, { keep: 0.66 }], ["A40-2205", 38], ["A40-2206", 39],
];
for (const [model, page, opt = {}] of SCENES) {
  const pg = await load(page);
  const { W, H, grey } = pg;
  /* The photograph is the big block of ink in the right half; find it rather than type it. */
  const box = inkBox(grey, W, Math.round(W * 0.52), Math.round(H * 0.04), Math.round(W * 0.97), Math.round(H * 0.97), 235);
  const side = Math.round(Math.min(box.right - box.left + 1, box.bottom - box.top + 1) * (opt.keep ?? 1));
  await sharp(pg.buf)
    .extract({ left: box.left, top: box.bottom + 1 - side, width: side, height: side })
    .resize(Math.min(1400, side), Math.min(1400, side))
    .jpeg({ quality: 88 })
    .toFile(`${dirOf(model)}/9-scene.jpg`);
  console.log(`${model}: scene ${side}px square from the bottom of p${page}`);
}

/* ---- 4. p52 card grid ----------------------------------------------------------------- */
{
  const pg = await load(52);
  const { W, H, grey } = pg;
  const COLS = [[0.03, 0.265], [0.265, 0.5], [0.5, 0.735], [0.735, 0.97]];
  const ROWS = [[0.1, 0.416], [0.416, 0.68], [0.68, 0.98]];
  /* [row][pair] → model; each model takes the two cards side by side. */
  const MODELS = [["KA29-9769", "A5-559"], ["KA82-9910", "A5-928"], ["KA9-9905", "A9-921"]];
  for (let r = 0; r < 3; r++) {
    for (let pair = 0; pair < 2; pair++) {
      const model = MODELS[r][pair];
      const dir = dirOf(model);
      for (let c = 0; c < 2; c++) {
        const [fx0, fx1] = COLS[pair * 2 + c];
        const x0 = Math.round(W * fx0), x1 = Math.round(W * fx1);
        const y0 = Math.round(H * ROWS[r][0]) + 8, y1 = Math.round(H * ROWS[r][1]) - 8;
        /* Card = render / escutcheon+drawing / caption, top to bottom. The caption is type and
           stays out of every picture. */
        /* 0.6% gap: the render and the escutcheon row below it are only ~39px apart on this page. */
        const bands = runs(grey, W, x0, y0, x1, y1, Math.round(H * 0.006), "y").filter(([a, b]) => b - a > H * 0.03);
        /* > 3% of the page: drops the caption (≈60px) and, on the top row, the series title
           that sits above the first cards (≈40px) — which a 1% floor mistook for the hero. */
        const [hero, lower] = bands;
        const render = inkBox(grey, W, x0, hero[0], x1, hero[1] + 1);
        await write(pg, render, `${dir}/${3 + c}-finish-${"ab"[c]}.jpg`, 1000);
        if (c > 0) continue;
        /* Lower band: escutcheon photograph on the left, drawing on the right. */
        const cols = runs(grey, W, x0, lower[0], x1, lower[1] + 1, Math.round(W * 0.012), "x");
        /* The escutcheon photograph is the left ~40% of the card. Its column run is NOT a safe
           bound: on several cards the dimension drawing starts close enough to merge with it,
           and the hero shipped with a thumbnail of its own drawing pasted beside it. */
        /* …and a fixed fraction is not safe either: the right-hand page's cards sit further in,
           and 42% cut A5-559's and A9-921's escutcheons in half. So: split the lower band on a
           20px gap — narrower than escutcheon-to-drawing on every card, wider than anything
           inside either — and the first run is the escutcheon. */
        const lowerCols = runs(grey, W, x0, lower[0], x1, lower[1] + 1, 20, "x");
        const escRight = lowerCols[0][1] + 6;
        const esc = inkBox(grey, W, x0, lower[0], escRight, lower[1] + 1);
        /* Lever above, escutcheon below-left — the 凯撒/意式 hero layout. But the lever reaches
           right over the dimension drawing, so the bounding rectangle of the two contains the
           drawing too. Paint that quadrant white before cutting: a hero carrying a thumbnail
           of its own drawing looks like a page someone screenshotted. */
        const heroBox = {
          left: Math.min(render.left, esc.left), top: render.top,
          right: Math.max(render.right, esc.right), bottom: esc.bottom,
        };
        const blank = Buffer.from(`<svg width="${W}" height="${H}"><rect x="${escRight}" y="${lower[0] - 4}" width="${W - escRight}" height="${H - lower[0] + 4}" fill="#fff"/></svg>`);
        const masked = await sharp(pg.buf).composite([{ input: blank, left: 0, top: 0 }]).png().toBuffer();
        await write({ ...pg, buf: masked }, heroBox, `${dir}/1-hero.jpg`);
        const draw = inkBox(grey, W, escRight, lower[0], x1, lower[1] + 1);
        await write(pg, draw, `${dir}/2-drawing.jpg`);
      }
      console.log(`${model}: hero, drawing, 2 finishes (p52 card grid)`);
    }
  }
}
