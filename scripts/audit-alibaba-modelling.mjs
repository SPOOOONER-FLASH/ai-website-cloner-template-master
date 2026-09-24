#!/usr/bin/env node
/**
 * Of the models the client actually sells on Alibaba, which could be modelled in 3D.
 *
 *   node scripts/audit-alibaba-modelling.mjs
 *
 * ---------------------------------------------------------------------------
 * WHY THIS CROSS IS THE USEFUL ONE
 *
 * `audit-modelling-candidates.mjs` answers "what CAN be modelled" from the catalogue's
 * published dimensions. It does not know which models anybody is asking about. The 43
 * products on the client's Alibaba storefront do: they carry ninety days of real enquiries
 * against each model number.
 *
 * A model built for a part nobody asks about is a week spent on nobody. A model built for
 * the part with the highest enquiry rate is the one a buyer is looking at when they decide
 * whether this factory knows its own product. So the ranking here is
 * "can be modelled honestly" AND "somebody is asking", and the second is what orders it.
 *
 * ---------------------------------------------------------------------------
 * WHAT "CAN BE MODELLED HONESTLY" MEANS HERE
 *
 * The same rule as the other audit, which is the rule from AGENTS.md: the published
 * dimensions must determine the shape. Where they do not, the answer is not "model it
 * roughly" — a lever with invented fixing holes is a part that cannot be installed. The
 * report prints what is missing so the gap becomes a question for the factory.
 *
 * Three tiers, in the order a modeller should take them:
 *
 *   COMPLETE   every dimension of the outside is published. Nothing is assumed.
 *   ENVELOPE   the outer box is published; the face, the bolts and the mechanism are not.
 *              This is what the three already-published models are, and each of them
 *              ships a list of what it leaves out.
 *   NO         the shape is a curve or a mechanism nobody published. Not a candidate.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ALIBABA = "docs/research/2026-09-11-alibaba-product-performance.json";
const PRODUCTS = "content/products";

/** Dimension sets that determine a shape, by what the shape is. */
const RULES = [
  {
    tier: "COMPLETE",
    what: "round-tube pull handle",
    categories: /glass-door-accessories|stainless-steel-handles/,
    needs: ["Tube diameter", "Tube Thickness", "Length", "Center distance", "Standoff"],
  },
  {
    tier: "COMPLETE",
    what: "flat plate",
    categories: /panic-exit-devices|indicators|door-viewers/,
    needs: ["Plate size", "Plate thickness"],
  },
  {
    tier: "ENVELOPE",
    what: "lock case outer box",
    categories: /lock-cases/,
    needs: ["Faceplate", "Case height", "Case depth"],
  },
];

const records = new Map();
for (const file of readdirSync(PRODUCTS).filter((f) => f.endsWith(".json"))) {
  const product = JSON.parse(readFileSync(join(PRODUCTS, file), "utf8"));
  if ((product.sites ?? []).length && !(product.sites ?? []).includes("hyde")) continue;
  records.set(String(product.model).trim().toUpperCase(), product);
}

const alibabaFile = JSON.parse(readFileSync(ALIBABA, "utf8"));
/* The export wraps the rows in `products` alongside a `meta` block. */
const alibaba = alibabaFile.products ?? alibabaFile;
const rows = [];

for (const entry of alibaba) {
  const model = String(entry.model ?? "").trim().toUpperCase();
  const product = records.get(model);
  const inquiries = Number(entry.inquiries90d ?? 0);

  if (!product) {
    /*
      Seventeen of the 43 land here and most have no `model` field at all — they are
      storefront listings the client never mapped to a catalogue number, or bundles like
      "310+015" that are two products in one listing. Printing "undefined" would hide that,
      so the listing title stands in: it is what somebody would search for to find the row.
    */
    rows.push({
      model: entry.model ?? `(unmapped) ${String(entry.title ?? "").slice(0, 48)}`,
      inquiries,
      verdict: "NO RECORD",
      detail: entry.model ? "not in the catalog under this number" : "Alibaba listing carries no model number",
    });
    continue;
  }
  if (!product.heroImage?.src) {
    rows.push({ model: entry.model, inquiries, verdict: "NO PHOTO", detail: "withheld — no page to put a model on" });
    continue;
  }

  const category = product.categoryPath?.[0] ?? "";
  const labels = new Set((product.specs ?? []).map((spec) => spec.label));
  const rule = RULES.find((r) => r.categories.test(category));

  if (!rule) {
    rows.push({ model: entry.model, inquiries, verdict: "NO", detail: `${category || "uncategorised"} — shape is not determined by dimensions` });
    continue;
  }

  const missing = rule.needs.filter((need) => !labels.has(need));
  rows.push({
    model: entry.model,
    inquiries,
    verdict: missing.length ? "NEEDS DATA" : rule.tier,
    detail: missing.length ? `${rule.what}; missing ${missing.join(", ")}` : rule.what,
  });
}

/* Enquiries first inside each tier: build the one people are asking about. */
const ORDER = ["COMPLETE", "ENVELOPE", "NEEDS DATA", "NO PHOTO", "NO RECORD", "NO"];
rows.sort(
  (a, b) => ORDER.indexOf(a.verdict) - ORDER.indexOf(b.verdict) || b.inquiries - a.inquiries,
);

let current = "";
for (const row of rows) {
  if (row.verdict !== current) {
    current = row.verdict;
    console.log(`\n## ${current}`);
  }
  console.log(`  ${String(row.model).padEnd(14)} ${String(row.inquiries).padStart(2)} enq/90d   ${row.detail}`);
}

const counts = new Map();
for (const row of rows) counts.set(row.verdict, (counts.get(row.verdict) ?? 0) + 1);
console.log(`\n${rows.length} Alibaba products — ${[...counts].map(([k, v]) => `${k} ${v}`).join(", ")}`);

/*
  The list to hand the factory.

  This is the point of the whole audit. "We cannot model 307" is useful to nobody;
  "307 needs two numbers and then it can be modelled" is a request somebody can answer in
  a morning — and 307 is the model with the most enquiries on the storefront.
*/
const asks = new Map();
for (const row of rows.filter((r) => r.verdict === "NEEDS DATA" && r.inquiries > 0)) {
  const missing = row.detail.split("missing ")[1] ?? "";
  for (const field of missing.split(", ")) {
    asks.set(field, [...(asks.get(field) ?? []), `${row.model} (${row.inquiries})`]);
  }
}
if (asks.size) {
  console.log("\nASK THE FACTORY FOR THESE — models with real inquiries, grouped by what is missing:");
  for (const [field, models] of [...asks].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${field.padEnd(16)} ${models.join(", ")}`);
  }
}
