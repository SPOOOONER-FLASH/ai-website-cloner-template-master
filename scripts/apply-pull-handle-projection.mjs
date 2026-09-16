/**
 * Put the real projection in the `Projection` row of the pull handles, and delete the
 * `Rose depth` row that never held a rose depth.
 *
 * WHAT WAS WRONG
 * Thirty-three pull handles carried a pair of rows like
 *
 *     Projection    32mm
 *     Rose depth    65mm
 *
 * Both came off the UNION drawing, and both are wrong. The drawings state the standoff as a
 * chain at the foot of the elevation — T1263 reads `22 | 30 | 52`, which is the 22mm bar plus
 * 30mm of clear air equals 52mm from the door face to the outside of the grip. It is the
 * LARGER number that is the projection. Whoever transcribed these took the smaller one, and
 * for the smaller one they did not even take the same dimension twice:
 *
 *     T1050   `Projection 35mm`  — 35 is the DOOR THICKNESS, off the shaded door strip
 *     T2930   `Projection 35mm`  — likewise the door
 *     T1224   `Projection 75mm`  — 75 is the width of the backplate
 *     G1226   `Projection 25mm`  — 25 is the foot's footprint; the standoff is 19
 *
 * So the repair is not a swap. The value in `Rose depth` is the projection and moves into
 * `Projection`; the value that was in `Projection` is discarded, because it is a different
 * quantity on nearly every drawing and there is no honest label to give it. Nothing invented
 * takes its place — the drawing is on the product page, and AGENTS.md is right that a missing
 * row costs less trust than a plausible number. A buyer sizes the gap between a pull handle
 * and a door frame from this figure.
 *
 * T811 IS LEFT WITH NEITHER ROW
 * Its drawing gives `28 / 55` on one elevation and `Ø25 / 68` on the other, and those are the
 * foot's footprint on the door face, not a standoff. Its old `Projection 35mm` appears
 * nowhere on the drawing at all. Rather than guess, both rows go and the model shows no
 * projection until the factory supplies one.
 *
 * BH38, BH39, BH42 and BH54 ARE LEFT ALONE
 * They have no UNION drawing. Their figures come from scripts/cad-dimensions.mjs, measured
 * from CAD, and they read the normal way round (projection larger than rose depth).
 *
 * ORDER: run AFTER scripts/merge-artunion-specs.mjs, alongside apply-client-fixing-holes.mjs.
 * The manifests under content/rayen/ are corrected too, so a re-ingest starts from the right
 * numbers rather than depending on this script being remembered.
 *
 * Usage:
 *   node scripts/apply-pull-handle-projection.mjs          # apply
 *   node scripts/apply-pull-handle-projection.mjs --check  # CI: fail if a bad row came back
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const MANIFESTS = join(root, "content", "rayen");
const CHECK = process.argv.includes("--check");

/** Models where the drawing confirms the `Rose depth` value is the overall projection. */
export const PROJECTION_FROM_ROSE_DEPTH = new Set([
  "G1130", "G1159", "G1226", "G1236", "G1237", "G1239", "G2746", "G52", "G720",
  "T1018", "T1050", "T1122", "T1130", "T1224", "T1225", "T1263", "T1265",
  "T2083", "T2336", "T2412", "T25", "T2930", "T3103", "T52", "T5450", "T5650",
  "T720", "T812", "T8050", "T915", "T921", "T9972",
]);

/** Models whose drawing does not state a standoff at all. Both rows go. */
export const NO_PROJECTION_ON_DRAWING = new Set(["T811"]);

const isRoseDepth = (label) => /^rose depth$/i.test(String(label).trim());
const isProjection = (label) => /^projection$/i.test(String(label).trim());

/** Rewrite one specs array in place. Returns true if it changed. */
function repair(model, specs) {
  if (!Array.isArray(specs)) return false;
  const rose = specs.find((row) => isRoseDepth(row.label));
  if (!rose) return false;

  if (NO_PROJECTION_ON_DRAWING.has(model)) {
    const before = specs.length;
    for (let i = specs.length - 1; i >= 0; i--) {
      if (isRoseDepth(specs[i].label) || isProjection(specs[i].label)) specs.splice(i, 1);
    }
    return specs.length !== before;
  }
  if (!PROJECTION_FROM_ROSE_DEPTH.has(model)) return false;

  const projection = specs.find((row) => isProjection(row.label));
  if (projection) projection.value = rose.value;
  else specs.splice(specs.indexOf(rose), 0, { label: "Projection", value: rose.value });
  specs.splice(specs.indexOf(rose), 1);
  return true;
}

const owned = (model) => PROJECTION_FROM_ROSE_DEPTH.has(model) || NO_PROJECTION_ON_DRAWING.has(model);

const changed = [];
const stale = [];

/* 1 — the generated product records */
for (const file of readdirSync(PRODUCTS)) {
  if (!file.endsWith(".json")) continue;
  const path = join(PRODUCTS, file);
  const product = JSON.parse(readFileSync(path, "utf8"));
  if (!owned(product.model)) continue;
  if (!repair(product.model, product.specs)) continue;
  if (CHECK) stale.push(`${product.model}（${file}）`);
  else {
    writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`, "utf8");
    changed.push(product.model);
  }
}

/* 2 — the manifests those records are rebuilt from */
for (const file of readdirSync(MANIFESTS)) {
  if (!/^union-handles.*\.json$/.test(file)) continue;
  const path = join(MANIFESTS, file);
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  let touched = false;
  for (const model of manifest.models ?? []) {
    if (!owned(model.model)) continue;
    if (repair(model.model, model.specs)) touched = true;
  }
  if (!touched) continue;
  if (CHECK) stale.push(`清单 ${file}`);
  else writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

if (CHECK) {
  if (stale.length) {
    console.error(
      `⚠ ${stale.length} 处又出现了 Rose depth 行 —— 多半是重跑了 merge-artunion-specs.mjs ` +
        `之后没有再跑这一步：`,
    );
    for (const line of stale.slice(0, 12)) console.error(`   ${line}`);
    process.exit(1);
  }
  console.log("拉手突出尺寸检查通过：没有残留的 Rose depth 行。");
} else {
  console.log(`拉手突出尺寸改写 ${changed.length} 个型号（Rose depth 的数值移入 Projection，该行删除）。`);
  console.log(`   T811 两行都删了：图纸上的 55 / 68 是底座在门面上的投影宽度，不是突出。`);
}
