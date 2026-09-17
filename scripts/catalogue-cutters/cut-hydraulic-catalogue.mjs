/*
 * Cut the hydraulic-hinge / door-stop catalogue (《雷茵-铰链和门吸》).
 *
 * Two layouts in one book:
 *   A  pp.1–24  hydraulic hinges — a coloured spec panel: table top-left, dimension
 *      drawing under it, six finish renders in a grid on the right.
 *   B  pp.25–37 door stops — a white panel: small spec block top-left, tiny drawing
 *      under it, 3–9 finish photographs in a grid on the right.
 *
 * Nothing with Chinese type in it is ever cut. The finish captions sit under each
 * photograph and are dropped by taking only the upper blob of each grid cell; the
 * 叶片36宽 / 叶片30宽 captions over the RY8005/RY8006 drawings are dropped by starting
 * the drawing band below them and cutting the two leaf widths as separate pictures.
 */
import { readFileSync, mkdirSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

const SRC = "D:/xwechat_files/wxid_kslpb8pv4u1c12_ba05/msg/file/2026-09/雷茵-铰链和门吸.pdf";
const doc = mupdf.Document.openDocument(readFileSync(SRC), "application/pdf");
const PANELS = JSON.parse(readFileSync(new URL("panels-hydraulic.json", import.meta.url), "utf8"));
const OUT = "hyd";
mkdirSync(OUT, { recursive: true });

/* The panel background is a flat fill, not white: near-black on pp.3/6/17/22, cream on
   p.10, peach on p.13, white on the door-stop pages. So "ink" is anything that differs
   from the background, sampled from the gutter the layout always leaves blank between
   the spec table and the finish grid. */
function sampleBg(rgb, W, x0, y0, x1, y1) {
  const r = [], g = [], b = [];
  for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) {
    const i = (y * W + x) * 3; r.push(rgb[i]); g.push(rgb[i + 1]); b.push(rgb[i + 2]);
  }
  const mid = (a) => a.sort((p, q) => p - q)[a.length >> 1];
  return [mid(r), mid(g), mid(b)];
}

const DIST = 22;
function isInk(rgb, W, x, y, bg) {
  const i = (y * W + x) * 3;
  return Math.abs(rgb[i] - bg[0]) + Math.abs(rgb[i + 1] - bg[1]) + Math.abs(rgb[i + 2] - bg[2]) > DIST;
}

function box(rgb, W, bg, x0, y0, x1, y1) {
  let a = x1, b = y1, c = -1, d = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (isInk(rgb, W, x, y, bg)) {
    if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > d) d = y;
  }
  return c < 0 ? null : { left: a, top: b, right: c, bottom: d };
}

/* Contiguous runs of rows (or columns) that contain ink. */
function runs(has, lo, hi) {
  const out = []; let start = -1;
  for (let i = lo; i < hi; i++) {
    if (has[i]) { if (start < 0) start = i; }
    else if (start >= 0) { out.push([start, i - 1]); start = -1; }
  }
  if (start >= 0) out.push([start, hi - 1]);
  return out;
}

async function write(buf, W, H, bx, path, cap = 1400, invert = false, clip = null) {
  const w = bx.right - bx.left + 1, h = bx.bottom - bx.top + 1;
  const pad = Math.round(Math.max(w, h) * 0.05);
  const lo = clip ?? { left: 0, top: 0, right: W - 1, bottom: H - 1 };
  const left = Math.max(lo.left, bx.left - pad), top = Math.max(lo.top, bx.top - pad);
  const right = Math.min(lo.right, bx.right + pad), bottom = Math.min(lo.bottom, bx.bottom + pad);
  const side = Math.min(cap, Math.max(w, h) + pad * 2);
  const body = sharp(buf).extract({ left, top, width: right - left + 1, height: bottom - top + 1 });
  /* The hydraulic-hinge spreads print their line drawings white-on-near-black. Inverted and
     stretched they read as ordinary black-on-white engineering drawings, which is how every
     other drawing on the site reads — a drawing is line art, so polarity is all that changes.
     Photographs are never inverted.

     Two passes on purpose: sharp runs negate after resize whatever the call order, so a
     single pass would letterbox in white and then invert the letterbox to black. */
  const inner = invert
    ? await body.negate({ alpha: false }).greyscale().normalise().toBuffer()
    : await body.toBuffer();
  await sharp(inner)
    .resize(side, side, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 92 }).toFile(path);
}

const LETTERS = "abcdefghi";

