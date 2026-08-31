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

  for (const label of entry.remove ?? []) {
    const had = specs.length;
    specs = specs.filter((s) => s.label !== label);
    removed += had - specs.length;
  }
  for (const [label, value] of entry.specs) {
    if (specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) continue;
    specs.push({ label, value });
  }
  if (specs.length === before && !(entry.remove ?? []).length) continue;

  product.specs = specs;
  added += entry.specs.length;
  updated += 1;
  if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

console.log(`products updated : ${updated}`);
console.log(`rows added       : ${added}`);
console.log(`rows removed     : ${removed} (contradicted by the drawing)`);
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
