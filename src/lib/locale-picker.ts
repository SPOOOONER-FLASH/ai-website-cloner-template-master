import { representatives } from "../data/representatives.ts";
import { siteSettings } from "../data/navigation.ts";
import type { Locale } from "../data/site.ts";
import { hasSpanishMirror } from "./spanish-mirror.ts";

/**
 * What the location-and-language panel offers, assembled from data that already exists.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS ANSWERS TWO QUESTIONS INSTEAD OF ONE
 *
 * FSB's panel — the reference the client showed on 2026-09-08 — is a language switch with
 * a location label attached: Europe gets English and German, the United States gets
 * English. Copying that shape here would give a buyer one useful line and a second one
 * that is a lie, because we do not have a German site.
 *
 * What we do have, and FSB's panel does not show, is who a buyer in that market actually
 * talks to. `representatives.ts` carries a real direct line for North America and real
 * addresses in Cologne and Remagen, each labelled with what it honestly is. A panel that
 * says "United States · Los Angeles and Arlington · +1 703 967 7493" answers the question
 * a buyer opens a location menu to ask. A globe does not, and neither does a flag.
 *
 * So the two axes are kept separate and both are true:
 *
 *   LANGUAGE   what the site is published in — English, and Spanish where a mirror exists
 *   CONTACT    where the nearest person is — from the representative records
 *
 * Presenting them as one grid would imply a Spanish-language region we do not staff, and
 * a German-language site we do not publish.
 *
 * ---------------------------------------------------------------------------
 * THE SPANISH MIRROR IS PARTIAL, AND THE LINK KNOWS IT
 *
 * `hasSpanishMirror` is the single source of truth for which English paths have a Spanish
 * counterpart; the header's own switch already uses it. Reusing it here means the panel
 * offers "Español" pointing at the *same page* when one exists, and at the Spanish home
 * only when it does not — rather than producing a 404 from a menu.
 */

export interface LanguageChoice {
  /** BCP 47, for `lang` and `hreflang`. */
  code: "en" | "es";
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

export interface ContactChoice {
  region: string;
  /** Every city we can be reached in for that region, in the order the data lists them. */
  cities: string[];
  phone?: string;
  email: string;
  /** What these addresses honestly are — see the header of representatives.ts. */
  note?: string;
}

/** The language half of the panel, for the page currently being viewed. */
export function languageChoices(pathname: string, locale: Locale): LanguageChoice[] {
  const isSpanish = locale === "es";
  const englishPath = isSpanish ? pathname.replace(/^\/es/, "") || "/" : pathname;
  const mirrored = hasSpanishMirror(englishPath);

  return [
    {
      code: "en",
      label: "English",
      href: englishPath,
      current: !isSpanish,
      samePage: true,
    },
    {
      code: "es",
      label: "Español",
      href: mirrored ? `/es${englishPath === "/" ? "" : englishPath}` : "/es",
      current: isSpanish,
      samePage: mirrored,
    },
  ];
}

/**
 * The contact half, grouped by region.
 *
 * China is prepended from `siteSettings` rather than stored in `representatives`, because
 * it is not a representative — it is the factory, and the distinction is the whole point
 * of that file's header comment. A buyer who reads "Zhongshan" here and "Zhongshan" on
 * /company is reading one fact twice, not two claims.
 */
export function contactChoices(locale: Locale = "en"): ContactChoice[] {
  const es = locale === "es";
  const grouped = new Map<string, ContactChoice>();

  for (const rep of representatives) {
    const region = es ? rep.regionEs : rep.region;
    const existing = grouped.get(region);
    if (existing) {
      existing.cities.push(rep.city);
      /* Keep the first note and phone: the data lists the primary contact first. */
      continue;
    }
    grouped.set(region, {
      region,
      cities: [rep.city],
      phone: rep.phone,
      email: rep.email,
      note: es ? rep.noteEs : rep.note,
    });
  }

  const factory: ContactChoice = {
    region: es ? "China (fábrica)" : "China (factory)",
    cities: [`${siteSettings.contact.city}, ${siteSettings.contact.province}`],
    email: siteSettings.contact.brandEmail ?? siteSettings.contact.email,
    note: es
      ? "Donde se fabrica todo. Visitas de fábrica e inspección por tercero bienvenidas."
      : "Where everything is made. Factory visits and third-party inspection are welcome.",
  };

  return [factory, ...grouped.values()];
}

/**
 * The two-part label on the trigger: OTHER | CURRENT.
 *
 * It used to read "INT | EN" — a region guess beside the current language. The client
 * struck the region on 2026-09-09, and it deserved striking twice over. "INT" is not a
 * place; it is jargon standing in for "we did not detect you", and detecting a reader is
 * something a static export cannot do anyway. Worse, it spent the header's only language
 * affordance on a word that tells a Spanish-speaking buyer nothing.
 *
 * So both slots now carry languages, and the FIRST one is the language you are NOT
 * reading. That ordering is the whole point: a buyer scanning the header sees "ES" and
 * learns in one glance that a Spanish site exists, which is the only thing this control
 * can usefully advertise. The current language sits second, as state rather than offer.
 */
export function triggerLabel(locale: Locale): string {
  return locale === "es" ? "EN | ES" : "ES | EN";
}

export const localePickerCopy = {
  en: {
    trigger: "Choose your location and language",
    title: "Choose your location and language",
    languages: "Language",
    contacts: "Your nearest contact",
    close: "Close",
    notMirrored: "goes to the Spanish home page — this page is English only",
    current: "current",
  },
  es: {
    trigger: "Elija su ubicación e idioma",
    title: "Elija su ubicación e idioma",
    languages: "Idioma",
    contacts: "Su contacto más cercano",
    close: "Cerrar",
    notMirrored: "lleva a la portada en español — esta página sólo existe en inglés",
    current: "actual",
  },
} as const;
