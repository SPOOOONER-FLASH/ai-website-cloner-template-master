#!/usr/bin/env node
/**
 * Places a REAL product photograph into a scene, and grades it so the two agree.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS FOR
 *
 * The client likes the tonality of the generated scene photographs — concrete, oak,
 * warm window light — and the discipline in AGENTS.md forbids generating the hardware
 * inside them. Both hold at once if the scene and the part come from different places:
 * the SET contains no metal and may be generated or photographed; the PART is the
 * client's own photograph and its pixels are never redrawn.
 *
 * ---------------------------------------------------------------------------
 * WHY GRADING IS ALLOWED AND RETOUCHING GEOMETRY IS NOT
 *
 * AGENTS.md permits "清晰化、白化、曝光、透视校正" on a real photograph. Everything this
 * file does to the part falls inside that: a global exposure and white-balance match, a
 * soft luminance ramp across the object in the direction of the scene's light, and a
 * shadow derived from the object's own silhouette. None of it moves a fixing hole, adds
 * a screw, or changes a profile — a buyer can still take the part in the output to a
 * workshop and order it.
 *
 * The ramp is the part worth being careful about. It is dodge-and-burn: the same pixel
 * ordering, darkened away from the light. It cannot invent a highlight that is not
 * there, which is precisely why it can never turn a flat-lit part into a rim-lit one —
 * see the failed dark-void experiment in compose-editorial-plate.mjs.
 *
 * ---------------------------------------------------------------------------
 * THE CONSTRAINT NOBODY CAN GRADE AROUND
 *
 * The part was photographed from one angle. A scene shot from a different angle will
 * never accept it, because a 2D photograph cannot be rotated in depth. So the scene has
 * to be chosen — or commissioned — to match the part, not the other way round, and the
 * brief for a usable scene plate is narrow:
 *
 *   - one soft source, high and slightly left, no second key and no hard rim
 *   - the surface the part sits on roughly level with the camera's own horizon
 *   - no metal anywhere in the frame
 *   - low local contrast; a scene with deep specular highlights will never match a
 *     catalogue cut-out lit on white
 *
 * Usage:
 *   node scripts/compose-scene-plate.mjs \
 *     --scene public/images/editorial/hyde-source-by-range-2026.webp \
 *     --slug 9001-stainless-steel-handle --x 0.30 --y 0.72 --span 0.30
 */

import { mkdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import sharp from "sharp";
import { cutOut } from "./lib/product-cutout.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i > -1 ? args[i + 1] : d;
};
const num = (n, d) => Number(flag(n, d));

/**
 * What the scene's light is doing where the part is going to sit.
 *
 * Sampled from the scene itself rather than declared, because a number typed into a
 * config drifts away from the image it was typed for. Three probes around the landing
 * zone give an ambient colour and a direction: whichever side is brighter is where the
 * light is, and that is the side the ramp keeps bright on the object.
 */
async function readLight(scene, cx, cy) {
  const { data, info } = await sharp(scene).resize(120, null, { fit: "inside" }).removeAlpha()
    .raw().toBuffer({ resolveWithObject: true });
  const at = (fx, fy) => {
    const x = Math.min(info.width - 1, Math.max(0, Math.round(fx * info.width)));
    const y = Math.min(info.height - 1, Math.max(0, Math.round(fy * info.height)));
    const i = (y * info.width + x) * 3;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  };
  const L = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

  const here = at(cx, cy);
  const left = at(Math.max(0.02, cx - 0.18), Math.max(0.02, cy - 0.18));
  const right = at(Math.min(0.98, cx + 0.18), Math.max(0.02, cy - 0.18));

  return {
    ambient: here,
    ambientL: L(here),
    /* -1 light from the left, +1 from the right. */
    direction: L(right) > L(left) ? 1 : -1,
    contrast: Math.abs(L(right) - L(left)),
  };
}

/**
 * Match the part's exposure and white balance to the scene, then ramp it.
 *
 * The catalogue photographs are lit on white and sit brighter and cooler than any
 * furnished interior. Left ungraded, the part reads as a sticker no matter how good the
 * shadow is — that mismatch, not the cut edge, is what people actually notice.
 */
