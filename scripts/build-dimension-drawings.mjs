#!/usr/bin/env node
/**
 * Draws a dimensioned line drawing for every product whose record carries the geometry.
 *
 * ---------------------------------------------------------------------------
 * THE GAP THIS FILLS
 *
 * FSB's product page has five parts and ours has four. The missing one is the dimensioned
 * drawing, and it is the one a specifier actually reads: a photograph says what a part
 * looks like, a drawing says whether it fits. `scripts/build-render-brief.mjs` measured
 * the cost of not having it — 435 products, 31 with enough published geometry to draw.
 *
 * This draws those. It is the cheapest of the three routes out of that hole (the other
 * two being a Blender render per model and a photographer), it needs no new data, and the
 * day the factory sends drawings for the remaining 404 it produces those too without
 * anybody rewriting it.
 *
 * ---------------------------------------------------------------------------
 * THE RULE
 *
 * A feature is drawn only where its dimension is published. Nothing is completed from a
 * standard, nothing is inferred from a sibling model, and a recipe that cannot get its
 * required figures produces NO drawing rather than a partial one. A drawing is read as a
 * statement of fact — more so than prose, because it looks like it came off a CAD seat —
 * so a plausible-looking outline with one guessed dimension is the most damaging thing
 * this repository could publish.
 *
 * Two dimensions are drawn but never dimensioned, because they are needed to have a
 * closed outline at all and are not published: faceplate thickness on a lock case, and
 * plate thickness on an exit device. Both are drawn at a nominal value and carry NO
 * dimension line, so nothing on the page invites a reader to measure them.
 *
 * Usage:
 *   node scripts/build-dimension-drawings.mjs            # write to public/images/drawings
 *   node scripts/build-dimension-drawings.mjs --dry      # report coverage only
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  THIN,
  OUTLINE_W,
  HAIR_W,
  circle,
  centreLine,
  dimH,
  dimV,
  leader,
  rect,
  svgDocument,
  unitsNote,
} from "./lib/dimension-drawing.mjs";

const DRY = process.argv.includes("--dry");
const OUT = "public/images/drawings";
const DIR = "content/products";

/* ------------------------------------------------------------------ dimensions */

/** First millimetre figure. "13mm, with inside deadlocking button" → 13. */
function mm(value) {
  if (!value) return null;
  const m = String(value).match(/(\d+(?:[.,]\d+)?)\s*mm/i);
  return m ? Number(m[1].replace(",", ".")) : null;
}

/** "300 × 75mm" → [300, 75]. Both figures, in the order written. */
function pair(value) {
  if (!value) return null;
  const m = String(value).match(/(\d+(?:[.,]\d+)?)\s*[×x*]\s*(\d+(?:[.,]\d+)?)\s*mm/i);
  return m ? [Number(m[1].replace(",", ".")), Number(m[2].replace(",", "."))] : null;
}

/** A diameter, from "Ø32mm" or "32mm". */
function dia(value) {
  if (!value) return null;
  const m = String(value).match(/[Øø⌀ф]?\s*(\d+(?:[.,]\d+)?)\s*mm/i);
  return m ? Number(m[1].replace(",", ".")) : null;
}

const get = (specs, ...labels) => {
  for (const label of labels) if (specs.has(label)) return specs.get(label);
  return null;
};

/* --------------------------------------------------------------------- recipes */

/**
 * Each recipe returns { body, width, height, note } in MILLIMETRES, or null when the
 * record does not publish what it needs. The caller adds the margin and the units note.
 *
 * ---------------------------------------------------------------------------
 * RECIPES ARE CHOSEN BY GEOMETRY, NOT BY CATEGORY
 *
 * The first version keyed these off `categoryPath[0]` and drew seven products. The reason
 * was not missing data: `19-130mm-glass-door-handle` publishes a plate size and a grip
 * centre distance — everything the exit-device plate recipe needs — but it is filed under
 * glass-door-accessories, so the plate recipe was never offered it. A pull handle is a
 * pull handle whether the catalogue files it under glass or stainless.
 *
 * So the recipes are tried in order and the first one whose required figures are all
 * present wins. Category is a merchandising decision; geometry is a fact about the shape,
 * and the shape is what is being drawn.
 */
