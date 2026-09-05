#!/usr/bin/env node
/**
 * Puts the studio field back under an existing atlas photograph.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS CANNOT BE DONE IN CSS
 *
 * hyde-real-product-atlas.webp is 87% pure white and the page background is #ffffff, so
 * the photograph has no edge at all: it is not an image sitting on the page, it is a set
 * of parts floating in it. The approved comps put the same parts on a lit backdrop that
 * runs #f4f4f4 down to about #cecece.
 *
 * A CSS background behind the <img> does nothing, because the white is INSIDE the file —
 * I tried it on the live page and got a grey border around a white rectangle. The field
 * has to be composited into the pixels.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS AND IS NOT TOUCHED
 *
 * The products are not touched. Near-white is keyed out by the same flood fill every
 * other composer in this repo uses, and the parts are laid back down unchanged over a
 * gradient. No pixel of any part is redrawn, recoloured or moved — the rule in AGENTS.md
 * is about the metal, and the metal is exactly as photographed.
 *
 * Usage:  node scripts/compose-atlas-field.mjs [--in <file>] [--out <file>]
 */

import sharp from "sharp";
import { cutOut } from "./lib/product-cutout.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i > -1 ? args[i + 1] : d;
};

const input = flag("in", "public/images/editorial/hyde-real-product-atlas.webp");
const output = flag("out", "public/images/editorial/hyde-real-product-atlas.webp");

/* Sampled from the approved comp: a lit backdrop, brighter top-left, falling to the floor. */
const FIELD_FROM = "rgb(244,244,244)";
const FIELD_MID = "rgb(233,233,233)";
const FIELD_TO = "rgb(206,206,206)";

const meta = await sharp(input).metadata();
const { width, height } = meta;

const object = await cutOut(input);
console.log(`cut out ${object.width}x${object.height} from ${width}x${height}`);

/*
  The parts keep the position and scale they were photographed at. Re-fitting them to the
  new frame would change the relative sizes the atlas exists to show.
*/
const inset = Math.round(Math.min(width, height) * 0.06);
const boxW = width - inset * 2;
const boxH = height - inset * 2;
const scale = Math.min(boxW / object.width, boxH / object.height, 1);
const w = Math.round(object.width * scale);
const h = Math.round(object.height * scale);
const left = Math.round((width - w) / 2);
const top = Math.round((height - h) / 2);

const resized = await sharp(object.buffer).resize(w, h).png().toBuffer();

const field = Buffer.from(
  `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <radialGradient id="g" cx="0.34" cy="0.14" r="1.05">
         <stop offset="0" stop-color="${FIELD_FROM}"/>
         <stop offset="0.55" stop-color="${FIELD_MID}"/>
         <stop offset="1" stop-color="${FIELD_TO}"/>
       </radialGradient>
     </defs>
     <rect width="100%" height="100%" fill="url(#g)"/>
   </svg>`,
);

/* One soft shadow from the parts' own silhouette. An ellipse is the tell of a composite. */
const blur = Math.round(Math.min(width, height) * 0.035);
const pad = Math.min(blur * 2, left, top);
const PW = w + pad * 2;
const PH = h + pad * 2;
const blank = (bg) =>
  sharp({ create: { width: PW, height: PH, channels: 4, background: bg } }).png().toBuffer();
const padded = await sharp(await blank({ r: 0, g: 0, b: 0, alpha: 0 }))
  .composite([{ input: resized, left: pad, top: pad }]).png().toBuffer();
const tinted = await sharp(padded)
  .composite([{ input: await blank({ r: 30, g: 30, b: 32, alpha: 1 }), blend: "in" }]).png().toBuffer();
const shadow = await sharp(await sharp(tinted).blur(blur).png().toBuffer())
  .composite([{ input: await blank({ r: 255, g: 255, b: 255, alpha: 0.16 }), blend: "dest-in" }])
  .png().toBuffer();

await sharp(field)
  .composite([
    { input: shadow, left: left - pad + Math.round(blur * 0.5), top: top - pad + Math.round(blur * 0.9) },
    { input: resized, left, top },
  ])
  .webp({ quality: 90 })
  .toFile(`${output}.tmp`);

const { rename } = await import("node:fs/promises");
await rename(`${output}.tmp`, output);
console.log(`wrote ${output}`);
