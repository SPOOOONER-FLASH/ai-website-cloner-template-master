import type { Locale } from "../data/site.ts";
import { overlays } from "../data/i18n-overlays.ts";
import { localiseValuesWith } from "./localise-values.ts";

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
  /* The seven overlay locales: the same three tables, from content/i18n/<code>/glossary.json. */
  return localiseValuesWith(values, locale, (code) => [
    overlays[code].glossary.specValues,
    overlays[code].glossary.materialNames,
    overlays[code].glossary.finishNames,
  ]);
}