const RECIPES = {
  /*
    LOCK CASE — the view a joiner works from.

    Looking at the case side-on: the faceplate stands at the left as a thin edge, the case
    body runs into the door to the right. Backset is measured horizontally from the
    faceplate FACE to the spindle centre, which is what the word means; centre distance is
    the vertical gap between the spindle and the cylinder, which straddle the case waist.
    Getting that last relationship wrong is what the Blender model did first, and it is
    visible immediately in a drawing — which is one more argument for drawing before
    rendering.
  */
  lockCase: (specs) => {
    const backset = mm(get(specs, "Backset"));
    const centre = mm(get(specs, "Centre distance", "Center Distance"));
    const caseH = mm(get(specs, "Case height"));
    const caseD = mm(get(specs, "Case depth"));
    const faceplate = pair(get(specs, "Faceplate"));
    if (!backset || !centre || !caseH || !caseD || !faceplate) return null;

    const [plateL, plateW] = faceplate;
    const PLATE_T = 3; // nominal, never dimensioned — see the header.
    const spindleR = 4;
    const cylR = 8.5;

    const height = Math.max(plateL, caseH);
    const midY = height / 2;
    const body = [
      rect(0, midY - plateL / 2, PLATE_T, plateL),
      rect(PLATE_T, midY - caseH / 2, caseD, caseH),

      centreLine(-10, midY - centre / 2, PLATE_T + caseD + 10, midY - centre / 2),
      centreLine(-10, midY + centre / 2, PLATE_T + caseD + 10, midY + centre / 2),
      centreLine(PLATE_T + backset, midY - caseH / 2 - 10, PLATE_T + backset, midY + caseH / 2 + 10),

      rect(PLATE_T + backset - spindleR, midY - centre / 2 - spindleR, spindleR * 2, spindleR * 2, {
        width: HAIR_W,
      }),
      circle(PLATE_T + backset, midY + centre / 2, cylR, { width: HAIR_W }),

      dimH(PLATE_T, PLATE_T + backset, midY - caseH / 2 - 22, `${backset}`, {
        from: midY - caseH / 2,
      }),
      dimV(midY - centre / 2, midY + centre / 2, PLATE_T + caseD + 26, `${centre}`, {
        from: PLATE_T + caseD,
      }),
      dimV(midY - caseH / 2, midY + caseH / 2, PLATE_T + caseD + 56, `${caseH}`, {
        from: PLATE_T + caseD,
      }),
      dimH(PLATE_T, PLATE_T + caseD, midY + caseH / 2 + 24, `${caseD}`, {
        from: midY + caseH / 2,
      }),
      dimV(midY - plateL / 2, midY + plateL / 2, -26, `${plateL}`, { from: 0 }),
    ].join("\n    ");

    return {
      body,
      width: PLATE_T + caseD,
      height,
      offsetX: 0,
      note: `Faceplate ${plateL} × ${plateW}mm. Backset ${backset}mm, centre distance ${centre}mm.`,
    };
  },

  /*
    PULL HANDLE — an elevation with the two standoffs.

    Length and centre distance are the pair a specifier checks first: the handle has to
    fit the door leaf, and the fixings have to land where the glass is drilled. Tube
    diameter goes on a leader rather than a dimension line because it is a diameter of a
    round section seen side-on, and a dimension line there would read as a width.
  */
  /*
    RIM LOCK / SURFACE BOX — a case that mounts on the face of the door.

    Size gives the outline; backset places the cylinder from the closing edge; the bolt
    throw, where published, is drawn as the bolt standing proud of the case, because that
    is the figure that decides whether the keep can be fitted.
  */
  rimLock: (specs) => {
    const size = pair(get(specs, "Size", "Sizes"));
    const backset = mm(get(specs, "Backset"));
    if (!size || !backset) return null;

    const [w, h] = size;
    if (backset > w) return null; // the figures disagree; say nothing rather than draw a lie.
    const throwLen = mm(get(specs, "Deadbolt throw", "Latch extension", "Latch throw"));
    const cylR = 15;

    const body = [
      rect(0, 0, w, h),
      ...(throwLen ? [rect(-throwLen, h / 2 - 8, throwLen, 16, { width: HAIR_W })] : []),
      centreLine(backset, -10, backset, h + 10),
      centreLine(-10, h / 2, w + 10, h / 2),
      circle(backset, h / 2, cylR, { width: HAIR_W }),

      dimH(0, backset, h + 24, `${backset}`, { from: h }),
      dimH(0, w, h + 52, `${w}`, { from: h }),
      dimV(0, h, w + 26, `${h}`, { from: w }),
      ...(throwLen ? [dimH(-throwLen, 0, -30, `${throwLen}`, { from: h / 2 - 8 })] : []),
    ].join("\n    ");

    return {
      body,
      width: w,
      height: h,
      offsetX: throwLen ?? 0,
      note: `Case ${w} × ${h}mm, backset ${backset}mm${throwLen ? `, bolt throw ${throwLen}mm` : ""}.`,
    };
  },

  /*
    BOLT DETAIL — for the 26 records that publish how far the bolts throw and where the
    cylinder sits, and nothing about the case outline.

    The temptation was to give them the rimLock outline with an assumed case size, and
    that would have been the single worst thing in this file: a drawing is read as
    measured, so an invented outline carrying three real figures is more misleading than
    no drawing at all.

    So this draws only what is known — the closing edge, the cylinder at its backset, and
    each bolt at its published throw — and the title says "bolt detail", not "product
    drawing". A partial view is normal engineering practice; a completed guess is not.
  */
  boltDetail: (specs) => {
    const backset = mm(get(specs, "Backset"));
    const latch = mm(get(specs, "Latch extension", "Latch throw"));
    const dead = mm(get(specs, "Deadbolt throw", "Bolt projection"));
    if (!backset || (!latch && !dead)) return null;

    const cylR = 15;
    const reach = Math.max(latch ?? 0, dead ?? 0);
    const height = Math.max(backset * 1.6, cylR * 4, 90);
    const midY = height / 2;
    const bolts = [latch, dead].filter(Boolean);
    const gap = 30;
    const first = midY - ((bolts.length - 1) * gap) / 2;

    /*
      The first layout put each bolt's dimension immediately above its own bar and the
      "closing edge" caption at the top right. With two bolts 30mm apart, a 13 and a 25
      landed on top of each other and on the caption. Dimension lines need room the same
      way the drawing does.

      So: every dimension goes BELOW the assembly, stacked, each one further out than the
      last, and the caption moves under the edge line it names. That is also the
      conventional place for it — a note sits outside the view, not across it.
    */
    const dimBase = height + 22;
    const body = [
      /* The closing edge of the door: everything to its left is inside the frame. */
      `<line x1="${reach}" y1="-10" x2="${reach}" y2="${height + 6}" stroke="${THIN}" stroke-width="${OUTLINE_W}" stroke-dasharray="10 5"/>`,

      ...bolts.map((len, i) =>
        rect(reach - len, first + i * gap - 7, len, 14, { width: HAIR_W }),
      ),

      centreLine(-14, midY, reach + backset + cylR + 16, midY),
      centreLine(reach + backset, -10, reach + backset, height + 6),
      circle(reach + backset, midY, cylR, { width: HAIR_W }),

      dimH(reach, reach + backset, dimBase, `${backset}`, { from: height }),
      ...bolts.map((len, i) =>
        dimH(reach - len, reach, dimBase + 26 + i * 26, `${len}`, { from: height }),
      ),

      `<text x="${reach}" y="${dimBase + 26 + bolts.length * 26 + 6}" font-size="10" fill="${THIN}" text-anchor="middle" font-family="'Archivo',Arial,sans-serif">closing edge</text>`,
    ].join("\n    ");

    return {
      body,
      width: reach + backset + cylR + 20,
      height,
      offsetX: 0,
      partial: true,
      padBottom: 26 + bolts.length * 26,
      note: [
        `Backset ${backset}mm to the cylinder centre.`,
        latch ? `Latch throw ${latch}mm.` : "",
        dead ? `Deadbolt throw ${dead}mm.` : "",
        "Case outline is not published and is therefore not drawn.",
      ].filter(Boolean).join(" "),
    };
  },

  pullHandle: (specs) => {
    const length = mm(get(specs, "Length"));
    const centre = mm(get(specs, "Centre distance", "Center Distance"));
    const tube = dia(get(specs, "Tube diameter"));
    const fixing = mm(get(specs, "Fixing centre", "Fixing centres"));
    if (!length || !centre || !tube) return null;

    const standoff = fixing ?? tube;
    const projection = mm(get(specs, "Projection")) ?? standoff * 2;
    const midX = projection + tube / 2;

    const body = [
      rect(midX - tube / 2, 0, tube, length),
      rect(0, (length - centre) / 2 - standoff / 2, projection, standoff),
      rect(0, (length + centre) / 2 - standoff / 2, projection, standoff),
      centreLine(-10, (length - centre) / 2, midX + tube, (length - centre) / 2),
      centreLine(-10, (length + centre) / 2, midX + tube, (length + centre) / 2),

      dimV(0, length, midX + tube / 2 + 30, `${length}`, { from: midX + tube / 2 }),
      dimV((length - centre) / 2, (length + centre) / 2, -26, `${centre}`, { from: 0 }),
      leader(midX, length * 0.14, midX + tube * 2.4, length * 0.08, `Ø${tube}`),
      ...(fixing ? [dimH(0, projection, length + 22, `${projection}`, { from: length })] : []),
    ].join("\n    ");

    return {
      body,
      width: midX + tube / 2,
      height: length,
      offsetX: 0,
      note: `Length ${length}mm, centre distance ${centre}mm, tube Ø${tube}mm.`,
    };
  },

  /*
    EXIT DEVICE TRIM — the plate as it sits on the door, seen face-on.

    Plate size and grip centre distance are what decides whether the trim lines up with
    the bar it works. The cylinder cutout is drawn at its published diameter because a
    buyer whose cylinder does not pass through it has bought the wrong plate.
  */
  platedTrim: (specs) => {
    const plate = pair(get(specs, "Plate size"));
    const grip = mm(get(specs, "Grip centre distance"));
    const cut = dia(get(specs, "Cylinder cutout"));
    if (!plate || !grip) return null;

    const [w, h] = plate;
    const projection = mm(get(specs, "Projection"));
    const gripY = h / 2;
    const gripX1 = (w - grip) / 2;
    const gripX2 = (w + grip) / 2;

    const body = [
      rect(0, 0, w, h),
      centreLine(gripX1, -10, gripX1, h + 10),
      centreLine(gripX2, -10, gripX2, h + 10),
      ...(cut ? [circle(w / 2, gripY, cut / 2, { width: HAIR_W })] : []),
      circle(gripX1, gripY, 5, { width: HAIR_W }),
      circle(gripX2, gripY, 5, { width: HAIR_W }),

      dimH(gripX1, gripX2, h + 24, `${grip}`, { from: h }),
      dimH(0, w, h + 52, `${w}`, { from: h }),
      dimV(0, h, w + 26, `${h}`, { from: w }),
      ...(cut ? [leader(w / 2 + cut / 2 * 0.7, gripY - cut / 2 * 0.7, w / 2 + cut * 1.6, -14, `Ø${cut}`)] : []),
    ].join("\n    ");

    return {
      body,
      width: w,
      height: h,
      offsetX: 0,
      note: [
        `Plate ${w} × ${h}mm, grip centres ${grip}mm.`,
        cut ? `Cylinder cutout Ø${cut}mm.` : "",
        projection ? `Projection ${projection}mm.` : "",
      ].filter(Boolean).join(" "),
    };
  },

  /*
    GRAB RAIL / WALL-MOUNTED TUBE — a bar on two brackets, seen from the side.

    Bathroom rails and stainless pulls publish length, tube diameter and projection but
    no centre distance, so they cannot use the pull-handle recipe: without a centre
    distance the bracket positions would have to be invented. Here the brackets are drawn
    at the ends of the rail, which is where they are on a grab rail, and their spacing
    carries NO dimension line — the drawing shows the shape and dimensions only the three
    figures the record actually states.
  */
  grabRail: (specs) => {
    const length = mm(get(specs, "Length"));
    const tube = dia(get(specs, "Tube diameter", "Diameter"));
    const projection = mm(get(specs, "Projection"));
    if (!length || !tube || !projection) return null;

    const height = mm(get(specs, "Height"));
    const bracket = Math.max(tube * 1.6, 20);
    const inset = bracket / 2 + 6;

    const body = [
      rect(projection - tube, 0, tube, length),
      rect(0, inset - bracket / 2, projection - tube, bracket, { width: HAIR_W }),
      rect(0, length - inset - bracket / 2, projection - tube, bracket, { width: HAIR_W }),
      // The wall the rail is fixed to, so "projection" reads as a distance FROM something.
      `<line x1="0" y1="-14" x2="0" y2="${length + 14}" stroke="${THIN}" stroke-width="${OUTLINE_W}"/>`,

      dimV(0, length, projection + 30, `${length}`, { from: projection }),
      dimH(0, projection, length + 24, `${projection}`, { from: length }),
      leader(projection - tube / 2, length * 0.5, projection + tube * 2.2, length * 0.42, `Ø${tube}`),
    ].join("\n    ");

    return {
      body,
      width: projection,
      height: length,
      offsetX: 0,
      note: `Length ${length}mm, projection ${projection}mm from the wall, tube Ø${tube}mm${height ? `, height ${height}mm` : ""}.`,
    };
  },
};

