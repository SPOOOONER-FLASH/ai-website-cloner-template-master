#!/usr/bin/env node
/**
 * Which published models have enough published dimensions to be modelled honestly.
 *
 *   node scripts/audit-modelling-candidates.mjs
 *   node scripts/audit-modelling-candidates.mjs --family=tube
 *
 * ---------------------------------------------------------------------------
 * THE QUESTION THIS ANSWERS, AND THE ONE IT REFUSES TO
 *
 * Three partial models shipped on 2026-09-14 — 9004S exterior, LC04 case envelope, 70SN
 * upper housing — and each one carries a list of what is NOT modelled, because the
 * published data ran out before the shape did. LC04's own scope file says the 15mm
 * thickness is "an assumed closure value, not a published product dimension". That is the
 * honest way to ship a partial model and it is also a warning: most of this catalogue
 * cannot be modelled, because most of it is a curve nobody published.
 *
 * So this audit does not rank by "how many spec rows are there". A lever handle with nine
 * rows is still an organic shape that no set of numbers determines, and a lock case with
 * seven is still a box whose interior is a mechanism. Counting rows would put those at the
 * top and produce exactly the invented geometry AGENTS.md forbids.
 *
 * It ranks by whether the dimensions that ARE published determine the whole outside.
 *
 * ---------------------------------------------------------------------------
 * WHY ROUND-TUBE PULL HANDLES COME FIRST, AND BY A LONG WAY
 *
 * A round-tube pull handle IS its dimensions. Give me outside diameter, wall thickness,
 * overall length, the distance between fixings and how far it stands off the glass, and
 * there is nothing left to guess — no fillet anybody has to invent, no face whose depth
 * is "about right", no internal part hidden behind a cover.
 *
 * Five models publish all five of those numbers: 100, 102, 104, 106 and 107. They are one
 * family on one drawing convention, so a single parametric generator produces all five,
 * and unlike the three already shipped these would not be partial. 106 is the interesting
 * one — "32mm, tapering to 18.5mm" plus a 140mm grip length is a tapered tube, still fully
 * determined.
 *
 * Everything below that line is reported with what it is missing, so the list becomes a
 * question for the factory rather than an invitation to fill the gap with a plausible
 * number.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PRODUCTS = "content/products";

/**
 * What each shape needs before its OUTSIDE is determined.
 *
 * Not "useful specs" — specs that fix geometry. Backset and deadbolt throw tell you how a
 * lock works and nothing whatever about what it looks like, so they are absent here on
 * purpose even though they are the most valuable rows on the page.
 */
const FAMILIES = [
  {
    key: "tube",
    title: "Round-tube pull handles — the outside is fully determined",
    match: (product) => /glass-door-accessories|stainless-steel-handles/.test(product.categoryPath?.[0] ?? ""),
    needs: ["Tube diameter", "Tube Thickness", "Length", "Centre distance", "Standoff"],
    verdict: "complete external model possible",
  },
  {
    key: "plate",
    title: "Flat plates and escutcheons — a plate is its outline and its thickness",
    match: (product) => /panic-exit-devices|indicators|door-viewers/.test(product.categoryPath?.[0] ?? ""),
    needs: ["Plate size", "Plate thickness"],
    verdict: "complete plate possible; any lever or bar on it is not",
  },
  {
    key: "case",
    title: "Lock cases — an envelope only, and only where all three are published",
    match: (product) => /lock-cases/.test(product.categoryPath?.[0] ?? ""),
    needs: ["Faceplate", "Case height", "Case depth"],
    verdict: "envelope possible; faceplate, bolts and mechanism are not",
  },
];

const family = (process.argv.find((a) => a.startsWith("--family=")) ?? "").slice(9);

const records = readdirSync(PRODUCTS)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(join(PRODUCTS, file), "utf8")))
  .filter((product) => (product.sites ?? []).length === 0 || (product.sites ?? []).includes("hyde"))
  /* Withheld records have no page to put a model on. */
  .filter((product) => product.heroImage?.src);

for (const group of FAMILIES) {
  if (family && family !== group.key) continue;

  const rows = [];
  for (const product of records) {
    if (!group.match(product)) continue;
    const labels = new Set((product.specs ?? []).map((spec) => spec.label));
    const missing = group.needs.filter((need) => !labels.has(need));
    if (missing.length === group.needs.length) continue;
    rows.push({ model: product.model, slug: product.slug, missing });
  }

  const ready = rows.filter((row) => !row.missing.length).sort((a, b) => a.model.localeCompare(b.model));
  const partial = rows
    .filter((row) => row.missing.length)
    .sort((a, b) => a.missing.length - b.missing.length || a.model.localeCompare(b.model));

  console.log(`\n### ${group.title}`);
  console.log(`    needs: ${group.needs.join(", ")}`);
  console.log(`\n  READY — ${ready.length}  (${group.verdict})`);
  for (const row of ready) console.log(`    ${row.model.padEnd(16)} ${row.slug}`);

  console.log(`\n  NOT READY — ${partial.length}, with what each is missing`);
  for (const row of partial.slice(0, 12)) {
    console.log(`    ${row.model.padEnd(16)} missing: ${row.missing.join(", ")}`);
  }
  if (partial.length > 12) console.log(`    … and ${partial.length - 12} more`);
}

console.log(
  "\nA model is only worth building where the published numbers determine the shape.\n" +
    "Where they do not, the gap is a question for the factory — not a value to assume.",
);
