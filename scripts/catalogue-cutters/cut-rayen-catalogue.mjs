/*
 * Cut the Italian Series artwork out of the press catalogue.
 *
 * The press PDF is one flattened 5031×3437 image per page, so nothing can be pulled out as
 * an embedded asset — every picture has to be found. The layout is regular (hero above a
 * "Finishes" rule, a 3-up grid of finish shots, a drawing block bottom-left), so each region
 * is located by ink rather than by typed coordinates: threshold, take the bounding box, pad,
 * square. Typed coordinates would need 84 pages of them and would go stale the first time
 * the client re-exports the book.
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import * as mupdf from "mupdf";
import sharp from "sharp";

const SRC = "D:/xwechat_files/wxid_kslpb8pv4u1c12_ba05/msg/file/2026-09/雷茵五金.pdf";
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

/** Bounding box of ink inside a window of a raw greyscale buffer. */
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

/** Row runs of ink inside a window, as [startY, endY] pairs, gaps of `gap` px or more split. */
/** Column runs of ink inside a window, as [startX, endX] pairs. */
function colRuns(grey, W, x0, y0, x1, y1, gap, cut = 242) {
  const runs = [];
  let start = -1, blank = 0;
  for (let x = x0; x < x1; x++) {
    let inked = false;
    for (let y = y0; y < y1; y++) if (grey[y * W + x] < cut) { inked = true; break; }
    if (inked) {
      if (start < 0) start = x;
      blank = 0;
    } else if (start >= 0 && ++blank >= gap) {
      runs.push([start, x - blank]);
      start = -1;
    }
  }
  if (start >= 0) runs.push([start, x1 - 1]);
  return runs;
}

function rowRuns(grey, W, x0, y0, x1, y1, gap, cut = 242) {
  const runs = [];
  let start = -1, blank = 0;
  for (let y = y0; y < y1; y++) {
    const row = y * W;
    let inked = false;
    for (let x = x0; x < x1; x++) if (grey[row + x] < cut) { inked = true; break; }
    if (inked) {
      if (start < 0) start = y;
      blank = 0;
    } else if (start >= 0 && ++blank >= gap) {
      runs.push([start, y - blank]);
      start = -1;
    }
  }
  if (start >= 0) runs.push([start, y1 - 1]);
  return runs;
}

/**
 * Square crop around a box, written as JPEG at NO MORE than its own resolution.
 *
 * `size` is a ceiling, not a target. The press PDF is one flattened 5031 × 3437 raster per
 * page and there is nothing sharper inside it, so a finish shot is 458 × 133 real pixels and
 * a hero about 1121 × 855. The first version passed those through `resize(1000, 1000)`, which
 * ENLARGES — the finish shots shipped at 2.2× their own resolution, were then re-encoded to
 * webp, stamped, and re-encoded again, and looked exactly as soft as that sounds. The client
 * asked why. Publishing at native size does not make them sharp; it stops them being blurred.
 * Sharp finish shots need 凯丽's original renders, which are not in this book.
 *
 * The square is made by PADDING, never by widening the sampled region. Growing the extract
 * to a square first is the obvious way to do it and it is wrong here: a finish shot is about
 * 600 × 130, so squaring it reaches 340px below the render and swallows the 型号 and
 * 「表面处理：哑黑」 captions printed underneath. Those captions are Chinese type baked into
 * a picture, which would then appear on the English site — the same defect delocalize-drawings
 * exists to undo. So: extract the ink, pad with white.
 */
async function write(buf, W, H, box, path, size = 1400) {
  const w = box.right - box.left + 1, h = box.bottom - box.top + 1;
  const pad = Math.round(Math.max(w, h) * 0.04);
  const left = Math.max(0, box.left - pad), top = Math.max(0, box.top - pad);
  const side = Math.min(size, Math.max(w, h) + pad * 2);
  await sharp(buf)
    .extract({
      left, top,
      width: Math.min(w + pad * 2, W - left),
      height: Math.min(h + pad * 2, H - top),
    })
    .flatten({ background: "#ffffff" })
    .resize(side, side, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 90 })
    .toFile(path);
}

