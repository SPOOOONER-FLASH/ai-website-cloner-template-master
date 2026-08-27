/**
 * Fills spec tables and per-model summaries for products that shipped as boilerplate.
 *
 * WHY: 44 products had an empty spec table, 107 had exactly one row, and 33 carried the
 * identical summary "Lock case." That is Bing's "content too short" (25 pages) and the
 * bulk of Google's "duplicate, no canonical selected" (525 pages) — near-identical
 * bodies under near-identical titles. One cause, two reports.
 *
 * WHAT MAY GO IN HERE. Two sources, both the client's own:
 *
 *   1. The model designation. Canton Hyland names euro lock cases
 *      <series><centre distance><backset>. Confirmed by the hand-entered records
 *      LC14 85x50 (Centre distance 85 / Backset 50) and LC04 85*70 (Backset 70mm), and
 *      independently by the client's own trade listing for LC8520, which reads
 *      "85mm center distance 20mm backset".
 *   2. CITED below — copy the client published themselves on worldbid.com under their
 *      own account. The listing id is on every entry so any row can be re-checked.
 *
 * Nothing else. A model whose dimensions cannot be read off its designation and whose
 * attributes are in no client listing keeps an empty row and is reported at the end.
 * See AGENTS.md: an empty spec table is honest, an invented one is an incident, because
 * buyers order from it.
 *
 * Idempotent — existing rows are never overwritten, only missing labels appended.
 * Run: node scripts/enrich-product-specs.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "content/products";
const DRY = process.argv.includes("--dry");

/**
 * Centre distance / backset read off the model designation.
 *
 * Only the unambiguous forms. `LC7065` and `LC6860` are deliberately excluded: the
 * hand-entered records read 70mm and 60mm backset respectively, so the two numbers swap
 * roles between them and neither can be parsed with confidence.
 */
function dimensionsFromModel(model) {
  const m = model.replace(/\s+/g, "");

  // "Lc02 85x40mm", "LC04 85*60", "Lc21 85x50mm" — separated pair.
  let hit = /^[A-Za-z]+\d*(\d{2})[x×*-](\d{2})m?m?$/i.exec(m);
  if (hit) {
    const [, a, b] = hit;
    // 85 and 72 are the euro / Latin centre-distance standards; the other is backset.
    if (a === "85") return { centre: 85, backset: Number(b) };
    if (b === "72") return { centre: 72, backset: Number(a) };
    return null;
  }

  // "Lc8520B", "Lc8530PS", "AI8530" — unseparated, centre distance 85.
  hit = /^[A-Za-z]+85(\d{2})[A-Za-z]*$/i.exec(m);
  if (hit) return { centre: 85, backset: Number(hit[1]) };

  return null;
}

/** Attributes the client published themselves; `src` is the listing they appear in. */
const CITED = {
  "lc02-85-40mm-lock-case": {
    src: "worldbid i383089",
    specs: [["Material", "Aluminium case"], ["Application", "Wooden and metal doors"]],
  },
  "lc03-85-45mm-lock-case": {
    src: "worldbid i383092",
    specs: [["Material", "Aluminium case"], ["Cylinder", "Euro profile"], ["Application", "Aluminium, wooden and metal doors"]],
  },
  "lc04-85-60-lock-case": {
    src: "worldbid i383091",
    specs: [["Cylinder", "Euro profile"], ["Bolts", "Four round bolts"], ["Application", "Wooden doors"]],
  },
  "lc04-85-60mm-lock-case": {
    src: "worldbid i383091",
    specs: [["Cylinder", "Euro profile"], ["Bolts", "Four round bolts"], ["Application", "Wooden doors"]],
  },
  "lc06-85-50mm-ps-lock-case": {
    src: "worldbid i383095",
    specs: [["Function", "Passage"], ["Application", "Wooden and metal doors"]],
  },
  "lc08-85-55mm-lock-case": {
    src: "worldbid i383134",
    specs: [["Material", "Iron case"], ["Cylinder", "Euro profile"], ["Latch", "Square latch"]],
  },
  "lc09-85-60mm-lock-case": {
    src: "worldbid i383135",
    specs: [["Material", "Iron case"], ["Cylinder", "Euro profile"], ["Latch", "Square latch"]],
  },
  "lc14-85-50mm-lock-case": {
    src: "worldbid i383019",
    specs: [["Cylinder", "Euro profile"], ["Bolts", "Four round bolts"], ["Application", "Security doors"]],
  },
  "lc17-lock-case": {
    src: "worldbid i383145",
    specs: [["Backset", "16mm"], ["Material", "Aluminium and steel"], ["Function", "Sliding hook"], ["Application", "Sliding doors"]],
  },
  "lc21-85-50mm-lock-case": {
    src: "worldbid i383151",
    specs: [["Function", "Passage"], ["Application", "Wooden and metal doors"]],
  },
  "lc33-5572-lock-case": {
    src: "worldbid i383169",
    specs: [["Cylinder", "Euro profile"], ["Function", "Panic exit"], ["Application", "Emergency and escape doors"]],
  },
  "lc34-50-72mm-lock-case": {
    src: "worldbid i383170",
    specs: [["Material", "Iron case"], ["Cylinder", "Euro profile"], ["Latch", "Square latch"]],
  },
  "lc7065ps-lock-case": {
    src: "worldbid i383193",
    specs: [["Backset", "70mm"], ["Cylinder", "Euro profile"], ["Function", "Passage"], ["Type", "Horizontal case"]],
  },
  "lc8520ps-lock-case": {
    src: "worldbid i383198",
    specs: [["Material", "Stainless steel"], ["Function", "Passage"], ["Application", "Interior wooden and metal doors"]],
  },
  "lc8520b-lock-case": {
    src: "worldbid i383199",
    specs: [["Material", "Stainless steel"], ["Application", "Interior wooden and metal doors"]],
  },
  "lc8535b-lock-case": {
    src: "worldbid i383221",
    specs: [["Material", "Stainless steel"], ["Application", "Interior wooden and metal doors"]],
  },
  "ai8530-lock-case": {
    src: "worldbid i383093",
    specs: [["Material", "Aluminium case"], ["Cylinder", "Euro profile"], ["Application", "Aluminium, wooden and metal doors"]],
  },
  "309-d-double-door-panic-exit-device": {
    src: "worldbid i383002",
    specs: [["Application", "Fire-rated double escape doors"], ["Function", "Push bar, active and inactive leaf"]],
  },
  "d101-dspb-deadbolts": {
    src: "worldbid i383261",
    specs: [["Material", "Stainless steel body"], ["Function", "Single cylinder"], ["Application", "Entrance doors"]],
  },
};

