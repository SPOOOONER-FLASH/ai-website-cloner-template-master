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

const CATEGORY_ALIASES: Record<string, CategoryAlias> = moves.categoryAliases;
const PRODUCT_MOVES: readonly ProductMove[] = moves.productMoves;

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
  return canonicalCategorySlug(category);
}

export function getLegacyCategoryParams(): { category: string }[] {
  return Object.keys(CATEGORY_ALIASES).map((category) => ({ category }));
}

export function getLegacyProductParams(): { category: string; slug: string }[] {
  return [
    ...Object.entries(CATEGORY_ALIASES).flatMap(([category, alias]) =>
      alias.productSlugs.map((slug) => ({ category, slug })),
    ),
    ...PRODUCT_MOVES.map((m) => ({ category: m.from, slug: m.slug })),
  ];
}
