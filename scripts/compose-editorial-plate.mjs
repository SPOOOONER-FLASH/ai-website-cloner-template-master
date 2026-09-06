#!/usr/bin/env node
/**
 * Puts a REAL product photograph into FSB's editorial field — the dark void or the
 * light void — and adds nothing to the part itself.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS ALONGSIDE compose-product-plate.mjs
 *
 * That script solved the catalogue problem: get the part off pure white and onto a
 * studio grey. This one solves the editorial problem the client actually asked about —
 * "像 fsb 甚至比 fsb 更好，设计风格影调" — which is a different job with different
 * numbers. A catalogue plate wants the part legible. An editorial plate wants the part
 * to look like it was photographed in a room, and it buys that with negative space,
 * a graded backdrop, and a light you can locate.
 *
 * ---------------------------------------------------------------------------
 * THE MEASUREMENT THAT SETTLES THE ARGUMENT
 *
 * Sampled 2026-09-05 from FSB's own heroes at w_1440 and from our homepage:
 *
 *   FSB dark void   (fsb-stage-desktop-center-haw-lin-services.png)
 *                   #171614 at the top falling to #5a5653 at the bottom. A 65 L
 *                   vertical spread. Light rises from below and behind. Very slightly
 *                   warm — R runs 3 to 7 above B, never neutral.
 *
 *   FSB light void  (fsb-designed-by-hero-image.png, produktfamilien_uebersicht)
 *                   #f0f0f0 falling to about #e3e3e3 low and centre. An 8 to 12 L
 *                   spread — nearly flat, a large softbox overhead rather than a key.
 *                   Exactly neutral: R, G and B are equal at every probe.
 *                   74% to 83% of the frame is empty field.
 *
 *   Ours, before    hyde-real-lever-plate.webp: corner #ffffff, and 87% of the frame
 *                   within a hair of pure white.
 *
 * --color-surface in globals.css is #ffffff. So a plate whose field is #ffffff has no
 * edge on the page at all — it is not a photograph sitting on the page, it is a part
 * floating in the page. FSB's #f0f0f0 is fifteen levels away from that, and those
 * fifteen levels are the entire difference between "catalogue cut-out" and "shot in a
 * studio". This file's whole job is to spend them.
 *
 * ---------------------------------------------------------------------------
 * WHICH FIELD FOR WHICH PART: WHAT THE FIRST RUN SHOWED, WHICH IS NOT WHAT I EXPECTED
 *
 * The plan was to pick the field by the part's own luminance — bright parts on the dark
 * void, dark parts on the light void — so that each one separated from its ground.
 * Seventeen plates in, that rule is wrong, and the reason is worth keeping.
 *
 * Separation was never the problem. AGREEMENT is. Every photograph in
 * public/images/products was lit the same way: a large soft source more or less overhead,
 * on white, frontal, no directional key. Put that part on the light void and the light in
 * the composite agrees with the light in the photograph, because the light void IS that
 * lighting setup — so it reads as one photograph. Put the same part on the dark void and
 * the part is still lit for a white room while the room is now black. Nothing is clipped
 * and nothing is deformed, and it still looks pasted on, immediately, to anyone.
 *
 * So: void-light is the default for everything, and void-dark is opt-in via --grammar for
 * a single hero somebody has actually looked at. FSB can hold a black lever on a near-black
 * field because they lit the lever for that field. We would have to invent the rim light
 * that does it, and inventing surface on a metal part is the thing we do not do.
 *
 * Usage:
 *   node scripts/compose-editorial-plate.mjs --slug 9001-stainless-steel-handle
 *   node scripts/compose-editorial-plate.mjs --all --limit 12 --out tmp/claude-editorial
 *   node scripts/compose-editorial-plate.mjs --slug 035-mortise-lock --grammar void-light
 */

import { readdirSync, existsSync, mkdirSync, writeFileSync, createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { join, basename } from "node:path";
import sharp from "sharp";
import { cutOut } from "./lib/product-cutout.mjs";

const SOURCE_DIR = "public/images/products";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};

/* ------------------------------------------------------------------ grammars */

/*
  16:10. FSB's heroes run wide — the Rams stage is 1440x690, roughly 2:1 — but a 2:1
  frame gives a lock case nowhere to be tall. 16:10 keeps the generous horizon without
  cropping the one product family that is not a lever.
*/
const FRAME = { width: 1600, height: 1000 };

