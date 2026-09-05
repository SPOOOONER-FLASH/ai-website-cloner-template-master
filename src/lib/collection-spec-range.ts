import { SPEC_LABELS_ES } from "../data/es-glossary.ts";
import type { Locale } from "../data/site.ts";
import type { Product } from "../data/types.ts";

/**
 * What a whole collection spans, computed from the products in it.
 *
 * ---------------------------------------------------------------------------
 * WHY A RANGE AND NOT A SPEC PER ROW
 *
 * The nineteen collection pages scored 38 on citability against 68 for the comparison
 * tables — and both are built from the same catalogue. The difference is that the
 * comparison tables print the numbers and the collection pages print only names. So the
 * fix is to print numbers.
 *
 * A figure per row would have worked too, but a range answers the question a buyer
 * actually arrives with. Somebody landing on "Mortise Locks" wants to know whether their
 * 60mm backset and 45mm door are in this family at all; a list of forty rows makes them
 * read forty rows to find out. One line — "Backset 45–85mm" — settles it, and it is
 * the same line an answer engine can quote when asked what backsets we make.
 *
 * ---------------------------------------------------------------------------
 * HOW THE NUMBERS ARE DERIVED
 *
 * Nothing is inferred. A range is only shown when at least three products in the
 * collection state that field, so a single record cannot speak for the family, and the
 * count of products carrying it is not padded with the ones that do not.
 *
 * Numeric fields collapse to min–max by parsing the millimetre values out of the recorded
 * strings; non-numeric fields collapse to the distinct values, most common first. Where a
 * field is stated inconsistently across the family the range simply comes out wide, which
 * is true, rather than tidy.
 */

export interface SpecRange {
  label: string;
  value: string;
  /** How many products in the collection state this field. Shown so the reader can weigh it. */
  stated: number;
}

/** The fields worth summarising, in the order a specifier checks them. */
const FIELDS: Array<{ labels: string[]; numeric: boolean }> = [
  { labels: ["Backset"], numeric: true },
  { labels: ["Centre distance", "Center Distance", "Grip centre distance"], numeric: true },
  { labels: ["Door thickness", "Suitable Door Thickness"], numeric: true },
  { labels: ["Deadbolt throw", "Latch extension", "Projection"], numeric: true },
  { labels: ["Size", "Sizes", "Plate size", "Length"], numeric: true },
  { labels: ["Material"], numeric: false },
  { labels: ["Finish", "Finishes", "Surface Finish"], numeric: false },
  { labels: ["Function"], numeric: false },
];

/** At least this many products must state a field before it speaks for the family. */
const MIN_STATED = 3;
/** Distinct non-numeric values worth listing before the line stops being readable. */
const MAX_VALUES = 4;

/** Millimetre figures inside a recorded string — "35mm to 55mm standard" gives 35 and 55. */
function millimetres(value: string): number[] {
  return [...value.matchAll(/(\d+(?:[.,]\d+)?)\s*mm/gi)]
    .map((m) => Number(m[1].replace(",", ".")))
    .filter((n) => Number.isFinite(n) && n > 0 && n < 5000);
}

export function collectionSpecRanges(products: Product[], locale: Locale = "en"): SpecRange[] {
  const es = locale === "es";
  const out: SpecRange[] = [];

  for (const field of FIELDS) {
    const values: string[] = [];
    for (const product of products) {
      const rows = es && product.specsEs?.length ? product.specsEs : product.specs;
      /*
        Spanish records are keyed by Spanish labels, so the English label is expanded
        through the same glossary the catalogue is composed from — the identical trap the
        product FAQ fell into, avoided here by reading from one source rather than two.
      */
      const wanted = es
        ? field.labels.flatMap((l) => [l, SPEC_LABELS_ES[l]]).filter(Boolean)
        : field.labels;
      const row = rows.find((r) => wanted.includes(r.label) && r.value);
      if (row) values.push(row.unit ? `${row.value} ${row.unit}` : row.value);
    }
    if (values.length < MIN_STATED) continue;

    const label = es ? (SPEC_LABELS_ES[field.labels[0]] ?? field.labels[0]) : field.labels[0];

    if (field.numeric) {
      const figures = values.flatMap(millimetres);
      if (figures.length < MIN_STATED) continue;
      const lo = Math.min(...figures);
      const hi = Math.max(...figures);
      out.push({
        label,
        value: lo === hi ? `${lo}mm` : `${lo}–${hi}mm`,
        stated: values.length,
      });
      continue;
    }

    const counts = new Map<string, number>();
    for (const value of values) {
      /* One recorded string can name several finishes; each is its own value. */
      for (const part of value.split(/[,;]| — /)) {
        const token = part.trim().replace(/\.$/, "");
        if (token && token.length < 40) counts.set(token, (counts.get(token) ?? 0) + 1);
      }
    }
    const top = [...counts]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_VALUES)
      .map(([value]) => value);
    if (!top.length) continue;
    out.push({ label, value: top.join(", "), stated: values.length });
  }

  return out;
}

export function specRangeHeading(locale: Locale = "en"): string {
  return locale === "es" ? "Lo que abarca esta gama" : "What this range covers";
}

/** "stated on 12 of 19 models" — so a reader knows how much of the family the line speaks for. */
export function statedOn(count: number, total: number, locale: Locale = "en"): string {
  return locale === "es"
    ? `indicado en ${count} de ${total} modelos`
    : `stated on ${count} of ${total} models`;
}
