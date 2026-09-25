import type { Metadata } from "next";
import { absoluteUrl, siteName } from "../data/site.ts";
import { hasPortugueseMirror, hasSpanishMirror } from "./spanish-mirror.ts";
import { MARKET_MIRROR_PATHS, marketLocaleMeta, type MarketLocale, type MarketPage } from "../data/market-locales.ts";
import { marketAlternates, marketHref } from "./market-mirror.ts";
import { marketCopy } from "../data/market/index.ts";
import type { MarketCopy } from "../data/market/types.ts";

export { marketCopy };
export type { MarketCopy };

export { marketAlternates, marketHref };

/** Every language a market page exists in, as absolute URLs, x-default last. */
function languagesFor(enPath: string): Record<string, string> {
  const clean = enPath === "/" ? "" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  const languages: Record<string, string> = { en: absoluteUrl(`${clean}/`) };
  if (hasSpanishMirror(enPath)) languages.es = absoluteUrl(`/es${clean}/`);
  if (hasPortugueseMirror(enPath)) languages.pt = absoluteUrl(`/pt${clean}/`);
  Object.assign(languages, marketAlternates(enPath));
  languages["x-default"] = absoluteUrl(`${clean}/`);
  return languages;
}

/**
 * Metadata for one market page: self-canonical, the full reciprocal hreflang set, and
 * Open Graph in that locale. The title of the home page is absolute (the layout template
 * does not run on the segment root); every other page gets " | Canton Hyland" from the
 * layout.
 */
export function marketPageMetadata(locale: MarketLocale, page: MarketPage): Metadata {
  const copy = marketCopy[locale];
  const meta = copy.meta[page];
  const self = absoluteUrl(marketHref(locale, page));
  const languages = languagesFor(page);
  const image = page === "/" ? "/images/editorial/home-panic-exit-bars.webp" : "/seo/og-default.png";

  return {
    title: page === "/" ? { absolute: `${meta.title} | ${siteName}` } : meta.title,
    description: meta.description,
    alternates: {
      canonical: marketHref(locale, page),
      languages,
    },
    openGraph: {
      type: "website",
      siteName,
      url: self,
      title: meta.title,
      description: meta.description,
      locale: marketLocaleMeta[locale].ogLocale,
      alternateLocale: Object.keys(languages).filter((k) => k !== locale && k !== "x-default"),
      images: [{ url: absoluteUrl(image), alt: copy.home.h1Line1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [absoluteUrl(image)],
    },
  };
}

/** The seven pages, for the sitemap and the route-parity test. */
export const marketPages: readonly MarketPage[] = MARKET_MIRROR_PATHS;
