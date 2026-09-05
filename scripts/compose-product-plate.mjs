#!/usr/bin/env node
/**
 * Places a REAL product photograph on the studio field FSB uses, and nothing else.
 *
 * ---------------------------------------------------------------------------
 * READ THE RULE BEFORE CHANGING THIS FILE
 *
 * AGENTS.md, "Never generate an imagined metal product": nothing here invents, restyles
 * or recombines a product. The pixels of the part are the client's own photograph,
 * untouched in shape. What this script supplies is the FIELD and the SHADOW — the two
 * things that are photography rather than product, and the two things FSB does
 * differently from us.
 *
 * That distinction is the whole point. The client's principal rejected generated hardware
 * on sight because a lever with invented fixing holes is a part that cannot be installed.
 * A real photograph on a better ground is still a real photograph.
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS MEASURED, AND FROM WHERE
 *
 * From FSB's own product-overview plate
 * (res.cloudinary.com/franzschneiderbrakel/…/produktfamilien_uebersicht_teaser.png,
 * fetched 2026-09-04, 1566×1044):
 *
 *   FIELD        A soft grey, not white — roughly #f2f2f3 at the upper left falling to
 *                about #e6e6e8 at the lower right. White backgrounds are what every
 *                Alibaba listing uses; the grey is most of why theirs reads as a studio.
 *   SCALE        The object spans about half the frame width and a fifth of its height.
 *                It is small. The restraint is the effect.
 *   PLACEMENT    Slightly left of centre and above it, so the shadow has room to fall.
 *   LIGHT        One source, upper left. One shadow, down and to the right, long and
 *                very soft. No fill light, no second shadow, no reflection.
 *   NOTHING ELSE No type, no model number, no certification badge, no UI. Every one of
 *                those lives in the HTML on this site already.
 *
 * ---------------------------------------------------------------------------
 * WHY THE BACKGROUND CAN BE KEYED OUT SAFELY
 *
 * Every photograph in public/images/products is a cut-out on pure white — sampled
 * 2026-09-04, corners read 255,255,255 across the set. So "near-white becomes
 * transparent" removes the backdrop and only the backdrop. The threshold is deliberately
 * tight: a satin stainless product has highlights close to white, and a loose threshold
 * eats them, which would be exactly the kind of silent deformation this rule exists to
 * prevent. Anything above the threshold that is INSIDE the object's outline is kept,
 * because the fill is flood-based from the edges rather than a global colour test.
 *
 * Usage:
 *   node scripts/compose-product-plate.mjs --slug 305-fire-door-panic-exit-device
 *   node scripts/compose-product-plate.mjs --all --limit 10 --out tmp/claude-plates
 */

import { readdirSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { cutOut } from "./lib/product-cutout.mjs";

const SOURCE_DIR = "public/images/products";
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};

/** Measured off FSB's plate. Changing these changes the house photographic grammar. */
const PLATE = {
  width: 1560,
  height: 1040,
  /** Field corners, upper-left to lower-right. */
  fieldFrom: { r: 242, g: 242, b: 243 },
  fieldTo: { r: 230, g: 230, b: 233 },
  /** Fraction of the frame the object's longest side may occupy. */
  objectSpan: 0.52,
  /** Centre of the object, as a fraction of the frame. Left of and above centre. */
  centreX: 0.47,
  centreY: 0.44,
  /*
    Softer and further than the first attempt, which sat tight under the object and read
    as a sticker. FSB's shadow is long, very diffuse and barely there — it says where the
    light is without competing with the part.
  */
  shadow: { dx: 26, dy: 60, blur: 55, opacity: 0.13 },
};

/**
 * The field: a linear gradient rendered as SVG, so it is resolution-independent and the
 * two measured colours are the only numbers involved.
 */
function field(width, height) {
  const { fieldFrom: a, fieldTo: b } = PLATE;
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="rgb(${a.r},${a.g},${a.b})"/>
           <stop offset="1" stop-color="rgb(${b.r},${b.g},${b.b})"/>
         </linearGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`,
  );
}

/*
  The cut-out itself lives in scripts/lib/product-cutout.mjs.

  It moved there when a second composer needed it. One copy, because that function is
  where the never-invent-a-product rule is actually enforced — a second copy is a second
  set of thresholds to keep in sync, and the one that falls behind is the one that ships
  a deformed part.
*/

async function compose(file, out) {
  const object = await cutOut(file);

  const scale = (PLATE.width * PLATE.objectSpan) / Math.max(object.width, object.height);
  const w = Math.round(object.width * scale);
  const h = Math.round(object.height * scale);
  const resized = await sharp(object.buffer).resize(w, h).png().toBuffer();

  const left = Math.round(PLATE.width * PLATE.centreX - w / 2);
  const top = Math.round(PLATE.height * PLATE.centreY - h / 2);

  /*
    The shadow is the object's own silhouette, blurred and tinted — not an ellipse under
    it. A drawn ellipse is the tell that separates a composite from a photograph, because
    the shadow stops agreeing with the shape that cast it.
  */
  const silhouette = await sharp(resized)
    .ensureAlpha()
    .composite([{ input: { create: { width: w, height: h, channels: 4, background: { r: 40, g: 40, b: 45, alpha: 1 } } }, blend: "in" }])
    .blur(PLATE.shadow.blur)
    .png()
    .toBuffer();

  await sharp(field(PLATE.width, PLATE.height))
    .composite([
      {
        input: await sharp(silhouette)
          .ensureAlpha()
          .composite([
            {
              input: {
                create: {
                  width: w,
                  height: h,
                  channels: 4,
                  background: { r: 255, g: 255, b: 255, alpha: PLATE.shadow.opacity },
                },
              },
              blend: "dest-in",
            },
          ])
          .png()
          .toBuffer(),
        left: left + PLATE.shadow.dx,
        top: top + PLATE.shadow.dy,
      },
      { input: resized, left, top },
    ])
    .webp({ quality: 90 })
    .toFile(out);

  return out;
}

/* ------------------------------------------------------------------------ run */

const outDir = flag("out", "tmp/claude-plates");
mkdirSync(outDir, { recursive: true });

let files = [];
const slug = flag("slug");
if (slug) {
  files = [`${slug}.webp`];
} else {
  const limit = Number(flag("limit", 10));
  /*
    Hero images only, and shuffled deterministically rather than sorted by size.

    Sorting by size selected the supplier's raw desk shots — see the guard in cutOut.
    Heroes (no -2, -3 … suffix) are the frames that went through the studio, so they are
    the population that can actually be composited. The guard still refuses any that slip
    through, which is the part that has to hold; this only stops the run wasting its
    attempts.
  */
  files = readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith(".webp") && !/-d+.webp$/.test(f) && !f.includes("-video"))
    .sort()
    .filter((_, i) => i % 7 === 0)
    .slice(0, limit);
}

console.log(`composing ${files.length} plate(s) into ${outDir}\n`);
for (const file of files) {
  const src = join(SOURCE_DIR, file);
  if (!existsSync(src)) {
    console.log(`  skip ${file} — not found`);
    continue;
  }
  try {
    const out = join(outDir, file.replace(/\.webp$/, "-plate.webp"));
    await compose(src, out);
    console.log(`  ${file}`);
  } catch (error) {
    console.log(`  FAILED ${file}: ${String(error).slice(0, 90)}`);
  }
}
console.log(`\nEvery pixel of every product above is the client's own photograph.`);