for (const p of PANELS) {
  const page = doc.loadPage(p.page - 1);
  const [, , pw] = page.getBounds();
  const S = 4600 / pw;
  const pix = page.toPixmap(mupdf.Matrix.scale(S, S), mupdf.ColorSpace.DeviceRGB, false, true);
  const buf = Buffer.from(pix.asPNG());
  const img = sharp(buf);
  const { width: W, height: H } = await img.metadata();
  const { data: rgb } = await img.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });

  const px0 = Math.round(W * (p.side === "L" ? 0 : 0.5));
  const pw2 = Math.round(W * 0.5);
  const PX = (f) => Math.round(px0 + pw2 * f);
  const PY = (f) => Math.round(H * f);

  const A = p.layout === "A";
  const bg = sampleBg(rgb, W, PX(A ? 0.55 : 0.40), PY(0.30), PX(A ? 0.60 : 0.45), PY(0.40));
  const darkPanel = (bg[0] * 299 + bg[1] * 587 + bg[2] * 114) / 1000 < 100;
  /* The coloured field does not fill the page: a white paper margin runs round it. Inverting a
     crop that overlaps that margin turns the margin solid black, which is what the first pass
     printed round every RY8002/RY8005/RY8006 drawing. Measure the field and clip to it. */
  let field = null;
  if (darkPanel) {
    let t = PY(0.0), b = PY(1.0) - 1, l = px0, r = px0 + pw2 - 1;
    const mid = Math.round(px0 + pw2 * 0.5);
    while (t < b && isInk(rgb, W, mid, t, bg)) t++;
    while (b > t && isInk(rgb, W, mid, b, bg)) b--;
    const midY = Math.round((t + b) / 2);
    while (l < r && isInk(rgb, W, l, midY, bg)) l++;
    while (r > l && isInk(rgb, W, r, midY, bg)) r--;
    field = { left: l, top: t, right: r, bottom: b };
  }

  const dir = `${OUT}/${p.model}`;
  mkdirSync(dir, { recursive: true });
  const notes = [];

  /* ---- finish grid ---------------------------------------------------- */
  const gx0 = PX(A ? 0.60 : 0.42), gx1 = PX(0.995);
  const gy0 = PY(A ? 0.12 : 0.10), gy1 = PY(A ? 0.75 : 0.97);
  const rowHas = new Uint8Array(H);
  for (let y = gy0; y < gy1; y++) {
    let n = 0;
    for (let x = gx0; x < gx1; x++) if (isInk(rgb, W, x, y, bg)) { if (++n > 3) break; }
    rowHas[y] = n > 3 ? 1 : 0;
  }
  const rowRuns = runs(rowHas, gy0, gy1);
  const tallest = Math.max(...rowRuns.map(([a, b]) => b - a));
  const imageRows = rowRuns.filter(([a, b]) => b - a >= tallest * 0.45);

  let k = 0;
  for (const [ry0, ry1] of imageRows) {
    /* The last row of a door-stop grid can hold three photographs instead of two, and it
       starts further left than the rows above it — 275's 黄古铜 sits at panel x 0.27 and was
       missed entirely by a band that began at 0.42. Below half-page height nothing but the
       grid is left on these panels (the spec block ends at 0.33, the drawing at 0.45), so the
       scan can safely widen there. */
    const cxLo = !A && ry0 > PY(0.50) ? PX(0.05) : gx0;
    const colHas = new Uint8Array(W);
    for (let x = cxLo; x < gx1; x++) {
      let n = 0;
      for (let y = ry0; y <= ry1; y++) if (isInk(rgb, W, x, y, bg)) { if (++n > 2) break; }
      colHas[x] = n > 2 ? 1 : 0;
    }
    for (const [cx0, cx1] of runs(colHas, cxLo, gx1)) {
      if (cx1 - cx0 < pw2 * 0.03) continue;           /* stray speck, not a product */
      const bx = box(rgb, W, bg, cx0, ry0, cx1 + 1, ry1 + 1);
      if (!bx) continue;
      /* No separate hero file: the ingest makes the first non-drawing image the thumbnail,
         and that is finish-a. Writing a copy of it as `1-hero.jpg` would publish the same
         photograph twice — once as the card and again as gallery item three. */
      await write(buf, W, H, bx, `${dir}/3-finish-${LETTERS[k]}.jpg`);
      k++;
    }
  }
  notes.push(`${k} finish`);

  /* ---- dimension drawing ---------------------------------------------- */
  const [dTop, dBot] = p.draw;
  const cols = p.drawCols ?? [[0.03, A ? 0.58 : 0.45]];
  cols.forEach(() => {});
  for (const [i, [cx0f, cx1f]] of cols.entries()) {
    const bandTop = PY(dTop), bandBot = PY(dBot);
    const bx = box(rgb, W, bg, PX(cx0f), bandTop, PX(cx1f), bandBot);
    if (!bx) { notes.push(`图纸 ${i + 1} 没找到`); continue; }
    /* If the ink reaches the top row of the band, something above the drawing — a table
       rule, the finish legend, a Chinese caption — has been pulled in with it. */
    if (bx.top <= bandTop + 2) notes.push(`⚠ 图纸 ${i + 1} 顶到了带子上沿，band 要下移`);
    if (bx.bottom >= bandBot - 2) notes.push(`⚠ 图纸 ${i + 1} 顶到了带子下沿，band 要下延`);
    const name = cols.length > 1 ? `2-drawing-${i + 1}.jpg` : "2-drawing.jpg";
    await write(buf, W, H, bx, `${dir}/${name}`, 1400, darkPanel, field);
  }

  /* ---- installed photograph -------------------------------------------
     The door-stop spreads put a full-bleed installed shot on the facing page. It is
     portrait and the gallery frame is square, so the window is the page width anchored to
     the BOTTOM of the page: every one of these photographs stands the product on the floor
     or the skirting, and the top third is empty wall. Checked against all twelve.
     273's page is the exception — it carries 「门缝不低于5mm／门缝不大于15mm」 in the lower
     left, and Chinese baked into a picture is Chinese the English site cannot translate. */
  if (p.scene) {
    const side = pw2;
    await sharp(buf)
      .extract({ left: p.side === "R" ? px0 - pw2 : px0, top: H - side, width: side, height: side })
      .resize(1400, 1400, { fit: "cover" })
      .jpeg({ quality: 88 }).toFile(`${dir}/4-scene.jpg`);
    notes.push("实景图");
  }

  console.log(`${p.model.padEnd(7)} ${notes.join("；")}`);
}
