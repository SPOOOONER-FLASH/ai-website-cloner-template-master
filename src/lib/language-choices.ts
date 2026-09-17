import { locales, type Locale } from "../data/locales.ts";
import { mirrorHref } from "./spanish-mirror.ts";

/**
 * The language half of the location-and-language panel, on its own.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS NOT IN locale-picker.ts WITH THE REST OF THE PANEL
 *
 * Because the test that would have caught the Portuguese outage could not import it
 * there. `locale-picker.ts` needs `siteSettings` for the factory address, which reaches
 * content/navigation.json, which `node --test` refuses to load without an import
 * attribute — so the whole module was untestable under the unit runner, and the one list
 * in it that decided whether 645 pages were reachable had no test at all.
 *
 * Same move, same reason, as src/data/locales.ts: the thing worth asserting on goes in a
 * leaf. Everything here imports only the locale list and the mirror predicates.
 */

export interface LanguageChoice {
  /** BCP 47, for `lang` and `hreflang`. */
  code: Locale;
  /** Endonym: a reader looking for their own language scans for their own word for it. */
  label: string;
  href: string;
  current: boolean;
  /**
   * True when this page itself exists in that language. False means the link goes to that
   * language's home page instead, and the panel says so rather than pretending.
   */
  samePage: boolean;
}

/**
 * The language half of the panel, for the page currently being viewed.
 *
 * ---------------------------------------------------------------------------
 * ⚠ THIS WAS A TWO-LANGUAGE LIST UNTIL 2026-09-17, AND THE PORTUGUESE SITE WAS INVISIBLE
 *
 * 645 Portuguese pages shipped on 2026-09-16 with reciprocal hreflang, a sitemap and a
 * translated catalogue — and no way to reach any of them from the site itself. The panel
 * offered English and Español, because it was written when those were the only two, and
 * nothing failed: no test, no audit, no build check. The client found it by opening the
 * menu.
 *
 * That is the shape of the miss worth recording: a NEW SURFACE does not announce itself to
 * the old hard-coded lists. hreflang knew about Portuguese because `mirrorsOf` is derived;
 * this panel did not because its list was typed. Anything else that enumerates locales by
 * hand has the same bug waiting in it — which is why this now maps over `locales` instead.
 */
const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

export function languageChoices(pathname: string, locale: Locale): LanguageChoice[] {
  /* Strip whichever locale prefix this page carries to recover the English path. */
  const prefix = pathname.split("/")[1];
  const englishPath =
    prefix === "es" || prefix === "pt"
      ? pathname.replace(new RegExp(`^/${prefix}`), "") || "/"
      : pathname;

  return locales.map((code) => {
    /*
      One function decides this and the footer's anchors — see `mirrorHref`. They used to
      compute it separately, which is how the footer ended up offering an English URL for
      a Portuguese-only page while the panel offered something else.
    */
    const { href, samePage } = mirrorHref(englishPath, code);
    return { code, label: LANGUAGE_LABELS[code], href, current: locale === code, samePage };
  });
}

/**
 * The two-part label on the trigger: OTHERS | CURRENT.
 *
 * It used to read "INT | EN" — a region guess beside the current language. The client
 * struck the region on 2026-09-09, and it deserved striking twice over. "INT" is not a
 * place; it is jargon standing in for "we did not detect you", and detecting a reader is
 * something a static export cannot do anyway. Worse, it spent the header's only language
 * affordance on a word that tells a Spanish-speaking buyer nothing.
 *
 * So both slots carry languages, and the FIRST one holds the languages you are NOT
 * reading. That ordering is the whole point: a buyer scanning the header sees "ES · PT"
 * and learns in one glance that those sites exist, which is the only thing this control
 * can usefully advertise. The current language sits second, as state rather than offer.
 *
 * Derived from `locales`, not typed out — this was "ES | EN" for a day after Portuguese
 * shipped, which is the same bug `languageChoices` above carries the warning about.
 */
const LOCALE_CODE_LABELS: Record<Locale, string> = { en: "EN", es: "ES", pt: "PT" };

export function triggerLabel(locale: Locale): string {
  const others = locales.filter((code) => code !== locale).map((code) => LOCALE_CODE_LABELS[code]);
  return `${others.join(" · ")} | ${LOCALE_CODE_LABELS[locale]}`;
}