const GRAMMARS = {
  "void-dark": {
    /*
      Vertical, dark at the top. Every instinct says to put the light at the top; FSB
      does the opposite, and it is why the image reads as a room rather than a vignette
      — the floor is what is lit, and the object stands in front of it.
    */
    gradient: () => `
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0"    stop-color="rgb(23,22,20)"/>
        <stop offset="0.55" stop-color="rgb(51,50,48)"/>
        <stop offset="1"    stop-color="rgb(90,86,83)"/>
      </linearGradient>`,
    objectSpan: 0.44,
    centreX: 0.5,
    centreY: 0.46,
    /* On a dark field the shadow is barely a shadow; past about 0.2 it turns into a smear. */
    shadow: { dx: 30, dy: 54, blur: 60, opacity: 0.28, tint: { r: 8, g: 8, b: 9 } },
    suits: "bright",
  },

  "void-light": {
    /*
      A radial centred above the top edge: one large soft source overhead, which is what
      an 8 to 12 L spread with the darkest probe at bottom-centre actually describes.
      A corner-to-corner linear gradient would put the light in a corner, and FSB's is
      not in a corner.
    */
    gradient: () => `
      <radialGradient id="g" cx="0.5" cy="0.02" r="1.15">
        <stop offset="0"   stop-color="rgb(242,242,242)"/>
        <stop offset="0.6" stop-color="rgb(238,238,238)"/>
        <stop offset="1"   stop-color="rgb(226,226,226)"/>
      </radialGradient>`,
    objectSpan: 0.44,
    centreX: 0.5,
    centreY: 0.44,
    shadow: { dx: 22, dy: 46, blur: 48, opacity: 0.16, tint: { r: 40, g: 40, b: 44 } },
    suits: "dark",
  },
};

/*
  SOURCES THAT ARE NOT PHOTOGRAPHS OF A PRODUCT.

  A minority of files in public/images/products are not product shots at all: dimension
  drawings with printed callouts and arrows, a marketing infographic with a red banner and
  three columns of copy, and one patch fitting whose grey backdrop sits just under the key
  threshold and survives as a rectangle.

  These are listed rather than detected. I tried to detect them — pale-pixel fraction,
  silhouette fill against its own bounding box, component count — and every statistic put
  the dimension drawing on the same side of the line as a genuine pull plate, because a
  lock case really is rectangular and printed type really is not a colour. A threshold
  loose enough to catch them starts discarding real parts, which is the failure that
  matters here. Reviewed by eye off the contact sheet; add to the list when the next one
  turns up, and say in the commit what was wrong with it.
*/
const NOT_A_PRODUCT_PHOTOGRAPH = new Set([
  "bl031-brass-and-steel-hinges", // dimension drawing: printed callouts and arrows
  "f111-glass-door-patch-fittings", // grey backdrop survives the key as a visible rectangle
  "hy008-lock-case", // marketing infographic, red banner, three columns of copy
  "lc8525b-lock-case", // dimension drawing: printed "85" and "25" with arrows
]);

