import type { NewsArticle, NewsKind } from "./types";

/**
 * The newsroom.
 *
 * It ships empty on purpose. A press page seeded with invented announcements is worse
 * than no press page: the dates are checkable, journalists do check them, and a
 * fabricated release is the one piece of site content that can be quoted back at the
 * company. The listing renders an honest empty state until the client writes the first
 * one — see PROGRESS.md, "宁可留空，不可编造".
 */
/** Records live in content/news/*.json — see products.ts for the rationale. */
import { news as generatedNews } from "./generated/news";
import { applyImageAltOverride, applyImageAltOverrides } from "./image-alt-overrides";

export const news: NewsArticle[] = generatedNews.map((article) => ({
  ...article,
  heroImage: applyImageAltOverride(article.heroImage),
  gallery: article.gallery ? applyImageAltOverrides(article.gallery) : undefined,
}));

/**
 * What the site is allowed to show.
 *
 * Two filters, both of which exist because a static export has no request-time logic:
 *
 *   `draft`        — never built, so an unfinished piece cannot be reached by URL either.
 *   future dates   — a post-dated article stays hidden until a build runs on or after
 *                    that day. This is NOT scheduled publishing: nothing triggers that
 *                    build. Whoever sets a future date has to also rebuild on the day.
 *
 * Newest first; ties broken by slug so the order is stable across builds rather than
 * dependent on filesystem order.
 */
export function getPublishedNews(today = new Date()): NewsArticle[] {
  const todayIso = today.toISOString().slice(0, 10);

  return news
    .filter((article) => !article.draft && article.publishedAt <= todayIso)
    .sort((a, b) =>
      a.publishedAt === b.publishedAt
        ? a.slug.localeCompare(b.slug)
        : b.publishedAt.localeCompare(a.publishedAt),
    );
}

export function getNewsByKind(kind: NewsKind, today = new Date()): NewsArticle[] {
  return getPublishedNews(today).filter((article) => article.kind === kind);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}

/**
 * Static params cover published articles only, so a draft has no page to leak through.
 */
export function getAllNewsParams(): { slug: string }[] {
  return getPublishedNews().map((article) => ({ slug: article.slug }));
}

/** Display label for a kind. Kept here so the listing and the detail page agree. */
export const NEWS_KIND_LABEL: Record<NewsKind, string> = {
  "press-release": "Press release",
  insight: "Insight",
};

/**
 * The same two kinds in Spanish.
 *
 * "Nota técnica" rather than a literal rendering of "Insight": these articles are what a
 * Spanish-speaking specifier calls a technical note, and the English word names a
 * publishing category that has no equivalent in that trade.
 */
export const NEWS_KIND_LABEL_ES: Record<NewsKind, string> = {
  "press-release": "Nota de prensa",
  insight: "Nota técnica",
};

/**
 * "15 March 2026" — spelled-out month, because 03/04/2026 reads as two different dates
 * either side of the Atlantic and this site sells into both.
 */
export function formatNewsDate(iso: string, locale: "en" | "es" = "en"): string {
  const [year, month, day] = iso.split("-").map(Number);
  /*
    es-ES rather than any Latin American locale: they agree on this format ("15 de marzo
    de 2026") and es-ES is the one guaranteed to be present in every runtime. The point of
    spelling the month out is the same in both languages — 03/04/2026 is two different
    dates depending on who reads it, and this catalogue sells into both conventions.
  */
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
