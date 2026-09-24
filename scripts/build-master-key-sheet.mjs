#!/usr/bin/env node
/**
 * Builds the payload for the master key plan sheet a buyer fills in and sends back.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * The master key article ends with "send the door schedule and say how many levels you
 * think you need", and until now that was the whole instruction. A buyer who has never
 * specified a keyed system does not know what a door schedule for keying looks like, so
 * the request either comes back missing half of what we need, or it does not come back.
 *
 * MIWA publish a キーシステムプラン入力シート — an Excel sheet with dropdowns, a PDF for
 * writing on by hand, and, decisively, a THIRD sheet that is already filled in. The
 * worked example is the part most suppliers leave out and it is the part that gets the
 * form returned: a blank grid asks the buyer to invent a format, a filled one asks them
 * to copy a pattern. See docs/research/2026-09-13-miwa-lock-structure.md.
 *
 * ---------------------------------------------------------------------------
 * WHY A GENERATOR AND NOT A SPREADSHEET SOMEBODY MAINTAINS
 *
 * The dropdowns are catalogue facts — cylinder lengths, finishes, keyway families. A
 * hand-maintained workbook is wrong the first time a cylinder is added and nobody can
 * tell by looking at it. This reprints from content/products every time.
 *
 * ⚠ The cylinder lengths here come from MODEL NUMBERS, not from spec rows, because only
 * ten of the forty-five published cylinders carry a size row. That is the factory's own
 * naming convention and the article now says so out loud, but it is inference, so the
 * sheet asks the buyer to confirm the length with us rather than presenting it as final.
 * Do not extend this inference to backset or centre distance — see the warning in
 * content/products/6068-mortise-lever-handle-lock.json.
 *
 * Usage:  node scripts/build-master-key-sheet.mjs [--out docs/collaboration]
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index > -1 ? args[index + 1] : fallback;
};

const PRODUCT_DIR = "content/products";
const products = readdirSync(PRODUCT_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(readFileSync(join(PRODUCT_DIR, name), "utf8")));

const published = products.filter((product) => product.heroImage?.src);

/* ------------------------------------------------------- catalogue-derived dropdowns */

const cylinders = published.filter((product) => product.categoryPath[0] === "lock-cylinders");

/** Leading figure of the model number — "70 SNDK" is a 70mm cylinder. */
const cylinderLengths = [
  ...new Set(
    cylinders
      .map((product) => Number((product.model.match(/^(\d{2,3})/) ?? [])[1]))
      .filter((length) => Number.isFinite(length) && length >= 40 && length <= 120),
  ),
].sort((a, b) => a - b);

/** How many of them actually state the length, so the sheet can be honest about it. */
const cylindersStatingLength = cylinders.filter((product) =>
  (product.specs ?? []).some((row) => /size|length/i.test(row.label) && /\d/.test(row.value)),
).length;

/*
  The twenty most-used finishes, not all ninety-eight.

  The catalogue spells finishes ninety-eight ways, and a dropdown that long is a dropdown
  nobody scrolls — the Spanish review sheet reached the same conclusion from the other
  side, replacing eighty-seven spellings with twenty decisions. Ranked by how many
  products carry each, so the list opens on what a buyer is most likely to want, and the
  cell still accepts free text for the rest.
*/
const finishUse = new Map();
for (const product of published) {
  for (const finish of product.finishes ?? []) {
    const value = finish.trim();
    if (value && value.length < 40) finishUse.set(value, (finishUse.get(value) ?? 0) + 1);
  }
}
const finishes = [...finishUse.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 20)
  .map(([finish]) => finish);

/** Products whose own record says they can be keyed alike or master keyed. */
const KEYABLE = /master ?key|keyed alike|master ?keyed/i;
const keyableModels = published
  .filter((product) =>
    [
      ...(product.specs ?? []).map((row) => `${row.label} ${row.value}`),
      ...(product.features ?? []),
    ].some((line) => KEYABLE.test(line)),
  )
  .map((product) => product.model)
  .sort();

/* ------------------------------------------------------------------- the sheet shape */

