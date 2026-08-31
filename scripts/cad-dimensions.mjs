/**
 * Writes dimensions read off the client's own CAD drawings into the spec tables.
 *
 * WHY. Many products ship a dimensioned drawing in their gallery and nothing in their
 * spec table. The drawing is the most authoritative source we have — it is the client's
 * own production drawing, not a storefront listing — and it was going unread.
 *
 * ⚠ IT ALSO CONTRADICTS DATA WE ALREADY PUBLISHED. Five glass-door handles (100, 102,
 * 104, 106, 107) all carried `Size = 32x300x600 mm`, imported from one stahlock listing
 * and copied across the family. Their five drawings give five different geometries and
 * not one of them contains a 300 mm dimension. The shared value is removed here.
 *
 * HOW A ROW GETS INTO THIS FILE. Someone opened that model's drawing and read it. The
 * `drawing` field names the image, so any row can be re-checked against the same picture.
 * Nothing is inferred from a sibling model: 100 and 107 have the same 148 mm centres,
 * 102 has 147 and 106 has 125, which is exactly the kind of near-miss that makes copying
 * across a family unsafe.
 *
 * Run: node scripts/cad-dimensions.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "content/products";
const DRY = process.argv.includes("--dry");

/**
 * slug -> what that model's drawing states.
 *
 * `remove` lists labels whose current value the drawing contradicts. They are deleted
 * rather than corrected where the drawing does not offer a single replacement figure —
 * a back-to-back pull handle has a length and a centre distance, not one "size".
 */
