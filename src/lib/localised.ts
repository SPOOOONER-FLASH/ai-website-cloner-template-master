import type { Locale } from "@/data/site";

/**
 * Reads a locale out of a record that may not have every locale yet.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS, AND WHY IT FALLS BACK TO ENGLISH RATHER THAN SPANISH
 *
 * Portuguese was added to `locales` on 2026-09-16 for the Brazilian market. The type
 * system immediately found every `Record<Locale, …>` in the codebase, which is the
 * behaviour we want — but a third locale does not arrive complete, and the interesting
 * question is what a page does with the fields that have no Portuguese yet.
 *
 * Falling back to SPANISH would be the tempting answer, because a Brazilian reader can
 * mostly read Spanish and the text would look finished. That is exactly the argument
 * against it. A page that silently mixes Portuguese and Spanish looks finished and is not,
 * so nobody fixes it, and a Brazilian buyer reads "cerradura" where the trade word is
 * "fechadura" and concludes the supplier does not know the market.
 *
 * English is the fallback because it is visibly a fallback. Nobody mistakes an English
 * paragraph on a Portuguese page for finished Portuguese, and the trade already works in
 * English — the catalogue, the standards and the drawings all are.
 *
 * ---------------------------------------------------------------------------
 * THE FALLBACK IS COUNTED, NOT HIDDEN
 *
 * `npm run audit:pt` walks the same records and reports how many fields still fall back,
 * by file. A fallback nobody can count is a fallback that becomes permanent — the same
 * reason the finish-code mapping returns null with a reason instead of guessing.
 */
export function localised<T>(record: Partial<Record<Locale, T>>, locale: Locale): T {
  const value = record[locale];
  if (value !== undefined) return value;

  const english = record.en;
  if (english === undefined) {
    throw new Error(
      `localised(): no value for "${locale}" and no English fallback. ` +
        `Every record must carry at least "en".`,
    );
  }
  return english;
}

/** True when this locale is being served the English fallback rather than its own text. */
export function isFallback<T>(record: Partial<Record<Locale, T>>, locale: Locale): boolean {
  return locale !== "en" && record[locale] === undefined;
}