/*
  One row per door. The columns are exactly what the article says we need and nothing
  else: "the door schedule with a line per door, and for each door: who must be able to
  open it, and which group it belongs to". Every extra column is a column that gets left
  blank and then has to be chased.
*/
const columns = [
  { key: "door", label: "Door ref", labelEs: "Ref. de puerta", width: 12, help: "Your own numbering — whatever is on the drawing" },
  { key: "location", label: "Location", labelEs: "Ubicación", width: 26, help: "Room or area name" },
  { key: "group", label: "Keying group", labelEs: "Grupo de amaestramiento", width: 20, help: "Floor, department or tenancy this door belongs to" },
  { key: "opensWith", label: "Opened by", labelEs: "Abren con", width: 28, help: "Every key level that must open this door" },
  { key: "model", label: "Lock / cylinder model", labelEs: "Modelo de cerradura / cilindro", width: 22, dropdown: "models", help: "Leave blank if you want us to propose one" },
  { key: "length", label: "Cylinder length (mm)", labelEs: "Longitud de cilindro (mm)", width: 20, dropdown: "lengths", help: "Overall length. We confirm it for the model you choose" },
  { key: "split", label: "Split", labelEs: "Reparto", width: 12, help: "e.g. 35/35. Depends on door thickness — see our note on length and split" },
  { key: "finish", label: "Finish", labelEs: "Acabado", width: 22, dropdown: "finishes" },
  { key: "keys", label: "Change keys", labelEs: "Llaves de cambio", width: 14, help: "How many keys for this door alone" },
  { key: "notes", label: "Notes", labelEs: "Notas", width: 30 },
];

/*
  The worked example. A small three-level building, because three levels is what the
  article says most buildings actually need — an example showing five would quietly
  recommend five. Deliberately includes a door opened by two levels and a door with a
  deliberate exception, since those are the rows buyers get wrong.
*/
const example = {
  system: {
    project: "Example — Riverside Office, 3 floors",
    levels: "3 (GMK / MK per floor / change key per door)",
    keyway: "One keyway for the whole system — to be confirmed with us",
    spares: "GMK ×2, each MK ×2, change keys ×1 per door plus 5 spare blanks",
    contact: "facilities@example.com",
  },
  rows: [
    { door: "G-01", location: "Main entrance", group: "Building", opensWith: "GMK, MK-G", model: "", length: "70", split: "35/35", finish: "Satin Stainless", keys: "2", notes: "Glazed door, check thickness" },
    { door: "G-04", location: "Server room", group: "Building", opensWith: "GMK only", model: "", length: "70", split: "35/35", finish: "Satin Stainless", keys: "2", notes: "Must NOT open on floor master" },
    { door: "1-02", location: "Office 102", group: "Floor 1", opensWith: "GMK, MK-1", model: "", length: "65", split: "30/35", finish: "Satin Stainless", keys: "1", notes: "" },
    { door: "1-03", location: "Office 103", group: "Floor 1", opensWith: "GMK, MK-1", model: "", length: "65", split: "30/35", finish: "Satin Stainless", keys: "1", notes: "" },
    { door: "2-01", location: "Meeting room", group: "Floor 2", opensWith: "GMK, MK-2", model: "", length: "65", split: "30/35", finish: "Polished Brass", keys: "3", notes: "Shared with tenant" },
    { door: "2-07", location: "Cleaners' store", group: "Floor 2", opensWith: "GMK, MK-2, cleaning contractor", model: "", length: "65", split: "30/35", finish: "Satin Stainless", keys: "4", notes: "Contractor keys counted here" },
  ],
};

const payload = {
  meta: {
    generated: new Date().toISOString().slice(0, 10),
    title: "Master key plan — input sheet",
    titleEs: "Plan de amaestramiento — hoja de entrada",
    source: "Generated by scripts/build-master-key-sheet.mjs from content/products",
    article: "/news/master-key-systems-how-many-levels-you-need/",
    cylinderCount: cylinders.length,
    cylindersStatingLength,
    keyableCount: keyableModels.length,
  },
  intro: [
    "One line per door. Fill in what you know and leave the rest — we would rather have the schedule with gaps than wait for a complete one.",
    "Sheet 3 is a worked example of a small three-level building. Copy its pattern rather than inventing a format.",
    "Two things decide the whole chart and are worth settling first: every cylinder in one system shares a keyway, and that cannot be changed later; and the number of keys each level needs, including the spares the building owner holds.",
    `Cylinder lengths in the dropdown are the ${cylinderLengths.length} the catalog carries. Only ${cylindersStatingLength} of the ${cylinders.length} published cylinders state the length as a specification, so confirm the exact overall length with us for the model you settle on.`,
  ],
  columns,
  dropdowns: {
    lengths: cylinderLengths.map(String),
    finishes,
    models: keyableModels,
  },
  example,
};

const outDir = flag("out", "docs/collaboration");
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "master-key-plan.json");
writeFileSync(target, `${JSON.stringify(payload, null, 1)}\n`);

console.log(`cylinders            ${cylinders.length}  (${cylindersStatingLength} state a length)`);
console.log(`cylinder lengths     ${cylinderLengths.join(", ")}`);
console.log(`finishes             ${finishes.length}`);
console.log(`keyable models       ${keyableModels.length}`);
console.log(`example rows         ${example.rows.length}`);
console.log(`payload -> ${target}`);
console.log(`now run:  py scripts/build_master_key_workbook.py ${target}`);
