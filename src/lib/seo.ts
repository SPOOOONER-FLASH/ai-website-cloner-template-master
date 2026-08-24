import type { Metadata } from "next";
import { absoluteUrl, defaultDescription, hasSpanishMirror, type Locale } from "@/data/site";

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
  const en = absoluteUrl(`${clean}/`);
  const es = absoluteUrl(`/es${clean}/`);
  const self = opts.locale === "es" ? es : en;
  const description = opts.description ?? defaultDescription[opts.locale];

  // Only declare alternates when the Spanish page actually exists — pointing hreflang
  // at a 404 is an SEO error, not a harmless extra tag.
  const bilingual = hasSpanishMirror(opts.enPath);

  const image = opts.image ?? defaultOgImage;
  const imageAlt = opts.image ? (opts.imageAlt ?? opts.title) : "HYDE architectural door hardware";

  return {
    title: opts.title,
    description,
    alternates: {
      // Self-referencing canonical. Prevents the /es mirror from being folded into /en.
      canonical: opts.locale === "es" ? `/es${clean}/` : `${clean}/` || "/",
      ...(bilingual ? { languages: { en, es, "x-default": en } } : {}),
    },
    openGraph: {
      type: "website",
      url: self,
      title: opts.title,
      description,
      locale: opts.locale,
      alternateLocale: opts.locale === "es" ? ["en"] : ["es"],
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
