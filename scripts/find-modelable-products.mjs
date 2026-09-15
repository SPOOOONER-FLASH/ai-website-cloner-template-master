/**
 * Which products already publish enough dimensions to build an honest partial 3D model.
 *
 * WHY
 * Client, 2026-09-15, looking at the 9004S preview: 「研究下还有什么可以建模的 …… 搞得还可以」.
 *
 * The three models published so far were each dimensioned by hand, and two of them had to
 * reach past the spec table to do it — LC04's 93 × 173 case envelope and 70SN's Ø17 housings
 * are not in those products' published rows, and LC04's note says outright that the 15 mm
 * thickness is an assumed closure value rather than a published dimension. That is honest,
 * but it does not scale: every model built that way needs someone to read a drawing and
 * decide what to assume.
 *
 * 9004S is the case that does scale. Its table alone — 135 mm lever, 53 mm square rose, 8 mm
 * rose thickness, 20 mm lever section, 63 mm projection — defines the solid with nothing
 * assumed. So this script looks for products in that position: where the shape follows from
 * rows the site already publishes, and a model would state only what the factory states.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * It does not rank by how nice the product would look, and it does not guess. A product
 * missing one dimension of an archetype is reported as missing it, by name, rather than
 * being offered with a note that the gap "could be assumed" — the assumption is exactly the
 * part a person has to decide, and burying it in a candidate list is how it stops being
 * decided.
 *
 * Usage:
 *   node scripts/find-modelable-products.mjs              # ready-to-model candidates
 *   node scripts/find-modelable-products.mjs --near       # also those one row short
 *   node scripts/find-modelable-products.mjs --site=rayen
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS = join(root, "content", "products");

const argv = process.argv.slice(2);
const NEAR = argv.includes("--near");
const SITE = (argv.find((a) => a.startsWith("--site=")) ?? "").slice(7);

/** Already published — listed so the report says "new" rather than repeating work. */
const ALREADY = new Set(["9004S", "LC04 85*60", "70SN"]);

/**
 * A shape we know how to build, and the rows it needs.
 *
 * Each slot lists acceptable labels in order of preference; a product satisfies the slot if
 * it publishes any one of them with a number in it. The archetypes are deliberately few:
 * these are the two forms the catalogue actually repeats hundreds of times.
 */
const ARCHETYPES = [
  {
    id: "lever",
    name: "执手（杆 + 座）",
    like: "9004S",
    /*
      Projection and Lever drop are NOT interchangeable, so they are separate slots.

      Projection is how far the lever stands off the door face; lever drop is how far the
      end of the lever sits from the spindle axis. One places the arm in depth, the other
      along the face. Accepting either for a single slot — which this script did in its
      first run — reports a product as ready to model when the modeller would still have to
      decide where the arm actually goes.

      Drop is optional because a straight lever's geometry closes without it; where it is
      published it is reported, because it is what distinguishes a cranked lever from a
      straight one.
    */
    slots: [
      ["Lever length"],
      ["Rose size", "Rose diameter", "Rosette Diameter"],
      ["Rose thickness", "Rose depth"],
      ["Lever section"],
      ["Projection"],
    ],
    optional: [["Lever drop"], ["Spindle"]],
  },
  {
    id: "pull",
    name: "大拉手（杆 + 两个立柱/座）",
    like: "T2973",
    slots: [
      ["Overall length", "Available lengths", "Grip length"],
      ["Centre distance"],
      ["Grip section"],
      ["Projection"],
    ],
  },
];

/** A row counts only if it carries a number we could measure with. */
const hasNumber = (value) => /\d/.test(String(value ?? ""));

function readAll() {
  const out = [];
  for (const file of readdirSync(PRODUCTS)) {
    if (!file.endsWith(".json")) continue;
    let product;
    try {
      product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
    } catch {
      continue;
    }
    if (!product.heroImage?.src) continue; // unpublished records have no page to put it on
    const sites = product.sites ?? ["hyde"];
    if (SITE && !sites.includes(SITE)) continue;
    out.push(product);
  }
  return out;
}

const products = readAll();

const report = ARCHETYPES.map((archetype) => {
  const ready = [];
  const near = [];
  for (const product of products) {
    const specs = new Map((product.specs ?? []).map((s) => [s.label, s.value]));
    const filled = [];
    const missing = [];
    for (const slot of archetype.slots) {
      const hit = slot.find((label) => specs.has(label) && hasNumber(specs.get(label)));
      if (hit) filled.push(`${hit}=${specs.get(hit)}`);
      else missing.push(slot[0]);
    }
    const extra = (archetype.optional ?? [])
      .map((slot) => slot.find((label) => specs.has(label) && hasNumber(specs.get(label))))
      .filter(Boolean)
      .map((label) => `${label}=${specs.get(label)}`);
    const row = {
      extra,
      model: product.model,
      slug: product.slug,
      category: product.categoryPath?.[0] ?? "",
      sites: (product.sites ?? ["hyde"]).join("+"),
      filled,
      missing,
    };
    if (!missing.length) ready.push(row);
    else if (missing.length === 1) near.push(row);
  }
  return { archetype, ready, near };
});

for (const { archetype, ready, near } of report) {
  const fresh = ready.filter((r) => !ALREADY.has(r.model));
  console.log(`\n${"=".repeat(74)}`);
  console.log(`${archetype.name}  —— 参照 ${archetype.like}`);
  console.log(`需要的行：${archetype.slots.map((s) => s[0]).join(" / ")}`);
  console.log(`${"=".repeat(74)}`);
  console.log(`规格表已经够用、可以直接建模的：${fresh.length} 个\n`);
  for (const row of fresh.slice(0, 40)) {
    console.log(`  ${row.model.padEnd(12)} ${row.sites.padEnd(11)} ${row.category}`);
    console.log(`      ${row.filled.join("  ")}`);
  }
  if (fresh.length > 40) console.log(`  …… 另有 ${fresh.length - 40} 个`);

  if (NEAR) {
    console.log(`\n  差一行就够的：${near.length} 个`);
    const byMissing = {};
    for (const row of near) (byMissing[row.missing[0]] ??= []).push(row.model);
    for (const [label, models] of Object.entries(byMissing).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`    缺「${label}」：${models.length} 个 —— ${models.slice(0, 12).join("、")}`);
    }
  }
}

console.log(`\n${"=".repeat(74)}`);
console.log(
  `清点范围：${products.length} 个已发布产品${SITE ? `（只看 ${SITE}）` : ""}。` +
    `\n已经建过模的 3 个（9004S、LC04、70SN）不计入。`,
);
console.log(
  `注意：LC04 与 70SN 的尺寸并不在它们的规格表里，是从图纸上读的，` +
    `\nLC04 那 15mm 厚度还是假设值 —— 这份清单只列「规格表本身就够用」的，不含那种。`,
);
