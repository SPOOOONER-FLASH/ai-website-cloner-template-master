/**
 * Apply the client's own fixing-hole diameters to the M8 models, overriding UNION's.
 *
 * WHY THIS IS A SCRIPT AND NOT 42 HAND EDITS
 * The client said it three times, twice with the premise stated outright:
 *
 *   「螺丝是M8的木门开孔直径10mm，玻璃门开孔直径16mm」
 *   「玻璃门安装16mm，木门安装10mm」
 *
 * UNION publishes φ12 for the glass hole on eleven of these models (G1229, G4227, G685,
 * T1050, T1780, T3103, T8050, T811, T812, T921, T9972). The client's figure is the factory's
 * own shipping spec and wins — but it was applied on 2026-09-14 by editing the generated
 * product JSON directly, and content/rayen/*.json says in as many words not to do that.
 *
 * The next re-ingest proved why. Re-running the batch-5 and batch-6 manifests rebuilt those
 * records from their manifests, scripts/merge-artunion-specs.mjs put UNION's φ12 back, and
 * the client's ruling was silently undone on 42 models — on exactly the number a buyer
 * drills a hole to. A decision that survives only until the next regeneration is not a
 * decision, it is a note. So it lives here, in the same spirit as
 * scripts/rayen-door-types.mjs: a rule about the catalogue, expressed once.
 *
 * WHAT IT DELIBERATELY LEAVES ALONE
 * The M6 models — about fifty of them — keep UNION's φ12 / φ8. All three of the client's
 * statements carry the M8 premise, and none of them mentions M6. Widening the instruction to
 * screws it did not name would mean a fitter drilling 16mm for an M6 fixing: four millimetres
 * too wide, in a sheet of glass, and there is no putting that back.
 *
 * ORDER: run AFTER scripts/merge-artunion-specs.mjs, which is what writes the rows this
 * overrides. src/data/product-sites.test.ts asserts the result, so a future re-ingest that
 * forgets this step fails the suite instead of shipping.
 *
 * Usage:
 *   node scripts/apply-client-fixing-holes.mjs          # apply
 *   node scripts/apply-client-fixing-holes.mjs --check  # CI: fail if any M8 model is stale
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const CHECK = process.argv.includes("--check");

/** The client's figures, keyed by the door the hole goes in. */
export const CLIENT_M8_HOLES = [
  { label: "Fixing hole (glass door)", value: "φ16mm" },
  { label: "Fixing hole (timber door)", value: "φ10mm" },
];

/** Any row this script owns — every spelling merge-artunion-specs.mjs can emit. */
const isHoleRow = (label) => /^Fixing hole/.test(label);

const changed = [];
const stale = [];

for (const file of readdirSync(PRODUCTS)) {
  if (!file.endsWith(".json")) continue;
  let product;
  try {
    product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
  } catch {
    continue;
  }
  if (!(product.sites ?? []).includes("rayen")) continue;

  const specs = product.specs ?? [];
  const screw = specs.find((row) => row.label === "Fixing screw")?.value;
  if (screw !== "M8") continue;

  const current = specs.filter((row) => isHoleRow(row.label));
  const correct =
    current.length === CLIENT_M8_HOLES.length &&
    CLIENT_M8_HOLES.every((want, i) => current[i]?.label === want.label && current[i]?.value === want.value);
  if (correct) continue;

  if (CHECK) {
    stale.push(
      `${product.model}：${current.map((r) => `${r.label}=${r.value}`).join("、") || "（没有开孔行）"}`,
    );
    continue;
  }

  /*
    Replace in place at the first hole row, so the two client rows land where UNION's did —
    after "Fixing screw" — rather than being appended below the weight.
  */
  const at = specs.findIndex((row) => isHoleRow(row.label));
  const kept = specs.filter((row) => !isHoleRow(row.label));
  const insertAt = at >= 0 ? at : kept.length;
  product.specs = [...kept.slice(0, insertAt), ...CLIENT_M8_HOLES.map((r) => ({ ...r })), ...kept.slice(insertAt)];

  writeFileSync(join(PRODUCTS, file), `${JSON.stringify(product, null, 2)}\n`, "utf8");
  changed.push(product.model);
}

if (CHECK) {
  if (stale.length) {
    console.error(
      `⚠ ${stale.length} 个 M8 型号的开孔直径不是甲方给的 φ16 / φ10 —— ` +
        `多半是重跑了 merge-artunion-specs.mjs 之后没有再跑这一步：`,
    );
    for (const line of stale.slice(0, 12)) console.error(`   ${line}`);
    process.exit(1);
  }
  console.log("M8 开孔直径检查通过：全部是甲方给的 φ16（玻璃门）/ φ10（木门）。");
} else {
  console.log(`M8 开孔直径按甲方口径改写 ${changed.length} 个型号（玻璃门 φ16，木门 φ10）。`);
  if (changed.length) console.log(`   ${changed.join("、")}`);
}
