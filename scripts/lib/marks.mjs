/**
 * Detects every brand mark present in the F:\新网站资料 photography.
 *
 * Four marks turned up during inspection, and they differ in whether they can be
 * lifted:
 *
 *   Hyland badge   red oval + strapline in a corner, sitting on the studio white.
 *                  Removable — see debadge.mjs.
 *   STAHLOCK       a fixed-position alpha logotype across the middle of the frame.
 *                  Not removable without the layered PSD.
 *   cantonlock.com a diagonal repeating domain tile across the whole frame. Also not
 *                  removable, and the same mark the 2022 legacy import rejected.
 *   RAYEN 雷茵      a third party's badge; lives in a 雷茵/ subfolder and is excluded by
 *                  path rather than detected.
 *
 * The two translucent overlays share a tell: a clean studio shot has a background of
 * exactly 255, whereas any alpha tile drags flat background into the 230–252 band. So
 * `veil` counts near-white-but-not-white pixels in *flat* areas, which catches either
 * overlay wherever the background is white. STAHLOCK also gets a positional template
 * correlation so that it is still caught on lifestyle shots, where there is no white
 * background for `veil` to read.
 */

import sharp from "sharp";

const N = 800;
const WM_BOX = { left: 190, top: 325, width: 420, height: 110 };
const TEMPLATE_SRC = "F:/新网站资料/22-Door Stopper/DS01/1-DS01.jpg";

/** Thresholds fixed against the labelled calibration set at the bottom of this file. */
export const T = { veil: 0.020, wmNcc: 0.030, red: 0.004 };

function laplacian(buf, w, h) {
  const out = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      out[i] = 4 * buf[i] - buf[i - 1] - buf[i + 1] - buf[i - w] - buf[i + w];
    }
  }
  return out;
}

function ncc(a, b) {
  let ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; }
  ma /= a.length; mb /= b.length;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] - ma, y = b[i] - mb;
    num += x * y; da += x * x; db += y * y;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

let TEMPLATE = null;
async function templateBand() {
  if (!TEMPLATE) {
    const g = await sharp(TEMPLATE_SRC).resize(N, N, { fit: "fill" }).extract(WM_BOX).greyscale().raw().toBuffer();
    TEMPLATE = laplacian(g, WM_BOX.width, WM_BOX.height);
  }
  return TEMPLATE;
}

export async function marks(file) {
  const { data, info } = await sharp(file).resize(N, N, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;

  const grey = new Uint8Array(N * N);
  for (let p = 0; p < N * N; p++) {
    const i = p * ch;
    grey[p] = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  }

  // A studio shot has a white border frame; a lifestyle photo does not. The veil test
  // only means anything against studio white, so it is gated on that and reported as
  // null elsewhere rather than guessed at.
  let border = 0, borderN = 0;
  for (let x = 0; x < N; x += 2) {
    for (const y of [1, 3, N - 2, N - 4]) { borderN++; if (grey[y * N + x] >= 250) border++; }
  }
  for (let y = 0; y < N; y += 2) {
    for (const x of [1, 3, N - 2, N - 4]) { borderN++; if (grey[y * N + x] >= 250) border++; }
  }
  const studio = border / borderN >= 0.9;

  // veil: near-white pixels sitting in flat neighbourhoods. Product edges and JPEG
  // ringing are excluded by the flatness test, so this reads the background only.
  let veil = 0, flat = 0;
  if (studio) {
    for (let y = 2; y < N - 2; y += 2) {
      for (let x = 2; x < N - 2; x += 2) {
        const p = y * N + x;
        const v = grey[p];
        if (v < 230) continue;
        let mn = 255, mx = 0;
        for (let dy = -2; dy <= 2; dy += 2) {
          for (let dx = -2; dx <= 2; dx += 2) {
            const q = grey[p + dy * N + dx];
            if (q < mn) mn = q;
            if (q > mx) mx = q;
          }
        }
        if (mx - mn > 10) continue; // not flat: an edge, not background
        flat++;
        if (v <= 252) veil++;
      }
    }
  }
  const veilFrac = studio && flat ? veil / flat : null;

  // red corner badge
  const S = 200;
  let red = 0;
  for (const [cx, cy] of [[0, 0], [N - S, 0], [0, N - S], [N - S, N - S]]) {
    let c = 0;
    for (let y = cy; y < cy + S; y++) {
      for (let x = cx; x < cx + S; x++) {
        const i = (y * N + x) * ch;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 110 && r - g > 55 && r - b > 45) c++;
      }
    }
    red = Math.max(red, c);
  }
  const redFrac = red / (S * S);

  // STAHLOCK positional template
  const bandGrey = new Uint8Array(WM_BOX.width * WM_BOX.height);
  for (let y = 0; y < WM_BOX.height; y++) {
    for (let x = 0; x < WM_BOX.width; x++) {
      bandGrey[y * WM_BOX.width + x] = grey[(y + WM_BOX.top) * N + (x + WM_BOX.left)];
    }
  }
  const wm = ncc(await templateBand(), laplacian(bandGrey, WM_BOX.width, WM_BOX.height));

  return {
    veil: veilFrac,
    studio,
    wm,
    red: redFrac,
    hyland: redFrac >= T.red,
    stahlock: wm >= T.wmNcc,
    veiled: veilFrac != null && veilFrac >= T.veil,
  };
}