/**
 * Function read off the model suffix.
 *
 * `PS` only. The client's own listings gloss LC7065PS, LC06 85-50PS and LC8520-PS all as
 * passage cases — three confirmations in the same LC family. The `B`, `BK` and `S`
 * suffixes appear in listings too but are never glossed, so they are left alone.
 */
function functionFromSuffix(model) {
  return /ps$/i.test(model.replace(/\s+/g, "")) ? "Passage" : null;
}

/** A summary is boilerplate when it is just the category name written as a sentence. */
const BOILERPLATE = /^(lock case|deadbolts?|panic exit device|d-panic exit device|s-panic exit device)\.$/i;

/** Singular head noun per category, so a rewritten summary does not read "A deadbolts". */
const NOUN = {
  "lock-cases": "mortise lock case",
  deadbolts: "deadbolt",
  "panic-exit-devices": "panic exit device",
};

/** "Iron case" / "Stainless steel body" read as adjectives once the noun is stripped. */
function asAdjective(material) {
  return material.toLowerCase().replace(/\s+(case|body|construction)$/, "");
}

const article = (phrase) => (/^[aeiou]/i.test(phrase) ? "An" : "A");

/** One honest sentence built only from the rows the record now holds. */
function summaryFrom(product, rows) {
  const get = (label) => rows.find((r) => r.label === label)?.value;
  const centre = get("Centre distance");
  const backset = get("Backset");
  const material = get("Material");
  const cylinder = get("Cylinder");
  const fn = get("Function");
  const app = get("Application");
  const bolts = get("Bolts");

  const head = [];
  if (material) head.push(asAdjective(material));
  head.push(NOUN[product.categoryPath[0]] ?? product.name.toLowerCase());
  if (centre && backset) head.push(`with ${centre} centre distance and ${backset} backset`);
  else if (backset) head.push(`with ${backset} backset`);

  const phrase = head.join(" ");
  let text = `${article(phrase)} ${phrase}`;
  const tail = [];
  // "Solid Brass Cylinder" already carries the noun; appending gave "cylinder cylinder".
  if (cylinder) {
    const prepared = cylinder.toLowerCase();
    tail.push(
      prepared.includes("cylinder") ? `prepared for a ${prepared}` : `${prepared} cylinder preparation`,
    );
  }
  if (bolts) tail.push(bolts.toLowerCase());
  if (fn) tail.push(`${fn.toLowerCase()} function`);
  if (tail.length) text += `, ${tail.join(", ")}`;
  if (app) text += `, for ${app.toLowerCase()}`;
  return `${text}.`;
}

let filledSpecs = 0;
let filledSummaries = 0;
const stillEmpty = [];

for (const file of readdirSync(DIR)) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const rows = [...(product.specs ?? [])];
  const before = rows.length;
  const beforeSummary = product.summary;

  const dims = dimensionsFromModel(product.model);
  if (dims) {
    if (!rows.some((r) => r.label === "Centre distance")) {
      rows.push({ label: "Centre distance", value: `${dims.centre}mm` });
    }
    if (!rows.some((r) => r.label === "Backset")) {
      rows.push({ label: "Backset", value: `${dims.backset}mm` });
    }
  }

  for (const [label, value] of CITED[product.slug]?.specs ?? []) {
    if (!rows.some((r) => r.label === label)) rows.push({ label, value });
  }

  const suffix = functionFromSuffix(product.model);
  if (suffix && !rows.some((r) => r.label === "Function")) {
    rows.push({ label: "Function", value: suffix });
  }

  if (rows.length !== before) {
    product.specs = rows;
    filledSpecs += 1;
  }

  if (rows.length && BOILERPLATE.test(product.summary ?? "")) {
    product.summary = summaryFrom(product, rows);
    filledSummaries += 1;
  }

  if (!rows.length) stillEmpty.push(`${product.model} — ${product.categoryPath.join("/")}`);

  if (!DRY && (rows.length !== before || product.summary !== beforeSummary)) {
    writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

console.log(`spec tables filled : ${filledSpecs}`);
console.log(`summaries rewritten: ${filledSummaries}`);
console.log(`still empty        : ${stillEmpty.length} — needs client data`);
for (const model of stillEmpty) console.log(`  ${model}`);
