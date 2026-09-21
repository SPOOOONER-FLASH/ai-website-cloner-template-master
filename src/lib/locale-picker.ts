import { representatives } from "../data/representatives.ts";
import { siteSettings } from "../data/navigation.ts";
import { type Locale } from "../data/locales.ts";

/*
  The language column and the trigger label live in ./language-choices.ts and are
  re-exported here, so every caller still asks one module about the panel. They moved on
  2026-09-17 to be reachable from a unit test — see that file's header.
*/
export { languageChoices, type LanguageChoice } from "./language-choices.ts";

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

export interface ContactChoice {
  region: string;
  /** Every city we can be reached in for that region, in the order the data lists them. */
  cities: string[];
  phone?: string;
  email: string;
  /** What these addresses honestly are — see the header of representatives.ts. */
  note?: string;
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
  /* English, never the other translation — see the note in src/lib/localised.ts. */
  const pick = (en: string, es?: string, pt?: string) =>
    (locale === "es" ? es : locale === "pt" ? pt : undefined) ?? en;
  const grouped = new Map<string, ContactChoice>();

  for (const rep of representatives) {
    const region = pick(rep.region, rep.regionEs, rep.regionPt);
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
      note: rep.note ? pick(rep.note, rep.noteEs, rep.notePt) : undefined,
    });
  }

  const factory: ContactChoice = {
    region: locale === "en" ? "China (factory)" : "China (fábrica)",
    cities: [`${siteSettings.contact.city}, ${siteSettings.contact.province}`],
    email: siteSettings.contact.brandEmail ?? siteSettings.contact.email,
    note:
      locale === "es"
        ? "Donde se fabrica todo. Visitas de fábrica e inspección por tercero bienvenidas."
        : locale === "pt"
          ? "Onde tudo é fabricado. Visitas à fábrica e inspeção por terceiros são bem-vindas."
          : "Where everything is made. Factory visits and third-party inspection are welcome.",
  };

  return [factory, ...grouped.values()];
}

export const localePickerCopy = {
  en: {
    trigger: "Choose your location and language",
    title: "Choose your location and language",
    languages: "Language",
    contacts: "Your nearest contact",
    close: "Close",
    notMirrored: "this page is English only — the link goes to that language's home page",
    current: "current",
  },
  es: {
    trigger: "Elija su ubicación e idioma",
    title: "Elija su ubicación e idioma",
    languages: "Idioma",
    contacts: "Su contacto más cercano",
    close: "Cerrar",
    notMirrored: "esta página sólo existe en inglés — el enlace lleva a la portada de ese idioma",
    current: "actual",
  },
  pt: {
    trigger: "Escolha o seu país e idioma",
    title: "Escolha o seu país e idioma",
    languages: "Idioma",
    contacts: "O seu contato mais próximo",
    close: "Fechar",
    notMirrored: "esta página só existe em inglês — o link leva à página inicial desse idioma",
    current: "atual",
  },
} as const;
