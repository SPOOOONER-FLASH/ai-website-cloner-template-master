/**
 * The seven MARKET locales, on their own, with no imports.
 *
 * ---------------------------------------------------------------------------
 * WHAT A MARKET LOCALE IS, AND WHY IT IS NOT IN `locales`
 *
 * `locales` (./locales.ts) is the list of FULL mirrors: English, Spanish and Portuguese,
 * each with 1,100 product records, 35 articles and 22 routes. `Locale` keys a dozen copy
 * dictionaries and a product record has `nameEs` / `namePt` on every field. Adding German
 * there would turn every one of those into a compile error until 1,100 products had a
 * `nameDe` — weeks of translation before a single German page could ship, and the
 * taxonomy-redirect test would demand a /de/ redirect for every retired product path.
 *
 * A market locale is a smaller, deliberate thing: a fully written landing site in that
 * language — home, catalogue overview, company, OEM services, certifications, FAQ and
 * contact — under `/{code}/`, with reciprocal hreflang to the English page it mirrors.
 * It gives a German or Saudi buyer, and the answer engine they asked, a first-class page
 * in their language; the catalogue itself stays English behind it, and the pages say so.
 *
 * The order is the client's brief of 2026-09-24 (法德 · 日韩 · 土俄 · 阿拉伯), not the
 * traffic order in docs/collaboration/2026-09-24-language-expansion-prep.md — the pages
 * ship together, so the order only decides how the language list reads.
 *
 * ⚠ ADDING ONE HERE IS NOT FREE EITHER: `src/data/market/<code>.ts` must exist with the
 * full `MarketCopy`, and `src/app/<code>/` must carry the seven routes.
 * locale-route-parity.test.ts checks both.
 */
export const marketLocales = ["fr", "de", "ja", "ko", "tr", "ru", "ar"] as const;

export type MarketLocale = (typeof marketLocales)[number];

export interface MarketLocaleMeta {
  /** BCP 47 for `<html lang>` and Open Graph. */
  htmlLang: string;
  ogLocale: string;
  dir: "ltr" | "rtl";
  /** Endonym — a reader scans for their own word for their language. */
  label: string;
}

export const marketLocaleMeta: Record<MarketLocale, MarketLocaleMeta> = {
  fr: { htmlLang: "fr", ogLocale: "fr_FR", dir: "ltr", label: "Français" },
  de: { htmlLang: "de", ogLocale: "de_DE", dir: "ltr", label: "Deutsch" },
  ja: { htmlLang: "ja", ogLocale: "ja_JP", dir: "ltr", label: "日本語" },
  ko: { htmlLang: "ko", ogLocale: "ko_KR", dir: "ltr", label: "한국어" },
  tr: { htmlLang: "tr", ogLocale: "tr_TR", dir: "ltr", label: "Türkçe" },
  ru: { htmlLang: "ru", ogLocale: "ru_RU", dir: "ltr", label: "Русский" },
  ar: { htmlLang: "ar", ogLocale: "ar_AR", dir: "rtl", label: "العربية" },
};

export function isMarketLocale(value: string): value is MarketLocale {
  return (marketLocales as readonly string[]).includes(value);
}

/** The market locale a rendered path is in, or null for the English/Spanish/Portuguese trees. */
export function marketLocaleFromPath(pathname: string): MarketLocale | null {
  const prefix = pathname.split("/")[1] ?? "";
  return isMarketLocale(prefix) ? prefix : null;
}

/**
 * The English paths every market locale mirrors. Exact paths, not prefixes: `/products`
 * is the catalogue OVERVIEW in German, not 1,100 German product pages.
 */
export const MARKET_MIRROR_PATHS = [
  "/",
  "/products",
  "/company",
  "/services",
  "/certifications",
  "/faq",
  "/contact",
] as const;

export type MarketPage = (typeof MARKET_MIRROR_PATHS)[number];

export function hasMarketMirror(enPath: string): boolean {
  const clean = enPath === "/" ? "/" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  return (MARKET_MIRROR_PATHS as readonly string[]).includes(clean);
}
