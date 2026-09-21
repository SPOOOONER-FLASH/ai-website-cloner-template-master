import type { Product } from "../data/types.ts";

/**
 * How many products the catalogue itself says can be keyed alike or master keyed.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS TAKES AN ARRAY INSTEAD OF READING THE CATALOGUE
 *
 * So it can be tested. `src/data/products.ts` pulls in the generated index and the
 * category aliases through extensionless imports that only Next resolves, so anything
 * importing it cannot run under `node --test` — which is why the catalogue-count tests in
 * this repo read `content/products/*.json` from disk instead. A pure function over an
 * array can be called by both: the homepage passes the live catalogue, the test passes
 * the files, and the number on the card is checked against the same rule that produced
 * it rather than against a copy of the rule.
 *
 * ---------------------------------------------------------------------------
 * WHY THE MATCH IS ON STATED TEXT AND NOT A FLAG
 *
 * There is no `keyable` field, and inventing one would mean deciding for 700 products
 * what their records do not say. What the records DO carry is a keying row or a feature
 * line in the factory's own words — "Can be keyed alike to the deadbolt series, or master
 * keyed". Counting those counts what we can actually stand behind, and a product that
 * gains the capability gains it by having the fact written down, which is the right order.
 *
 * Unpublished products are excluded: a model with no photograph is off every browse
 * surface (see isPublished in src/data/products.ts), so counting it would advertise a
 * choice a buyer cannot make.
 */

const KEYABLE = /master ?key|keyed alike|master ?keyed/i;

export function keyableProducts<T extends Pick<Product, "specs" | "features" | "heroImage">>(
  catalogue: T[],
): T[] {
  return catalogue.filter((product) => {
    if (!product.heroImage?.src) return false;

    const stated = [
      ...(product.specs ?? []).map((row) => `${row.label} ${row.value}`),
      ...(product.features ?? []),
    ];

    return stated.some((line) => KEYABLE.test(line));
  });
}
