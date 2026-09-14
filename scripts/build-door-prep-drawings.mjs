#!/usr/bin/env node
/**
 * Draws the DOOR PREPARATION — the holes to drill, not the shape of the part.
 *
 * ---------------------------------------------------------------------------
 * WHY A SECOND KIND OF DRAWING
 *
 * MIWA publish two per product: 外形図, the product outline, and 切欠図, the cut-out the
 * door needs. We already generate the first (84 of them, scripts/build-dimension-
 * drawings.mjs). The second answers a different question, and it is the one that decides
 * whether the hardware can go in at all: not "what does this look like" but "what do I
 * cut". See docs/research/2026-09-13-miwa-lock-structure.md.
 *
 * It is also the drawing most on-brand for this factory. The category rule in AGENTS.md
 * is about hole positions — "金属的孔位不对，螺丝不对，安装不上去" — so a factory whose
 * whole argument is that it gets hole positions right should be the one publishing them.
 *
 * ---------------------------------------------------------------------------
 * ⚠ THE RULE IS STRICTER HERE THAN FOR AN OUTLINE DRAWING
 *
 * Every dimension on a preparation drawing gets sawn. An outline drawing with a wrong
 * figure is caught when the part arrives and does not match; a preparation drawing with a
 * wrong figure is caught after somebody has already cut the customer's door. So:
 *
 *   - A hole is drawn ONLY where both its diameter and its position are published.
 *   - Nothing is inferred from the model number, from a sibling model, or from a
 *     standard. This is the same rule as the outline generator and it is not relaxed.
 *   - A product missing either figure produces NO drawing. There is no partial mode.
 *   - Door thickness is printed as a NOTE, never as a drawn feature: it varies per door
 *     and drawing it would imply we know the customer's door.
 *
 * WHAT THIS DELIBERATELY DOES NOT DRAW: mortise lock preparation. A mortise pocket needs
 * the spindle hole and the cylinder hole, and the catalogue records neither — the
 * `Cylinder` rows hold a material, not a diameter. The hand-drawn LC-085 sheet the client
 * circulated on 2026-09-12 had "Spindle Hole 8×8" and "Cylinder Hole Ø17" on it; those
 * two figures exist nowhere in our records, which is exactly why that drawing could not
 * ship. When the factory supplies them, add a recipe here.
 *
 * Usage:
 *   node scripts/build-door-prep-drawings.mjs          # write to public/images/door-prep
 *   node scripts/build-door-prep-drawings.mjs --dry    # report coverage only
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  INK,
  THIN,
  HAIR_W,
  OUTLINE_W,
  circle,
  centreLine,
  dimV,
  leader,
  rect,
  svgDocument,
  unitsNote,
} from "./lib/dimension-drawing.mjs";

const PRODUCT_DIR = "content/products";
const OUT_DIR = "public/images/door-prep";
const dry = process.argv.includes("--dry");

const HOLE_LABELS = ["Fixing hole", "Fixing hole (flush door)", "Fixing hole (glass door)"];
const CENTRE_LABELS = ["Centre distance", "Center Distance", "Grip centre distance"];
const THICKNESS_LABELS = ["Door thickness", "Suitable Door Thickness", "Glass thickness"];

/** First millimetre figure in a recorded string. "φ12mm" gives 12; "P=640mm" gives 640. */
function firstFigure(value) {
  const match = value.match(/(\d+(?:[.,]\d+)?)\s*mm/i) ?? value.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const figure = Number(match[1].replace(",", "."));
  return Number.isFinite(figure) && figure > 0 ? figure : null;
}

function row(product, labels) {
  return (product.specs ?? []).find((spec) => labels.includes(spec.label) && /\d/.test(spec.value));
}

/**
 * The drilling pattern: two holes of one diameter at one centre distance.
 *
 * This is the honest shape of what the catalogue knows. A pull handle or a lever on a
 * plate is fixed through the door on a pair of centres, and both figures are recorded on
 * 56 products. Anything more elaborate — a third fixing, a rose cut-out, a latch mortise
 * — is not recorded, so it is not drawn, and the note says which face the pattern is on
 * rather than letting the reader assume.
 */
