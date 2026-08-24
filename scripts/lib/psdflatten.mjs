/**
 * Flattens a PSD to RGB with the STAHLOCK watermark layer left out.
 *
 * The client's retouching files keep the overlay as its own layer — the one named with
 * a hash, composited at 15% opacity — sitting on top of the finished artwork. So the
 * clean picture is just the same stack rendered without that layer, which is exact,
 * rather than an estimate recovered from the flattened JPEG next to it.
 *
 * These files only use normal blending, so that is all this composites; anything else
 * is reported so it cannot be flattened wrongly in silence.
 */
import { readPsd, layerPixels } from "./psd.mjs";

/** The overlay ships as a shared asset under a fixed hash name. */
export const WATERMARK_LAYER = /^3d7a87fbe2efd9bad39f10e51879a18a$/i;

/**
 * The red "Hyland" corner badge is its own layer too, but an unnamed one — so it is
 * recognised by shape rather than by name: a small layer, parked in a corner, a good
 * part of whose opaque pixels are the badge's saturated red. All three have to hold,
 * so a red product part in frame cannot be mistaken for it.
 */
function isBadgeLayer(px, L, W, H) {
  if (L.width > W * 0.30 || L.height > H * 0.22) return false;

  // The badge is a squat oval, about 1.5:1. Red callout rules and dimension lines are
  // also small, also cornered, and far redder than the badge — the aspect test is what
  // keeps them out of here.
  const aspect = L.width / Math.max(1, L.height);
  if (aspect < 1.1 || aspect > 2.5) return false;

  const cx = L.left + L.width / 2, cy = L.top + L.height / 2;
  const inCorner = (cx < W * 0.34 || cx > W * 0.66) && (cy < H * 0.26 || cy > H * 0.74);
  if (!inCorner) return false;

  let red = 0, opaque = 0;
  for (let i = 0; i < px.width * px.height; i++) {
    if (px.rgba[i * 4 + 3] < 20) continue;
    opaque++;
    const R = px.rgba[i * 4], G = px.rgba[i * 4 + 1], B = px.rgba[i * 4 + 2];
    if (R > 110 && R - G > 55 && R - B > 45) red++;
  }
  if (opaque < 200) return false;

  // The badge mixes red wordmark, dark oval and grey strapline; anything approaching
  // solid red is a drawing annotation, not the logo.
  const share = red / opaque;
  return share >= 0.05 && share <= 0.60;
}

export function flatten(file, { dropWatermark = true, dropBadge = true } = {}) {
  const psd = readPsd(file);
  const W = psd.width, H = psd.height;
  const out = Buffer.alloc(W * H * 3, 255);

  const notes = [];
  let dropped = 0, drawn = 0, badges = 0;

  for (const L of psd.layers) {
    if (L.hidden) continue;
    if (dropWatermark && WATERMARK_LAYER.test(L.name)) { dropped++; continue; }
    if (L.width <= 0 || L.height <= 0) continue;
    if (L.blend !== "norm") { notes.push(`blend:${L.blend}@${L.name}`); continue; }

    const px = layerPixels(psd, L);
    if (!px) { notes.push(`nopixels:${L.name}`); continue; }
    if (px.unsupported) { notes.push(`compression${px.unsupported}:${L.name}`); continue; }
    if (dropBadge && isBadgeLayer(px, L, W, H)) { badges++; continue; }

    const lo = L.opacity / 255;
    for (let y = 0; y < px.height; y++) {
      const cy = L.top + y;
      if (cy < 0 || cy >= H) continue;
      for (let x = 0; x < px.width; x++) {
        const cx = L.left + x;
        if (cx < 0 || cx >= W) continue;
        const s = (y * px.width + x) * 4;
        const a = (px.rgba[s + 3] / 255) * lo;
        if (a <= 0) continue;
        const d = (cy * W + cx) * 3;
        for (let c = 0; c < 3; c++) {
          out[d + c] = Math.round(px.rgba[s + c] * a + out[d + c] * (1 - a));
        }
      }
    }
    drawn++;
  }

  return { data: out, width: W, height: H, dropped, badges, drawn, notes, layers: psd.layers };
}
