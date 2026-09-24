#!/usr/bin/env node
/**
 * Writes the Portuguese fields onto content/products.
 *
 *   node scripts/translate-products-pt.mjs            # report what it would do
 *   node scripts/translate-products-pt.mjs --write    # write namePt/summaryPt/specsPt/seo*Pt
 *   node scripts/translate-products-pt.mjs --names-only --write
 *   node scripts/translate-products-pt.mjs --all      # list every unmapped term, not the top 25
 *
 * ---------------------------------------------------------------------------
 * WHAT IT WILL AND WILL NOT DO
 *
 * It translates from a finite dictionary (src/data/pt-glossary.ts) and carries numbers,
 * model codes and finish codes through untouched. Anything it cannot resolve it LEAVES IN
 * ENGLISH and counts. It never paraphrases.
 *
 * That is not timidity, it is the same rule the rest of this repository runs on. A spec
 * row is a specification: "Backset 60mm" translated loosely into a near-synonym still
 * looks like a specification and no longer is one, and the person who finds out is a
 * locksmith in São Paulo holding a door that will not take the lock.
 *
 * ---------------------------------------------------------------------------
 * AN UNMAPPED PRODUCT NAME STOPS THE RUN
 *
 * AGENTS.md, 2026-09-11: when a default would be wrong rather than merely incomplete, stop.
 * The Spanish translator learned this the expensive way — `nameEs = categories[…] ?? name`
 * put the CATEGORY name on 582 records, so 582 pages claimed to be their own category, and
 * nothing noticed for weeks. A missing row in PRODUCT_NAMES_PT costs one line; a plausible
 * default costs the catalogue.
 *
 * Spec labels and values are different: leaving one in English is visibly incomplete
 * rather than wrong, so those fall back and are counted instead of throwing.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const write = process.argv.includes("--write");
const namesOnly = process.argv.includes("--names-only");

/*
  --only <models>: restrict the run to a comma-separated list of models or slugs.

  Added 2026-09-24. The block at the write below explains at length why a full re-run is
  unsafe on this catalogue, and then leaves the reader with no way to do the safe thing:
  until now the only switches were everything or --names-only, so a three-record fix meant
  regenerating 1,089 records and reading the diff to prove it had not undone anything. That
  is the operation that reverted 830 spec rows on 2026-09-11.

  "A targeted change gets a targeted write" needs a targeted write to exist. This is it.
  Records outside the list are not read, not composed and not written, so they cannot be
  touched however stale the glossary is relative to what review has since improved.
*/
const only = (() => {
  const i = process.argv.indexOf("--only");
  if (i === -1) return null;
  const list = (process.argv[i + 1] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!list.length) {
    throw new Error("--only needs a comma-separated list of models or slugs, e.g. --only 306-D,306-S");
  }
  return new Set(list.map((s) => s.toLowerCase()));
})();

/** True when --only was not given, or when this record is one of the ones named. */
function selected(product) {
  if (!only) return true;
  return (
    only.has(String(product.model ?? "").toLowerCase()) ||
    only.has(String(product.slug ?? "").toLowerCase())
  );
}
const showAll = process.argv.includes("--all");

/* ------------------------------------------------------------------ glossary ---- */

/**
 * Read the dictionaries out of the TypeScript source.
 *
 * Same approach as the Spanish translator: the glossary is a .ts file because the site
 * imports it too, and a build step to make it importable from a script would be a second
 * thing to keep in step. The balanced-brace scan is deliberate — a regex stops at the
 * first `}` inside a value.
 */
function loadGlossary() {
  const source = readFileSync("src/data/pt-glossary.ts", "utf8");
  const grab = (name) => {
    const start = source.indexOf(`export const ${name}`);
    if (start < 0) throw new Error(`pt-glossary.ts has no ${name}`);
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
    const body = source.slice(open, i).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    return eval(`(${body})`);
  };
  return {
    labels: grab("SPEC_LABELS_PT"),
    values: grab("SPEC_VALUES_PT"),
    finishes: grab("FINISH_NAMES_PT"),
    materials: grab("MATERIAL_NAMES_PT"),
    categories: grab("CATEGORY_NAMES_PT"),
    names: grab("PRODUCT_NAMES_PT"),
  };
}

