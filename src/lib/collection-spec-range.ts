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
  /*
    "Bar Length" belongs in this group and its absence printed a wrong number.

    The panic-exit family records the push-bar span under "Bar Length" (309-D: 1110mm)
    while its siblings use "Length" (305: 1040mm, 314: 650mm / 800mm / 1000mm). Reading
    only "Length" produced "Size 650–1040mm" — a line that tells a specifier the longest
    bar we make is 1040mm, with an 1110mm bar sitting one row below it in the same
    collection. A range that excludes a stated value is worse than no range: it is a
    figure the buyer can disprove from our own catalogue.
  */
  { labels: ["Size", "Sizes", "Plate size", "Length", "Bar Length"], numeric: true },
  /*
    Cycle life is the one endurance figure this catalogue states, and a buyer comparing us
    against an ANSI Grade 1 claim asks for it by name. It stays non-numeric because the
    value is a cycle count, not a millimetre figure — the numeric branch parses mm only,
    so routing it there would silently drop every row.
  */
  { labels: ["Cycle life"], numeric: false },
  /*
    Closers are selected by what they can carry, not by how they are built, so these two
    are the first rows a specifier reads on a closer family — and they were missing, which
    left the double-leaf fire door set with nothing but a material list. "Capacity" stays
    non-numeric because the values are weight bands ("45-85KG") and the numeric branch
    parses millimetres; printing the bands is what a reader wants anyway, since the answer
    to "will this hold my door" is which band the leaf falls in.
  */
  { labels: ["Door Width", "Door width"], numeric: true },
  { labels: ["Capacity"], numeric: false },
  { labels: ["Material"], numeric: false },
  { labels: ["Finish", "Finishes", "Surface Finish"], numeric: false },
  { labels: ["Function"], numeric: false },
];

/** At least this many products must state a field before it speaks for the family. */
const MIN_STATED = 3;
/** Distinct non-numeric values worth listing before the line stops being readable. */
const MAX_VALUES = 4;

/**
 * Millimetre figures inside a recorded string — "35mm to 55mm standard" gives 35 and 55.
 *
 * A list may carry its unit once, at the end. English records 314 as
 * "650mm / 800mm / 1000mm" and Spanish records the same device as
 * "650 / 800 / 1000 mm", which is correct Spanish and correct catalogue practice. Reading
 * only `figure + mm` took all three from the English row and one from the Spanish, so the
 * two sites printed different spans — 650–1110mm against 1000–1110mm — off identical
 * data. Copy parity checks the words; nothing was checking the figures a component
 * derives from them. Distribute a trailing unit back across the run it closes.
 */
function millimetres(value: string): number[] {
  const expanded = value.replace(
    /(\d+(?:[.,]\d+)?)(\s*\/\s*)(?=(?:\d+(?:[.,]\d+)?\s*\/\s*)*\d+(?:[.,]\d+)?\s*mm\b)/gi,
    "$1mm$2",
  );
  return [...expanded.matchAll(/(\d+(?:[.,]\d+)?)\s*mm/gi)]
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
      /*
        One recorded string can name several finishes; each is its own value.

        The comma must not split a thousands separator. "200,000 cycles" came back as
        "200" and "000 cycles" and rejoined for display as "200, 000 cycles" — a figure
        no buyer would trust and none of us would have caught by reading the finish rows,
        because finishes never carry digits. Split on a comma only when a digit is not
        standing on both sides of it.
      */
      for (const part of value.split(/(?<!\d),(?!\d)|;| — /)) {
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
