#!/usr/bin/env node
/**
 * Cuts a real product out of its white catalogue backdrop, and refuses to do anything else.
 *
 * ---------------------------------------------------------------------------
 * THIS FILE IS THE ENFORCEMENT POINT FOR ONE RULE
 *
 * AGENTS.md, "Never generate an imagined metal product": the pixels of the part are the
 * client's own photograph and are never redrawn, restyled or recombined. Every composer
 * in this repo goes through this function, so the guard below only has to hold in one
 * place. Do not copy it into a second file — a duplicated guard is a guard that drifts,
 * and the copy that drifts is the one that ships an unusable part.
 *
 * What callers are allowed to add around the result: a field, a shadow, and a layout.
 * Those are photography. Nothing else.
 */

import sharp from "sharp";

/** Near-white is background. Tight, so satin highlights survive — see the header. */
const WHITE_CUTOFF = 247;


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

    Foreground is labelled into connected components below, and the test for which of
    those components is a watermark is stated where that test lives.
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

  /*
    WHICH COMPONENTS ARE THE SUPPLIER'S WATERMARK AND WHICH ARE THE PRODUCT.

    First attempt was "small AND high in the frame", at 6% of the largest component. It
    leaked: on 001-panic-exit-device the burned-in Hyland oval is fatter than the narrow
    pull handle it sits beside, so it cleared the 6% bar and rode into the composite as a
    logo floating in mid-air.

    Raising the size threshold alone would start eating real parts — a strike plate is
    also small and can also sit high. The property that actually separates the two is
    ISOLATION: a component that belongs to the product is near the product's main mass,
    because it was laid out on the same bench. A watermark is off on its own in a corner.
    So all three must hold before anything is discarded, and the third is the one doing
    the work.
  */
  const biggest = Math.max(...areas);
  const main = bounds[areas.indexOf(biggest)];
  const near = (b) => {
    const gapX = Math.max(main.minX - b.maxX, b.minX - main.maxX, 0);
    const gapY = Math.max(main.minY - b.maxY, b.minY - main.maxY, 0);
    return Math.hypot(gapX, gapY) < Math.max(width, height) * 0.06;
  };
  const keep = areas.map(
    (area, id) =>
      !(area < biggest * 0.25 && bounds[id].maxY < height * 0.2 && !near(bounds[id])),
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

export { cutOut, WHITE_CUTOFF };
