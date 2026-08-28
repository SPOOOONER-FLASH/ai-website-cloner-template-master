/**
 * Reads the finish and function out of a model designation and writes them as spec rows.
 *
 * WHY THIS IS SAFE NOW. An earlier pass rejected this: 4 of 21 checkable models had a
 * `finishes` field that contradicted their suffix. That comparison was wrong. Those four
 * records list the finish RANGE the model can be produced in — "Satin nickel, chrome,
 * antique brass, polished brass, all available" — not the finish of the piece in front
 * of you. The suffix names the specific one. Both are true at once.
 *
 * The client confirmed the table on 2026-08-27, and the catalogue corroborates it in its
 * own finish column: `PB=Polish Brass` on the 6094, `SN=Satin Nickel` on the 70710,
 * `SC= Satin chrome` on the 70610, `BN Black Nickle` on the 9211, `Satin Stainless Steel
 * (SS)` on the 9080E.
 *
 * WHY IT MATTERS. 32 stainless-steel handles, 30 lever handles and 23 heavy-duty knob
 * locks carry identical copy because the only thing separating them is the suffix. Decode
 * it and every one of those pages states something the others do not.
 *
 * PARSING RIGHT TO LEFT. The function suffix is stripped first, then the finish, and a
 * model only counts as decoded when the ENTIRE letter run is consumed. 592 SSET is
 * SS + ET, not S + SET — reading left to right gets that backwards, and a half-consumed
 * run means the code is one this table does not cover, so nothing is written.
 *
 * Idempotent; existing Finish/Function rows are never overwritten.
 * Run: node scripts/decode-model-suffixes.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "content/products";
const DRY = process.argv.includes("--dry");

/**
 * Confirmed by the client, 2026-08-27. Longest first so SSS is not read as SS + S.
 *
 * F and WL are a sprayed coating rather than a plating — 喷木纹球 and 白色喷漆球, a
 * wood-grain and a white paint finish on the knob. They are listed here because the
 * client named them; anything they did not name is absent on purpose.
 */
const FINISHES = [
  ["PSS", "Polished stainless steel"],
  ["SSS", "Satin stainless steel"],
  ["ORB", "Oil-rubbed bronze"],
  ["WL", "White sprayed"],
  ["MB", "Matt black"],
  ["PB", "Polished brass"],
  ["AB", "Antique brass"],
  ["AC", "Antique copper"],
  ["SN", "Satin nickel"],
  ["SC", "Satin chrome"],
  ["CP", "Chrome plated"],
  ["SS", "Stainless steel"],
  ["BN", "Black nickel"],
  ["SB", "Satin brass"],
  ["SP", "Bright polished"],
  ["W", "White"],
  ["F", "Wood-grain sprayed"],
];

/** Confirmed by the client, 2026-08-27. */
const FUNCTIONS = [
  ["SET", null], // handled below: SET is a finish S* plus ET, never a function on its own
  ["ET", "Entrance — keyed outside"],
  ["PS", "Passage — latch only, no cylinder"],
  ["BK", "Privacy — bathroom, turn button inside"],
];

const FUNCTION_CODES = FUNCTIONS.filter(([, label]) => label);

/**
 * Splits the trailing letter run into finish and function.
 * Returns null unless the whole run is accounted for.
 */
function decode(model) {
  const compact = model.replace(/[\s-]+/g, "").toUpperCase();
  const hit = /^(.*\d)([A-Z]+)$/.exec(compact);
  if (!hit) return null;

  let rest = hit[2];
  let fn = null;
  for (const [code, label] of FUNCTION_CODES) {
    // A run may be nothing but the function — LC8520PS is a passage case in no stated
    // finish — so full consumption is allowed here, unlike the finish pass below.
    if (rest.endsWith(code)) {
      rest = rest.slice(0, -code.length);
      fn = label;
      break;
    }
  }

  let finish = null;
  for (const [code, label] of FINISHES) {
    if (rest === code) {
      finish = label;
      rest = "";
      break;
    }
  }

  // Anything left over is a code this table does not cover. Write nothing.
  if (rest !== "") return null;
  if (!finish && !fn) return null;
  return { finish, fn };
}

let updated = 0;
let finishes = 0;
let functions = 0;
const undecoded = new Map();

for (const file of readdirSync(DIR)) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const decoded = decode(product.model);

  if (!decoded) {
    const tail = /^(.*\d)([A-Z]+)$/.exec(product.model.replace(/[\s-]+/g, "").toUpperCase());
    if (tail) undecoded.set(tail[2], (undecoded.get(tail[2]) ?? 0) + 1);
    continue;
  }

  const rows = [...(product.specs ?? [])];
  let changed = false;

  /*
    A family write-up states the options the family offers — "Entrance, privacy, passage
    or dummy" — which is true of the family and says nothing about this model. The suffix
    names which one this model is, so it replaces a menu but never replaces a value that
    is already a single specific fact.
  */
  const isMenu = (value) => /,/.test(value) && / or /.test(value);

  const put = (label, value) => {
    const existing = rows.find((r) => r.label === label);
    if (!existing) {
      rows.push({ label, value });
      changed = true;
      return true;
    }
    if (isMenu(existing.value)) {
      existing.value = value;
      changed = true;
      return true;
    }
    return false;
  };

  if (decoded.finish && put("Finish", decoded.finish)) finishes += 1;
  if (decoded.fn && put("Function", decoded.fn)) functions += 1;
  if (!changed) continue;

  product.specs = rows;
  updated += 1;
  if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

console.log(`products updated : ${updated}`);
console.log(`  Finish rows added   : ${finishes}`);
console.log(`  Function rows added : ${functions}`);
console.log(`\nsuffixes this table does not cover: ${undecoded.size}`);
for (const [code, count] of [...undecoded.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.log(`  ${String(count).padStart(3)}  ${code}`);
}
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
