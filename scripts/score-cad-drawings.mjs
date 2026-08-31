/**
 * Ranks product images by how much they look like a DIMENSION DRAWING rather than a photo.
 *
 * find-cad-drawings.mjs shortlists on the paper (mostly white, no mid-grey). That is tuned
 * for recall and roughly two in three survivors are still studio photographs, so somebody
 * has to open 248 images to find 20. This narrows that.
 *
 * The three failed attempts on record all measured the INK — how black it is, how long the
 * runs are, how little mid-grey there is. What separates the two classes is not the ink but
 * how ISOLATED it is.
 *
 *   A photograph of a lock is a filled object. Almost every dark pixel is surrounded by
 *   more dark pixels, because it is the inside of something.
 *   A drawing is thin strokes and small digits on paper. Almost every dark pixel has paper
 *   on most sides of it.
 *
 * So the signal — speckle — is the share of dark pixels whose 8-neighbourhood is mostly
 * light. It does not care whether the ink is pure black (the test that missed every fine
 * drawing) or anti-aliased grey, and it does not care how bright the background is (the
 * test that let every studio photograph through).
 *
 * Two supporting figures, both cheap, used only to break ties:
 *   fill — darkPixels / area(their bounding box). A photographed object fills its box; a
 *          drawing reaches the same corners with a fraction of the pixels.
 *   ink  — a drawing spends very little of the page on ink at all.
 *
 * STILL A RANKING, NOT A VERDICT. Open the top of the list and read the numbers off the
 * drawing itself. Never write a dimension this script implied.
 *
 *   node scripts/score-cad-drawings.mjs               # rank every product image
 *   node scripts/score-cad-drawings.mjs --top=40      # just the most promising
 *   node scripts/score-cad-drawings.mjs --json=<path> # machine-readable, for a worklist
 */
import sharp from "sharp";
import { readdirSync, writeFileSync } from "node:fs";

const DIR = "public/images/products";
const SIZE = 200;
const DARK = 170; // ink, anti-aliased grey included — not "pure black", which missed fine lines

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

async function score(file) {
  const { data, info } = await sharp(`${DIR}/${file}`)
    .greyscale()
    .resize(SIZE, SIZE, { fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  let dark = 0;
  let minX = w;
  let maxX = -1;
  let minY = h;
  let maxY = -1;
  let speckle = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[y * w + x] >= DARK) continue;
      dark += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      // A dark pixel surrounded mostly by paper is a stroke of text or a dimension line,
      // not the interior of a photographed object.
      let light = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (data[ny * w + nx] >= DARK) light += 1;
        }
      if (light >= 6) speckle += 1;
    }
  }

  if (!dark) return null;
  const box = (maxX - minX + 1) * (maxY - minY + 1);
  return {
    file,
    fill: dark / box,
    ink: dark / (w * h),
    speckle: speckle / dark,
  };
}

const rows = [];
for (const f of readdirSync(DIR).filter((f) => /\.(webp|png|jpe?g)$/i.test(f))) {
  try {
    const s = await score(f);
    if (s) rows.push(s);
  } catch {
    // An unreadable image is not a drawing we can read either; skip it rather than stop.
  }
}

/*
  Measured against the 19 drawings already read by hand and six confirmed photographs,
  SPECKLE is the separator, not fill: every known drawing scores 0.53-0.99 and every known
  photograph 0.01-0.17, with nothing in between. Fill and ink only break ties. One known
  drawing (lc9045) sits with the photographs — it is a dark render with two figures printed
  on it, so a low rank here is not proof of a photograph.
*/
for (const r of rows) {
  r.score = Math.min(r.speckle / 0.6, 1) * 0.7 + (1 - Math.min(r.fill / 0.4, 1)) * 0.2 + (1 - Math.min(r.ink / 0.25, 1)) * 0.1;
}
rows.sort((a, b) => b.score - a.score);

const top = Number(arg("top", rows.length));
const jsonPath = arg("json", null);
if (jsonPath) writeFileSync(jsonPath, `${JSON.stringify(rows.slice(0, top), null, 2)}\n`);

console.log("score  fill   ink    speckle  file");
for (const r of rows.slice(0, top)) {
  console.log(
    `${r.score.toFixed(3)}  ${r.fill.toFixed(3)}  ${r.ink.toFixed(3)}  ${r.speckle.toFixed(3)}    ${r.file}`,
  );
}
console.log(`\n${rows.length} images ranked. Open the top of the list; the score is a hint, not a verdict.`);
