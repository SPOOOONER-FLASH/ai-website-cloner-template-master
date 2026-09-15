import { HARDWARE_TERMS, type HardwareTerm } from "../data/hardware-terms.ts";
import { publishedProducts } from "../data/products.ts";

/**
 * How many published models publish each term's value.
 *
 * The count is the thing that makes this a glossary of OUR catalogue rather than a list
 * of trade words copied from somewhere. "Backset — 145 models state it" tells a reader
 * two things at once: what the word means, and that we can answer the question for most
 * of the range. Where the count is low, that is honest too — `Fixing centre` reads 5, and
 * its entry says so in as many words.
 *
 * Derived at build time, so it moves when the catalogue moves. Nothing here is typed by
 * hand beside the definition.
 */

export interface TermUsage {
  term: HardwareTerm;
  /** Published models with at least one of the term's spec labels filled in. */
  models: number;
}

function countFor(term: HardwareTerm): number {
  /*
    Grade is not a spec row — it lives in the product-level `certifications` array, which
    is the only field on a record that can carry a test standard. Counting it from there
    keeps the entry honest rather than borrowing a nearby label.
  */
  if (term.countCertifications) {
    return publishedProducts.filter((product) => product.certifications?.length).length;
  }
  if (!term.specLabels.length) return 0;
  const labels = new Set(term.specLabels);
  let count = 0;
  for (const product of publishedProducts) {
    if (product.specs?.some((spec) => labels.has(spec.label))) count += 1;
  }
  return count;
}

export const termUsage: TermUsage[] = HARDWARE_TERMS.map((term) => ({
  term,
  models: countFor(term),
}));

export const termsByGroup = (["dimensions", "mechanism", "ordering"] as const).map((group) => ({
  group,
  terms: termUsage.filter((entry) => entry.term.group === group),
}));

/** Published models stating at least one glossary term. The headline figure on the page. */
export const modelsWithGlossaryTerm = (() => {
  const labels = new Set(HARDWARE_TERMS.flatMap((term) => term.specLabels));
  return publishedProducts.filter((product) =>
    product.specs?.some((spec) => labels.has(spec.label)),
  ).length;
})();
