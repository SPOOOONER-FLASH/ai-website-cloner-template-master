import type { Locale, OverlayLocale } from "../data/locales.ts";
import clientUi from "../data/generated/i18n-ui-client.json" with { type: "json" };
import { makeDict, makeSpecLabels, makeTx } from "./i18n-core.ts";
import { localiseValuesWith } from "./localise-values.ts";

/**
 * The i18n surface a "use client" component may import.
 *
 * Same `tx` / `dict` as src/lib/i18n.ts, bound to src/data/generated/i18n-ui-client.json:
 * for each locale only the interface sentences that client components (and the modules
 * they import) actually reference, cut by scripts/build-i18n-client-ui.mjs from
 * content/i18n/<code>/ui.json. A client component must never import src/lib/i18n.ts —
 * that module carries every locale's glossary, products and articles, and it went into the
 * homepage bundle on 2026-09-25 (1,267 KB in one chunk against a 1,200 KB budget for the
 * whole page). src/components/site/static-export-performance.test.ts holds that line.
 *
 * A sentence missing from the subset renders in English on the client AND on the server
 * (client components are server-rendered from this same module), so hydration stays
 * consistent; scripts/audit-locale-pages.mjs then reports it as an English leftover.
 */
type ClientBundle = Record<string, { ui: Record<string, string>; specLabels: Record<string, string>; values: Record<string, string> }>;
const bundle = clientUi as ClientBundle;
const uiOf = (locale: OverlayLocale) => bundle[locale]?.ui ?? {};

export const tx = makeTx(uiOf);
export const dict = makeDict(uiOf);
export const specLabels = makeSpecLabels((locale: OverlayLocale) => bundle[locale]?.specLabels ?? {});
/** A spec label in the reader's language, or the English label. */
export const specLabel = (label: string, locale: Locale): string => specLabels(locale)[label] ?? label;
export { t, isEnglishFallback, type Overlayed } from "./i18n-core.ts";
export { LOCALE_TAG, OG_LOCALE, LANGUAGE_LABELS, LOCALE_DIR, type LocaleDict } from "./i18n-core.ts";

/** Material / finish values on a card, from the subset (materials, finishes, the spec values products use as `material`). */
export const localiseProductValues = (values: string[], locale: Locale): string[] =>
  localiseValuesWith(values, locale, (code) => [bundle[code]?.values ?? {}]);
