/**
 * Merges scraped legacy-site specifications into content/products/*.json.
 *
 * Run scripts/scrape-legacy-products.mjs first; this reads its report.
 *
 * Two rules decide what gets written, and both exist because a spec table is a
 * commercial promise, not decoration:
 *
 *   1. ADDITIVE ONLY. New spec rows are appended. A row whose label already exists is
 *      never overwritten — the existing value was reviewed once already.
 *
 *   2. CONFLICTS ARE REPORTED, NOT RESOLVED. `material`, `finishes` and `doorTypes` are
 *      first-class fields that the client supplied once through the asset pack and again,
 *      differently, on their own site — model 305 is "Steel / stainless steel" here and
 *      "Iron material and Aluminium" there. Both sources are the client's. Picking one
 *      silently would launder a guess into a datasheet, so they print for a human.
 *
 * Certification rows never reach this script: the scraper quarantines them.
 *
 *   node scripts/merge-legacy-specs.mjs            # dry run — prints the plan
 *   node scripts/merge-legacy-specs.mjs --write    # apply it
 */
import { readFileSync, writeFileSync } from "node:fs";

const REPORT = "docs/research/legacy/details.json";
const write = process.argv.includes("--write");

/**
 * Verified by eye against the legacy photography, not by model string alone: the legacy
 * page titled "600-Indicator" carries a picture of the recessed sliding-door pull, and
 * "320-Panic Exit Device" shows the two-point bar with head and threshold rods. Model
 * numbers collide across a catalogue this old; the images settled both.
 */
const AID_TO_SLUG = {
  1058: "023-etan-anti-pick-panic-exit-device",
  387: "305-fire-door-panic-exit-device",
  1597: "314-alarm-panic-bar-exit-device",
  1601: "317-cold-room-push-bar-exit-device",
  391: "320-two-point-locking-exit-device",
  506: "600-concealed-sliding-door-handle",
};

/** These map onto dedicated fields, so they are compared rather than appended. */
const FIELD_LABELS = {
  material: "material",
  finish: "finishes",
  "surface finish": "finishes",
  "door type": "doorTypes",
  "suitable for": "doorTypes",
};

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

const report = JSON.parse(readFileSync(REPORT, "utf8"));
const conflicts = [];
const claims = [];
let added = 0;

for (const rec of report) {
  const slug = AID_TO_SLUG[rec.aid];
  if (!slug) continue;

  const path = `content/products/${slug}.json`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const existing = new Set((product.specs ?? []).map((s) => norm(s.label)));
  const newRows = [];

  for (const row of rec.specs) {
    const field = FIELD_LABELS[norm(row.label)];

    if (field) {
      const mine = Array.isArray(product[field])
        ? product[field].join(", ")
        : (product[field] ?? "");
      if (norm(mine) !== norm(row.value)) {
        conflicts.push({
          model: product.model,
          field,
          ours: mine || "(empty)",
          legacy: row.value,
        });
      }
      continue;
    }

    if (existing.has(norm(row.label))) continue;
    // Normalise the odd lowercase "length：" the legacy CMS emits on older pages.
    const label = row.label.charAt(0).toUpperCase() + row.label.slice(1);
    newRows.push({ label, value: row.value });
    existing.add(norm(row.label));
  }

  for (const c of rec.claimsForReview) {
    claims.push({ model: product.model, ...c });
  }

  if (newRows.length) {
    product.specs = [...(product.specs ?? []), ...newRows];
    added += newRows.length;
    console.log(`\n${product.model} — ${slug}`);
    newRows.forEach((r) => console.log(`   + ${r.label}: ${r.value}`));
    if (write) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

console.log(`\n${added} spec rows ${write ? "written" : "would be added"}.`);

if (conflicts.length) {
  console.log(`\n⚠ ${conflicts.length} field conflicts — NOT applied, ask the client:`);
  for (const c of conflicts) {
    console.log(`   ${c.model}  ${c.field}`);
    console.log(`      ours   : ${c.ours}`);
    console.log(`      legacy : ${c.legacy}`);
  }
}

if (claims.length) {
  console.log(`\n⛔ ${claims.length} certification claims found and NOT applied:`);
  for (const c of claims) console.log(`   ${c.model}  ${c.label}: ${c.value}`);
  console.log("   No test report on file names these models. See src/data/company.ts.");
}

if (!write) console.log("\nDry run. Re-run with --write to apply.");
