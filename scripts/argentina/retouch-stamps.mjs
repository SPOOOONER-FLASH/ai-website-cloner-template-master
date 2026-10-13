#!/usr/bin/env node
/*
  Remove the customer's stamped brand (Candex / INDUSTRIA ARGENTINA, Elabora's PICCOLO label)
  from the crawled photographs. Client 2026-10-10: 「面板上的冲压字修掉…P掉」.

  Only pixels inside the declared boxes change; everything outside is copied byte for byte,
  so a hole, edge or latch outside a box cannot move. Inside a box the metal is rebuilt from
  the strips just beyond it:

    v      each column blends from the strip above the box to the strip below (faceplates:
           shading runs across the plate, so it survives)
    h      each row blends from the strip left of the box to the strip right of it
    white  plain white (line drawings)

  plus a little grain measured from those same strips, so the patch is not glassier than the
  metal around it. The noise is seeded per box: the same spec always gives the same pixels.

    node scripts/argentina/retouch-stamps.mjs                 every spec in scripts/argentina/stamps/
    node scripts/argentina/retouch-stamps.mjs 117_Candex_niq  one spec

  Spec: scripts/argentina/stamps/<name>.json = { "file": "candex-img/117_Candex_niq.jpg",
        "boxes": [{ "x": 0, "y": 0, "w": 0, "h": 0, "mode": "v" }] }   (source pixels)
  Out:  tmp/claude-argentina/retouched/<name>.png and retouch-preview/<name>.png (before | after)
*/
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

/* --root / --specs point the same retouch at another collection (Brazil, 2026-10-12: its specs stay
   local because their file paths name the customers). Defaults are the Argentina collection. */
const flag = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const ROOT = flag("root", join("..", "claude-argentina"));
/* The specs are the record of every retouch (51 files, reviewed one by one 2026-10-12): kept in the repo. */
const SPECS = flag("specs", join("scripts", "argentina", "stamps"));
const OUT = join(ROOT, "retouched");
const PREVIEW = join(ROOT, "retouch-preview");
const STRIP = 4;

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

