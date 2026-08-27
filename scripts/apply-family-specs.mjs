/**
 * Fills spec tables from the client's own product-family write-ups.
 *
 * SOURCE. Thirteen Word files in F:\网站资料\产品描述, written by the client in 2019 and
 * 2022, describe each lock family in parallel Chinese and English. Every row below is
 * transcribed from the ENGLISH side of one of those files, and `src` names it. Run
 * `node scripts/read-drive-descriptions.mjs` to re-read the originals and check any row.
 *
 * WHY FAMILY-LEVEL DATA IS WORTH ADDING. 106 products still carry one spec row or none.
 * These files hold the figures a buyer actually asks for — backset, door thickness, cycle
 * life, chassis material, cylinder type — and they are stated per family, which is how
 * the client sells them. A family row is not a guess about an individual model; it is
 * what the client publishes about every model in that family.
 *
 * WHAT IS DELIBERATELY NOT HERE.
 *
 *   - No certification. The panic-device file repeats "CE certificate, Fire rated EN1125"
 *     against every model; only two Intertek reports are ours and neither covers those
 *     models. See the certificates block in src/data/company.ts.
 *   - No per-model figures. Where a family file leaves "Backset" as a bare heading with
 *     no value (呆锁, 大档盖球锁, 建筑锁 all do), nothing is invented to fill it.
 *   - No finish. Finish varies per model and the family files do not state it.
 *
 * Idempotent: existing labels are never overwritten, only missing ones appended.
 * Run: node scripts/apply-family-specs.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "content/products";
const DRY = process.argv.includes("--dry");

/**
 * Category path prefix -> rows the client states for that family.
 *
 * Matched on the joined categoryPath, longest prefix first, so
 * `knob-locks/tubular-locks` wins over a `knob-locks` entry.
 */
