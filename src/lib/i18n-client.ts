import type { Locale, OverlayLocale } from "../data/locales.ts";
import { makeDict, makeSpecLabels, makeTx } from "./i18n-core.ts";
import { localiseValuesWith } from "./localise-values.ts";

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

const uiOf = (locale: OverlayLocale) => bundles[locale]?.ui ?? {};

export const tx = makeTx(uiOf);
export const dict = makeDict(uiOf);
export const specLabels = makeSpecLabels((locale: OverlayLocale) => bundles[locale]?.specLabels ?? {});
/** A spec label in the reader's language, or the English label. */
export const specLabel = (label: string, locale: Locale): string => specLabels(locale)[label] ?? label;
export { t, isEnglishFallback, type Overlayed } from "./i18n-core.ts";
export { LOCALE_TAG, OG_LOCALE, LANGUAGE_LABELS, LOCALE_DIR, type LocaleDict } from "./i18n-core.ts";

/** Material / finish values on a card, from the subset (materials, finishes, the spec values products use as `material`). */
export const localiseProductValues = (values: string[], locale: Locale): string[] =>
  localiseValuesWith(values, locale, (code) => [bundles[code]?.values ?? {}]);
