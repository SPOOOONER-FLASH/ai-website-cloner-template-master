import categoriesFile from "../../content/categories.json";
import { applyImageAltOverride } from "./image-alt-overrides";
import { brandProductImageRef } from "./product-image-branding";
// Safe: products.ts does not import this module, so there is no cycle.
import { products } from "./products";
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

/** Slug plus both display names — everything the menu needs and nothing else. */
export interface MenuCategory {
  slug: string;
  label: string;
  labelEs: string;
  /**
   * Sub-categories, for the menu's second level.
   *
   * These are a filter dimension, never a URL segment (see the note at the top of this
   * file), so a child's destination is `/products/<parent>/?type=<child>` — the same
   * query the filter rail on the category page writes. Only four of the fifteen
   * categories have any; the rest link straight through.
   */
  children: { slug: string; label: string; labelEs: string; count: number }[];
  count: number;
}

/**
 * The catalogue as the mobile menu needs it.
 *
 * Passed down from the server layouts rather than imported by the drawer directly.
 * `categories` carries summaries, images and the whole sub-category tree — 15KB of JSON
 * plus the alt-override and watermark modules it pulls in — and the drawer is client
 * code, so importing it there would ship all of that to every visitor to render fifteen
 * labels.
 */
export function getMenuCategories(): MenuCategory[] {
  return categories.map((category) => {
    const inCategory = products.filter((p) => p.categoryPath[0] === category.slug);

    /*
      A sub-category with no products is dropped, not shown as an empty branch. Two are
      currently empty — `wafer-locks` and `armoured-lock-covers` — and a menu entry that
      leads to "no products match this filter" is a defect, not a placeholder.

      The counts that survive are rendered next to each label. Some of them are small
      (panic exit devices has five sub-types covering 12 of its 42 records, the other 30
      being untagged), and showing that honestly is the point: it tells the buyer where
      the range actually is, and it makes the tagging gap visible instead of hiding it
      behind a menu that implies even coverage.
    */
    const children = (category.children ?? [])
      .map((child) => ({
        slug: child.slug,
        label: child.name,
        labelEs: child.nameEs ?? child.name,
        count: inCategory.filter((p) => p.categoryPath[1] === child.slug).length,
      }))
      .filter((child) => child.count > 0);

    return {
      slug: category.slug,
      label: category.name,
      labelEs: category.nameEs ?? category.name,
      count: inCategory.length,
      children,
    };
  });
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