const glossary = loadGlossary();
const missing = new Map();
const note = (term) => missing.set(term, (missing.get(term) ?? 0) + 1);

/* -------------------------------------------------------------------- values ---- */

/** A pure code — model numbers, finish codes, "SS/AB/SN". Never translated. */
const IS_CODE = /^[A-Z0-9]{1,6}(\s*[./,+&-]\s*[A-Z0-9]{1,6})*\.?$/;

/** A pure measurement. The number is not language; only a trailing qualifier can be. */
/*
  φ, Ø, ≥ and ≤ are notation, not language, and they open a measurement the same way a
  digit does. Leaving them out of this class sent 300-odd rows like "φ12mm" and "≥42mm"
  to the untranslated pile on the first run.
*/
const IS_NUMERIC =
  /^[φØø≥≤~]?\s*[\d\s.,/×x*°–—"'-]+\s*(mm|cm|m|kg|g|in|inch|N·m|N|°|pcs|MM)?\s*(\/\s*[φØø≥≤~]?\s*[\d\s.,/×x*°–—"'-]+\s*(mm|cm|m|kg|g|MM)?\s*)*\.?$/i;

/**
 * Measurements with a qualifier after them. The figure survives byte for byte.
 *
 * Portuguese trade usage puts a space before the unit, same as Spanish, so "60mm / 70mm
 * adjustable" becomes "60 mm / 70 mm ajustável". The spacing is applied to the whole
 * string rather than per-number so a range keeps its shape.
 */
const NUMERIC_RULES = [
  [/^(.*?)\s*adjustable$/i, (m) => `${enMeasure(m[1])} ajustável`],
  [/^Adjustable\s+(.*)$/i, (m) => `Ajustável ${enMeasure(m[1])}`],
  [/^(.*?)\s*standard;\s*(.*?)\s*on request$/i, (m) => `${enMeasure(m[1])} de série; ${enMeasure(m[2])} sob pedido`],
  [/^(.*?)\s*available on request$/i, (m) => `${enMeasure(m[1])} sob pedido`],
  [/^(.*?)\s*\(length can be adjusted\)$/i, (m) => `${enMeasure(m[1])} (comprimento ajustável)`],
  [/^(.*?)\s*cycles$/i, (m) => `${enMeasure(m[1])} ciclos`],
  [/^(.*?)\s*hours?$/i, (m) => `${enMeasure(m[1])} horas`],
  [/^(.*?)\s*hooks?(\s+available)?$/i, (m) => `${m[1]} ganchos${m[2] ? " disponíveis" : ""}`],
  [/^(.*?)\s*Rotation$/i, (m) => `rotação de ${m[1]}`],
];

/**
 * Puts a measurement into Brazilian form.
 *
 * Three things, all found by reading the first written output rather than by thinking:
 *
 *   "60mm"            → "60 mm"           a space before the unit, as the trade writes it
 *   "35mm to 45mm"    → "35 mm a 45 mm"   the range connector is a WORD, and it was
 *                                         surviving in English inside otherwise-translated
 *                                         rows. "35 mm to 45 mm ajustável" reads as a
 *                                         half-finished export, which is what it was.
 *   "200,000 cycles"  → "200.000 ciclos"  Brazilian groups thousands with a full stop.
 *                                         Only runs of exactly three digits are touched, so
 *                                         a decimal comma is never mistaken for a group.
 */
function spaceUnits(text) {
  return text
    // Brazilian trade writes the unit in lower case; the English side shouts it as MM.
    .replace(/(\d)\s*(mm|cm|kg|MM)\b/g, (_, n, unit) => `${n} ${unit === "MM" ? "mm" : unit}`)
    .replace(/\b(\d+(?:\s*mm|\s*cm)?)\s+to\s+(\d)/gi, "$1 a $2");
}

/**
 * English figures into Brazilian figures. ONLY ever called on English source text.
 *
 * English writes 1,250.75 and Brazil writes 1.250,75 — the two separators swap roles, so a
 * single pass that exchanges them inside a numeric token converts the grouping mark and the
 * decimal mark at once and cannot disagree with itself:
 *
 *   "200,000 cycles" -> "200.000 ciclos"   grouping comma becomes a full stop
 *   "22.5mm"         -> "22,5 mm"          decimal point becomes a comma
 *   "0.044"          -> "0,044"            right at three decimal places, where counting
 *                                          digits cannot tell a decimal from a group
 *
 * WHY THIS IS NOT IN spaceUnits: spaceUnits also runs on the Portuguese that comes straight
 * out of the glossary, and that text is ALREADY Brazilian ("Chapa de aço de 1,2 mm"). Doing
 * the swap there would turn a correct comma back into a point — the same defect in the other
 * direction. So the conversion lives here and is applied only where the input is still
 * English.
 *
 * The grouping rule this replaces had exactly that bug. It matched \d{1,3},\d{3}, so a
 * Brazilian "0,044" arriving from the glossary was rewritten to "0.044".
 *
 * Safe on this catalogue because no HYDE spec value uses a comma as a list separator between
 * bare digits — "300mm,400mm" has the unit in between — checked across every value before
 * this landed. A value like "30,40,50" would have to be split into a list first.
 */
function brNumbers(text) {
  return text.replace(/\d+(?:[.,]\d+)+/g, (n) =>
    n.replace(/[.,]/g, (c) => (c === "," ? "." : ",")),
  );
}

/** An English measurement in Brazilian form: spacing, then the range word, then figures. */
function enMeasure(text) {
  return brNumbers(spaceUnits(text));
}

/**
 * A comma-separated finish list: "Polished Brass (PB), Antique Brass (AB) — all available".
 *
 * Each name is translated and each parenthesised code is carried, because the code is the
 * half a buyer actually orders against. Returns null when any part is unknown, so a
 * half-translated list never ships.
 */
function translateFinishList(text) {
  const tail = /(?:—|,)\s*(all available|other available)$/i.exec(text);
  const head = tail ? text.slice(0, tail.index).trim() : text;

  const parts = head.split(/,\s*/).filter(Boolean);
  /*
    A single entry counts. "Satin stainless steel (US32D)" is one finish and a US code, and
    requiring two members sent 60-odd of those to the untranslated pile.
  */
  if (!parts.length) return null;

  const translated = [];
  for (const part of parts) {
    const withCode = /^(.*?)\s*\(([^)]+)\)$/.exec(part);
    const name = (withCode ? withCode[1] : part).trim();
    const code = withCode ? withCode[2] : null;

    if (IS_CODE.test(name)) {
      translated.push(part);
      continue;
    }
    const pt = glossary.finishes[name] ?? glossary.materials[name];
    if (!pt) return null;
    translated.push(code ? `${pt} (${code})` : pt);
  }

  const suffix = tail
    ? /all available/i.test(tail[1])
      ? ", todos disponíveis"
      : ", outros disponíveis"
    : "";
  return translated.join(", ") + suffix;
}