async function gradeToScene(objectPng, w, h, light) {
  /*
    Exposure. Aim the part's own mid-tone at the scene's ambient rather than at a fixed
    target, and clamp the correction: a scene much darker than the part would otherwise
    crush the part into a silhouette, which loses exactly the surface detail a buyer
    reads a finish from.
  */
  const target = Math.max(90, Math.min(175, light.ambientL * 1.05));
  const stats = await sharp(objectPng).stats();
  const current = 0.2126 * stats.channels[0].mean + 0.7152 * stats.channels[1].mean + 0.0722 * stats.channels[2].mean;
  const exposure = Math.max(0.72, Math.min(1.12, target / Math.max(1, current)));

  /* White balance: a nudge toward the scene's cast, never a move to it — metal is neutral. */
  const cast = {
    r: 1 + ((light.ambient.r - light.ambientL) / 255) * 0.18,
    g: 1 + ((light.ambient.g - light.ambientL) / 255) * 0.18,
    b: 1 + ((light.ambient.b - light.ambientL) / 255) * 0.18,
  };

  /*
    NORMALISE THE GAIN, OR BRASS GOES FLUORESCENT.

    First version multiplied exposure by the cast and handed the product straight to
    linear(). On a warm scene and a polished-brass part that put the red and green gains
    above 1 on a channel that was already near 255, both clipped, and the lever came out
    highlighter-yellow — a finish no buyer could order. The channels are scaled so the
    largest gain never exceeds 1.06, which keeps the correction a correction and not a
    recolour. Changing a product's finish is as wrong as changing its hole positions:
    somebody orders from it.
  */
  const peak = Math.max(exposure * cast.r, exposure * cast.g, exposure * cast.b);
  const trim = peak > 1.06 ? 1.06 / peak : 1;

  const exposed = await sharp(objectPng)
    .linear([exposure * cast.r * trim, exposure * cast.g * trim, exposure * cast.b * trim], [0, 0, 0])
    .png()
    .toBuffer();

  /*
    The ramp. A linear gradient multiplied across the object, dark on the side away from
    the scene's light. Kept shallow — 100% to 82% — because this is describing which way
    the room is lit, not relighting the part. Anything steeper starts to look like an
    airbrush, and an airbrushed lock case is a lock case somebody will not recognise.
  */
  const fromLeft = light.direction < 0;
  const ramp = Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="r" x1="${fromLeft ? 0 : 1}" y1="0" x2="${fromLeft ? 1 : 0}" y2="0.35">
           <stop offset="0"   stop-color="#ffffff"/>
           <stop offset="0.55" stop-color="#efefef"/>
           <stop offset="1"   stop-color="#d1d1d1"/>
         </linearGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#r)"/>
     </svg>`,
  );

  return sharp(exposed)
    .composite([{ input: await sharp(ramp).png().toBuffer(), blend: "multiply" }])
    .png()
    .toBuffer();
}

/* ------------------------------------------------------------------------ compose */

async function compose({ scene, source, out, cx, cy, span }) {
  const meta = await sharp(scene).metadata();
  const object = await cutOut(source);
  const light = await readLight(scene, cx, cy);

  const scale = (meta.width * span) / Math.max(object.width, object.height);
  const w = Math.max(1, Math.round(object.width * scale));
  const h = Math.max(1, Math.round(object.height * scale));

  const resized = await sharp(object.buffer).resize(w, h).png().toBuffer();
  const graded = await gradeToScene(resized, w, h, light);

  /* Re-apply the object's alpha: linear() and multiply both operate on flattened pixels. */
  const part = await sharp(graded)
    .composite([{ input: resized, blend: "dest-in" }])
    .png()
    .toBuffer();

  const left = Math.round(meta.width * cx - w / 2);
  const top = Math.round(meta.height * cy - h / 2);

  /*
    Two shadows, because a real object on a real surface casts two: a tight dark one
    where it touches, and a long soft one where it blocks the room. One shadow alone is
    the other classic composite tell — it either floats or looks stamped on.
  */
  const shadow = async (blur, opacity, dx, dy) => {
    const pad = Math.min(Math.ceil(blur * 2), Math.floor((meta.width - w) / 2), Math.floor((meta.height - h) / 2));
    const PW = w + pad * 2;
    const PH = h + pad * 2;
    const blank = (bg) => sharp({ create: { width: PW, height: PH, channels: 4, background: bg } }).png().toBuffer();
    const padded = await sharp(await blank({ r: 0, g: 0, b: 0, alpha: 0 }))
      .composite([{ input: resized, left: pad, top: pad }]).png().toBuffer();
    const tinted = await sharp(padded)
      .composite([{ input: await blank({ r: 12, g: 11, b: 10, alpha: 1 }), blend: "in" }]).png().toBuffer();
    const soft = await sharp(tinted).blur(blur).png().toBuffer();
    return {
      input: await sharp(soft)
        .composite([{ input: await blank({ r: 255, g: 255, b: 255, alpha: opacity }), blend: "dest-in" }])
        .png().toBuffer(),
      left: left - pad + dx,
      top: top - pad + dy,
    };
  };

  const cast = Math.round(Math.max(w, h) * 0.10);
  await sharp(scene)
    .composite([
      await shadow(cast, 0.30, Math.round(cast * light.direction * 1.6), Math.round(cast * 1.5)),
      await shadow(Math.max(3, Math.round(cast * 0.18)), 0.42, 0, Math.round(h * 0.02)),
      { input: part, left, top },
    ])
    .webp({ quality: 92 })
    .toFile(out);

  return { out, light, w, h };
}

/* ---------------------------------------------------------------------------- run */

const scene = flag("scene");
const slug = flag("slug");
if (!scene || !slug) {
  console.error("need --scene <file> and --slug <product-slug>");
  process.exit(1);
}
const source = join("public/images/products", `${slug}.webp`);
if (!existsSync(scene) || !existsSync(source)) {
  console.error(`missing: ${!existsSync(scene) ? scene : source}`);
  process.exit(1);
}

const outDir = flag("out", "tmp/claude-scene");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${slug}-on-${basename(scene, ".webp")}.webp`);

const r = await compose({
  scene,
  source,
  out,
  cx: num("x", 0.5),
  cy: num("y", 0.7),
  span: num("span", 0.3),
});

console.log(
  `${basename(r.out)}\n  scene light: ${r.light.direction < 0 ? "from the left" : "from the right"}` +
    `, ambient L ${Math.round(r.light.ambientL)}, side-to-side spread ${Math.round(r.light.contrast)}` +
    `\n  part placed at ${r.w}x${r.h}px. Product pixels: original, graded only.`,
);
