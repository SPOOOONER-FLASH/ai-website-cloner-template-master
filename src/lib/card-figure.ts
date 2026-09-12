import { SPEC_LABELS_ES } from "../data/es-glossary.ts";
import type { Locale } from "../data/site.ts";
import type { Product } from "../data/types.ts";

/**
 * The one figure worth printing on a catalogue card.
 *
 * ---------------------------------------------------------------------------
 * WHY A CARD CARRIES A NUMBER AT ALL
 *
 * The client's own Alibaba listings burn a dimension into the product photograph —
 * "Center Distance 92 mm" sits on the 311 main image — and that is the right instinct.
 * A specifier scanning forty cards is not reading names; they are looking for the one
 * measurement that decides whether a product is even a candidate. A card that shows it
 * removes a click for the buyer and removes a dead visit for us.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT BURN IT INTO THE IMAGE, WHICH IS WHAT ALIBABA DOES
 *
 * Three reasons, and they are not stylistic:
 *
 *   1. The site is English, Spanish and Chinese. Text baked into a photograph is baked
 *      in one language, so the Spanish mirror would show an English label on a Spanish
 *      page — the same class of defect as the category names that took 534 pages.
 *   2. Baked text is invisible to a screen reader and to anything that reads the page
 *      as data, including the answer engines this catalogue is trying to be cited by.
 *   3. 518 photographs would have to be regenerated whenever a figure is corrected. A
 *      correction that expensive is a correction that does not happen.
 *
 * HTML text over the image gets the same visual result with none of that.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT WILL NOT DO
 *
 * Return anything when the catalogue does not state a figure. 276 of the 636 published
 * products have no dimension on record — that is the factory-data gap, not a rendering
 * problem, and those cards stay blank rather than carrying a softer-sounding substitute.
 * A card that says nothing is honest; a card that says "Steel" where its neighbours say
 * "Backset 60mm" is a card admitting we do not know our own product.
 */

/**
 * Ordered by what actually decides a purchase, not by what is most often recorded.
 *
 * Backset first because it is the question a mortise or tubular lock is bought on, and a
 * wrong one cannot be filed out on site. Plate and bar lengths come before generic
 * "Size" so a panic bar shows its span rather than a carton dimension.
 */
const FIGURE_LABELS = [
  "Backset",
  "Centre distance",
  "Center Distance",
  "Grip centre distance",
  "Plate length",
  "Bar Length",
  "Length",
  "Size",
  "Deadbolt throw",
  "Door thickness",
  "Capacity",
  "Door Width",
] as const;

export interface CardFigure {
  label: string;
  value: string;
}

/** A value only counts if it carries a digit — "Available on request" is not a figure. */
const hasDigit = (value: string) => /\d/.test(value);

export function cardFigure(
  product: Partial<Pick<Product, "specs" | "specsEs">>,
  locale: Locale = "en",
): CardFigure | undefined {
  const es = locale === "es";

  for (const label of FIGURE_LABELS) {
    const row = product.specs?.find((spec) => spec.label === label && hasDigit(spec.value));
    if (!row) continue;

    /*
      The Spanish row is looked up by its own label rather than translated here, and it
      falls back to the English VALUE with a Spanish LABEL when the Spanish record has no
      matching row. A figure is the same figure in both languages — "60mm" needs no
      translation — so falling back keeps the two sites stating the same number, which is
      the property copy:parity exists to protect.
    */
    if (es) {
      const esLabel = SPEC_LABELS_ES[label] ?? label;
      const esRow = product.specsEs?.find((spec) => spec.label === esLabel && hasDigit(spec.value));
      return { label: esLabel, value: esRow?.value ?? row.value };
    }

    return { label, value: row.value };
  }

  return undefined;
}