function field(grammar, width, height) {
  const g = GRAMMARS[grammar];
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <defs>${g.gradient(width, height)}</defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`,
  );
}

/* ------------------------------------------------------------------ selection */

/**
 * Mean luminance of the part itself, ignoring everything that keyed out.
 *
 * This is the number that picks the field, so it must not be contaminated by the
 * backdrop — a mean over the whole frame would be dominated by the white that is about
 * to become transparent, and every part would come back "bright".
 */
async function objectLuminance(cut) {
  const { data, info } = await sharp(cut.buffer).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let sum = 0;
  let n = 0;
  for (let i = 0; i < info.width * info.height; i += 1) {
    if (ch === 4 && data[i * ch + 3] < 128) continue;
    sum += 0.2126 * data[i * ch] + 0.7152 * data[i * ch + 1] + 0.0722 * data[i * ch + 2];
    n += 1;
  }
  return n ? sum / n : 0;
}

const sha256 = (file) =>
  new Promise((resolve, reject) => {
    const h = createHash("sha256");
    createReadStream(file).on("data", (d) => h.update(d)).on("end", () => resolve(h.digest("hex"))).on("error", reject);
  });

/* ------------------------------------------------------------------- compose */

/**
 * Why this photograph should not go on the dark field, or null.
 *
 * ONE measurement, plus a reviewed list. It started as two measurements and the second
 * one had to go, which is the useful part of this note.
 *
 * The halo test works and is calibrated on real numbers: pale flat pixels as a share of
 * the cut-out come out at 1.6% and 2.7% on plates that look right, 6.9% on one that is
 * fine, and 12.6% on 037-panic-exit-device, which is the one carrying a baked-in paper
 * shadow. The threshold sits at 10%, between the highest good and the lowest bad.
 *
 * The second test was "saturated colour high in the frame is the Hyland logo", on the
 * reasoning that metal here is neutral. Measured, it says b024-brass-and-steel-hinges is
 * 23% logo — because BRASS IS SATURATED, and a brass hinge is more saturated than a small
 * red oval ever is as a share of the frame. It would have thrown out the best plate in
 * the set to catch a defect on another. Deleted rather than tuned: a detector that ranks
 * a product below a watermark is not measuring what it claims to.
 *
 * So the watermark cases go in a reviewed list, the way NOT_A_PRODUCT_PHOTOGRAPH above
 * already handles the sources no statistic could separate either.
 */
const WATERMARK_SURVIVES_CUTOUT = new Set([
  /* Hyland oval sits close enough to the cylinder body that the isolation test keeps it. */
  "70sn-lock-cylinder",
]);

async function darkFieldRisk(object, slug) {
  if (WATERMARK_SURVIVES_CUTOUT.has(slug)) return "a burned-in watermark survives the cut-out";

  const { data, info } = await sharp(object.buffer)
    .resize(200, null, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let solid = 0;
  let halo = 0;
  for (let i = 0; i < info.width * info.height; i += 1) {
    if (data[i * 4 + 3] < 200) continue;
    solid += 1;
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    /* Pale and flat: paper carrying a shadow, not a lit surface. */
    if (min >= 232 && max - min < 12) halo += 1;
  }
  if (!solid) return null;
  if (halo / solid > 0.1) {
    return String(Math.round((halo / solid) * 100)) + "% of the cut-out is baked-in paper shadow";
  }
  return null;
}

async function compose(file, out, forced) {
  const object = await cutOut(file);
  const lum = await objectLuminance(object);

  /* void-light unless somebody asked for otherwise — see the header for why. */
  let grammar = forced ?? "void-light";

  /*
    ── THE DARK FIELD IS A TEST, AND SOME PHOTOGRAPHS FAIL IT ──────────────────

    Two defects live in the source photographs and are invisible on a light field,
    because they are the same colour as it:

      - a soft shadow the supplier baked onto the paper. It survives the cut-out because
        it is 235–248, not white, and on a dark ground it becomes a pale smear under the
        part;
      - the burned-in Hyland logo, on the frames where it sits close enough to a large
        part that the isolation test in product-cutout.mjs cannot separate it.

    Neither can be removed without painting over the client's photograph, and painting
    over a photograph to make it prettier is the first step of the thing AGENTS.md
    forbids. So they are not removed — the plate is moved to the field where the defect
    does not show, and the downgrade is reported rather than hidden.

    Measured on the cut-out itself, so it is a property of the photograph and not a
    judgement about it.
  */
  if (grammar === "void-dark") {
    const flaw = await darkFieldRisk(object, basename(file, ".webp"));
    if (flaw) {
      grammar = "void-light";
      console.log(`  ${basename(file)}: ${flaw} — using void-light instead`);
    }
  }

  const g = GRAMMARS[grammar];

  const scale = (FRAME.width * g.objectSpan) / Math.max(object.width, object.height);
  const w = Math.round(object.width * scale);
  const h = Math.round(object.height * scale);
  const resized = await sharp(object.buffer).resize(w, h).png().toBuffer();

  const left = Math.round(FRAME.width * g.centreX - w / 2);
  const top = Math.round(FRAME.height * g.centreY - h / 2);

  /*
    The shadow is the part's own silhouette, blurred — never a drawn ellipse. An ellipse
    is the single clearest tell of a composite, because the moment the shadow stops
    agreeing with the shape that cast it the viewer stops believing the photograph. The
    client's principal put this exactly: 一看就是假的，因为不合逻辑.
  */
  /*
    Four passes, not one chained pipeline: sharp's .composite() REPLACES the pending
    composite list rather than appending to it, so chaining two calls silently drops the
    first. The first version of this function did exactly that and failed on every wide
    object — worth the extra buffers to keep each step separately true.
  */
  /*
    Two blur radii of margin is enough for a gaussian to fall off, and it is clamped so
    the padded silhouette can never grow past the frame — sharp refuses a composite input
    larger than its base, and at three radii a square object overflowed the 1000px height
    and took eight of the sixteen plates down with an error that named dimensions rather
    than the shadow.
  */
  const pad = Math.max(
    0,
    Math.min(Math.ceil(g.shadow.blur * 2), Math.floor((FRAME.width - w) / 2), Math.floor((FRAME.height - h) / 2)),
  );
  const PW = w + pad * 2;
  const PH = h + pad * 2;
  const blank = (bg) => sharp({ create: { width: PW, height: PH, channels: 4, background: bg } }).png().toBuffer();

  const padded = await sharp(await blank({ r: 0, g: 0, b: 0, alpha: 0 }))
    .composite([{ input: resized, left: pad, top: pad }])
    .png()
    .toBuffer();

  const tinted = await sharp(padded)
    .composite([{ input: await blank({ ...g.shadow.tint, alpha: 1 }), blend: "in" }])
    .png()
    .toBuffer();

  const silhouette = await sharp(await sharp(tinted).blur(g.shadow.blur).png().toBuffer())
    .composite([{ input: await blank({ r: 255, g: 255, b: 255, alpha: g.shadow.opacity }), blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(field(grammar, FRAME.width, FRAME.height))
    .composite([
      { input: silhouette, left: left - pad + g.shadow.dx, top: top - pad + g.shadow.dy },
      { input: resized, left, top },
    ])
    .webp({ quality: 92 })
    .toFile(out);

  /*
    The sidecar is the point, not paperwork. An image whose provenance is only in a chat
    turn is an image nobody can defend six months later, and this is the exact class of
    image that got rejected once already.
  */
  writeFileSync(
    `${out}.json`,
    `${JSON.stringify(
      {
        kind: "real-photograph-on-editorial-field",
        grammar,
        field: grammar === "void-dark" ? "#171614 → #5a5653, vertical" : "#f2f2f2 → #e2e2e2, radial from above",
        fieldMeasuredFrom: "FSB heroes fetched 2026-09-05 at w_1440 (dieter-rams stage; designed-by; produktfamilien_uebersicht)",
        objectMeanLuminance: Math.round(lum),
        productGeometry: "Original pixels retained. Uniform resize and complete-object crop only — no redraw, no restyle, no recombination.",
        addedByThisScript: ["graded backdrop", "cast shadow derived from the object's own silhouette"],
        sources: [{ source: file, sha256: await sha256(file) }],
      },
      null,
      2,
    )}\n`,
  );

  return { out, grammar, lum: Math.round(lum) };
}

/* ------------------------------------------------------------------------ run */

const outDir = flag("out", "tmp/claude-editorial");
mkdirSync(outDir, { recursive: true });
const forced = flag("grammar");
if (forced && !GRAMMARS[forced]) {
  console.error(`unknown grammar "${forced}" — expected one of ${Object.keys(GRAMMARS).join(", ")}`);
  process.exit(1);
}

const slug = flag("slug");
let files;
if (slug) {
  files = [`${slug}.webp`];
} else {
  /*
    Heroes only, spread across the alphabet rather than taken from one end of it.
    Sorting by file size picked the supplier's raw desk shots last time; the guard in
    product-cutout.mjs refuses those, but there is no reason to spend the attempts.
  */
  const limit = Number(flag("limit", 12));
  const all = readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".webp") && !/-\d+\.webp$/.test(f) && !f.includes("-video")).sort();
  const step = Math.max(1, Math.floor(all.length / limit));
  files = all.filter((_, i) => i % step === 0).slice(0, limit);
}

console.log(`composing ${files.length} editorial plate(s) into ${outDir}\n`);
let made = 0;
for (const file of files) {
  const src = join(SOURCE_DIR, file);
  if (!existsSync(src)) {
    console.log(`  skip  ${file} — not found`);
    continue;
  }
  if (NOT_A_PRODUCT_PHOTOGRAPH.has(basename(file, ".webp"))) {
    console.log(`  SKIP       ${file} — listed as not a product photograph`);
    continue;
  }
  const dest = join(outDir, `${basename(file, ".webp")}-editorial.webp`);
  try {
    const r = await compose(src, dest, forced);
    console.log(`  ${r.grammar.padEnd(10)} L=${String(r.lum).padStart(3)}  ${basename(dest)}`);
    made += 1;
  } catch (error) {
    console.log(`  REFUSED    ${file}: ${error.message}`);
  }
}
console.log(`\n${made} plate(s). Every pixel of every product is the client's own photograph.`);
