import { isOverlayLocale, type Locale, type OverlayLocale } from "../data/locales.ts";
import { localisedHref } from "./spanish-mirror.ts";
import { SPEC_LABELS_ES } from "../data/es-glossary.ts";
import { SPEC_LABELS_PT } from "../data/pt-glossary.ts";

/**
 * The reading rule without the data. src/lib/i18n.ts binds these to the full overlays for
 * server components; src/lib/i18n-client.ts binds them to the generated per-locale subset
 * of interface copy that "use client" components actually reach — because on 2026-09-25,
 * once the seven glossaries and ui.json files were merged, the one shared module put
 * 1,267 KB of every locale's every translation into the homepage bundle.
 */
export type UiOf = (locale: OverlayLocale) => Record<string, string>;

/** A copy dictionary with at least English. Spanish and Portuguese may be present. */
export type LocaleDict<T> = { en: T } & Partial<Record<Locale, T>>;

export function makeTx(uiOf: UiOf) {
  /** A translated interface sentence, or the English one. */
  return function tx(locale: Locale, en: string, alt?: { es?: string; pt?: string }): string {
    if (locale === "en") return en;
    if (locale === "es") return alt?.es ?? en;
    if (locale === "pt") return alt?.pt ?? en;
    return uiOf(locale)[en] ?? en;
  };
}

/**
 * Every string inside a copy object, run through the overlay; every `href` run through
 * `localisedHref` so a link written as "/products" lands in the reader's tree. Arrays and
 * nested objects are walked; anything else is returned as it is.
 */
export function mapStrings<T>(value: T, ui: Record<string, string>, locale: OverlayLocale, key = ""): T {
  if (typeof value === "string") {
    if (/href$/i.test(key) && value.startsWith("/")) return localisedHref(value, locale) as T;
    return (ui[value] ?? value) as T;
  }
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, ui, locale, key)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, mapStrings(v, ui, locale, k)]),
    ) as T;
  }
  return value;
}

export function makeDict(uiOf: UiOf) {
  /**
   * A whole copy dictionary in the reader's language.
   *
   * `COPY[locale]` was the idiom, and it is a runtime crash the day a fourth key is missing.
   * This returns the locale's own object where one exists, the English object mapped
   * through the overlay for the seven overlay locales, and English otherwise. The return
   * type is the English member's, because that is the shape every caller was written
   * against — see the note in src/lib/localised.ts on why `as const` dictionaries do not
   * type as `Record<Locale, T>`.
   */
  return function dict<D extends { en: unknown } & Partial<Record<Locale, unknown>>>(d: D, locale: Locale): D["en"] {
    const own = d[locale];
    if (own !== undefined) return own as D["en"];
    if (isOverlayLocale(locale)) return mapStrings(d.en, uiOf(locale), locale) as D["en"];
    return d.en;
  };
}

/** The BCP 47 tag `toLocaleDateString` and `<html lang>` use for a locale. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: "en-GB",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ja: "ja-JP",
  ko: "ko-KR",
  tr: "tr-TR",
  ru: "ru-RU",
  ar: "ar",
};

/** Open Graph's underscore form of the same tag. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en",
  es: "es",
  pt: "pt_BR",
  fr: "fr_FR",
  de: "de_DE",
  ja: "ja_JP",
  ko: "ko_KR",
  tr: "tr_TR",
  ru: "ru_RU",
  ar: "ar_AR",
};

/** The endonym each language link carries — a reader scans for their own word for it. */
export const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  tr: "Türkçe",
  ru: "Русский",
  ar: "العربية",
};

/** Writing direction per locale, for `<html dir>`. */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  pt: "ltr",
  fr: "ltr",
  de: "ltr",
  ja: "ltr",
  ko: "ltr",
  tr: "ltr",
  ru: "ltr",
  ar: "rtl",
};

/**
 * One field of a record, in the reader's language.
 *
 *   t(product, "name", "pt")   → product.namePt ?? product.name
 *   t(product, "name", "de")   → product.i18n?.de?.name ?? product.name
 *   t(product, "specs", "ja")  → product.i18n?.ja?.specs ?? product.specs
 *
 * The record's own type decides the return type — a translated `specs` is still a
 * `SpecRow[]`. Suffixed fields are read by name (`${field}Es`), which is how every Spanish
 * and Portuguese field on the types is spelled; a record that lacks the suffixed field
 * simply falls back, exactly as the hand-written ternaries did.
 */
export interface Overlayed {
  i18n?: Partial<Record<OverlayLocale, Record<string, unknown>>>;
}

export function t<R extends object, K extends keyof R & string>(
  record: R,
  field: K,
  locale: Locale,
): R[K] {
  const bag = record as Record<string, unknown>;
  const en = bag[field] as R[K];
  if (locale === "en") return en;
  if (locale === "es" || locale === "pt") {
    const suffixed = bag[`${field}${locale === "es" ? "Es" : "Pt"}`];
    return (suffixed === undefined || suffixed === null ? en : (suffixed as R[K]));
  }
  const overlay = (record as Overlayed).i18n?.[locale]?.[field];
  return overlay === undefined || overlay === null ? en : (overlay as R[K]);
}

/** True when `t(record, field, locale)` would return the English value. */
export function isEnglishFallback<R extends object>(record: R, field: keyof R & string, locale: Locale): boolean {
  if (locale === "en") return false;
  const bag = record as Record<string, unknown>;
  if (locale === "es" || locale === "pt") {
    const suffixed = bag[`${field}${locale === "es" ? "Es" : "Pt"}`];
    return suffixed === undefined || suffixed === null;
  }
  const overlay = (record as Overlayed).i18n?.[locale]?.[field];
  return overlay === undefined || overlay === null;
}

/** Spec-table row labels for a locale: the es/pt tables, or the overlay's specLabels. */
export function makeSpecLabels(labelsOf: (locale: OverlayLocale) => Record<string, string>) {
  return function specLabels(locale: Locale): Record<string, string> {
    if (locale === "es") return SPEC_LABELS_ES;
    if (locale === "pt") return SPEC_LABELS_PT;
    if (locale === "en") return {};
    return labelsOf(locale);
  };
}
