import type { Metadata } from "next";
import { absoluteUrl, defaultDescription, type Locale } from "@/data/site";
import { mirrorsOf } from "./spanish-mirror.ts";

/**
 * Builds canonical + hreflang + Open Graph for a page, from its ENGLISH path.
 *
 * Having one helper matters more than it looks: canonical and hreflang have to agree
 * with each other and with the sitemap, and hand-writing three URLs per page across a
 * bilingual site is how sites end up telling Google two different stories.
 *
 * `enPath` is always the English path ("/company"), even when building the Spanish page.
 */
/**
 * Shared social card, used whenever a page has no image of its own.
 *
 * Built by scripts/build-og-image.mjs from the HYDE logotype and the brand tokens. It
 * exists because a link with no og:image pastes into WhatsApp, LinkedIn or Slack as a
 * grey box — a wasted impression on a site whose purpose is collecting enquiries.
 */
export const defaultOgImage = "/seo/og-default.png";

/**
 * The hreflang map for one English path, derived rather than typed.
 *
 * `pageMetadata` computes this internally, but the news detail routes build their own
 * metadata and were hand-writing the map — so when Portuguese news shipped on 2026-09-17
 * the English and Spanish articles would have gone on declaring two alternates for a page
 * that has three. That is the hand-written-locale-list bug for the third time in two days
 * (see src/lib/language-choices.ts), so it is a function now.
 *
 * Returns undefined when only English exists, because a `languages` map of one entry is
 * noise rather than a signal.
 */
/** The absolute URL of a clean English path ("" for home, "/company") in a locale. */
function localeUrl(locale: Locale, clean: string): string {
  return absoluteUrl(locale === "en" ? `${clean}/` : `/${locale}${clean}/`);
}

export function alternateLanguages(enPath: string): Record<string, string> | undefined {
  const clean = enPath === "/" ? "" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  const available = mirrorsOf(enPath);
  if (available.length < 2) return undefined;
  return Object.fromEntries([
    ...available.map((locale) => [locale, localeUrl(locale, clean)]),
    ["x-default", localeUrl("en", clean)],
  ]);
}

export function pageMetadata(opts: {
  enPath: string;
  locale: Locale;
  title: string;
  description?: string;
  /** Absolute or /public-relative image for OG. Falls back to the site default. */
  image?: string;
  imageAlt?: string;
}): Metadata {
  const clean = opts.enPath === "/" ? "" : `/${opts.enPath.replace(/^\/|\/$/g, "")}`;
  const en = localeUrl("en", clean);
  const self = localeUrl(opts.locale, clean);
  const description = opts.description ?? defaultDescription[opts.locale];

  /*
    Only declare alternates for locales whose page actually exists — pointing hreflang at a
    404 is an SEO error, not a harmless extra tag, and Search Console can discount the whole
    language cluster for it.

    `mirrorsOf` answers that for all three at once. It replaced a boolean on 2026-09-16 when
    Portuguese arrived: a two-valued answer cannot express "Spanish yes, Portuguese not yet",
    which is the state most of this site is in and will be for a while.
  */
  const available = mirrorsOf(opts.enPath);
  const languages = Object.fromEntries([
    ...available.map((locale) => [locale, localeUrl(locale, clean)]),
    ["x-default", en],
  ]);
  const declared = available.length;

  const image = opts.image ?? defaultOgImage;
  const imageAlt = opts.image ? (opts.imageAlt ?? opts.title) : "HYDE architectural door hardware";

  return {
    title: opts.title,
    description,
    alternates: {
      // Self-referencing canonical. Prevents a mirror from being folded into /en.
      canonical: opts.locale === "en" ? `${clean}/` || "/" : `/${opts.locale}${clean}/`,
      ...(declared > 1 ? { languages } : {}),
    },
    openGraph: {
      type: "website",
      url: self,
      title: opts.title,
      description,
      locale: opts.locale,
      alternateLocale: available.filter((locale) => locale !== opts.locale),
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: imageAlt }],
    },
    // X/Twitter ignores og:image sizing hints and wants its own card type; without this
    // the link renders as a small thumbnail rather than the full-width card.
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
