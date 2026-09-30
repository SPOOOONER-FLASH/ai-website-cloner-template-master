import type { Locale } from "../data/site.ts";

/**
 * The value localiser without ANY data — not the overlay subset and, since 2026-09-30, not
 * the Spanish and Portuguese glossaries either. The caller hands over the tables for the
 * locale it is rendering: src/lib/spanish-product.ts (server) imports the glossaries,
 * src/lib/i18n-client-values.ts (client) reads whatever the locale's layout registered.
 * The rules and their history are documented in spanish-product.ts.
 *
 * WHY THE GLOSSARIES LEFT. This module was imported by src/lib/i18n-client.ts, which every
 * "use client" component imports, so SPEC_VALUES_ES / _PT rode in the shared client chunk of
 * every page in every language — 117 KB, 33 KB gzipped, on an English homepage. The same
 * lesson as the 1,267 KB overlay incident recorded in i18n-core.ts, one file down.
 */
const SEPARATORS = /(\s*[/+,]\s*)/;

function lookupIn(tables: Table[], value: string): string | undefined {
  for (const table of tables) {
    const hit = table[value];
    if (hit) return hit;
  }
  return undefined;
}

/** One lookup table; a locale consults several in order (spec values, materials, finishes). */
export type Table = Record<string, string>;

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


export function localiseValuesWith(
  values: string[],
  locale: Locale,
  tablesOf: (locale: Exclude<Locale, "en">) => Table[],
): string[] {
  if (locale === "en") return values;
  const tables = tablesOf(locale);
  return values.map((value) => localiseValue(value, tables));
}
