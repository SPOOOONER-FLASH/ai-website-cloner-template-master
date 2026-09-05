#!/usr/bin/env node
/**
 * Places a REAL product photograph on the studio field FSB uses, and nothing else.
 *
 * ---------------------------------------------------------------------------
 * READ THE RULE BEFORE CHANGING THIS FILE
 *
 * AGENTS.md, "Never generate an imagined metal product": nothing here invents, restyles
 * or recombines a product. The pixels of the part are the client's own photograph,
 * untouched in shape. What this script supplies is the FIELD and the SHADOW — the two
 * things that are photography rather than product, and the two things FSB does
 * differently from us.
 *
 * That distinction is the whole point. The client's principal rejected generated hardware
 * on sight because a lever with invented fixing holes is a part that cannot be installed.
 * A real photograph on a better ground is still a real photograph.
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS MEASURED, AND FROM WHERE
 *
 * From FSB's own product-overview plate
 * (res.cloudinary.com/franzschneiderbrakel/…/produktfamilien_uebersicht_teaser.png,
 * fetched 2026-09-04, 1566×1044):
 *
 *   FIELD        A soft grey, not white — roughly #f2f2f3 at the upper left falling to
 *                about #e6e6e8 at the lower right. White backgrounds are what every
 *                Alibaba listing uses; the grey is most of why theirs reads as a studio.
 *   SCALE        The object spans about half the frame width and a fifth of its height.
 *                It is small. The restraint is the effect.
 *   PLACEMENT    Slightly left of centre and above it, so the shadow has room to fall.
 *   LIGHT        One source, upper left. One shadow, down and to the right, long and
 *                very soft. No fill light, no second shadow, no reflection.
 *   NOTHING ELSE No type, no model number, no certification badge, no UI. Every one of
 *                those lives in the HTML on this site already.
 *
 * ---------------------------------------------------------------------------
 * WHY THE BACKGROUND CAN BE KEYED OUT SAFELY
 *
 * Every photograph in public/images/products is a cut-out on pure white — sampled
 * 2026-09-04, corners read 255,255,255 across the set. So "near-white becomes
 * transparent" removes the backdrop and only the backdrop. The threshold is deliberately
 * tight: a satin stainless product has highlights close to white, and a loose threshold
 * eats them, which would be exactly the kind of silent deformation this rule exists to
 * prevent. Anything above the threshold that is INSIDE the object's outline is kept,
 * because the fill is flood-based from the edges rather than a global colour test.
 *
 * Usage:
 *   node scripts/compose-product-plate.mjs --slug 305-fire-door-panic-exit-device
 *   node scripts/compose-product-plate.mjs --all --limit 10 --out tmp/claude-plates
 */

import { readFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "public/images/products";
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};

/** Measured off FSB's plate. Changing these changes the house photographic grammar. */
const PLATE = {
  width: 1560,
  height: 1040,
  /** Field corners, upper-left to lower-right. */
  fieldFrom: { r: 242, g: 242, b: 243 },
  fieldTo: { r: 230, g: 230, b: 233 },
  /** Fraction of the frame the object's longest side may occupy. */
  objectSpan: 0.52,
  /** Centre of the object, as a fraction of the frame. Left of and above centre. */
  centreX: 0.47,
  centreY: 0.44,
  /*
    Softer and further than the first attempt, which sat tight under the object and read
    as a sticker. FSB's shadow is long, very diffuse and barely there — it says where the
    light is without competing with the part.
  */
  shadow: { dx: 26, dy: 60, blur: 55, opacity: 0.13 },
};

/** Near-white is background. Tight, so satin highlights survive — see the header. */
const WHITE_CUTOFF = 247;

/**
 * The field: a linear gradient rendered as SVG, so it is resolution-independent and the
 * two measured colours are the only numbers involved.
 */
