import { isOverlayLocale, type Locale, type OverlayLocale } from "../data/locales.ts";
import { overlays, type OverlayBundle } from "../data/i18n-overlays.ts";
import { makeDict, makeSpecLabels, makeTx, type Overlayed } from "./i18n-core.ts";

/**
 * How every page reads text in the reader's language.
 *
 * ---------------------------------------------------------------------------
 * THREE LOCALE TIERS, ONE READING RULE
 *
 *   en        the source. Every record, dictionary and page is written in it.
 *   es, pt    on the records: `nameEs`, `bodyPt`, and `{ en, es, pt }` dictionaries.
 *   fr de ja  in content/i18n/<code>/ — the overlay (src/data/i18n-overlays.ts), keyed
 *   ko tr ru  by slug for records and by the ENGLISH SENTENCE for interface copy.
 *   ar
 *
 * The rule is the same for all of them and it is the one src/lib/localised.ts states:
 * the reader's language if it exists, English if it does not — never a third language,
 * because a Turkish page quietly serving German looks finished and is not. Every fallback
 * is counted by scripts/track-locale-mirror.mjs, so a gap is a number on the board
 * rather than a surprise on the site.
 *
 * ---------------------------------------------------------------------------
 * WHY INTERFACE COPY IS KEYED BY THE ENGLISH SENTENCE
 *
 * Ninety-three components carry their own `{ en, es, pt }` dictionaries and ternaries.
 * Re-keying every string ("faq.title", "product.specs.heading"…) would touch every one
 * of them and move the English out of the place a reader of the code sees it. Keying the
 * overlay by the English sentence leaves the code as it is: `tx(locale, "Ask a question")`
 * reads as English, and `ui.json` answers "Eine Frage stellen". The same key serves every
 * dictionary, every page and every component, and a sentence that changes in English
 * visibly loses its translations — which is the correct outcome, not a bug.
 */

export { LOCALE_TAG, OG_LOCALE, LANGUAGE_LABELS, LOCALE_DIR, type LocaleDict } from "./i18n-core.ts";

/** The overlay bundle for a locale, or null for the three record-level locales. */
export function overlayFor(locale: Locale): OverlayBundle | null {
  return isOverlayLocale(locale) ? overlays[locale] : null;
}

const uiOf = (locale: OverlayLocale) => overlays[locale].ui;

/** A translated interface sentence, or the English one. */
export const tx = makeTx(uiOf);

/** A whole copy dictionary in the reader's language (see i18n-core.ts). Server side: the full overlay. */
export const dict = makeDict(uiOf);

export { t, isEnglishFallback, type Overlayed } from "./i18n-core.ts";


/**
 * Attach the overlay translations of every overlay locale to a list of records.
 *
 * Called once by each data module (products, categories, news, guides, projects) on the
 * generated list, so a record carries `i18n.de`, `i18n.fr`… beside its `…Es` / `…Pt`
 * fields and `t()` can read any locale the same way. A record with no translation yet
 * gets no `i18n` entry for that locale, which `t()` reads as "fall back to English".
 */
export function withOverlays<R extends object>(
  records: R[],
  kind: keyof Pick<OverlayBundle, "products" | "categories" | "news" | "guides" | "projects">,
  keyOf: (record: R) => string,
): (R & Overlayed)[] {
  return records.map((record) => {
    const key = keyOf(record);
    const i18n: Overlayed["i18n"] = {};
    for (const [code, bundle] of Object.entries(overlays) as [OverlayLocale, OverlayBundle][]) {
      const translated = bundle[kind][key];
      if (translated) i18n[code] = translated;
    }
    return Object.keys(i18n).length ? { ...record, i18n } : record;
  });
}

/**
 * The spec-label table of a locale: what "Backset" is called in its spec tables. Spanish
 * and Portuguese keep their hand-written glossaries; the seven overlay locales read
 * `glossary.specLabels` from content/i18n/<code>/glossary.json. English has no table.
 */
export const specLabels = makeSpecLabels((locale: OverlayLocale) => overlays[locale].glossary.specLabels ?? {});

/** A spec label in the reader's language, or the English label. */
export function specLabel(label: string, locale: Locale): string {
  return specLabels(locale)[label] ?? label;
}
