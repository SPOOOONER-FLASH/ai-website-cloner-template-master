/**
 * Merges synonym labels in the product spec tables.
 *
 * The catalogue was transcribed by several hands, so one attribute ended up under five
 * headings: "Application", "Suitable for", "Usage", "Use" and "USAGE" all answer *where
 * the product is used*. Split that way, no single heading covers more than 19% of the
 * catalogue and a spec table reads as if each product were described by a different
 * template. Alibaba's own listing form has one "Application" attribute, which is a
 * reasonable check that this is one field and not five.
 *
 * Only genuine synonyms are merged, and the merge is on the LABEL, never the value:
 *
 *   Application  ← Suitable for, Usage, Use, USAGE
 *   Finish       ← Surface Finish
 *
 * Deliberately NOT merged:
 *   Door Type    "Single Door", "Wooden Door / Metal Door" — door construction, which
 *                is not the same question as where the product is used.
 *   Color        distinct from Finish; "Black" and "Powder Coating" are different facts.
 *   Type         product sub-type, not lock Function.
 *
 * Some rows filed under "Use" hold a door configuration rather than an application
 * ("Single Door"). Moving those to Door Type is an editorial call per row, so they are
 * merged with the rest and then listed for review rather than silently reclassified.
 *
 *   node scripts/consolidate-spec-labels.mjs           # report
 *   node scripts/consolidate-spec-labels.mjs --write   # apply
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const write = process.argv.includes("--write");
const DIR = "content/products";

const MERGE = new Map([
  ["suitable for", "Application"],
  ["usage", "Application"],
  ["use", "Application"],
  ["surface finish", "Finish"],
]);

/** Values that read as a door configuration rather than an application. */
const LOOKS_LIKE_DOOR_TYPE = /^(single|double|outswing|inswing|wooden|metal|timber|steel|glass)\b/i;

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
let changedFiles = 0, changedRows = 0, merged = 0;
const review = [];
const beforeCounts = {};
const afterCounts = {};

for (const f of files) {
  const path = `${DIR}/${f}`;
  const p = JSON.parse(readFileSync(path, "utf8"));
  const specs = p.specs ?? [];
  if (!specs.length) continue;

  let touched = false;
  for (const row of specs) {
    const label = String(row.label ?? "").trim();
    beforeCounts[label] = (beforeCounts[label] ?? 0) + 1;

    const target = MERGE.get(label.toLowerCase());
    if (target && target !== label) {
      if (target === "Application" && LOOKS_LIKE_DOOR_TYPE.test(String(row.value ?? ""))) {
        review.push({ f, from: label, value: String(row.value ?? "") });
      }
      row.label = target;
      touched = true;
      changedRows++;
      merged++;
    }
    afterCounts[row.label] = (afterCounts[row.label] ?? 0) + 1;
  }

  // Two rows can now share a heading — "Finish" and "Surface Finish" on one product.
  // Fold those into a single row rather than printing the heading twice.
  const seen = new Map();
  const deduped = [];
  for (const row of specs) {
    const key = String(row.label).trim().toLowerCase();
    const prev = seen.get(key);
    if (prev && String(prev.value).trim().toLowerCase() === String(row.value).trim().toLowerCase()) {
      touched = true;
      continue;                                    // exact duplicate, drop
    }
    if (prev) {
      prev.value = `${prev.value} / ${row.value}`; // same heading, different facts
      touched = true;
      continue;
    }
    seen.set(key, row);
    deduped.push(row);
  }

  if (touched) {
    p.specs = deduped;
    changedFiles++;
    if (write) writeFileSync(path, `${JSON.stringify(p, null, 2)}\n`);
  }
}

const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log(`files changed: ${changedFiles}   rows relabelled: ${merged}`);
console.log(`distinct labels: ${Object.keys(beforeCounts).length} -> ${Object.keys(afterCounts).length}`);
console.log("\nbefore (top 10):");
top(beforeCounts).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
console.log("\nafter (top 10):");
top(afterCounts).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

console.log(`\nrows now under "Application" whose value reads as a door configuration (${review.length}) —`);
console.log("moving these to Door Type is a per-row editorial call, so they are left for review:");
review.forEach((r) => console.log(`  ${r.f}  (was "${r.from}")  ${JSON.stringify(r.value)}`));

if (!write) console.log("\nReport only. Re-run with --write to apply.");
