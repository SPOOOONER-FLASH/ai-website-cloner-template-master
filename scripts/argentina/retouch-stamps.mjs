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

    node scripts/argentina/retouch-stamps.mjs                 every spec in tmp/claude-argentina/stamps/
    node scripts/argentina/retouch-stamps.mjs 117_Candex_niq  one spec

  Spec: tmp/claude-argentina/stamps/<name>.json = { "file": "candex-img/117_Candex_niq.jpg",
        "boxes": [{ "x": 0, "y": 0, "w": 0, "h": 0, "mode": "v" }] }   (source pixels)
  Out:  tmp/claude-argentina/retouched/<name>.png and retouch-preview/<name>.png (before | after)
*/
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import sharp from "sharp";

const ROOT = join("..", "claude-argentina");
const SPECS = join(ROOT, "stamps");
const OUT = join(ROOT, "retouched");
const PREVIEW = join(ROOT, "retouch-preview");
mkdirSync(OUT, { recursive: true });
mkdirSync(PREVIEW, { recursive: true });
const STRIP = 4;

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function retouch(data, width, height, channels, box, seed = 1) {
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
  const x0 = Math.max(0, Math.min(...spec.boxes.map((b) => b.x)) - pad);
  const y0 = Math.max(0, Math.min(...spec.boxes.map((b) => b.y)) - pad);
  const x1 = Math.min(info.width, Math.max(...spec.boxes.map((b) => b.x + b.w)) + pad);
  const y1 = Math.min(info.height, Math.max(...spec.boxes.map((b) => b.y + b.h)) + pad);
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

const only = process.argv[2];
const names = only ? [only] : readdirSync(SPECS).filter((f) => f.endsWith(".json")).map((f) => basename(f, ".json"));
for (const name of names) await run(name);
