/**
 * The articles and guides that name a product in their `relatedModels`, for the product page.
 *
 * ---------------------------------------------------------------------------
 * WHY
 *
 * An article already links down to every model it names (NewsDetail). Nothing linked back
 * up. LC04 85*60 is cited by three articles, including the mortise lock case comparison, and
 * its product page led to none of them — so a buyer (or an answer engine) arriving from
 * ChatGPT on the product page saw five spec rows and a dead end, while the page that
 * compares LC04 with its neighbors sat two clicks away through the guide index.
 *
 * The comparison pages are the hub the client described on 2026-09-28: "the roundup is the
 * table AI reads; the table sends people to the product". A hub only works if the spokes
 * point back at it, so the product page now lists the pages that cite it.
 *
 * ---------------------------------------------------------------------------
 * THE RULE
 *
 * Only `relatedModels` counts, not a text search of the body. The list is curated per
 * article and resolved against real records by NewsDetail already; a body match on "564"
 * would find every page that mentions a 564mm length. Guides come before news (they are the
 * comparison and reference pages), newest first within each, and the list is capped so the
 * block stays a pointer rather than a second index.
 */

export type CitingSection = "guides" | "news";

export interface CitingArticle<A> {
  section: CitingSection;
  article: A;
}

interface Citable {
  slug: string;
  publishedAt: string;
  relatedModels?: string[];
}

/** At most this many links; beyond it the block turns into an index nobody scans. */
export const CITING_LIMIT = 4;

export function articlesCitingModel<A extends Citable>(
  model: string,
  guides: readonly A[],
  news: readonly A[],
  limit = CITING_LIMIT,
): CitingArticle<A>[] {
  const cites = (article: A) => (article.relatedModels ?? []).includes(model);
  const newestFirst = (a: A, b: A) =>
    a.publishedAt === b.publishedAt
      ? a.slug.localeCompare(b.slug)
      : b.publishedAt.localeCompare(a.publishedAt);

  return [
    ...guides.filter(cites).sort(newestFirst).map((article) => ({ section: "guides" as const, article })),
    ...news.filter(cites).sort(newestFirst).map((article) => ({ section: "news" as const, article })),
  ].slice(0, limit);
}