const pointInPolygon = (px, py, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

/*
  mode "lines" (Brazil BR6-SM, 2026-10-13): lettering moulded right against a housing's ridge
  and rim. A v/h blend crosses those edges and leaves a notch in them, so here every pixel is
  rebuilt along the edges instead: `left` and `right` are two measured edges (polylines, top to bottom),
  and a pixel is blended from the clean pixels above and below it on the line that runs between
  them at the same fraction of the way across. An edge, or any line parallel to them, therefore
  continues through the patch from its own pixels. Only pixels inside `poly` that sit within
  `dilate` px of lettering (|pixel − blur| > `threshold`) change.
*/
function retouchAlongLines(data, width, height, channels, spec, seed) {
  const { left, right, poly, dilate = 4, threshold = 9, average = 3, fill = "lines", whole = false } = spec;
  /* An edge is a polyline measured row by row (a rim curves); beyond its ends the end segment extends. */
  const lineX = (pts, y) => {
    let i = 0;
    while (i < pts.length - 2 && y > pts[i + 1][1]) i++;
    const [[ax, ay], [bx, by]] = [pts[i], pts[i + 1]];
    return ax + ((bx - ax) * (y - ay)) / (by - ay);
  };
  const ys = poly.map((p) => p[1]), xs = poly.map((p) => p[0]);
  const [x0, x1, y0, y1] = [Math.floor(Math.min(...xs)), Math.ceil(Math.max(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...ys))];
  if (x0 < 1 || y0 < 1 || x1 >= width - 1 || y1 >= height - 1) throw new Error("lines polygon outside image");
  const src = Uint8Array.from(data);
  const grey = (x, y) => { const i = (y * width + x) * channels; return (src[i] + src[i + 1] + src[i + 2]) / 3; };
  /* Local mean over a 11×11 box: lettering is what stands out from it. */
  const R = 5, mean = (x, y) => { let s = 0, n = 0; for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const cx = x + dx, cy = y + dy; if (cx >= 0 && cy >= 0 && cx < width && cy < height) { s += grey(cx, cy); n++; } } return s / n; };
  const inPoly = (x, y) => pointInPolygon(x + 0.5, y + 0.5, poly);
  const mark = new Set(), key = (x, y) => y * width + x;
  /* whole: rebuild every pixel in the polygon. A detector that misses one faint letter edge leaves
     it behind as a "clean" pixel the fill then copies, so strips that run between lettering and an
     edge are rebuilt entirely. */
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inPoly(x, y) && (whole || Math.abs(grey(x, y) - mean(x, y)) > threshold)) mark.add(key(x, y));
  const mask = new Set();
  for (const k of mark) {
    if (whole) { mask.add(k); continue; }
    const mx = k % width, my = (k - mx) / width;
    for (let dy = -dilate; dy <= dilate; dy++) for (let dx = -dilate; dx <= dilate; dx++) {
      if (dx * dx + dy * dy > dilate * dilate) continue;
      const cx = mx + dx, cy = my + dy;
      if (inPoly(cx, cy)) mask.add(key(cx, cy));
    }
  }
  const at = (x, y, k) => { /* bilinear along the row */
    const xi = Math.floor(x), f = x - xi, i = (y * width + xi) * channels + k;
    return src[i] * (1 - f) + src[i + channels] * f;
  };
  /* Edge-preserving smoothing across the line (bilateral, ±3 px): one JPEG pixel stretched
     along a line reads as a streak, but a ridge or bevel differs by far more than the grain
     and keeps its weight to itself. */
  const sample = (x, y, k) => {
    const c = at(x, y, k);
    let sum = 0, wsum = 0;
    for (let d = -3; d <= 3; d++) {
      if (x + d < 0 || x + d >= width - 1) continue;
      const v = at(x + d, y, k), w = Math.exp(-(d * d) / 4.5 - ((v - c) ** 2) / 200);
      sum += v * w; wsum += w;
    }
    return sum / wsum;
  };
  /* Grain: the spread of the untouched pixels in the polygon around their local mean. */
  let dev = 0, n = 0;
  for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) if ((whole ? !inPoly(x, y) : inPoly(x, y)) && !mask.has(key(x, y)) && grey(x, y) < 235) { dev += (grey(x, y) - mean(x, y)) ** 2; n++; }
  const grain = Math.min(6, Math.sqrt(dev / Math.max(1, n)));
  const rand = rng(seed);
  /*
    fill "harmonic": a plain face with no edge running through the patch (the poly stops short
    of every edge). Each masked pixel settles to the average of its four neighbours, held by the
    untouched pixels around it — the smoothest surface those pixels allow, with nothing for a
    line-wise blend to stretch into streaks.
  */
  if (fill === "harmonic") {
    const keys = [...mask];
    const val = new Map(keys.map((k) => [k, [0, 1, 2].map((c) => src[k * channels + c])]));
    const get = (k, c) => (val.has(k) ? val.get(k)[c] : src[k * channels + c]);
    for (let it = 0; it < 4000; it++) {
      let delta = 0;
      for (const k of keys) {
        const v = val.get(k);
        for (let c = 0; c < 3; c++) {
          const next = (get(k - 1, c) + get(k + 1, c) + get(k - width, c) + get(k + width, c)) / 4;
          const moved = v[c] + 1.9 * (next - v[c]);
          delta = Math.max(delta, Math.abs(moved - v[c]));
          v[c] = moved;
        }
      }
      if (delta < 0.01) break;
    }
    for (const k of keys) {
      const noise = (rand() * 2 - 1) * grain;
      for (let c = 0; c < 3; c++) data[k * channels + c] = Math.max(0, Math.min(255, Math.round(val.get(k)[c] + noise)));
    }
    return mask.size;
  }
  for (const k of mask) {
    const x = k % width, y = (k - x) / width;
    const l = lineX(left, y), t = (x - l) / (lineX(right, y) - l);
    const along = (cy) => { const lc = lineX(left, cy); return lc + t * (lineX(right, cy) - lc); };
    /* The first `average` clean pixels beyond the lettering on this line, in one direction. */
    const walk = (dir) => {
      const hits = [];
      for (let cy = y + dir; cy >= 0 && cy < height && hits.length < average; cy += dir) {
        const cx = along(cy);
        if (cx < 1 || cx >= width - 2) break;
        if (!mask.has(key(Math.round(cx), cy))) hits.push({ cy, cx });
        else if (hits.length) break;
      }
      if (!hits.length) throw new Error(`lines: no clean pixel ${dir < 0 ? "above" : "below"} ${x},${y}`);
      return { cy: hits[0].cy, value: (c) => hits.reduce((a, h) => a + sample(h.cx, h.cy, c), 0) / hits.length };
    };
    const up = walk(-1), down = walk(1);
    const s = (y - up.cy) / (down.cy - up.cy);
    const noise = (rand() * 2 - 1) * grain;
    for (let c = 0; c < 3; c++) {
      const v = up.value(c) * (1 - s) + down.value(c) * s + noise;
      data[k * channels + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
  return mask.size;
}

export function retouch(data, width, height, channels, box, seed = 1) {
  if (box.mode === "lines") return retouchAlongLines(data, width, height, channels, box, seed);
  const { x, y, w, h, mode = "v" } = box;
  if (x < 0 || y < 0 || x + w > width || y + h > height) throw new Error(`box outside image: ${JSON.stringify(box)}`);
  const at = (cx, cy, k) => data[(cy * width + cx) * channels + k];
  const set = (cx, cy, k, v) => { data[(cy * width + cx) * channels + k] = Math.max(0, Math.min(255, Math.round(v))); };
  if (mode === "white") {
    for (let cy = y; cy < y + h; cy++) for (let cx = x; cx < x + w; cx++) for (let k = 0; k < 3; k++) set(cx, cy, k, 255);
    return;
  }
  const vertical = mode === "v";
  const along = vertical ? w : h; // lines that each get their own blend
  const across = vertical ? h : w; // length of each blend
  const strip = (line, before) => {
    const vals = [[], [], []];
    for (let s = 1; s <= STRIP; s++) {
      const p = before ? -s : across - 1 + s;
      const cx = vertical ? x + line : x + p, cy = vertical ? y + p : y + line;
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      for (let k = 0; k < 3; k++) vals[k].push(at(cx, cy, k));
    }
    return vals.map((v) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length));
  };
  /* Grain: the spread of the border strips around their own line means. */
  let dev = 0, n = 0;
  for (let line = 0; line < along; line++) {
    for (const before of [true, false]) {
      const mean = strip(line, before);
      for (let s = 1; s <= STRIP; s++) {
        const p = before ? -s : across - 1 + s;
        const cx = vertical ? x + line : x + p, cy = vertical ? y + p : y + line;
        if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
        dev += (at(cx, cy, 1) - mean[1]) ** 2; n++;
      }
    }
  }
  const grain = Math.min(6, Math.sqrt(dev / Math.max(1, n)));
  const rand = rng(seed);
  for (let line = 0; line < along; line++) {
    const a = strip(line, true), b = strip(line, false);
    for (let p = 0; p < across; p++) {
      const t = (p + 0.5) / across;
      const noise = (rand() * 2 - 1) * grain;
      const cx = vertical ? x + line : x + p, cy = vertical ? y + p : y + line;
      for (let k = 0; k < 3; k++) set(cx, cy, k, a[k] * (1 - t) + b[k] * t + noise);
    }
  }
}

async function run(name) {
  const spec = JSON.parse(readFileSync(join(SPECS, `${name}.json`), "utf8"));
  const src = join(ROOT, "raw", spec.file);
  const { data, info } = await sharp(src).flatten({ background: "#ffffff" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const before = Buffer.from(data);
  spec.boxes.forEach((box, i) => retouch(data, info.width, info.height, info.channels, box, i + 1));
  const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };
  await sharp(data, raw).png().toFile(join(OUT, `${name}.png`));

  /* Whole image, before | after at 700px each: the view a buyer gets, for the verifier. */
  const whole = async (buf) => sharp(buf, raw).resize(700, 700, { fit: "inside" }).png().toBuffer();
  const [wb, wa] = [await whole(before), await whole(data)];
  const { width: ww, height: wh } = await sharp(wb).metadata();
  await sharp({ create: { width: ww * 2 + 12, height: wh, channels: 3, background: "#ff00ff" } })
    .composite([{ input: wb, left: 0, top: 0 }, { input: wa, left: ww + 12, top: 0 }])
    .png()
    .toFile(join(PREVIEW, `${name}-full.png`));
  if (!spec.boxes.length) {
    console.log(`${name}: no brand mark declared → copied unchanged`);
    return;
  }

  /* Before | after, around every box, for a human (or agent) to judge. */
  const pad = 70;
  const bounds = spec.boxes.map((b) => {
    if (b.mode !== "lines") return b;
    const xs = b.poly.map((p) => p[0]), ys = b.poly.map((p) => p[1]);
    const [x, y] = [Math.floor(Math.min(...xs)), Math.floor(Math.min(...ys))];
    return { x, y, w: Math.ceil(Math.max(...xs)) - x, h: Math.ceil(Math.max(...ys)) - y };
  });
  const x0 = Math.max(0, Math.min(...bounds.map((b) => b.x)) - pad);
  const y0 = Math.max(0, Math.min(...bounds.map((b) => b.y)) - pad);
  const x1 = Math.min(info.width, Math.max(...bounds.map((b) => b.x + b.w)) + pad);
  const y1 = Math.min(info.height, Math.max(...bounds.map((b) => b.y + b.h)) + pad);
  const region = { left: x0, top: y0, width: x1 - x0, height: y1 - y0 };
  const scale = Math.min(2, 700 / region.width);
  const crop = async (buf) => sharp(buf, raw).extract(region).resize(Math.round(region.width * scale)).png().toBuffer();
  const [b, a] = [await crop(before), await crop(data)];
  const { width: cw, height: ch } = await sharp(b).metadata();
  await sharp({ create: { width: cw * 2 + 12, height: ch, channels: 3, background: "#ff00ff" } })
    .composite([{ input: b, left: 0, top: 0 }, { input: a, left: cw + 12, top: 0 }])
    .png()
    .toFile(join(PREVIEW, `${name}.png`));
  console.log(`${name}: ${spec.boxes.length} box(es) → retouched/${name}.png`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  mkdirSync(OUT, { recursive: true });
  mkdirSync(PREVIEW, { recursive: true });
  const only = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const names = only ? [only] : readdirSync(SPECS).filter((f) => f.endsWith(".json")).map((f) => basename(f, ".json"));
  for (const name of names) await run(name);
}
