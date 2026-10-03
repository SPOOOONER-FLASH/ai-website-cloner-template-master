import type { Locale, OverlayLocale } from "../data/locales.ts";
import { makeDict, makeSpecLabels, makeTx } from "./i18n-core.ts";

/**
 * The i18n surface a "use client" component may import.
 *
 * Same `tx` / `dict` as src/lib/i18n.ts, but the data arrives per locale: each overlay
 * locale's root layout renders `<I18nClientBundle />` from
 * src/data/generated/i18n-client/<code>.tsx, a client module that imports that locale's
 * subset (src/data/generated/i18n-client/<code>.json — only the interface sentences client
 * components reach, plus spec labels and the material/finish values cards need, cut by
 * scripts/build-i18n-client-ui.mjs) and registers it here at module evaluation. So an
 * English, Spanish or Portuguese page ships none of it, and a German page ships German only.
 *
 * WHY NOT ONE JSON. The first cut bound this module to a single file holding all seven
 * locales: 218 KB raw, 104 KB gzipped, on every page including /, and the release session
 * measured first paint 1.8 s → 2.7 s on French phones (2026-09-25). A client component must
 * never import src/lib/i18n.ts either — that carries every locale's glossary, products and
 * articles (1,267 KB in the homepage chunk when it happened).
 *
 * Registration is keyed by locale, so concurrent server renders of different locales cannot
 * read each other's bundle. The bundle module is evaluated before any component renders —
 * on the server at import, in the browser when the page's client chunks load — so SSR and
 * hydration see the same dictionary. A sentence missing from the subset renders in English
 * on both sides; scripts/audit-locale-pages.mjs reports it as an English leftover.
 *
 * THIS MODULE IMPORTS NO GLOSSARY. Until 2026-09-30 it pulled src/lib/localise-values.ts and,
 * through i18n-core.ts, SPEC_LABELS_ES / _PT — and with them SPEC_VALUES_ES / _PT, FINISH_
 * and MATERIAL_NAMES — into the shared client chunk of every page: 117 KB (33 KB gzipped) of
 * Spanish and Portuguese tables on an English homepage that reads none of them. Product
 * values on a card now come from src/lib/i18n-client-values.ts, and the Spanish and
 * Portuguese tables are registered by their own layouts (src/data/i18n-client-values-es.tsx,
 * -pt.tsx) exactly as the overlay bundles are, so each language downloads only its own.
 */
export interface ClientBundle {
  ui: Record<string, string>;
  specLabels: Record<string, string>;
  values: Record<string, string>;
}

const bundles: Partial<Record<OverlayLocale, ClientBundle>> = {};

/** Called once per locale by the generated bundle module. Idempotent. */
export function registerClientBundle(locale: OverlayLocale, data: ClientBundle): void {
  bundles[locale] = data;
}

/** Spec-label tables for the two record-level locales, registered by their layouts. */
const recordLocaleSpecLabels: Partial<Record<"es" | "pt", Record<string, string>>> = {};

/** Called once by src/data/i18n-client-values-es.tsx / -pt.tsx. Idempotent. */
export function registerRecordLocaleSpecLabels(locale: "es" | "pt", labels: Record<string, string>): void {
  recordLocaleSpecLabels[locale] = labels;
}

const uiOf = (locale: OverlayLocale) => bundles[locale]?.ui ?? {};

export const tx = makeTx(uiOf);
export const dict = makeDict(uiOf);
export const specLabels = makeSpecLabels((locale) =>
  locale === "es" || locale === "pt" ? (recordLocaleSpecLabels[locale] ?? {}) : (bundles[locale]?.specLabels ?? {}),
);
/** The overlay locale's material / finish values, for src/lib/i18n-client-values.ts. */
export const clientBundleValues = (locale: OverlayLocale): Record<string, string> => bundles[locale]?.values ?? {};
/** A spec label in the reader's language, or the English label. */
export const specLabel = (label: string, locale: Locale): string => specLabels(locale)[label] ?? label;
export { t, fill, isEnglishFallback, type Overlayed } from "./i18n-core.ts";
export { LOCALE_TAG, OG_LOCALE, LANGUAGE_LABELS, LOCALE_DIR, type LocaleDict } from "./i18n-core.ts";
