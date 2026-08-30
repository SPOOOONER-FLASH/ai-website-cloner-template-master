import categoriesFile from "../../content/categories.json";
import { applyImageAltOverride } from "./image-alt-overrides";
import { brandProductImageRef } from "./product-image-branding";
import type { Category } from "./types";

/**
 * Product category tree — mirrors the client's own cantonlock.com catalogue,
 * read from https://www.cantonlock.com/Index.php?a=index&c=Lists&m=home&tid=75
 * on 2026-08-16. Prices and marketplace fields are intentionally excluded.
 *
 * The shape of this tree IS the URL structure: /products/[category]/[slug].
 * Renaming a slug changes a live URL, so treat slugs as stable once published.
 *
 * Sub-categories are a FILTER DIMENSION only (decision 3) — they never become a URL
 * segment. They are used by the P4 listing page.
 */
function applyCategoryImageAltOverrides(category: Category): Category {
  return {
    ...category,
    image: brandProductImageRef(applyImageAltOverride(category.image)),
    children: category.children?.map(applyCategoryImageAltOverrides),
  };
}

export const categories = (categoriesFile.categories as Category[]).map(
  applyCategoryImageAltOverrides,
);

/* -------------------------------------------------------------------------
 * Lookup helpers — pure functions over the tree, no side effects.
 * ---------------------------------------------------------------------- */

/** Top-level categories, in menu order. */
export function getTopLevelCategories(): Category[] {
  return categories;
}

/** Find a category by its path of slugs, e.g. ["knob-locks", "tubular-knob"]. */
export function findCategoryByPath(path: string[]): Category | undefined {
  let level: Category[] | undefined = categories;
  let found: Category | undefined;

  for (const slug of path) {
    found = level?.find((c) => c.slug === slug);
    if (!found) return undefined;
    level = found.children;
  }
  return found;
}

/**
 * Every category path in the tree, flattened.
 * generateStaticParams() needs this to enumerate routes for the static export.
 */
export function getAllCategoryPaths(): string[][] {
  const out: string[][] = [];

  const walk = (nodes: Category[], prefix: string[]) => {
    for (const node of nodes) {
      const path = [...prefix, node.slug];
      out.push(path);
      if (node.children?.length) walk(node.children, path);
    }
  };

  walk(categories, []);
  return out;
}
