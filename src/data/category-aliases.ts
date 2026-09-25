// The import attribute is required by Node, which runs this file directly under
// `node --test`. Next accepts it too, so one form works in both.
import moves from "../../content/taxonomy-moves.json" with { type: "json" };

/*
 * A retired route is a redirect, not a page — so it must not be indexable.
 *
 * Under `output: "export"`, `permanentRedirect()` cannot emit a 301: Next writes a
 * client-side stub instead, an `__next_error__` document with no <h1> and about ten
 * words in it. `generateMetadata` still ran on that stub and stamped it
 * `robots: index, follow`, so we were actively inviting crawlers to index three empty
 * pages that duplicated the title of the real one.
 *
 * Bing Site Scan caught it as its only High-severity finding — "The <h1> tag is missing",
 * 4 pages — and the same three stubs also account for its thin-content and
 * duplicate-title counts. The canonical tag already pointed at the real page, which is
 * why Google mostly coped; noindex says it outright and costs nothing.
 *
 * The server-side 301s in deploy/nginx/taxonomy-redirects.conf are the real fix. These
 * stubs only exist for paths Next itself generates.
 *
 * TWO KINDS OF MOVE, AND ONLY ONE OF THEM IS A CATEGORY ALIAS.
 *
 * `categoryAliases` retires a whole category: everything under `door-hinges` now lives
 * under `brass-steel-hinges`, so the old CATEGORY slug resolves to the new one and every
 * product under it comes along.
 *
 * `productMoves` is the case that table could not express. When the 美工 review moved
 * three products between categories that are BOTH still live — a push-bar device out of
 * hardware-accessories and into panic-exit-devices, say — the old category is not
 * retired, so mapping it wholesale would drag forty other products with it. These are
 * resolved per product instead.
 */

interface CategoryAlias {
  canonical: string;
  productSlugs: readonly string[];
}

interface ProductMove {
  slug: string;
  from: string;
  to: string;
  why: string;
}

/**
 * Two records described one product; one of them was retired.
 *
 * The third kind, and the one the other two could not express. A merge does not move a
 * product between categories and does not retire a category — it retires a SLUG inside a
 * live category, because the catalogue held the same part twice under two spellings of
 * its model number. `canonicalProductCategory` cannot help here: the category was always
 * right, it is the page that should not have existed.
 */
interface ProductMerge {
  from: string;
  to: string;
  category: string;
  /**
   * Set when the renamed product also changed category (BH01 "Bathroom Accessories" →
   * care-grab-bars "Grab Bar", 2026-09-24). One entry, one hop: a rename entry plus a
   * separate move entry would send the old URL through two 301s, and would build a stub
   * at a new-slug-in-old-category path that never existed.
   */
  toCategory?: string;
  why: string;
}

const CATEGORY_ALIASES: Record<string, CategoryAlias> = moves.categoryAliases;
const PRODUCT_MOVES: readonly ProductMove[] = moves.productMoves;
const PRODUCT_MERGES: readonly ProductMerge[] = moves.productMerges ?? [];

/** The surviving slug for a retired duplicate, or the slug unchanged. */
/** Pass the category from the URL, not the canonical one: a merge is keyed by where the old page lived. */
const findMerge = (category: string, slug: string) =>
  PRODUCT_MERGES.find(
    (m) =>
      m.from === slug &&
      (m.category === category || m.category === canonicalCategorySlug(category)),
  );

export function canonicalProductSlug(category: string, slug: string): string {
  return findMerge(category, slug)?.to ?? slug;
}

export function canonicalCategorySlug(slug: string): string {
  return CATEGORY_ALIASES[slug]?.canonical ?? slug;
}

/**
 * Where a product URL should actually live.
 *
 * Checks the per-product moves first: a moved product's old category is still a real
 * category, so falling through to `canonicalCategorySlug` alone would return the old
 * slug unchanged and the stub would redirect to itself.
 */
export function canonicalProductCategory(category: string, slug: string): string {
  const moved = PRODUCT_MOVES.find((m) => m.slug === slug && m.from === category);
  if (moved) return moved.to;
  const merged = findMerge(category, slug);
  if (merged?.toCategory) return merged.toCategory;
  return canonicalCategorySlug(category);
}

export function getLegacyCategoryParams(): { category: string }[] {
  return Object.keys(CATEGORY_ALIASES).map((category) => ({ category }));
}

/**
 * Retired product URLs, each with the destination it redirects to.
 *
 * ---------------------------------------------------------------------------
 * WHY THE DESTINATION IS RETURNED RATHER THAN CHECKED HERE
 *
 * One `content/products` directory feeds two sites, and each record says which ones it
 * belongs to. A taxonomy move does not: `t2973a-stainless-steel-handle → t2973-…` is a
 * true statement about the catalogue, and `t2973` is a RAYEN-only record — so on the HYDE
 * export that stub was a redirect pointing at a page this site never builds. `audit-seo`
 * caught it as `redirect-target-missing` on 2026-09-16, which is the same class of fault
 * as a 301 chain: a crawler follows it and finds a 404 where a 200 used to be.
 *
 * The filter belongs to the caller, not here. Deciding it in this module needs the product
 * records, and `products.ts` imports this file — so reading it back is a cycle, and
 * importing the generated catalogue directly drags 800 JSON files into every unit test
 * that touches a slug. Both were tried; both broke `node --test`.
 *
 * So the move is reported with `to`/`toSlug` and the route drops what it does not build.
 */
export function getLegacyProductParams(): {
  category: string;
  slug: string;
  to?: string;
  toSlug?: string;
}[] {
  return [
    ...Object.entries(CATEGORY_ALIASES).flatMap(([category, alias]) =>
      alias.productSlugs.map((slug) => ({ category, slug })),
    ),
    ...PRODUCT_MOVES.map((m) => ({
      category: m.from,
      slug: m.slug,
      to: m.to,
      toSlug: m.slug,
    })),
    ...PRODUCT_MERGES.map((m) => ({
      category: m.category,
      slug: m.from,
      to: m.toCategory ?? m.category,
      toSlug: m.to,
    })),
  ];
}

/** Drops the retired URLs whose destination this site does not build. */
export function buildableLegacyProductParams(
  isBuilt: (category: string, slug: string) => boolean,
): { category: string; slug: string }[] {
  return getLegacyProductParams()
    .filter((entry) => !entry.to || isBuilt(entry.to, entry.toSlug ?? entry.slug))
    .map(({ category, slug }) => ({ category, slug }));
}
