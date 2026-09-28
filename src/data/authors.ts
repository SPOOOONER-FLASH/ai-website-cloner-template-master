import { absoluteUrl, type Locale } from "./site";
import { localisedHref } from "../lib/spanish-mirror";
import type { ArticleAuthor, NewsArticle } from "./types";
import { getAllGuideParams, getPublishedGuides } from "./guides";
import { getPublishedNews } from "./news";

/**
 * Authors with a profile page on this site (client 2026-09-28, Google Discover / E-E-A-T:
 * 「做一个站内作者页……schema 里的作者链接改成指向这个页面」).
 *
 * The profile is not a second copy of the author. Name, role and credential are read from
 * the `author` block the articles already carry, so the byline, the Article schema and
 * this page cannot disagree. A name missing from this map has no page and keeps linking
 * to its external profile, which is the honest fallback for a guest writer.
 */
const AUTHOR_SLUGS: Readonly<Record<string, string>> = {
  "Johnson Liu": "johnson-liu",
};

/** The English path of an author's profile, or null when the author has none. */
export function authorPath(author: Pick<ArticleAuthor, "name"> | undefined): string | null {
  const slug = author ? AUTHOR_SLUGS[author.name] : undefined;
  return slug ? `/company/${slug}` : null;
}

/** Spanish and Portuguese for a credential. The seven overlays take it from ui.json. */
export const CREDENTIAL_TRANSLATIONS: Readonly<Record<string, { es: string; pt: string }>> = {
  "MA Digital Media, Johns Hopkins University": {
    es: "Máster en Medios Digitales, Johns Hopkins University",
    pt: "Mestrado em Mídias Digitais, Johns Hopkins University",
  },
};

export type AuthoredArticle = { section: "guides" | "news"; article: NewsArticle };

/** The author record for a profile slug, taken from the newest article that names them. */
export function getAuthorBySlug(slug: string): ArticleAuthor | undefined {
  const name = Object.keys(AUTHOR_SLUGS).find((n) => AUTHOR_SLUGS[n] === slug);
  if (!name) return undefined;
  return [...getPublishedGuides(), ...getPublishedNews()]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .find((a) => a.author?.name === name)?.author;
}

/** Every published article by this author that exists in the reader's language tree. */
export function getAuthorArticles(name: string, locale: Locale): AuthoredArticle[] {
  const guideSlugs = new Set(getAllGuideParams(locale).map((p) => p.slug));
  return [
    ...getPublishedGuides()
      .filter((a) => a.author?.name === name && guideSlugs.has(a.slug))
      .map((article) => ({ section: "guides" as const, article })),
    ...getPublishedNews()
      .filter((a) => a.author?.name === name)
      .map((article) => ({ section: "news" as const, article })),
  ].sort((x, y) => y.article.publishedAt.localeCompare(x.article.publishedAt));
}

/** Slugs of every author page, for tests and the sitemap. */
export function authorSlugs(): string[] {
  return Object.values(AUTHOR_SLUGS);
}

/** Where an author link should go in this locale: the on-site profile, else their own URL. */
export function authorHref(author: ArticleAuthor, locale: Locale, absolute = false): string | undefined {
  const path = authorPath(author);
  if (!path) return author.url;
  const href = localisedHref(`${path}/`, locale);
  return absolute ? absoluteUrl(href) : href;
}
