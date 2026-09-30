import type { Locale } from "../data/locales.ts";
import { clientBundleValues } from "./i18n-client.ts";
import { localiseValuesWith, type Table } from "./localise-values.ts";

/**
 * Material / finish values on a card, in the reader's language, for "use client" components.
 *
 * Split out of src/lib/i18n-client.ts on 2026-09-30 so that importing `tx` for a button label
 * does not also import the value tables. The overlay locales' values arrive with their
 * generated bundle (src/data/generated/i18n-client/<code>.json); Spanish and Portuguese are
 * registered below by src/data/i18n-client-values-es.tsx / -pt.tsx from the glossaries, and
 * only those two layouts render them. An English page ships none of it.
 *
 * A locale nothing registered for falls back to the English value, which is the same rule
 * every other translation on the site follows (src/lib/localised.ts).
 */
const recordLocaleTables: Partial<Record<"es" | "pt", Table[]>> = {};

/** Called once per locale by the registration module. Idempotent. */
export function registerRecordLocaleValues(locale: "es" | "pt", tables: Table[]): void {
  recordLocaleTables[locale] = tables;
}

export const localiseProductValues = (values: string[], locale: Locale): string[] =>
  localiseValuesWith(values, locale, (code) =>
    code === "es" || code === "pt" ? (recordLocaleTables[code] ?? []) : [clientBundleValues(code)],
  );