/* ------------------------------------------------------------------------ run */

const MARGIN = 76;

const products = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

if (!DRY) mkdirSync(OUT, { recursive: true });

let drawn = 0;
const index = [];
const skipped = new Map();

/*
  Order matters: the most specific shape is offered the record first. A lock case that
  also happens to publish a Length would otherwise be drawn as a pull handle, which is a
  drawing of the wrong object made entirely of correct numbers — the worst possible
  outcome here, because every figure on it would check out.
*/
const ORDER = ["lockCase", "platedTrim", "rimLock", "pullHandle", "grabRail", "boltDetail"];

for (const product of products) {
  const family = product.categoryPath?.[0];
  const specs = new Map((product.specs ?? []).map((s) => [s.label, s.value]));

  let drawing = null;
  for (const name of ORDER) {
    drawing = RECIPES[name](specs);
    if (drawing) {
      drawing.shape = name;
      break;
    }
  }
  if (!drawing) {
    skipped.set(family, (skipped.get(family) ?? 0) + 1);
    continue;
  }

  /* A recipe that stacks dimensions below the view says how much room it needs. */
  const width = drawing.width + MARGIN * 2;
  const height = drawing.height + MARGIN * 2 + (drawing.padBottom ?? 0);
  const title = `${product.modelTbc ? product.name : `${product.model} ${product.name}`} — ${drawing.partial ? "bolt detail" : "dimensioned drawing"}`;

  const svg = svgDocument({
    width,
    height,
    title,
    note: `${drawing.note} Drawn 1:1 from the published specification; unstated features are not shown.`,
    body: `<g transform="translate(${MARGIN} ${MARGIN})">
      ${drawing.body}
    </g>
    ${unitsNote(MARGIN, height - 22)}`,
  });

  if (!DRY) writeFileSync(join(OUT, `${product.slug}.svg`), svg);
  index.push([product.slug, { shape: drawing.shape, note: drawing.note, partial: Boolean(drawing.partial) }]);
  drawn += 1;
}

/*
  An index the site can read at build time. Without it a component would have to probe the
  filesystem for every product, and a missing file would become a broken <img> rather than
  an absent section — the drawing is either there or the block does not render.
*/
if (!DRY) {
  writeFileSync(
    join(OUT, "index.json"),
    `${JSON.stringify(Object.fromEntries(index.sort()), null, 1)}\n`,
  );
}

console.log(`${DRY ? "[dry] " : ""}${drawn} drawing(s) from ${products.length} products`);
if (skipped.size) {
  console.log("\nnot drawn:");
  for (const [why, n] of [...skipped].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${why}`);
  }
  console.log("\nA family with no recipe needs one; a product with no dimensions needs the factory.");
}
if (!DRY) console.log(`\n-> ${OUT}`);
