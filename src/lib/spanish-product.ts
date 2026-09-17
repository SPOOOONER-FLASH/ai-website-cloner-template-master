import type { Locale } from "../data/site.ts";
import { SPEC_VALUES_ES } from "../data/es-glossary.ts";
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

/** The separators a factory spec sheet uses between two values in one field. */
const SEPARATORS = /\s*([/+])\s*/;

function lookupPt(value: string): string | undefined {
  return SPEC_VALUES_PT[value] ?? MATERIAL_NAMES_PT[value] ?? FINISH_NAMES_PT[value];
}

function localisePt(value: string): string {
  const whole = lookupPt(value);
  if (whole) return whole;

  /*
    split() with a capturing group keeps the separators in the result, so the original
    spelling is rebuilt exactly — "A / B" does not come back as "A/B".
  */
  const parts = value.split(SEPARATORS);
  if (parts.length < 3) return value;

  let translatedAny = false;
  const rebuilt = parts.map((part, index) => {
    /* Odd indices are the captured separators. */
    if (index % 2 === 1) return part;
    const pt = lookupPt(part.trim());
    if (pt) translatedAny = true;
    return pt ?? part;
  });

  return translatedAny ? rebuilt.join("") : value;
}

export function localiseProductValues(values: string[], locale: Locale): string[] {
  if (locale === "pt") return values.map(localisePt);
  if (locale !== "es") return values;
  return values.map((value) => SPEC_VALUES_ES[value] ?? value);
}
