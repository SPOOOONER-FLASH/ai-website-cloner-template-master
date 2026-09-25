import type { Locale } from "../data/site.ts";
import type { OverlayLocale } from "../data/locales.ts";
import { FINISH_NAMES_ES, MATERIAL_NAMES_ES, SPEC_VALUES_ES } from "../data/es-glossary.ts";
import { FINISH_NAMES_PT, MATERIAL_NAMES_PT, SPEC_VALUES_PT } from "../data/pt-glossary.ts";

/**
 * The value localiser without the overlay data, so a client bundle can use it with the
 * generated subset (src/lib/i18n-client.ts) while server code uses the full glossaries
 * (src/lib/spanish-product.ts). The rules and their history are documented there.
 */
const SEPARATORS = /(\s*[/+,]\s*)/;

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
export type Table = Record<string, string>;

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


export function localiseValuesWith(values: string[], locale: Locale, overlayTables: (locale: OverlayLocale) => Table[]): string[] {
  if (locale === "en") return values;
  const tables = locale === "es" || locale === "pt" ? TABLES[locale] : overlayTables(locale);
  return values.map((value) => localiseValue(value, tables));
}
