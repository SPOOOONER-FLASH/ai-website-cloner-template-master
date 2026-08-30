import type { Locale } from "../data/site.ts";
import { SPEC_VALUES_ES } from "../data/es-glossary.ts";

/**
 * Localise structured catalogue facts without translating or inferring them.
 *
 * Only exact, client-reviewed glossary matches change. Unknown values stay in the
 * source language so a missing terminology decision remains visible to reviewers.
 */
export function localiseProductValues(values: string[], locale: Locale): string[] {
  if (locale !== "es") return values;
  return values.map((value) => SPEC_VALUES_ES[value] ?? value);
}