function field(width, height) {
  const { fieldFrom: a, fieldTo: b } = PLATE;
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="rgb(${a.r},${a.g},${a.b})"/>
           <stop offset="1" stop-color="rgb(${b.r},${b.g},${b.b})"/>
         </linearGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`,
  );
}

/**
 * The product with its white backdrop removed.
 *
 * Flood-filled from the edges rather than thresholded globally: a global test would also
 * punch holes through any white area inside the object — a printed marking, a bright
 * highlight on a polished face — and those holes would show the grey field through the
 * middle of the part. Which is a deformed product, arrived at by a different route.
 */
async function cutOut(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const isPale = (i) =>
    data[i] >= WHITE_CUTOFF && data[i + 1] >= WHITE_CUTOFF && data[i + 2] >= WHITE_CUTOFF;

  const background = new Uint8Array(width * height);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (background[p]) return;
    if (!isPale(p * channels)) return;
    background[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % width;
    const y = (p - x) / width;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  /*
    DROP THE SUPPLIER'S BURNED-IN WATERMARK BEFORE MEASURING THE OBJECT.

    Several source photographs carry a Hyland logo printed into the top-left corner. It is
    foreground as far as the flood fill is concerned, so the bounding box stretched from
    the logo to the far edge of the product and the composition came out with the part
    pushed off-centre and undersized — the first run of this script produced exactly that.

    Foreground is labelled into connected components and a component is discarded when it
    is BOTH small relative to the largest AND sits entirely in the top fifth of the frame.
    Both conditions, because a small part low in the frame is a strike plate or a set of
    keys and belongs to the product; a small mark up in a corner is a logo.
  */
  const label = new Int32Array(width * height).fill(-1);
  const areas = [];
  const bounds = [];
  for (let seed = 0; seed < width * height; seed += 1) {
    if (background[seed] || label[seed] !== -1) continue;
    const id = areas.length;
    areas.push(0);
    bounds.push({ minX: width, minY: height, maxX: -1, maxY: -1 });
    const stack = [seed];
    label[seed] = id;
    while (stack.length) {
      const q = stack.pop();
      const x = q % width;
      const y = (q - x) / width;
      areas[id] += 1;
      const bb = bounds[id];
      if (x < bb.minX) bb.minX = x;
      if (x > bb.maxX) bb.maxX = x;
      if (y < bb.minY) bb.minY = y;
      if (y > bb.maxY) bb.maxY = y;
      const step = (nx, ny) => {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) return;
        const n = ny * width + nx;
        if (background[n] || label[n] !== -1) return;
        label[n] = id;
        stack.push(n);
      };
      step(x + 1, y);
      step(x - 1, y);
      step(x, y + 1);
      step(x, y - 1);
    }
  }

  const biggest = Math.max(...areas);
  const keep = areas.map(
    (area, id) => !(area < biggest * 0.06 && bounds[id].maxY < height * 0.2),
  );

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let p = 0; p < width * height; p += 1) {
    if (background[p] || !keep[label[p]]) {
      data[p * channels + 3] = 0;
      continue;
    }
    const x = p % width;
    const y = (p - x) / width;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  if (maxX < 0) throw new Error("the whole frame keyed out as background");

  /*
    IS THIS ACTUALLY A CUT-OUT?

    The first run of this script sorted candidates by file size and produced a plate
    showing a photograph of parts lying on a wooden desk, pasted onto the grey field with
    a rectangular shadow. The largest files in the set are the supplier's raw shots —
    on a desk, on a floor, on a pallet — not the studio cut-outs, so the size heuristic
    selected precisely the wrong images.

    The flood fill cannot fail loudly on those: an image with no white border simply keeps
    every pixel and reports success. So the check has to be here. A genuine cut-out gives
    up a large share of its frame as background; a photograph of a desk gives up almost
    none. Below the floor this refuses rather than composing something that will be
    obvious to a buyer and invisible to whoever ran the script.
  */
  const removed = background.reduce((n, v) => n + v, 0) / (width * height);
  if (removed < 0.2) {
    throw new Error(
      `not a cut-out — only ${(removed * 100).toFixed(0)}% of the frame is white background`,
    );
  }

  const cut = await sharp(data, { raw: { width, height, channels } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer();

  return { buffer: cut, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function compose(file, out) {
  const object = await cutOut(file);

  const scale = (PLATE.width * PLATE.objectSpan) / Math.max(object.width, object.height);
  const w = Math.round(object.width * scale);
  const h = Math.round(object.height * scale);
  const resized = await sharp(object.buffer).resize(w, h).png().toBuffer();

  const left = Math.round(PLATE.width * PLATE.centreX - w / 2);
  const top = Math.round(PLATE.height * PLATE.centreY - h / 2);

  /*
    The shadow is the object's own silhouette, blurred and tinted — not an ellipse under
    it. A drawn ellipse is the tell that separates a composite from a photograph, because
    the shadow stops agreeing with the shape that cast it.
  */
  const silhouette = await sharp(resized)
    .ensureAlpha()
    .composite([{ input: { create: { width: w, height: h, channels: 4, background: { r: 40, g: 40, b: 45, alpha: 1 } } }, blend: "in" }])
    .blur(PLATE.shadow.blur)
    .png()
    .toBuffer();

  await sharp(field(PLATE.width, PLATE.height))
    .composite([
      {
        input: await sharp(silhouette)
          .ensureAlpha()
          .composite([
            {
              input: {
                create: {
                  width: w,
                  height: h,
                  channels: 4,
                  background: { r: 255, g: 255, b: 255, alpha: PLATE.shadow.opacity },
                },
              },
              blend: "dest-in",
            },
          ])
          .png()
          .toBuffer(),
        left: left + PLATE.shadow.dx,
        top: top + PLATE.shadow.dy,
      },
      { input: resized, left, top },
    ])
    .webp({ quality: 90 })
    .toFile(out);

  return out;
}

/* ------------------------------------------------------------------------ run */

const outDir = flag("out", "tmp/claude-plates");
mkdirSync(outDir, { recursive: true });

let files = [];
const slug = flag("slug");
if (slug) {
  files = [`${slug}.webp`];
} else {
  const limit = Number(flag("limit", 10));
  /*
    Hero images only, and shuffled deterministically rather than sorted by size.

    Sorting by size selected the supplier's raw desk shots — see the guard in cutOut.
    Heroes (no -2, -3 … suffix) are the frames that went through the studio, so they are
    the population that can actually be composited. The guard still refuses any that slip
    through, which is the part that has to hold; this only stops the run wasting its
    attempts.
  */
  files = readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith(".webp") && !/-d+.webp$/.test(f) && !f.includes("-video"))
    .sort()
    .filter((_, i) => i % 7 === 0)
    .slice(0, limit);
}

console.log(`composing ${files.length} plate(s) into ${outDir}\n`);
for (const file of files) {
  const src = join(SOURCE_DIR, file);
  if (!existsSync(src)) {
    console.log(`  skip ${file} — not found`);
    continue;
  }
  try {
    const out = join(outDir, file.replace(/\.webp$/, "-plate.webp"));
    await compose(src, out);
    console.log(`  ${file}`);
  } catch (error) {
    console.log(`  FAILED ${file}: ${String(error).slice(0, 90)}`);
  }
}
console.log(`\nEvery pixel of every product above is the client's own photograph.`);