function translateValue(input) {
  const text = String(input ?? "").trim();
  if (!text) return text;

  /*
    A code is returned byte for byte — it is an identifier. A measurement is not: it still
    needs Brazilian spacing and thousands grouping, so it goes through the formatter even
    though no word in it changes.
  */
  /*
    A code must contain a letter. IS_CODE also matches a bare decimal — "19.6" parses as
    19 + . + 6 — and because this test runs before the numeric one, every such value was
    returned byte for byte and kept its English decimal point. The ten that did so are all
    plainly measurements (carton volume, gross and net weight, thickness), not identifiers.
    The unit does not save it either: "2.0-3.5MM" has letters and still is not a code, so a
    string that reads as a plain measurement is excluded as well.
  */
  if (IS_CODE.test(text) && /[A-Za-z]/.test(text) && !IS_NUMERIC.test(text)) return text;
  if (IS_NUMERIC.test(text)) return enMeasure(text);

  const direct =
    glossary.values[text] ?? glossary.materials[text] ?? glossary.finishes[text];
  /*
    A dictionary hit still goes through spaceUnits, because the Portuguese in the glossary
    is written with the figures already in it ("13 mm, com botão…") and the number
    formatting has to apply there too. Cheap, and it keeps one rule for numbers.
  */
  if (direct) return spaceUnits(direct);

  for (const [pattern, build] of NUMERIC_RULES) {
    const match = pattern.exec(text);
    if (match) return build(match);
  }

  /* "60mm (2-3/8”)" — a metric figure with its imperial twin. Both are numbers. */
  if (/^[\d\s.,/×x*-]+\s*(mm|cm|kg)?\s*\([\d\s./-]+["”']*\)\.?$/i.test(text)) {
    return enMeasure(text);
  }
  /* "P=425mm", "CF60 lift-to-lock" — a factory code with an optional English tail. */
  if (/^[A-Z]{1,3}\s*=\s*\d/.test(text)) return enMeasure(text);

  const list = translateFinishList(text);
  if (list) return list;

  note(text);
  return text;
}

function translateLabel(text) {
  const key = String(text ?? "").trim();
  const pt = glossary.labels[key];
  if (pt) return pt;
  note(`LABEL: ${key}`);
  return key;
}

/* ------------------------------------------------------------------ summary ----- */

/**
 * A one-line summary, assembled rather than translated.
 *
 * The English summaries are themselves generated ("Stainless Steel 304 brass and steel
 * hinges."), so translating them would translate a template. Rebuilding from the product's
 * own name and material produces a sentence that is right by construction, and the one
 * case that produced nonsense in English — a material that contradicts the name — produces
 * nothing here rather than nonsense in a second language.
 */
function summaryPt(product, namePt) {
  const material = String(product.material ?? "").trim();
  const materialPt = material ? (glossary.materials[material] ?? null) : null;
  if (!materialPt) return `${namePt}.`;
  return `${namePt} em ${materialPt.toLowerCase()}.`;
}

/* --------------------------------------------------------------------- main ----- */

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
let touched = 0;
const unnamed = [];

for (const file of files) {
  const path = join(DIR, file);
  const product = JSON.parse(readFileSync(path, "utf8"));
  if (!selected(product)) continue;

  const name = String(product.name ?? "").trim();
  const namePt = glossary.names[name];
  if (!namePt) {
    unnamed.push(`${name} (${product.model})`);
    continue;
  }

  product.namePt = namePt;

  if (!namesOnly) {
    product.summaryPt = summaryPt(product, namePt);
    if (Array.isArray(product.specs)) {
      product.specsPt = product.specs.map((row) => ({
        label: translateLabel(row.label),
        value: translateValue(row.value),
      }));
    }
    const category = glossary.categories[product.categoryPath?.[0]] ?? "";
    product.seoTitlePt = `${product.model} ${namePt} | Canton Hyland`;
    product.seoDescriptionPt =
      `${namePt} ${product.model} da Canton Hyland${category ? ` — ${category.toLowerCase()}` : ""}. ` +
      "Fabricado em Guangdong, China e exportado para mais de trinta mercados — peça um orçamento.";
  }

  if (write) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  touched += 1;
}

/*
  Stop on an unmapped product name — see the header. Reported in full rather than as a
  count, because the fix is one dictionary line per name and a count does not say which.
*/
if (unnamed.length) {
  console.error(`\n${unnamed.length} product(s) have no Portuguese name:\n`);
  for (const entry of [...new Set(unnamed)].sort()) console.error(`  ${entry}`);
  console.error("\nAdd each to PRODUCT_NAMES_PT in src/data/pt-glossary.ts.");
  console.error("Do NOT let it fall back to the category name — that defect shipped on 582");
  console.error("Spanish records in September and took weeks to find.");
  process.exit(1);
}

console.log(`${write ? "wrote" : "would write"} Portuguese on ${touched} of ${files.length} records`);

const sorted = [...missing.entries()].sort((a, b) => b[1] - a[1]);
const uses = sorted.reduce((n, [, count]) => n + count, 0);
console.log(`${sorted.length} distinct terms left in English, across ${uses} rows`);

if (sorted.length) {
  console.log("\nmost used, add these to pt-glossary.ts first:");
  for (const [term, count] of showAll ? sorted : sorted.slice(0, 25)) {
    console.log(`  ${String(count).padStart(4)}  ${term.slice(0, 96)}`);
  }
  if (!showAll && sorted.length > 25) console.log(`  … ${sorted.length - 25} more (--all)`);
}
