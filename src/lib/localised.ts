import type { Locale } from "../data/locales.ts";

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
/*
  The signature takes the record rather than its value type, and returns the type of its
  English member.

  `Partial<Record<Locale, T>>` looks like the obvious shape and does not compile against
  the copy dictionaries in this codebase: they are `as const`, so `en` and `es` have
  DIFFERENT literal types ("Model" vs "Modelo"), T is inferred from the first, and the
  second no longer matches. Constraining on the record and projecting `R["en"]` keeps the
  precise English types every caller already relies on.

  `en` is required by the constraint, so the fallback cannot be missing — the runtime check
  below is for JavaScript callers and for a record built dynamically.
*/
export function localised<R extends { en: unknown } & Partial<Record<Locale, unknown>>>(
  record: R,
  locale: Locale,
): R["en"] {
  const value = record[locale];
  if (value !== undefined) return value as R["en"];

  if (record.en === undefined) {
    throw new Error(
      `localised(): no value for "${locale}" and no English fallback. ` +
        `Every record must carry at least "en".`,
    );
  }
  return record.en;
}

/** True when this locale is being served the English fallback rather than its own text. */
export function isFallback(
  record: Partial<Record<Locale, unknown>>,
  locale: Locale,
): boolean {
  return locale !== "en" && record[locale] === undefined;
}
