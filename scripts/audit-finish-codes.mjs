/**
 * How much of the catalogue's finish and order-code vocabulary we can actually read.
 *
 *   node scripts/audit-finish-codes.mjs            print the report
 *   node scripts/audit-finish-codes.mjs --json     machine-readable, for the page build
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A SCRIPT AND NOT A PARAGRAPH
 *
 * The number this prints — "43 finish cells name something we cannot resolve" — is the
 * kind of fact that is true on the day it is written and quietly false a month later,
 * after the factory answers two questions and another session adds sixty products. A
 * sentence in a document cannot tell the next session whether it still holds. This can:
 * re-run it.
 *
 * It is also how the factory question list stays specific. "Some finish codes are
 * unclear" gets no answer. "GP appears on three models and nothing in our data says what
 * it expands to" gets one.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/* The code tables are TypeScript. Node's type stripping reads them directly under 24. */
import { FINISH_CODES, FUNCTION_CODES } from "../src/data/finish-codes.ts";
import { parseFinishValue, parseOrderCode } from "../src/lib/order-code.ts";

const DIR = "content/products";

/** Published on cantonlock.com. An absent `sites` means both sites. */
function isHyde(product) {
  return !Array.isArray(product.sites) || product.sites.includes("hyde");
}

const products = readdirSync(DIR)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(join(DIR, file), "utf8")))
  .filter(isHyde);

const finishUse = new Map(FINISH_CODES.map((entry) => [entry.code, 0]));
const functionUse = new Map(FUNCTION_CODES.map((entry) => [entry.code, 0]));
const unresolvedFinish = new Map();
const unresolvedSuffix = new Map();

let withFinishField = 0;
let readableFinishField = 0;
let suffixed = 0;

for (const product of products) {
  /*
    The S/D letter is only meaningful on escape hardware — see DOOR_CONFIGURATION_CODES.
    Opting in by category is what keeps `DV12-S`, a door viewer, out of the count.
  */
  const escapeHardware = (product.categoryPath ?? []).includes("panic-exit-devices");
  const parsed = parseOrderCode(product.model ?? "", { doorCodes: escapeHardware });
  if (parsed.finishes.length) suffixed += 1;
  for (const code of parsed.finishes) finishUse.set(code, (finishUse.get(code) ?? 0) + 1);
  if (parsed.fn) functionUse.set(parsed.fn, functionUse.get(parsed.fn) + 1);
  for (const token of parsed.unresolved) {
    /*
      Product words trail plenty of model numbers ("ANTI THEFT DOOR LOCK") and are not
      codes at all, and plenty of models carry a bare dimension. Two to four letters with
      at least one letter in them is the shape a code takes; anything else would drown
      the signal.
    */
    if (token.length > 4 || !/[A-Z]/.test(token)) continue;
    unresolvedSuffix.set(token, (unresolvedSuffix.get(token) ?? 0) + 1);
  }

  const cells = Array.isArray(product.finishes) ? product.finishes : [];
  if (!cells.length) continue;
  withFinishField += 1;

  let readable = false;
  for (const cell of cells) {
    const value = parseFinishValue(cell);
    for (const code of value.codes) {
      readable = true;
      finishUse.set(code, (finishUse.get(code) ?? 0) + 1);
    }
    for (const fragment of value.unresolved) {
      unresolvedFinish.set(fragment, (unresolvedFinish.get(fragment) ?? 0) + 1);
    }
  }
  if (readable) readableFinishField += 1;
}

const report = {
  generated: new Date().toISOString().slice(0, 10),
  products: products.length,
  withFinishField,
  readableFinishField,
  suffixedModels: suffixed,
  confirmedFinishCodes: FINISH_CODES.filter((e) => e.evidence !== "unconfirmed").length,
  unconfirmedFinishCodes: FINISH_CODES.filter((e) => e.evidence === "unconfirmed").length,
  finishUse: Object.fromEntries([...finishUse].sort((a, b) => b[1] - a[1])),
  functionUse: Object.fromEntries([...functionUse].sort((a, b) => b[1] - a[1])),
  unresolvedFinish: Object.fromEntries([...unresolvedFinish].sort((a, b) => b[1] - a[1])),
  unresolvedSuffix: Object.fromEntries([...unresolvedSuffix].sort((a, b) => b[1] - a[1])),
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : "—");
  console.log(`Finish and order-code coverage — ${report.products} published HYDE records`);
  console.log(
    `  finish field filled     ${withFinishField} (${pct(withFinishField, products.length)})`,
  );
  console.log(
    `  of those, readable      ${readableFinishField} (${pct(readableFinishField, withFinishField)})`,
  );
  console.log(`  model carries a finish  ${suffixed}`);
  console.log(
    `  codes confirmed         ${report.confirmedFinishCodes} finish + ${FUNCTION_CODES.filter((e) => e.evidence !== "unconfirmed").length} function`,
  );
  console.log(
    `  codes in use, unknown   ${report.unconfirmedFinishCodes} finish + ${FUNCTION_CODES.filter((e) => e.evidence === "unconfirmed").length} function`,
  );

  const show = (title, map, limit) => {
    const rows = Object.entries(map).filter(([, n]) => n > 0);
    if (!rows.length) return;
    console.log(`\n${title}`);
    for (const [key, count] of rows.slice(0, limit)) {
      console.log(`  ${String(count).padStart(4)}  ${key}`);
    }
    if (rows.length > limit) console.log(`  … ${rows.length - limit} more`);
  };

  show("finish codes by models offering them", report.finishUse, 40);
  show("function codes by models", report.functionUse, 20);
  show("finish text we could not read — ask the factory", report.unresolvedFinish, 25);
  show("model suffixes we could not read", report.unresolvedSuffix, 25);
}
