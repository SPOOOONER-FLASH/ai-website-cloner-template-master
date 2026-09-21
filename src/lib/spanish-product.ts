import type { Locale } from "../data/site.ts";
import {
  FINISH_NAMES_ES,
  MATERIAL_NAMES_ES,
  SPEC_VALUES_ES,
} from "../data/es-glossary.ts";
import {
  FINISH_NAMES_PT,
  MATERIAL_NAMES_PT,
  SPEC_VALUES_PT,
} from "../data/pt-glossary.ts";

/**
 * Localise structured catalogue facts without translating or inferring them.
 *
 * Only exact, client-reviewed glossary matches change. Unknown values stay in the
 * source language so a missing terminology decision remains visible to reviewers.
 *
 * ---------------------------------------------------------------------------
 * ⚠ THIS CONSULTED ONE TABLE AND THE GENERATOR CONSULTED THREE
 *
 * `scripts/translate-products-pt.mjs` reads SPEC_VALUES_PT, MATERIAL_NAMES_PT and
 * FINISH_NAMES_PT; this read SPEC_VALUES_PT alone. Same question, two answers — which is
 * the drift AGENTS.md warns about when one fact lives in two places.
 *
 * It showed up on the card under every product: "Zinc Alloy" on 152 Portuguese pages,
 * "Stainless Steel" on 250, both of them sitting in MATERIAL_NAMES_PT the whole time and
 * never looked at. The spec TABLE on the same page read "Zamak", because that went through
 * the generator. One page, two translations of one word, neither of them wrong on its own.
 *
 * ---------------------------------------------------------------------------
 * AND A SLASH IS A LIST
 *
 * "Zinc Alloy/304 Stainless Steel" is how the factory writes a two-material part, and it is
 * not a phrase — it is two values with a separator. Looking it up whole finds nothing, so
 * the parts are translated individually and rejoined with the separator they arrived with.
 *
 * A part that has no entry keeps its English, and the rest still translate: a material line
 * reading "Zamak/304 Stainless Steel" is honest about which half we have a decision for,
 * and it is visibly incomplete, which is the state that gets fixed.
 */

/**
 * The separators a factory spec sheet uses between values in one field.
 *
 * The comma joined the set on 2026-09-17. A finish row is written as a list —
 * "Chrome Plated (CP), Polished Brass (PB)" — and without it the whole row missed, which
 * is nine Spanish pages of English finishes from one character.
 */
const SEPARATORS = /(\s*[/+,]\s*)/;

type Table = Record<string, string>;

function lookupIn(tables: Table[], value: string): string | undefined {
  for (const table of tables) {
    const hit = table[value];
    if (hit) return hit;
  }
  return undefined;
}

/**
 * The tables each locale consults, in order.
 *
 * Spanish has one because its spec values were composed by a generator rather than
 * collected into named tables; when `MATERIAL_NAMES_ES` and `FINISH_NAMES_ES` exist they
 * belong here beside it and nothing else changes.
 */
const TABLES: Record<"es" | "pt", Table[]> = {
  es: [SPEC_VALUES_ES, MATERIAL_NAMES_ES, FINISH_NAMES_ES],
  pt: [SPEC_VALUES_PT, MATERIAL_NAMES_PT, FINISH_NAMES_PT],
};

function localiseValue(value: string, tables: Table[]): string {
  const whole = lookupIn(tables, value);
  if (whole) return whole;

  /* A lone "Gun metal (GM)" has no separator in it, so the split below never sees it. */
  const coded = /^(.*?)\s*\(([^)]+)\)$/.exec(value.trim());
  if (coded) {
    const name = lookupIn(tables, coded[1].trim());
    if (name) return `${name} (${coded[2]})`;
  }

  /*
    split() with a capturing group keeps the separators in the result, so the original
    spelling is rebuilt exactly — "A / B" does not come back as "A/B".

    ⚠ The whitespace is INSIDE the captured group for that reason. It used to sit outside
    it, which meant every separator was rebuilt bare: a comma-separated finish list came
    back as "Cromado (CP),Latón pulido (PB)" with the spaces eaten. The comment above was
    written before the comma joined the set and had been wrong ever since.
  */
  const parts = value.split(SEPARATORS);
  if (parts.length < 3) return value;

  let translatedAny = false;
  const rebuilt = parts.map((part, index) => {
    /* Odd indices are the captured separators. */
    if (index % 2 === 1) return part;
    const hit = lookupIn(tables, part.trim());
    if (hit) {
      translatedAny = true;
      return hit;
    }
    /*
      "Antique Brass (AB)" is a name with an order code after it. Translate the name, put
      the code back byte for byte — a code is an identifier, and a buyer writes it onto a
      purchase order exactly as printed.
    */
    const coded = /^(.*?)\s*\(([^)]+)\)$/.exec(part.trim());
    if (coded) {
      const name = lookupIn(tables, coded[1].trim());
      if (name) {
        translatedAny = true;
        return `${name} (${coded[2]})`;
      }
    }
    return part;
  });

  return translatedAny ? rebuilt.join("") : value;
}

/**
 * ⚠ SPANISH USED TO SKIP THE SPLIT, AND 146 SPANISH PAGES CARRIED ENGLISH MATERIALS.
 *
 * This function read `SPEC_VALUES_ES[value] ?? value` — a whole-string lookup — while
 * Portuguese went through the split above. So "Zinc Alloy/304 Stainless Steel" was
 * "Aleación de zinc/Acero inoxidable 304" on the Portuguese page and untouched English on
 * the Spanish one, from the same record, in the same component.
 *
 * The lesson is the one this file already records one screen up: when two locales answer
 * the same question through two code paths, they will disagree, and the newer path is not
 * automatically the wrong one to generalise.
 */
export function localiseProductValues(values: string[], locale: Locale): string[] {
  if (locale !== "es" && locale !== "pt") return values;
  const tables = TABLES[locale];
  return values.map((value) => localiseValue(value, tables));
}
