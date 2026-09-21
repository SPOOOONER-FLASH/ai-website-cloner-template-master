#!/usr/bin/env node
/**
 * Fills ONLY the Spanish fields that are empty. Never rewrites one that has a value.
 *
 *   node scripts/fill-missing-spanish.mjs            # report
 *   node scripts/fill-missing-spanish.mjs --write
 *
 * ---------------------------------------------------------------------------
 * WHY NOT JUST RE-RUN THE TRANSLATOR
 *
 * AGENTS.md, 2026-09-11, in as many words: `translate-products-es.mjs --write` is no
 * longer safe on this catalogue. Re-running it to fix one field produced a 557-file diff
 * and 830 changed spec rows, and the sample read:
 *
 *   - "label": "Doble distancia entre ejes"
 *   + "label": "Centre distances"
 *
 * Spanish rows REVERTING to English, because those labels are not in SPEC_LABELS_ES —
 * somebody had translated them by hand afterwards, and the generator's "no glossary entry,
 * keep the English" branch discarded the better text. A generator cannot see that its own
 * output has been improved since it last ran.
 *
 * So this is the targeted write that rule asks for. It reads the same glossary, produces
 * the same values, and writes a field only where there is nothing to lose: 225 records
 * with no `summaryEs` and 162 with no `specsEs`, none of which anybody has improved,
 * because none of them exist.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT REFUSES TO DO
 *
 * A record whose `nameEs` is missing stops the run rather than getting a default — the
 * same guard the main translator has, for the same reason: `nameEs = categories[…]` once
 * put the CATEGORY name on 582 records and nothing noticed for weeks.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const write = process.argv.includes("--write");

/** Same balanced-brace read as the translators; the glossary is a .ts the site imports. */
function grab(source, name) {
  const start = source.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`es-glossary.ts has no ${name}`);
  const open = source.indexOf("{", start);
  let depth = 0;
  let i = open;
  for (; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (!depth) {
        i += 1;
        break;
      }
    }
  }
  const body = source
    .slice(open, i)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  return eval(`(${body})`);
}

const source = readFileSync("src/data/es-glossary.ts", "utf8");
const LABELS = grab(source, "SPEC_LABELS_ES");
const VALUES = grab(source, "SPEC_VALUES_ES");
const NAMES = grab(source, "PRODUCT_NAMES_ES");

const untranslated = new Map();
const note = (term) => untranslated.set(term, (untranslated.get(term) ?? 0) + 1);

/** A code or a pure measurement is not language and is carried through. */
const IS_CODE = /^[A-Z0-9]{1,6}(\s*[./,+&-]\s*[A-Z0-9]{1,6})*\.?$/;
const IS_NUMERIC = /^[φØø≥≤~]?\s*[\d\s.,/×x*°–—"'-]+\s*(mm|cm|m|kg|g|in|inch|N·m|N|°|pcs|MM)?\.?$/i;

function value(input) {
  const text = String(input ?? "").trim();
  if (!text || IS_CODE.test(text) || IS_NUMERIC.test(text)) return text;
  const hit = VALUES[text];
  if (hit) return hit;
  note(text);
  return text;
}

function label(input) {
  const text = String(input ?? "").trim();
  const hit = LABELS[text];
  if (hit) return hit;
  note(`LABEL: ${text}`);
  return text;
}

const onHyde = (product) =>
  !(product.sites ?? []).length || (product.sites ?? []).includes("hyde");

const filled = { summaryEs: 0, specsEs: 0, seoTitleEs: 0, seoDescriptionEs: 0 };
const unnamed = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = join(DIR, file);
  const product = JSON.parse(readFileSync(path, "utf8"));
  if (!onHyde(product)) continue;

  const nameEs = product.nameEs ?? NAMES[String(product.name ?? "").trim()];
  if (!nameEs) {
    unnamed.push(`${product.name} (${product.model})`);
    continue;
  }

  let changed = false;

  /* The summary is assembled, not translated — the English one is itself generated. */
  if (!product.summaryEs) {
    const material = String(product.material ?? "").trim();
    const materialEs = material ? VALUES[material] : null;
    product.summaryEs = materialEs ? `${nameEs} de ${materialEs.toLowerCase()}.` : `${nameEs}.`;
    filled.summaryEs += 1;
    changed = true;
  }

  if (!product.specsEs?.length && Array.isArray(product.specs) && product.specs.length) {
    product.specsEs = product.specs.map((row) => ({
      label: label(row.label),
      value: value(row.value),
    }));
    filled.specsEs += 1;
    changed = true;
  }

  if (!product.seoTitleEs) {
    product.seoTitleEs = `${product.model} ${nameEs} | Canton Hyland`;
    filled.seoTitleEs += 1;
    changed = true;
  }

  if (!product.seoDescriptionEs) {
    product.seoDescriptionEs =
      `${nameEs} ${product.model} de Canton Hyland. ` +
      "Fabricado en Guangdong, China y exportado a más de treinta mercados — solicite una cotización.";
    filled.seoDescriptionEs += 1;
    changed = true;
  }

  if (changed && write) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

if (unnamed.length) {
  console.error(`\n${unnamed.length} record(s) have no Spanish name:\n`);
  for (const entry of [...new Set(unnamed)].sort()) console.error(`  ${entry}`);
  console.error("\nAdd each to PRODUCT_NAMES_ES. Never let it fall back to the category.");
  process.exit(1);
}

console.log(write ? "filled:" : "would fill:");
for (const [field, count] of Object.entries(filled)) {
  if (count) console.log(`  ${String(count).padStart(4)}  ${field}`);
}

const sorted = [...untranslated.entries()].sort((a, b) => b[1] - a[1]);
if (sorted.length) {
  console.log(`\n${sorted.length} terms left in English inside the NEW rows only:`);
  for (const [term, count] of sorted.slice(0, 15)) {
    console.log(`  ${String(count).padStart(4)}  ${term.slice(0, 90)}`);
  }
  if (sorted.length > 15) console.log(`  … ${sorted.length - 15} more`);
}
