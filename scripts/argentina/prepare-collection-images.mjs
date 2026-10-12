#!/usr/bin/env node
/*
  Turn the crawled Candex photographs and Elabora model sheets into square 1100px webp
  sources in tmp/claude-argentina/webp/, ready for scripts/watermark-product-images.mjs.

  - Candex: the photograph as published, trimmed and centred on white. Nothing on the
    product is touched.
  - Elabora: the published photographs are ~250px wide behind a grey "ghost" copy, so the
    dimension drawing is used instead. Their round logo (bottom right) and the tiny
    "PICCOLO" label drawn on the faceplate are painted white; the drawing itself is not.

    node scripts/argentina/prepare-collection-images.mjs
*/
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const RAW = join("tmp", "claude-argentina", "raw");
const OUT = join("tmp", "claude-argentina", "webp");
mkdirSync(OUT, { recursive: true });
const SIZE = 1100;
/* The brand-stamp retouch (scripts/argentina/retouch-stamps.mjs) wins when it exists. */
const RETOUCHED = join("tmp", "claude-argentina", "retouched");
const source = (raw, name) => (existsSync(join(RETOUCHED, `${name}.png`)) ? join(RETOUCHED, `${name}.png`) : raw);
const white = { r: 255, g: 255, b: 255, alpha: 1 };

async function square(input, file, margin = 0.08) {
  const inner = Math.round(SIZE * (1 - 2 * margin));
  const trimmed = await sharp(input).flatten({ background: white }).trim({ background: "#ffffff", threshold: 12 }).toBuffer();
  const fitted = await sharp(trimmed).resize(inner, inner, { fit: "inside" }).toBuffer();
  await sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: white } })
    .composite([{ input: fitted, gravity: "centre" }])
    .webp({ quality: 88 })
    .toFile(join(OUT, file));
}

const candex = JSON.parse(readFileSync(join(RAW, "candex.json"), "utf8"));
for (const product of candex) {
  if (!product.images[0]) continue;
  const file = product.images[0];
  await square(source(join(RAW, "candex-img", file), file.replace(/\.[^.]+$/, "")), `candex-${product.slug}.webp`);
}

/*
  Which sheet is which model, checked against each drawing's faceplate length and centre
  distance on 2026-10-10 (e.g. 07 is the 183 × 18 faceplate of model 101).
*/
const ELABORA_BY_FILE = {
  "01": "110", "02": "110-frente-chico", "03": "111", "04": "111-doble-perno", "05": "140",
  "06": "1140", "07": "101", "08": "102", "09": "1121", "10": "1122",
};
const sheets = readdirSync(join(RAW, "elabora-img")).filter((f) => f.endsWith(".png")).sort();
if (sheets.length !== Object.keys(ELABORA_BY_FILE).length) throw new Error(`expected 10 Elabora sheets, found ${sheets.length}`);
for (const sheet of sheets) {
  const model = ELABORA_BY_FILE[sheet.slice(0, 2)];
  if (!model) throw new Error(`unmapped Elabora sheet ${sheet}`);
  const { data, info } = await sharp(source(join(RAW, "elabora-img", sheet), `elabora-${sheet.slice(0, 2)}`))
    .flatten({ background: white })
    .extract({ left: 560, top: 100, width: 503, height: 491 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  /* Navy (their titles, "Medidas", the logo disc) and red (the logo) go white; the drawing
     is neutral grey and black, so it survives untouched. */
  for (let i = 0; i < data.length; i += info.channels) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const navy = b - r > 6 && b - g > 3; // includes the anti-aliased halo
    const red = r - g > 25 && r - b > 15;
    /* The logo's last specks: its corner holds no drawing on any of the ten sheets. */
    const x = (i / info.channels) % info.width, y = Math.floor(i / info.channels / info.width);
    const logoCorner = x >= info.width - 58 && y >= info.height - 56;
    if (navy || red || logoCorner) data[i] = data[i + 1] = data[i + 2] = 255;
  }
  const drawing = await sharp(data, { raw: info }).png().toBuffer();
  await square(drawing, `elabora-${model}.webp`, 0.06);
}
console.log(`candex ${candex.length}, elabora ${sheets.length} → ${OUT}`);
