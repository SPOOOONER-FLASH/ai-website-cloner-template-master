import type { Product } from "../data/types.ts";
import type { Locale } from "../data/site.ts";
import { collectionSpecRanges } from "./collection-spec-range.ts";
import { t } from "./i18n.ts";
import { localiseProductValues } from "./spanish-product.ts";

/**
 * The figures a category buying guide is allowed to print.
 *
 * Every number here is counted or ranged from the published records at build time — the
 * same rule as the comparison tables and the spec-range block. The guide copy in
 * src/data/category-buying-guides.ts holds `{count}`, `{backset}`, `{thickness}` and the
 * other placeholders; a sentence whose facts are not stated on enough records is not
 * printed at all (see `guideBlocks`). That is what keeps the block from turning into the
 * plausible-but-unsourced paragraph AGENTS.md forbids: the words are ours, the figures are
 * the catalogue's, and a figure the catalogue cannot support removes the sentence.
 *
 * Numeric ranges reuse collectionSpecRanges (one parser for the whole site). The three
 * list facts — materials, finishes, functions — are counted here from whole values, because
 * the range block joins its top values with ", " and a value such as "Entrance, keyed
 * outside" cannot be split back. Bar length is its own fact: the shared "Size" group also
 * takes a trim's plate size, which put "52–1110mm" under "bar lengths" on 2026-09-28.
 */
export interface CategoryFacts {
  count: number;
  backset?: string;
  center?: string;
  thickness?: string;
  throw?: string;
  sizes?: string;
  barLength?: string;
  cycle?: string;
  doorWidth?: string;
  capacity?: string;
  materials?: string;
  finishes?: string;
  functions?: string;
}

const RANGE_KEY: Record<string, keyof CategoryFacts> = {
  Backset: "backset",
  "Center distance": "center",
  "Door thickness": "thickness",
  "Deadbolt throw": "throw",
  Size: "sizes",
  "Cycle life": "cycle",
  "Door Width": "doorWidth",
  Capacity: "capacity",
};

const LIST_FACTS: Array<{ key: keyof CategoryFacts; labels: string[] }> = [
  { key: "materials", labels: ["Material"] },
  { key: "finishes", labels: ["Finish", "Finishes", "Surface Finish"] },
  { key: "functions", labels: ["Function"] },
];

const MIN_STATED = 3;
const MAX_VALUES = 4;
/** A value longer than this is a sentence, not a name, and does not belong in a list. */
const MAX_VALUE_LENGTH = 60;

function millimetres(value: string): number[] {
  /* "8-12mm" and "35–55mm" state two figures; only the second carries the unit. */
  const expanded = value.replace(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(?=\d+(?:[.,]\d+)?\s*mm\b)/gi, "$1mm–");
  return [...expanded.matchAll(/(\d+(?:[.,]\d+)?)\s*mm/gi)]
    .map((m) => Number(m[1].replace(",", ".")))
    .filter((n) => Number.isFinite(n) && n > 0 && n < 5000);
}

function rowValue(product: Product, labels: string[], locale: Locale): string | undefined {
  const rows = product.specs ?? [];
  const row = rows.find((r) => labels.includes(r.label) && r.value);
  if (!row) return undefined;
  if (locale === "en" || locale === "es" || locale === "pt") return row.value;
  /* Overlay locales carry translated values under the English labels. */
  const localeRows = t(product, "specs", locale);
  const localised = localeRows?.find((r) => r.label === row.label && r.value);
  return localised?.value ?? row.value;
}

function listFact(products: Product[], labels: string[], locale: Locale): string | undefined {
  const counts = new Map<string, { value: string; n: number }>();
  let stated = 0;
  for (const product of products) {
    const value = rowValue(product, labels, locale)?.trim().replace(/\.$/, "");
    if (!value) continue;
    stated++;
    if (value.length > MAX_VALUE_LENGTH) continue;
    const key = value.toLowerCase().replace(/\s+/g, " ");
    const hit = counts.get(key);
    if (hit) hit.n++;
    else counts.set(key, { value, n: 1 });
  }
  if (stated < MIN_STATED || !counts.size) return undefined;
  const top = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, MAX_VALUES).map((c) => c.value);
  return (locale === "es" || locale === "pt" ? localiseProductValues(top, locale) : top).join(", ");
}

function rangeFact(products: Product[], labels: string[]): string | undefined {
  const figures = products.flatMap((p) => {
    const value = rowValue(p, labels, "en");
    return value ? millimetres(value) : [];
  });
  if (figures.length < MIN_STATED) return undefined;
  const lo = Math.min(...figures);
  const hi = Math.max(...figures);
  return lo === hi ? `${lo}mm` : `${lo}–${hi}mm`;
}

export function categoryFacts(products: Product[], locale: Locale = "en"): CategoryFacts {
  const facts: CategoryFacts = { count: products.length };
  const bag = facts as unknown as Record<string, unknown>;
  for (const range of collectionSpecRanges(products, "en")) {
    const key = RANGE_KEY[range.label];
    if (key) bag[key] = range.value;
  }
  for (const { key, labels } of LIST_FACTS) {
    const value = listFact(products, labels, locale);
    if (value) bag[key] = value;
  }
  const barLength = rangeFact(products, ["Bar Length", "Length"]);
  if (barLength) facts.barLength = barLength;
  return facts;
}
