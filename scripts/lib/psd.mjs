/**
 * Minimal PSD layer reader — enough to pull one layer's pixels out of the client's
 * retouching files.
 *
 * The point of this is the watermark. Every PSD on the drive carries a layer named
 * `3d7a87fbe2efd9bad39f10e51879a18a` on top of the artwork, which is the STAHLOCK
 * overlay dropped in as a shared asset. The layer underneath it is the unmarked
 * original, so the marked JPEGs next to these files can be replaced with a clean render
 * rather than trying to invert the overlay out of a flattened image.
 *
 * Supports what these files actually use: 8-bit RGB, raw and RLE (PackBits) channel
 * data. ZIP-compressed channels are reported, not guessed at.
 */
import fs from "node:fs";

const SIG = 0x38425053; // '8BPS'

export function readPsd(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) !== SIG) throw new Error("not a PSD");
  const version = b.readUInt16BE(4);
  if (version !== 1) throw new Error("PSB unsupported");
  const channels = b.readUInt16BE(12);
  const height = b.readUInt32BE(14);
  const width = b.readUInt32BE(18);
  const depth = b.readUInt16BE(22);
  const mode = b.readUInt16BE(24);
  if (depth !== 8) throw new Error(`depth ${depth} unsupported`);

  let p = 26;
  p += 4 + b.readUInt32BE(p);            // colour mode data
  p += 4 + b.readUInt32BE(p);            // image resources
  const lmiLen = b.readUInt32BE(p); p += 4;
  const lmiEnd = p + lmiLen;

  const layerInfoLen = b.readUInt32BE(p); p += 4;
  let count = b.readInt16BE(p); p += 2;
  const hasMergedAlpha = count < 0;
  count = Math.abs(count);

  const layers = [];
  for (let i = 0; i < count; i++) {
    const top = b.readInt32BE(p), left = b.readInt32BE(p + 4);
    const bottom = b.readInt32BE(p + 8), right = b.readInt32BE(p + 12);
    p += 16;
    const nch = b.readUInt16BE(p); p += 2;
    const chans = [];
    for (let c = 0; c < nch; c++) {
      chans.push({ id: b.readInt16BE(p), length: b.readUInt32BE(p + 2) });
      p += 6;
    }
    p += 4;                               // '8BIM'
    const blend = b.toString("latin1", p, p + 4); p += 4;
    const opacity = b[p], clipping = b[p + 1], flags = b[p + 2];
    p += 4;                               // opacity/clipping/flags/filler
    const extraLen = b.readUInt32BE(p); p += 4;
    const extraEnd = p + extraLen;

    const maskLen = b.readUInt32BE(p); p += 4 + maskLen;
    const blendLen = b.readUInt32BE(p); p += 4 + blendLen;
    const nameLen = b[p];
    let name = b.toString("latin1", p + 1, p + 1 + nameLen);
    p += 1 + nameLen;
    p += (4 - ((1 + nameLen) % 4)) % 4;   // pad to 4

    // additional info: prefer the unicode name when present
    while (p + 12 <= extraEnd) {
      if (b.toString("latin1", p, p + 4) !== "8BIM") break;
      const key = b.toString("latin1", p + 4, p + 8);
      const len = b.readUInt32BE(p + 8);
      if (key === "luni") {
        const cnt = b.readUInt32BE(p + 12);
        let s = "";
        for (let k = 0; k < cnt; k++) s += String.fromCharCode(b.readUInt16BE(p + 16 + k * 2));
        name = s;
      }
      p += 12 + len + (len % 2);
    }
    p = extraEnd;

    layers.push({
      index: i, name, top, left, bottom, right,
      width: right - left, height: bottom - top,
      channels: chans, blend, opacity, clipping, flags,
      hidden: !!(flags & 0x02),
    });
  }

  // channel image data follows, in layer order
  for (const L of layers) {
    L.dataOffsets = [];
    for (const c of L.channels) {
      L.dataOffsets.push({ id: c.id, start: p, length: c.length });
      p += c.length;
    }
  }

  return { buf: b, width, height, channels, mode, layers, hasMergedAlpha, lmiEnd, layerInfoLen };
}

/** PackBits row decoder. */
function unpackRLE(b, start, rowCounts, w, h) {
  const out = Buffer.alloc(w * h);
  let src = start, dst = 0;
  for (let y = 0; y < h; y++) {
    const end = src + rowCounts[y];
    let x = 0;
    while (src < end && x < w) {
      const n = b.readInt8(src++);
      if (n >= 0) {
        const len = n + 1;
        b.copy(out, dst + x, src, src + len);
        src += len; x += len;
      } else if (n > -128) {
        const len = 1 - n;
        out.fill(b[src++], dst + x, Math.min(dst + x + len, dst + w));
        x += len;
      }
    }
    src = end;
    dst += w;
  }
  return out;
}

/** Decodes one layer's RGB(A) into a raw RGBA buffer at layer size. */
export function layerPixels(psd, layer) {
  const { buf: b } = psd;
  const w = layer.width, h = layer.height;
  if (w <= 0 || h <= 0) return null;
  const planes = {};

  for (const d of layer.dataOffsets) {
    let p = d.start;
    const comp = b.readUInt16BE(p); p += 2;
    if (comp === 0) {
      planes[d.id] = b.subarray(p, p + w * h);
    } else if (comp === 1) {
      const counts = new Array(h);
      for (let y = 0; y < h; y++) counts[y] = b.readUInt16BE(p + y * 2);
      planes[d.id] = unpackRLE(b, p + h * 2, counts, w, h);
    } else {
      return { unsupported: comp };
    }
  }

  const rgba = Buffer.alloc(w * h * 4);
  const R = planes[0], G = planes[1], B = planes[2], A = planes[-1];
  if (!R || !G || !B) return null;
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = R[i]; rgba[i * 4 + 1] = G[i]; rgba[i * 4 + 2] = B[i];
    rgba[i * 4 + 3] = A ? A[i] : 255;
  }
  return { rgba, width: w, height: h };
}