function drawPattern({ diameter, centres, thickness, holeLabel }) {
  const scale = Math.min(1.6, 420 / Math.max(centres, 120));
  const radius = Math.max(3, (diameter / 2) * scale);
  const span = centres * scale;

  const marginX = 150;
  const marginY = 90;
  const panelW = Math.max(span, 160) + 120;
  const panelH = span + 60;
  /*
    The viewBox has to contain the panel, not just the margins. The first version computed
    height from the margins alone and produced a 720×300 box around a drawing 570 tall —
    every drawing silently clipped at the bottom hole. An SVG does not complain about
    that; it just crops, and a cropped preparation drawing is the one kind of image on
    this site that could send somebody to the wrong hole. Bounds are asserted in the test.
  */
  const width = marginX - 60 + panelW + 90;
  const height = marginY + panelH + 60;

  const cx = width / 2;
  const top = marginY + 30;
  const bottom = top + span;

  const body = [
    /*
      The door face is drawn as a light panel with one edge line, so the pattern is
      obviously ON something. It carries no dimensions: we do not know the customer's
      door and a dimensioned rectangle would read as a stile size we are specifying.
    */
    rect(marginX - 60, marginY, Math.max(span, 160) + 120, span + 60, {
      fill: "none",
      stroke: THIN,
      width: HAIR_W,
    }),
    `<line x1="${marginX - 60}" y1="${marginY}" x2="${marginX - 60}" y2="${marginY + span + 60}" stroke="${INK}" stroke-width="${OUTLINE_W}"/>`,

    centreLine(cx, top - 26, cx, bottom + 26),
    centreLine(cx - 40, top, cx + 40, top),
    centreLine(cx - 40, bottom, cx + 40, bottom),

    circle(cx, top, radius, { width: OUTLINE_W }),
    circle(cx, bottom, radius, { width: OUTLINE_W }),

    dimV(top, bottom, cx + Math.max(span, 160) / 2 + 46, `${centres}`, {
      from: cx + radius,
    }),
    leader(
      cx + radius * 0.7,
      top - radius * 0.7,
      cx - 92,
      top - 40,
      `2 × Ø${diameter}`,
    ),
  ];

  const notes = [`${holeLabel}. Centres ${centres}mm.`];
  if (thickness) notes.push(`For door thickness ${thickness} — confirm before drilling.`);
  notes.push("Hole positions only. Not a product outline.");

  body.push(unitsNote(marginX - 60, height - 26));

  return { body: body.join("\n    "), width, height, notes };
}

/* ------------------------------------------------------------------------ the run */

const products = readdirSync(PRODUCT_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(readFileSync(join(PRODUCT_DIR, name), "utf8")));

const index = {};
let drawn = 0;
const skipped = { unpublished: 0, noHole: 0, noCentre: 0, unparsable: 0 };

if (!dry) mkdirSync(OUT_DIR, { recursive: true });

for (const product of products) {
  if (!product.heroImage?.src) {
    skipped.unpublished += 1;
    continue;
  }

  const holeRow = row(product, HOLE_LABELS);
  const centreRow = row(product, CENTRE_LABELS);
  if (!holeRow) {
    skipped.noHole += 1;
    continue;
  }
  if (!centreRow) {
    skipped.noCentre += 1;
    continue;
  }

  const diameter = firstFigure(holeRow.value);
  const centres = firstFigure(centreRow.value);
  if (!diameter || !centres) {
    skipped.unparsable += 1;
    continue;
  }

  const thicknessRow = row(product, THICKNESS_LABELS);
  const drawing = drawPattern({
    diameter,
    centres,
    thickness: thicknessRow?.value,
    holeLabel: holeRow.label,
  });

  const title = `${product.model} — door preparation`;
  const svg = svgDocument({
    body: drawing.body,
    width: drawing.width,
    height: drawing.height,
    title,
    note: drawing.notes.join(" "),
  });

  if (!dry) writeFileSync(join(OUT_DIR, `${product.slug}.svg`), svg);

  index[product.slug] = {
    model: product.model,
    diameter,
    centres,
    holeLabel: holeRow.label,
    /* The exact strings the figures came from, so a reviewer can check without the JSON. */
    source: { hole: holeRow.value, centre: centreRow.value },
    note: drawing.notes.join(" "),
  };
  drawn += 1;
}

if (!dry) writeFileSync(join(OUT_DIR, "index.json"), `${JSON.stringify(index, null, 1)}\n`);

console.log(`${dry ? "Would draw" : "Drew"} ${drawn} door preparation drawings.`);
console.log(`  skipped: ${skipped.noHole} with no fixing-hole diameter,`);
console.log(`           ${skipped.noCentre} with a diameter but no centre distance,`);
console.log(`           ${skipped.unparsable} whose figures would not parse,`);
console.log(`           ${skipped.unpublished} unpublished.`);
