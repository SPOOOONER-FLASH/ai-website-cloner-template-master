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
 * The printed finish table, "Breakdown of Finish / 表面处理一览表", page 42 of the Hyland
 * catalogue. Transcribed from the client's own page, including the US designations it
 * prints alongside each code.
 *
 * US numbers are the trade's finish-naming standard, not a certification: US32D names a
 * satin stainless finish the way "RAL 9010" names a white. Publishing them says nothing
 * about product approval — see the certificates note in src/data/company.ts.
 *
 * Longest code first so SSS is not read as SS + S.
 */
const FINISHES = [
  // stainless and chrome
  ["SSS", "Satin stainless steel"],
  ["PSS", "Polished stainless steel"],
  ["PSC", "Polished satin chrome"],
  ["SS", "Satin stainless steel (US32D)"],
  ["SP", "Polished stainless steel (US32)"],
  ["SC", "Satin chrome (US26D)"],
  ["CR", "Bright chrome (US26)"],
  // brass and copper
  ["PB", "Polished brass (US3)"],
  ["SB", "Satin brass (US4)"],
  ["AB", "Antique brass (US5)"],
  ["AC", "Antique copper (US11)"],
  // nickel
  ["DC", "Satin nickel (US15)"],
  ["AN", "Antique nickel (US15A)"],
  ["NI", "Bright nickel"],
  ["BN", "Black nickel"],
  ["SN", "Satin nickel"],
  // bronze and black
  ["ABR", "Oil-rubbed bronze (US10B)"],
  ["ABL", "Antique black"],
  ["ORB", "Oil-rubbed bronze"],
  ["MB", "Matt black"],
  // painted and sprayed coatings rather than platings
  ["WL", "White painted"],
  ["GRL", "Grey painted"],
  ["BRL", "Brown painted"],
  ["BLL", "Blue painted"],
  ["HGL", "Golden finish"],
  ["GL", "Golden painted"],
  ["IL", "Ivory painted"],
  ["BL", "Black painted"],
  ["RL", "Red painted"],
  ["W", "White"],
  ["F", "Wood-grain sprayed"],
];

/**
 * The printed function tables, pages 40 and 41 of the Hyland catalogue: "Functions for
 * cylindrical door locks / 圆筒式功能说明" and "Functions for tubular door locks /
 * 三柱式功能说明". Only the codes those pages actually print in brackets are here.
 *
 * Exit Latch and Communicating Lock appear on the same pages with no code letters, so
 * they are absent. CL, EL, R and S turn up as suffixes in the catalogue and are NOT
 * assumed to mean them.
 */
const FUNCTIONS = [
  ["ET", "Entrance — keyed outside"],
  ["PS", "Passage — latch only, no cylinder"],
  ["BK", "Privacy — bathroom, turn button inside"],
  ["CR", "Classroom — key releases the outside knob"],
  ["SR", "Storeroom — outside knob always rigid"],
  ["PT", "Patio — locked by inside button"],
];

/**
 * Both printed tables are titled for CYLINDRICAL and TUBULAR door locks, so their codes
 * describe knob and lever hardware and nothing else. A mortise lock case has no knob and
 * no turn button, so reading BK on Lc8530BK as a privacy function was wrong — that is a
 * variant letter this table cannot speak to.
 *
 * PS is the exception: the client's own trade listings gloss LC7065PS, LC06 85-50PS and
 * LC8520-PS as passage cases, so it is confirmed for lock cases independently.
 */
const KNOB_AND_LEVER = /^(knob-locks|lever-handles|grip-handle-sets|stainless-steel-handles)/;
const appliesTo = (code, categoryPath) =>
  code === "PS" || KNOB_AND_LEVER.test(categoryPath.join("/"));

/**
 * Splits the trailing letter run into finish and function.
 * Returns null unless the whole run is accounted for.
 */
function decode(model, categoryPath) {
  const compact = model.replace(/[\s-]+/g, "").toUpperCase();
  const hit = /^(.*\d)([A-Z]+)$/.exec(compact);
  if (!hit) return null;

  let rest = hit[2];
  let fn = null;
  for (const [code, label] of FUNCTIONS) {
    // A run may be nothing but the function — LC8520PS is a passage case in no stated
    // finish — so full consumption is allowed here, unlike the finish pass below.
    if (rest.endsWith(code) && appliesTo(code, categoryPath)) {
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

/**
 * Values this script emitted under an earlier, less precise reading of the codes.
 *
 * ⚠ SCOPED BY LABEL, and that scoping is the whole point. "Stainless steel" is a
 * superseded FINISH label and also a perfectly good MATERIAL value on 40-odd records. An
 * earlier version of this set was unscoped and stripped Material rows off 32 products,
 * emptying their spec tables. Only Finish and Function rows are ever touched here.
 *
 *   SS was "Stainless steel"  → the printed table says satin stainless, US32D
 *   SP was "Bright polished"  → the printed table says polished stainless, US32
 *   WL was "White sprayed"    → the printed table says white painted
 *   the plain brass and chrome names now carry their US designations
 */
const SUPERSEDED = {
  Finish: new Set([
    "Stainless steel",
    "Bright polished",
    "White sprayed",
    "Chrome plated",
    "Polished brass",
    "Satin brass",
    "Antique brass",
    "Antique copper",
    "Satin chrome",
  ]),
  Function: new Set(["Privacy — bathroom, turn button inside"]),
};

const wasOurs = (row) => SUPERSEDED[row.label]?.has(row.value) ?? false;
const CURRENT_LABELS = new Set([
  ...FINISHES.map(([, label]) => label),
  ...FUNCTIONS.map(([, label]) => label),
]);

let updated = 0;
let withdrawn = 0;
let finishes = 0;
let functions = 0;
const undecoded = new Map();

for (const file of readdirSync(DIR)) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));
  const decoded = decode(product.model, product.categoryPath);

  if (!decoded) {
    const tail = /^(.*\d)([A-Z]+)$/.exec(product.model.replace(/[\s-]+/g, "").toUpperCase());
    if (tail) undecoded.set(tail[2], (undecoded.get(tail[2]) ?? 0) + 1);
    /*
      A row this script wrote earlier must be withdrawn when the code no longer decodes.
      Lc8530BK was given a privacy function before BK was scoped to knob and lever
      hardware; leaving it would keep a claim the table can no longer support.
    */
    const rows = product.specs ?? [];
    const kept = rows.filter((r) => !wasOurs(r));
    if (kept.length !== rows.length) {
      product.specs = kept;
      withdrawn += rows.length - kept.length;
      if (!DRY) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
    }
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
  const isOurs = (label, value) =>
    (SUPERSEDED[label]?.has(value) ?? false) || CURRENT_LABELS.has(value);

  const put = (label, value) => {
    const existing = rows.find((r) => r.label === label);
    if (!existing) {
      rows.push({ label, value });
      changed = true;
      return true;
    }
    if (isMenu(existing.value) || isOurs(label, existing.value)) {
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
console.log(`  superseded rows withdrawn : ${withdrawn}`);
console.log(`\nsuffixes this table does not cover: ${undecoded.size}`);
for (const [code, count] of [...undecoded.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.log(`  ${String(count).padStart(3)}  ${code}`);
}
if (DRY) console.log("\nDry run. Re-run without --dry to apply.");