/* model, page, side, and how many finish shots the panel carries. */
const PANELS = JSON.parse(readFileSync("panels.json", "utf8"));

for (const p of PANELS) {
  const buf = pageBuffer(p.page);
  const img = sharp(buf);
  const { width: W, height: H } = await img.metadata();
  const { data: grey } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  const x0 = Math.round(W * (p.side === "L" ? 0.04 : 0.53));
  const x1 = Math.round(W * (p.side === "L" ? 0.45 : 0.945));
  const dir = `out/${p.model}`;
  mkdirSync(dir, { recursive: true });

  /*
   * 1 — hero: the big render between the series title and the "Finishes" rule.
   *
   * `heroBand` / `specBand` in panels.json override the search windows for the one page that
   * does not follow the layout: KA5-2007 (图册 p14) puts its spec block to the RIGHT of the
   * escutcheon, above the Finishes rule, instead of underneath the grid. Detection found no
   * spec block there and the hero crop swallowed it — publishing a product photograph with
   * 材质:锌合金 printed inside it, which is the Chinese-baked-into-a-picture problem again.
   * One page out of thirty-two earns two numbers and this note rather than a cleverer rule.
   */
  const [heroTop, heroBottom] = p.heroBand ?? [0.13, 0.43];
  const hero = inkBox(grey, W, x0, Math.round(H * heroTop), x1, Math.round(H * heroBottom));
  if (hero) await write(buf, W, H, hero, `${dir}/1-hero.jpg`);

  /*
   * 2 — finish shots, and 3 — the dimension drawing, both located by finding the rows of ink
   * under the "Finishes" rule rather than by fixed coordinates.
   *
   * The panel layout is not fixed: KA82-9902 carries three finishes in one row, KA5-2007
   * carries nine in three, and every extra row pushes the spec block further down the page.
   * A typed y-band found the spec block on the first and missed it entirely on the second.
   * So: split the lower half into rows of ink; the LAST row is always the spec block, and
   * everything above it is the finish grid.
   */
  const rows = rowRuns(grey, W, x0, Math.round(H * (p.gridTop ?? 0.455)), x1, Math.round(H * 0.98), Math.round(H * 0.018))
    /* 0.03 of the page, not 0.02: the "Finishes" rule and its label are their own band,
       about 0.02 tall, and they are type — so they scored as low-density and were picked
       as the spec block, which left the real one in the grid to be cut as finish shots. */
    .filter(([a, b]) => b - a > H * 0.03);

  /*
   * Which row is the spec block, and which are finishes.
   *
   * NOT "the last one" — KA5-2007 fills its page with nine finishes and carries no spec
   * block at all, and that rule silently ate its third row of finishes. The difference that
   * actually holds is what the ink IS: the spec block's left column is small type, a finish
   * cell is a solid render. Measured over the left 28% of the panel and divided by the row's
   * height, type comes out near 60 ink pixels per row and a render between 100 and 205 —
   * so 80 separates them with room on both sides, on all 32 panels cut so far.
   */
  const leftEdge = Math.round(x0 + (x1 - x0) * 0.28);
  const density = ([a, b]) => {
    let n = 0;
    for (let y = a; y <= b; y++) {
      const r = y * W;
      for (let x = x0; x < leftEdge; x++) if (grey[r + x] < 242) n++;
    }
    return n / Math.max(1, b - a);
  };
  /* The LOWEST-density row, not the first under the bar: "first" depends on how many finish
     rows precede it, and one stray band of type ahead of the spec block is enough to pick
     the wrong one. */
  let specAt = -1, lowest = 80;
  rows.forEach((row, i) => {
    const d = density(row);
    if (d < lowest) { lowest = d; specAt = i; }
  });
  const specRow = specAt >= 0 ? rows.splice(specAt, 1)[0] : null;

  let k = 0;
  const cellW = (x1 - x0) / 3;
  for (const [ry0, ry1] of rows) {
    for (let c = 0; c < 3; c++) {
      const cx0 = Math.round(x0 + c * cellW), cx1 = Math.round(x0 + (c + 1) * cellW) - 2;
      /* Inside a cell the first run is the render; the runs below it are the model code and
         the finish name, which belong on the page, not baked into a picture. */
      const runs = rowRuns(grey, W, cx0, ry0, cx1, ry1 + 1, Math.round(H * 0.006));
      if (!runs.length) continue;
      const [ty0, ty1] = runs[0];
      if (ty1 - ty0 < H * 0.012) continue;
      const box = inkBox(grey, W, cx0, ty0, cx1, ty1 + 1);
      if (!box || k >= 12) continue;
      await write(buf, W, H, box, `${dir}/${k + 3}-finish-${"abcdefghijkl"[k]}.jpg`, 1000);
      k += 1;
    }
  }

  /*
   * The drawing band is FOUND, not typed. Every spec block is a Chinese (or Chinese/English)
   * label column — 材质 / 选配锁体 / 适用门厚 — followed by the handle's own dimension drawing,
   * and further right the optional lock case. Profiling the columns gives those as separate
   * runs of ink, and the drawing is the second one. The two series measure differently
   * (Italian's labels end at 0.153 of the panel, 凯撒's at 0.209 because they are bilingual),
   * which is exactly why a typed constant would be wrong for one of them.
   *
   * The label column is left out because it is type, and type baked into a picture cannot be
   * translated — the English site would show Chinese. Those three values become spec rows
   * instead. The lock case drawing is left out too: it is 選配, a separate purchase, and a
   * lock body's backset printed in a lever's gallery is how somebody orders the wrong part.
   */
  /* No spec block on the page means no dimension drawing to cut. KA5-2007 is that case:
     nine finishes fill it, and its material and lock body are not printed anywhere on the
     panel. Falling back to a default y-band would have cropped a row of finish shots and
     published it as a dimension drawing. */
  const [specTop, specBottom] = p.specBand
    ? [Math.round(H * p.specBand[0]), Math.round(H * p.specBand[1])]
    : (specRow ?? [0, 0]);
  /* `specX` narrows the column search when the spec block is not where it usually is: on
     KA5-2007's page it sits in the RIGHT half of the panel, beside the escutcheon, and the
     default left-half search returned the escutcheon photograph as the "drawing". */
  const [sxa, sxb] = p.specX ?? [0, 0.5];
  const cols = (p.specBand || specRow)
    ? colRuns(
        grey, W,
        Math.round(x0 + (x1 - x0) * sxa), specTop,
        Math.round(x0 + (x1 - x0) * sxb), specBottom,
        Math.round(W * 0.006),
      )
    : [];
  const band = cols.length > 1 ? cols[1] : cols[0];
  const [bandL, bandR] = band ?? [x0, x1];
  const draw = (p.specBand || specRow) && band ? inkBox(grey, W, bandL, specTop, bandR, specBottom + 1) : null;
  if (draw) {
    const pad = Math.round((draw.right - draw.left) * 0.05);
    const left = Math.max(0, draw.left - pad), top = Math.max(0, draw.top - pad);
    await sharp(buf)
      .extract({
        left, top,
        width: Math.min(draw.right - draw.left + pad * 2, W - left),
        height: Math.min(draw.bottom - draw.top + pad * 2, H - top),
      })
      .flatten({ background: "#ffffff" })
      .resize(
        Math.min(1400, Math.max(draw.right - draw.left, draw.bottom - draw.top) + pad * 2),
        Math.min(1400, Math.max(draw.right - draw.left, draw.bottom - draw.top) + pad * 2),
        { fit: "contain", background: "#ffffff" },
      )
      .jpeg({ quality: 92 })
      .toFile(`${dir}/2-drawing.jpg`);
  }
  console.log(`${p.model}: hero${hero ? "" : " MISSING"}, ${k} finishes, drawing${draw ? "" : " MISSING"}`);
}
