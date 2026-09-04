#!/usr/bin/env node
/**
 * Writes carton data from content/packing-data.json onto the products it unambiguously
 * names, and reports everything it refused.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS MATTERS MORE THAN ITS SIZE SUGGESTS
 *
 * Packing data is the thinnest field in the catalogue — 6 of 435 records carry any — and
 * the GEO audit put it first on the list of things that would move the score, because
 * "24 pieces per carton, 30.2 × 26 × 40.4 cm, 19.6 kg gross" is exactly the kind of
 * sentence an answer engine can quote and a spec table cannot fake. It is also the first
 * thing a distributor asks and the number that decides a container quotation.
 *
 * ---------------------------------------------------------------------------
 * WHY IT APPLIES SO FEW ROWS
 *
 * The source is a photographed shipping worksheet, and it contradicts the assumption that
 * would have made it go much further. Rows 6 and 7 are the same lock in two finishes —
 * 808 SS ET and 808 PB ET — packed 57.2 × 19.1 × 47.5 and 42 × 35 × 31.8. FINISH CHANGES
 * THE CARTON. So a row naming `D101、D102` cannot be spread across the five D101 finishes
 * we publish, and `70710-AB` cannot cover 70710 PB.
 *
 * Several models also appear twice with different packing (607 SS ET blister and carton;
 * 026 at 24 and at 16 per carton), and the photograph does not say which is current.
 *
 * A packing figure is quoted into a proforma invoice and a bill of lading. Being wrong
 * there is a shipment that does not fit the container the customer booked, so the rule is
 * the same one the photograph import uses: exact model, unambiguous row, or nothing.
 *
 * Everything refused is written to the report, which is what goes to the client.
 *
 * Usage:
 *   node scripts/apply-packing-data.mjs            # report
 *   node scripts/apply-packing-data.mjs --write
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const SOURCE = "content/packing-data.json";
const write = process.argv.includes("--write");

const { rows } = JSON.parse(readFileSync(SOURCE, "utf8"));
const normalise = (s) => String(s ?? "").toUpperCase().replace(/[\s_.-]/g, "");

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
const byModel = new Map();
for (const file of files) {
  const product = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  if (product.model) byModel.set(normalise(product.model), { file, product });
}

/** Volume from the carton, so the figure on the page is arithmetically consistent with it. */
function volumeFrom(cartonCm) {
  const parts = String(cartonCm ?? "").split(/[×x*]/).map((n) => Number.parseFloat(n));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return (parts[0] * parts[1] * parts[2]) / 1_000_000;
}

const applied = [];
const refused = [];

for (const row of rows) {
  if (row.status !== "ok") {
    refused.push(row);
    continue;
  }
  for (const model of row.appliesTo ?? []) {
    const hit = byModel.get(normalise(model));
    if (!hit) {
      refused.push({ ...row, status: "no-such-model", note: `${model} is not in the catalogue` });
      continue;
    }

    /*
      The sheet's own volume where it has one and it agrees with the dimensions; otherwise
      the volume computed from the carton. Publishing a volume that does not multiply out
      from the carton beside it is the kind of detail a freight forwarder checks and a
      buyer then stops trusting the rest of the page for.
    */
    const derived = volumeFrom(row.cartonCm);
    const stated = row.volumeM3;
    const agrees = derived !== null && stated !== null && Math.abs(derived - stated) < 0.0005;
    const volume = agrees ? stated : derived;

    const specs = [
      { label: "Pieces per carton", value: String(row.perCarton), unit: "" },
      row.cartonCm ? { label: "Carton size", value: row.cartonCm, unit: "cm" } : null,
      volume ? { label: "Carton volume", value: volume.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""), unit: "m³" } : null,
      row.grossKg ? { label: "Gross weight", value: String(row.grossKg), unit: "kg" } : null,
      row.netKg ? { label: "Net weight", value: String(row.netKg), unit: "kg" } : null,
    ].filter(Boolean);

    const path = join(DIR, hit.file);
    const record = JSON.parse(readFileSync(path, "utf8"));
    record.specs = record.specs ?? [];

    /*
      Existing rows win. A value already on the record may have been checked by a person
      since; this photograph has not been checked by anyone.
    */
    const have = new Set(record.specs.map((s) => s.label.toLowerCase()));
    const added = specs.filter((s) => !have.has(s.label.toLowerCase()));
    if (!added.length) continue;

    record.specs.push(...added);
    record.packingSource = "装箱表 photographed 2026-09-04, see content/packing-data.json";

    if (write) writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
    applied.push({ model: hit.product.model, added: added.map((s) => s.label) });
  }
}

console.log(`${rows.length} rows on the sheet · ${applied.length} product(s) ${write ? "written" : "would be written"}\n`);
for (const a of applied) console.log(`  ${a.model.padEnd(10)} + ${a.added.join(", ")}`);

const byStatus = new Map();
for (const r of refused) byStatus.set(r.status, [...(byStatus.get(r.status) ?? []), r.model]);

console.log(`\n${refused.length} row(s) not applied:`);
for (const [status, models] of [...byStatus.entries()].sort()) {
  console.log(`  ${status.padEnd(24)} ${models.join(", ")}`);
}

if (!write) console.log("\n--write not given; nothing written.");
