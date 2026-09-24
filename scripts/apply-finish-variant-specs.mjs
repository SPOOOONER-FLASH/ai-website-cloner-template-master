/**
 * Give a finish variant the dimensions of the model it is a finish of.
 *
 * WHY THIS EXISTS
 * Client, 2026-09-15, explaining how UNION numbers a lever:
 *
 *   「ul代表是门把手，后面的数字代表是型号，再后面的数字就表达其他的意思，
 *     要不就是表面的处理加上材料的。前面的第一个字不要，门把手 UL 开始。」
 *
 * So in MUL1066 the model is UL1066 and the leading M is not part of it. That matters,
 * because MUL1066 and MUL1022 shipped with no spec table at all while UL1066 and UL1022
 * carry full ones, and UNION has no record of the M-prefixed numbers — they are the
 * factory's own marking, so nothing can be scraped for them.
 *
 * VERIFIED BY PHOTOGRAPH, NOT BY THE NUMBER
 * A naming rule is not evidence about a part. Both pairs were put side by side first:
 *
 *   MUL1066 / UL1066   same round rose, same knurled grip, same taper — 玫瑰金 vs 黑色
 *   MUL1022 / UL1022   same flat blade, same rose, same drop — 砂镍 vs 黑色
 *
 * Identical geometry, different finish. That is what licenses this file. A pair that merely
 * looked related, or differed in shape anywhere, would not be in the list.
 *
 * WHAT IS COPIED, AND WHAT IS POINTEDLY NOT
 * Dimensions only. Weight is excluded, and that exclusion is the whole point of being
 * careful here: the client said the trailing digits encode 「表面的处理加上材料的」 — finish
 * AND material. If the M marks a different alloy, the shape is unchanged but the weight is
 * not, and a wrong weight on a quotation is a wrong shipping cost. Our records call both
 * stainless, but that came from a pack name rather than from the factory, so it is not
 * strong enough to carry a number a buyer would price against.
 *
 * MUL2101 and MTR2110 are deliberately absent: UL2101 is not in the catalogue at all, and
 * MTR2110 does not resolve to T2110 under the client's own rule (dropping one letter leaves
 * TR2110). Both are still open questions for the factory.
 *
 * ORDER: run AFTER scripts/merge-artunion-specs.mjs, which rebuilds the rows this reads
 * from. src/lib/rayen-paths.test.ts runs the --check so a re-ingest that forgets this step
 * fails the suite instead of quietly emptying the tables again.
 *
 * Usage:
 *   node scripts/apply-finish-variant-specs.mjs
 *   node scripts/apply-finish-variant-specs.mjs --check
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");
const CHECK = process.argv.includes("--check");

/** variant -> the model it is a finish of. Each pair checked against the photographs. */
const FINISH_OF = {
  MUL1066: "UL1066",
  MUL1022: "UL1022",
};

/** Rows that describe the SHAPE. Anything not named here stays where it is. */
const GEOMETRY = new Set([
  "Lever length",
  "Lever section",
  "Lever drop",
  "Lever thickness",
  "Rose diameter",
  "Rose thickness",
  "Projection",
  "Center distance",
  "Overall length",
  "Grip section",
  "Fixing center",
  "Backset",
  "Spindle",
]);

const byModel = new Map();
for (const file of readdirSync(PRODUCTS)) {
  if (!file.endsWith(".json")) continue;
  try {
    const product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    byModel.set(String(product.model ?? "").trim(), { file, product });
  } catch {
    /* another session may be mid-write */
  }
}

const applied = [];
const problems = [];

for (const [variant, base] of Object.entries(FINISH_OF)) {
  const v = byModel.get(variant);
  const b = byModel.get(base);
  if (!v) {
    problems.push(`${variant}：目录里没有这个型号`);
    continue;
  }
  if (!b) {
    problems.push(`${variant}：找不到它的底型号 ${base}`);
    continue;
  }

  const rows = (b.product.specs ?? []).filter((row) => GEOMETRY.has(row.label));
  if (!rows.length) {
    problems.push(`${variant}：${base} 自己也没有尺寸行，没得抄`);
    continue;
  }

  const have = new Set((v.product.specs ?? []).map((row) => row.label));
  const missing = rows.filter((row) => !have.has(row.label));
  if (!missing.length) continue;

  if (CHECK) {
    problems.push(`${variant}：少 ${missing.length} 行（应当照 ${base} 补）`);
    continue;
  }

  v.product.specs = [...(v.product.specs ?? []), ...missing.map((row) => ({ ...row }))];
  /* Say where the numbers came from, on the record itself. */
  v.product.specSources = {
    ...(v.product.specSources ?? {}),
    finishVariantOf: { model: base, basis: "same-shape-different-finish", rows: missing.length },
  };
  writeFileSync(join(PRODUCTS, v.file), `${JSON.stringify(v.product, null, 2)}\n`, "utf8");
  applied.push(`${variant} ← ${base}：${missing.map((r) => r.label).join("、")}`);
}

if (CHECK) {
  if (problems.length) {
    console.error(`⚠ ${problems.length} 个表面变体的尺寸行没有跟上底型号：`);
    for (const line of problems) console.error(`   ${line}`);
    process.exit(1);
  }
  console.log(`表面变体尺寸检查通过：${Object.keys(FINISH_OF).length} 个都跟底型号一致。`);
} else {
  console.log(`表面变体补尺寸：${applied.length} 个型号（只补形状，不补重量）。`);
  for (const line of applied) console.log(`   ${line}`);
  if (problems.length) {
    console.error(`⚠ ${problems.length} 个没处理：`);
    for (const line of problems) console.error(`   ${line}`);
  }
}
