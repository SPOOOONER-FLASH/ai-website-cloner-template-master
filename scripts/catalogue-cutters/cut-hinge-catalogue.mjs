/*
 * Cut the stainless-hinge catalogue into one folder per model.
 *
 * Layout, unlike 《雷茵五金》: every landscape page is a printed spread of two A4 panels,
 * and every panel carries THREE products stacked, each a row of
 *
 *     photograph   |   model code + bilingual spec block   |   dimension drawing
 *
 * There is no finish grid — a hinge ships in one finish and the block says which — so a
 * product here is two pictures, not seven. Rows and columns are found by ink rather than
 * typed, same as the lever catalogue: the printed rules between rows are hairlines and
 * would be brittle to key off.
 */
import { readFileSync, mkdirSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

/*
  Where the client's PDF is.

  Pass it as the first argument: `node <this script> "D:/.../雷茵五金.pdf"`.

  It used to be a hardcoded path into one machine's WeChat download folder, which broke
  twice over: the work moved to a second machine, and on the first one the client tidied
  the four catalogues into a 「新建文件夹」 subfolder. Neither failure is interesting and
  both cost a debugging round, so the path is an argument now. RAYEN_CATALOGUE_DIR is the
  convenience for running several cutters in a row against the same folder.
*/
const CATALOGUE = "雷茵-不锈钢铜合页.pdf";
const SRC =
  process.argv.find((a) => /\.pdf$/i.test(a)) ??
  (process.env.RAYEN_CATALOGUE_DIR
    ? `${process.env.RAYEN_CATALOGUE_DIR.replace(/[\/]+$/, "")}/${CATALOGUE}`
    : null);
if (!SRC) {
  console.error(
    `用法：node ${process.argv[1]} <${CATALOGUE} 的完整路径>
` +
      `   或：设 RAYEN_CATALOGUE_DIR 指向放这四本图册的文件夹再运行。`,
  );
  process.exit(1);
}
const doc = mupdf.Document.openDocument(readFileSync(SRC), "application/pdf");
const [first, last] = process.argv.slice(2).map(Number);

function inkBox(grey, W, x0, y0, x1, y1, cut = 242) {
  let a = x1, b = y1, c = x0, d = y0;
  for (let y = y0; y < y1; y++) {
    const r = y * W;
    for (let x = x0; x < x1; x++) {
      if (grey[r + x] < cut) { if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > d) d = y; }
    }
  }
  return c < a ? null : { left: a, top: b, right: c, bottom: d };
}

function colRuns(grey, W, x0, y0, x1, y1, gap, cut = 242) {
  const runs = []; let s = -1, blank = 0;
  for (let x = x0; x < x1; x++) {
    let inked = false;
    for (let y = y0; y < y1; y++) if (grey[y * W + x] < cut) { inked = true; break; }
    if (inked) { if (s < 0) s = x; blank = 0; }
    else if (s >= 0 && ++blank >= gap) { runs.push([s, x - blank]); s = -1; }
  }
  if (s >= 0) runs.push([s, x1 - 1]);
  return runs;
}

function rowRuns(grey, W, x0, y0, x1, y1, gap, cut = 242) {
  const runs = []; let s = -1, blank = 0;
  for (let y = y0; y < y1; y++) {
    const r = y * W; let inked = false;
    for (let x = x0; x < x1; x++) if (grey[r + x] < cut) { inked = true; break; }
    if (inked) { if (s < 0) s = y; blank = 0; }
    else if (s >= 0 && ++blank >= gap) { runs.push([s, y - blank]); s = -1; }
  }
  if (s >= 0) runs.push([s, y1 - 1]);
  return runs;
}

/** Pad to square with white — never enlarge. See cut.mjs for why the ceiling matters. */
async function write(buf, W, H, box, path, cap = 1400) {
  const w = box.right - box.left + 1, h = box.bottom - box.top + 1;
  const pad = Math.round(Math.max(w, h) * 0.05);
  const left = Math.max(0, box.left - pad), top = Math.max(0, box.top - pad);
  const side = Math.min(cap, Math.max(w, h) + pad * 2);
  await sharp(buf)
    .extract({ left, top, width: Math.min(w + pad * 2, W - left), height: Math.min(h + pad * 2, H - top) })
    .flatten({ background: "#ffffff" })
    .resize(side, side, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 90 })
    .toFile(path);
}

mkdirSync("hinges", { recursive: true });
const index = [];

for (let n = first; n <= last; n++) {
  const page = doc.loadPage(n - 1);
  const [, , pw] = page.getBounds();
  const S = 4200 / pw;
  const pix = page.toPixmap(mupdf.Matrix.scale(S, S), mupdf.ColorSpace.DeviceRGB, false, true);
  const buf = Buffer.from(pix.asPNG());
  const img = sharp(buf);
  const { width: W, height: H } = await img.metadata();
  const { data: grey } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });

  for (const [side, lo, hi] of [["L", 0.0, 0.5], ["R", 0.5, 1.0]]) {
    const px0 = Math.round(W * lo), px1 = Math.round(W * hi);
    const pw2 = px1 - px0;
    /* Product rows sit below the series header; the photo column alone is enough to find
       them and does not pick up the header's type. */
    const photoL = Math.round(px0 + pw2 * 0.05), photoR = Math.round(px0 + pw2 * 0.35);
    const rows = rowRuns(grey, W, photoL, Math.round(H * 0.1), photoR, Math.round(H * 0.97), Math.round(H * 0.02))
      .filter(([a, b]) => b - a > H * 0.06);

    rows.forEach((row, i) => {
      const id = `p${String(n).padStart(2, "0")}${side}${i + 1}`;
      const dir = `hinges/${id}`;
      mkdirSync(dir, { recursive: true });
      /*
        Three columns per row — photograph, bilingual spec block, dimension drawing — and
        they are FOUND, not typed. Measured on p2L they fall at 0.135–0.307, 0.420–0.640 and
        0.745–0.858 of the panel, and a hand-typed drawing window starting at 0.62 swallowed
        the right-hand edge of the spec text. The first run is the photograph and the last is
        the drawing; the type in between is the one column that must NOT become a picture,
        because it is Chinese set into the page and the English site could not translate it.
      */
      const cols = colRuns(grey, W, px0, row[0], px1, row[1] + 1, Math.round(W * 0.008));
      const photoCol = cols[0];
      const drawCol = cols.length > 1 ? cols[cols.length - 1] : null;
      const photo = photoCol ? inkBox(grey, W, photoCol[0], row[0], photoCol[1] + 1, row[1] + 1) : null;
      const draw = drawCol && drawCol !== photoCol
        ? inkBox(grey, W, drawCol[0], row[0], drawCol[1] + 1, row[1] + 1)
        : null;
      index.push({ id, page: n, side, row: i + 1, photo: !!photo, drawing: !!draw });
      if (photo) write(buf, W, H, photo, `${dir}/1-hero.jpg`);
      if (draw) write(buf, W, H, draw, `${dir}/2-drawing.jpg`);
    });
    console.log(`p${n}${side}: ${rows.length} 个型号`);
  }
}
