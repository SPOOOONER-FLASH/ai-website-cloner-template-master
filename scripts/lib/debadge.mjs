/**
 * Removes the red "Hyland ®" corner badge from the client's product photography.
 *
 * The badge is always printed into a corner of a pure-white studio background, so it
 * can be lifted by painting that corner white again — no cloning, no inpainting, and
 * nothing of the product is touched.
 *
 * The badge is two disconnected pieces: the red oval and a line of small grey type
 * under it. So the box is seeded from the red pixels and then dilated until the margin
 * around it comes back entirely white, which absorbs the strapline and stops at the
 * studio background. That termination condition is also the safety proof — a box that
 * is surrounded by white cannot be clipping a product, because no connected shape
 * crosses its boundary. Where a product sits close enough that the box would swallow
 * it, the growth blows past MAX_SPAN and the image is reported instead of painted.
 */

import sharp from "sharp";

const WHITE = 246;      // at or above this on every channel counts as studio background
const MARGIN = 12;      // width of the band that has to come back white to stop growing
const MAX_SPAN = 0.42;  // a box wider/taller than this share of the frame is not a badge

const isRed = (r, g, b) => r > 110 && r - g > 55 && r - b > 45;

/** Extends `box` to cover every non-white pixel in the band just outside it. */
function absorbMargin(data, ch, W, H, box) {
  const lo = { x0: Math.max(0, box.x0 - MARGIN), y0: Math.max(0, box.y0 - MARGIN) };
  const hi = { x1: Math.min(W - 1, box.x1 + MARGIN), y1: Math.min(H - 1, box.y1 + MARGIN) };
  let grew = false;
  for (let y = lo.y0; y <= hi.y1; y++) {
    for (let x = lo.x0; x <= hi.x1; x++) {
      if (x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1) continue;
      const i = (y * W + x) * ch;
      if (data[i] >= WHITE && data[i + 1] >= WHITE && data[i + 2] >= WHITE) continue;
      if (x < box.x0) { box.x0 = x; grew = true; }
      if (x > box.x1) { box.x1 = x; grew = true; }
      if (y < box.y0) { box.y0 = y; grew = true; }
      if (y > box.y1) { box.y1 = y; grew = true; }
    }
  }
  return grew;
}

/**
 * @returns {{data:Buffer, info:Object, removed:boolean, reason:string, box:Object|null}}
 */
export async function debadge(file, size = null) {
  let pipe = sharp(file);
  if (size) pipe = pipe.resize(size, size, { fit: "fill" });
  const { data, info } = await pipe.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: ch } = info;

  // Only the four corner quadrants are candidates for a badge.
  const QW = Math.round(W * 0.35), QH = Math.round(H * 0.24);
  const quads = [[0, 0], [W - QW, 0], [0, H - QH], [W - QW, H - QH]];

  let seed = null;
  for (const [qx, qy] of quads) {
    let x0 = W, y0 = H, x1 = -1, y1 = -1, n = 0;
    for (let y = qy; y < qy + QH; y++) {
      for (let x = qx; x < qx + QW; x++) {
        const i = (y * W + x) * ch;
        if (!isRed(data[i], data[i + 1], data[i + 2])) continue;
        n++;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
    if (n < 60) continue;
    if (!seed || n > seed.n) seed = { n, box: { x0, y0, x1, y1 } };
  }

  if (!seed) return { data, info, removed: false, reason: "no-badge", box: null };

  const box = { ...seed.box };
  const limitW = W * MAX_SPAN, limitH = H * MAX_SPAN;
  let guard = 0;
  while (absorbMargin(data, ch, W, H, box)) {
    if (box.x1 - box.x0 > limitW || box.y1 - box.y0 > limitH) {
      return { data, info, removed: false, reason: "touches-product", box };
    }
    if (++guard > 200) return { data, info, removed: false, reason: "no-convergence", box };
  }

  for (let y = box.y0; y <= box.y1; y++) {
    for (let x = box.x0; x <= box.x1; x++) {
      const i = (y * W + x) * ch;
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
    }
  }
  return { data, info, removed: true, reason: "filled", box };
}
