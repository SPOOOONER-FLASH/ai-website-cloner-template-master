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
      ...(opts.image
        ? { images: [{ url: absoluteUrl(opts.image), alt: opts.imageAlt ?? opts.title }] }
        : {}),
    },
  };
}
