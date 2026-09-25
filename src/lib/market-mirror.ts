import { absoluteUrl } from "../data/site.ts";
import {
  hasMarketMirror,
  marketLocales,
  type MarketLocale,
} from "../data/market-locales.ts";

/**
 * The URL side of the market mirrors, kept apart from src/lib/market.ts so that seo.ts
 * and the sitemap can ask "which market URLs exist for this English path" without pulling
 * seven copy dictionaries into their import graph.
 */

/** "/de" + "/company" → "/de/company/" — the trailing slash matches next.config's trailingSlash. */
export function marketHref(locale: MarketLocale, enPath: string): string {
  const clean = enPath === "/" ? "" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  return `/${locale}${clean}/`;
}

/**
 * The hreflang entries every market page and every mirrored English page share.
 *
 * Reciprocity is the whole point: /de/company/ lists en, es, pt and the other six market
 * locales, and /company/ lists de back. `audit-seo` reports `hreflang-not-reciprocal` the
 * moment either side forgets, so both sides read this one function. Undefined for a path
 * with no market mirror, so a spread of the result adds nothing.
 */
export function marketAlternates(enPath: string): Record<MarketLocale, string> | undefined {
  if (!hasMarketMirror(enPath)) return undefined;
  return Object.fromEntries(
    marketLocales.map((code) => [code, absoluteUrl(marketHref(code, enPath))]),
  ) as Record<MarketLocale, string>;
}
