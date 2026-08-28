import type { Product } from "@/data/types";

/**
 * What to show in the "related products" block on a product page.
 *
 * Only 24 of 435 products carry a hand-written `relatedModels` list. Rendering just those
 * left 411 pages showing the same "relationships not yet verified" sentence — boilerplate
 * repeated 411 times, which is part of what Google is reporting as duplicate content. So
 * the block falls back to relationships the catalogue already states about itself.
 *
 * The fallback is not a guess. Series and top-level category come from the client's own
 * data, so "another handle in the D101 series" is a fact, not an inferred recommendation.
 * The heading changes with the source, so a curated pairing is never presented as if it
 * were the same thing as an alphabetical neighbour.
 *
 * Neighbours are taken as a rotating window rather than the first N of the group. Taking
 * the first N would give all 32 stainless-steel-handles pages an identical block — moving
 * the duplication rather than fixing it. Rotating means each page links to a different
 * slice, and every product in a group is linked from roughly `LIMIT` sibling pages, which
 * is also what spreads crawl depth across the long tail.
 */

export type RelatedSource = "curated" | "series" | "category";

export interface RelatedBlock {
  source: RelatedSource;
  heading: string;
  items: Product[];
}

/** Three fills one row at the widest breakpoint, where cards are `xl:col-span-8` of 24. */
export const LIMIT = 3;

/** Stable ordering — the catalogue's own file order is import order, which is arbitrary. */
const byModel = (a: Product, b: Product) => a.model.localeCompare(b.model, "en");

/**
 * The `LIMIT` products following `product` in `group`, wrapping past the end.
 * Returns fewer when the group is smaller; empty when `product` is the only member.
 */
export function rotatingNeighbours(product: Product, group: Product[]): Product[] {
  const ordered = [...group].sort(byModel);
  const index = ordered.findIndex((p) => p.slug === product.slug);

  if (index === -1 || ordered.length < 2) return [];

  const take = Math.min(LIMIT, ordered.length - 1);
  return Array.from({ length: take }, (_, i) => ordered[(index + 1 + i) % ordered.length]);
}

export interface RelatedInput {
  product: Product;
  /** Already resolved from `product.relatedModels`; unknown models dropped upstream. */
  curated: Product[];
  /** The whole catalogue. Filtering happens here so callers stay dumb. */
  catalogue: Product[];
  /** Display name of the top-level category, for the heading. */
  categoryName: string;
}

/**
 * Returns null when the product has no siblings at all — a category of one. The caller
 * should then omit the section entirely rather than print an empty-state sentence.
 */
export function relatedBlock({
  product,
  curated,
  catalogue,
  categoryName,
}: RelatedInput): RelatedBlock | null {
  if (curated.length) {
    return { source: "curated", heading: "Related products", items: curated.slice(0, LIMIT) };
  }

  const sameCategory = catalogue.filter(
    (p) => p.categoryPath[0] === product.categoryPath[0] && p.slug !== product.slug,
  );

  const series = product.series?.trim();

  if (series) {
    const sameSeries = sameCategory.filter((p) => p.series?.trim() === series);
    const items = rotatingNeighbours(product, [...sameSeries, product]);

    if (items.length) {
      return { source: "series", heading: `More in the ${series} series`, items };
    }
  }

  const items = rotatingNeighbours(product, [...sameCategory, product]);

  if (!items.length) return null;

  return { source: "category", heading: `More in ${categoryName}`, items };
}