const FROM_DRAWINGS = {
  "100-glass-door-handle": {
    drawing: "100-glass-door-handle-2.webp",
    remove: ["Size"],
    specs: [
      ["Length", "600mm"],
      ["Centre distance", "148mm"],
      ["Tube diameter", "32mm"],
      ["Standoff", "26mm"],
      ["Fixing centre", "30mm"],
      ["Glass gap", "7.5mm"],
    ],
  },
  "102-glass-door-handle": {
    drawing: "102-glass-door-handle-2.webp",
    remove: ["Size"],
    specs: [
      ["Length", "600mm"],
      ["Centre distance", "147mm"],
      ["Tube diameter", "32mm"],
      ["Standoff", "26mm"],
      ["Fixing centre", "30mm"],
      ["Glass gap", "8mm"],
    ],
  },
  "104-glass-door-handle": {
    drawing: "104-glass-door-handle-3.webp",
    remove: ["Size"],
    specs: [
      ["Length", "600mm"],
      ["Centre distance", "149mm at the head, 133mm at the foot — tapered"],
      ["Tube diameter", "32mm, tapering to 19mm"],
      ["Standoff", "26mm"],
      ["Fixing centre", "34mm"],
      ["Glass gap", "8mm"],
    ],
  },
  "106-glass-door-handle": {
    drawing: "106-glass-door-handle-3.webp",
    remove: ["Size"],
    specs: [
      ["Length", "600mm"],
      ["Centre distance", "125mm"],
      ["Grip length", "140mm"],
      ["Tube diameter", "32mm, tapering to 18.5mm"],
      ["Standoff", "26mm"],
      ["Fixing centre", "30mm"],
      ["Glass gap", "7mm"],
    ],
  },
  "107-glass-door-handle": {
    drawing: "107-glass-door-handle-3.webp",
    remove: ["Size"],
    specs: [
      ["Length", "600mm"],
      ["Centre distance", "148mm"],
      ["Tube diameter", "32mm"],
      ["Standoff", "26mm"],
      ["Fixing centre", "30mm"],
      ["Glass gap", "8mm"],
    ],
  },
  "19-130mm-glass-door-handle": {
    drawing: "19-130mm-glass-door-handle-3.webp",
    specs: [
      ["Plate size", "200 × 65mm"],
      ["Plate thickness", "1.2mm"],
      ["Grip centre distance", "148mm"],
      ["Projection", "60mm"],
      ["Grip section", "19mm"],
      ["Slot width", "20mm"],
    ],
  },
  "9082e-stainless-steel-handle": {
    drawing: "9082e-stainless-steel-handle-2.webp",
    specs: [
      ["Plate size", "168 × 45mm"],
      ["Lever length", "135mm"],
      ["Lever section", "19mm"],
      ["Cylinder cutout", "17 × 33mm, 10mm keyway"],
      ["Fixing screws", "60mm and 16mm"],
    ],
  },
  "9005e-stainless-steel-handle": {
    drawing: "9005e-stainless-steel-handle-7.webp",
    specs: [
      ["Lever length", "130mm"],
      ["Rose diameter", "53mm"],
      ["Rose thickness", "8mm"],
      ["Lever section", "19mm"],
      ["Projection", "62mm"],
      ["Spindle", "8mm"],
    ],
  },
  "9004s-stainless-steel-handle": {
    drawing: "9004s-stainless-steel-handle-6.webp",
    specs: [
      ["Lever length", "135mm"],
      ["Rose size", "53mm square"],
      ["Rose thickness", "8mm"],
      ["Lever section", "20mm"],
      ["Projection", "63mm"],
      ["Spindle", "8mm"],
    ],
  },
  "bh38-bathroom-accessories": {
    drawing: "bh38-bathroom-accessories-4.webp",
    specs: [
      ["Rose diameter", "48mm"],
      ["Projection", "48mm"],
      ["Hook arm", "40mm"],
      ["Tube diameter", "8mm"],
      ["Rose depth", "20mm"],
    ],
  },
  "bh39-bathroom-accessories": {
    drawing: "bh39-bathroom-accessories-2.webp",
    specs: [
      ["Rose size", "45mm square"],
      ["Projection", "45mm"],
      ["Hook arm", "40mm"],
      ["Tube diameter", "8mm"],
      ["Rose depth", "18.5mm"],
    ],
  },
  "bh42-bathroom-accessories": {
    drawing: "bh42-bathroom-accessories-3.webp",
    specs: [
      ["Rose diameter", "48mm"],
      ["Projection", "48mm"],
      ["Tube diameter", "8mm"],
      ["Rose depth", "20mm"],
    ],
  },
  "bh54-bathroom-accessories": {
    drawing: "bh54-bathroom-accessories-3.webp",
    specs: [
      ["Overall length", "82mm"],
      ["Projection", "56mm"],
      ["Rose diameter", "50mm"],
      ["Rose depth", "14mm"],
      ["Upper hook", "30mm"],
      ["Tube diameter", "22mm, 8mm at the tip"],
    ],
  },
  "bh21-bathroom-accessories": {
    drawing: "bh21-bathroom-accessories-4.webp",
    specs: [
      ["Width", "152mm"],
      ["Drop", "96mm"],
      ["Rose diameter", "45mm"],
      ["Rose depth", "10mm"],
      ["Stem", "22mm"],
      ["Bar section", "6mm"],
    ],
  },
  "lc07-85-45mm-lock-case": {
    drawing: "lc07-85-45mm-lock-case.webp",
    // Independent confirmation of the LC naming convention decoded in
    // scripts/decode-model-suffixes.mjs: the drawing prints 85 and 45 for LC07 85×45.
    specs: [
      ["Faceplate", "240 × 23mm"],
      ["Case height", "173mm"],
      ["Case depth", "72mm"],
      ["Latch throw", "26mm"],
      ["Bolt projection", "18.5mm"],
    ],
  },
  "lc9045-lock-case": {
    drawing: "lc9045-lock-case.webp",
    /*
      The two figures the drawing prints, described as the drawing describes them.
      LC9045 was deliberately left out of the suffix decoder because 90 is not a euro
      centre distance and the pattern could not be read with confidence — this horizontal
      case measures faceplate-to-cylinder instead, which is why. Stated positionally
      rather than labelled "backset", because the drawing does not label it either.
    */
    specs: [
      ["Faceplate to cylinder centre", "90mm"],
      ["Cylinder centre to back", "45mm"],
    ],
  },
  "027-panic-exit-device": {
    drawing: "027-panic-exit-device-5.webp",
    specs: [
      ["Lever length", "122mm"],
      ["Plate width", "75mm"],
      ["Fixing centres", "52.5mm"],
      ["Plate height", "77.5mm"],
      ["Lever drop", "58mm"],
      ["Spindle length", "60mm"],
    ],
  },
  "ds01-door-stopper": {
    drawing: "ds01-door-stopper.webp",
    specs: [
      ["Height", "96mm"],
      ["Projection", "70mm"],
      ["Base diameter", "34mm"],
      ["Body diameter", "24mm"],
      ["Stem diameter", "10mm"],
      ["Footprint", "46mm"],
    ],
  },
  "9014-stainless-steel-handle": {
    drawing: "9014-stainless-steel-handle.webp",
    specs: [
      ["Lever length", "135mm"],
      ["Projection", "60mm"],
      ["Rose diameter", "53mm"],
      ["Rose thickness", "9mm"],
      ["Lever section", "19mm"],
      ["Spindle", "8mm"],
    ],
  },

  /*
    2026-08-31 batch. Found with scripts/score-cad-drawings.mjs rather than by opening the
    248-image shortlist one at a time; eight images opened, eight were drawings.

    Two of these drawings show the EXTERIOR TRIM that ships with a panic device, not the
    device. The rows are labelled as plate and lever so nobody reads 300 mm as the width of
    a panic bar.
  */
  "036-panic-exit-device": {
    drawing: "036-panic-exit-device-2.webp",
    specs: [
      ["Width", "200mm"],
      ["Height", "190mm"],
      ["Bar section", "4mm"],
      ["Plate width", "20mm"],
    ],
  },
  "001-panic-exit-device": {
    drawing: "001-panic-exit-device-3.webp",
    specs: [
      ["Plate size", "300 × 75mm"],
      ["Plate thickness", "1.5mm"],
      ["Grip centre distance", "179mm"],
      ["Projection", "60mm"],
      ["Cylinder cutout", "Ø32mm"],
    ],
  },
  // Prints bare figures with no unit; the whole drawing set is millimetres.
  "030-panic-exit-device": {
    drawing: "030-panic-exit-device-2.webp",
    specs: [
      ["Plate size", "178 × 52mm"],
      ["Lever length", "140mm"],
      ["Lever section", "22.5mm"],
      ["Projection", "40mm"],
    ],
  },
  "9003e-stainless-steel-handle": {
    drawing: "9003e-stainless-steel-handle-6.webp",
    specs: [
      ["Lever length", "133mm"],
      ["Rose diameter", "53mm"],
      ["Lever section", "19mm"],
      ["Rose thickness", "8mm"],
      ["Spindle", "8mm"],
      ["Projection", "62mm"],
    ],
  },
  /*
    9003E and 9007S are the same rose and the same spindle, and differ by one millimetre of
    lever and one of projection — 133/62 against 132/63. Read off two drawings, not copied.
  */
  "9007s-stainless-steel-handle": {
    drawing: "9007s-stainless-steel-handle-5.webp",
    specs: [
      ["Lever length", "132mm"],
      ["Rose diameter", "53mm"],
      ["Lever section", "19mm"],
      ["Rose thickness", "8mm"],
      ["Spindle", "8mm"],
      ["Projection", "63mm"],
    ],
  },
  // Bare figures again; the lever is an oval section, so 38 is its height, not a diameter.
  "nc182-stainless-steel-handle": {
    drawing: "nc182-stainless-steel-handle-4.webp",
    specs: [
      ["Lever length", "86mm"],
      ["Lever section", "38mm"],
      ["Lever drop", "49mm"],
      ["Spindle", "8mm"],
    ],
  },
  "bh41-bathroom-accessories": {
    drawing: "bh41-bathroom-accessories-2.webp",
    specs: [
      ["Height", "45mm"],
      ["Projection", "45mm"],
      ["Standoff", "18.5mm"],
      ["Bar section", "8mm"],
    ],
  },
  /*
    A floor-spring cement case. The drawing CONFIRMS the existing Size row rather than
    replacing it — 129 × 321.5 is the cover plate — so no plate row is added here. What the
    record was missing is that the plate overhangs a smaller body, and how deep that body is.
  */
  "f101-glass-door-patch-fittings": {
    drawing: "f101-glass-door-patch-fittings-6.webp",
    specs: [
      ["Plate thickness", "1mm"],
      ["Footprint", "308 × 108mm"],
      ["Case depth", "40.5mm"],
    ],
  },
};

let updated = 0;
let added = 0;
let removed = 0;

for (const file of readdirSync(DIR)) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const entry = FROM_DRAWINGS[product.slug];
  if (!entry) continue;

  let specs = [...(product.specs ?? [])];
  const before = specs.length;

  let removedHere = 0;
  for (const label of entry.remove ?? []) {
    const had = specs.length;
    specs = specs.filter((s) => s.label !== label);
    removedHere += had - specs.length;
  }
  removed += removedHere;
  for (const [label, value] of entry.specs) {
    if (specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) continue;
    specs.push({ label, value });
  }
  // Report what actually changed. Counting every entry with a `remove` list as an update
  // made a re-run look like it had rewritten thirteen products when it had rewritten none.
  const gained = specs.length - before + removedHere;
  if (!gained) continue;

  product.specs = specs;
  added += gained;
  updated += 1;
  if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

console.log(`products updated : ${updated}`);
console.log(`rows added       : ${added}`);
console.log(`rows removed     : ${removed} (contradicted by the drawing)`);
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