const FAMILIES = [
  {
    prefix: "lever-handles",
    src: "执手锁.doc — Tubular leverset",
    specs: [
      ["Backset", "60mm / 70mm adjustable"],
      ["Door thickness", "35mm to 45mm adjustable"],
      ["Cycle life", "200,000 cycles"],
      ["Chassis", "Solid steel, zinc plated for corrosion resistance"],
      ["Trim", "Zinc die-casting electro-plated or solid brass"],
      ["Handing", "Fully reversible, left or right hand"],
      ["Function", "Entrance, privacy, passage or dummy"],
      ["Keying", "Can be keyed alike with deadbolts, or master keyed"],
    ],
  },
  {
    prefix: "knob-locks/heavy-duty-cylindrical-locks",
    src: "大档盖球锁.doc — Heavy duty cylindrical lockset",
    specs: [
      ["Cycle life", "200,000 cycles"],
      ["Chassis", "Solid steel chassis and latch case, zinc plated"],
      ["Trim", "Zinc die-casting electro-plated or solid brass"],
      ["Cylinder", "5-pin tumbler, brass plug, two nickel-plated brass keys"],
      ["Latch", "Deadlocking on keyed functions"],
      ["Handing", "Fully reversible, left or right hand"],
      ["Application", "Commercial offices, schools and heavy-duty residential"],
      ["Keying", "Can be keyed alike to deadbolts"],
    ],
  },
  {
    prefix: "knob-locks/light-duty-cylindrical-locks",
    src: "小档盖球锁.doc — Cylindrical lockset",
    specs: [
      ["Cycle life", "200,000 cycles"],
      ["Chassis", "Solid steel chassis and latch case, zinc plated"],
      ["Trim", "Wrought stainless steel or brass"],
      ["Cylinder", "5-pin tumbler, brass plug, two nickel-plated brass keys"],
      ["Latch", "Deadlocking on keyed functions"],
      ["Handing", "Fully reversible, left or right hand"],
      ["Application", "Standard residential use"],
      ["Keying", "Can be keyed alike to the deadbolt series, or master keyed"],
    ],
  },
  {
    prefix: "knob-locks/tubular-locks",
    src: "三柱式球锁.doc — Tubular lockset",
    specs: [
      ["Backset", "60mm / 70mm adjustable"],
      ["Door thickness", "35mm to 45mm adjustable"],
      ["Cycle life", "200,000 cycles"],
      ["Chassis", "Solid steel chassis and latch case, zinc plated"],
      ["Trim", "Wrought stainless steel or brass"],
      ["Strike", "57mm curved lip standard; 70mm available on request"],
      ["Handing", "Fully reversible, left or right hand"],
      ["Application", "Residential use"],
    ],
  },
  {
    prefix: "grip-handle-sets",
    src: "套锁.doc — Decorative handleset",
    specs: [
      ["Backset", "60mm / 70mm adjustable, latch and deadbolt both"],
      ["Door thickness", "35mm to 45mm adjustable"],
      ["Deadbolt throw", "25mm, with hardened steel insert to resist sawing"],
      ["Latch extension", "13mm"],
      ["Cross bore", "51mm — replaces most existing locksets"],
      ["Chassis", "Solid steel internal construction, corrosion protected"],
      ["Trim", "Forged solid brass or zinc die-casting electro-plated"],
      ["Handing", "Non-handed, left or right hand"],
      ["Feature", "No exposed exterior fixings; free-turning cylinder ring resists wrenching"],
    ],
  },
  {
    prefix: "deadbolts",
    src: "呆锁.doc — Deadbolt",
    specs: [
      ["Deadbolt throw", "25mm, zinc die-cast with hardened steel roller insert"],
      ["Cylinder", "5-pin tumbler, solid brass plug, two nickel-plated brass keys"],
      ["Chassis", "Zinc plated steel internal components"],
      ["Trim", "Stainless steel, brass or steel"],
      ["Handing", "Fully reversible, left or right hand"],
      ["Feature", "Free-turning cylinder trim prevents wrenching; cylinder removable for rekeying"],
      ["Keying", "Can be keyed to pair with an entrance bored lock"],
    ],
  },
  {
    prefix: "night-latches-rim-locks",
    src: "防盗锁.doc — Night latch and rim lock",
    specs: [
      ["Door thickness", "35mm to 55mm standard; 30mm to 60mm on request"],
      ["Latch extension", "13mm, with inside deadlocking button"],
      ["Deadbolt throw", "25mm on rim deadbolt versions"],
      ["Chassis", "Zinc die-cast case, zinc-plated steel internal components"],
      ["Strike", "Angle strike standard for inward-opening doors; flat strike available"],
      ["Handing", "Fully reversible, left or right hand"],
      ["Function", "Single cylinder, double cylinder or self-locking"],
      ["Feature", "Anti-picking slide gate on single-cylinder deadlock"],
    ],
  },
];

/** Longest prefix first so a sub-category is never shadowed by its parent. */
const ORDERED = [...FAMILIES].sort((a, b) => b.prefix.length - a.prefix.length);

let filled = 0;
let rowsAdded = 0;
const perFamily = new Map();

for (const file of readdirSync(DIR)) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const key = product.categoryPath.join("/");
  const family = ORDERED.find((f) => key === f.prefix || key.startsWith(`${f.prefix}/`));
  if (!family) continue;

  const rows = [...(product.specs ?? [])];
  const before = rows.length;
  for (const [label, value] of family.specs) {
    if (!rows.some((r) => r.label === label)) rows.push({ label, value });
  }
  if (rows.length === before) continue;

  product.specs = rows;
  filled += 1;
  rowsAdded += rows.length - before;
  perFamily.set(family.prefix, (perFamily.get(family.prefix) ?? 0) + 1);
  if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

console.log(`products updated: ${filled}`);
console.log(`spec rows added : ${rowsAdded}`);
for (const [prefix, count] of perFamily) console.log(`  ${String(count).padStart(3)}  ${prefix}`);
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
