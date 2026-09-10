import categoriesFile from "../../content/categories.json";
import { applyImageAltOverride } from "./image-alt-overrides";
import { brandProductImageRef } from "./product-image-branding";
// Safe: products.ts does not import this module, so there is no cycle.
import { publishedProducts } from "./products";
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
  /*
    A category with nothing published in it does not get a page.

    This is the same rule getMenuCategories() already applies one level down — "a
    sub-category with no products is dropped, not shown as an empty branch" — raised to
    the top level, where it was missing.

    It was missing because until 2026-09-10 every top-level category had products, so the
    case never arose. `flip-up-grab-bars` was added that day ahead of its photographs and
    immediately produced four broken routes: /products/<slug>/ and /compare/<slug>/ in
    both locales, each with no JSON-LD itemListElement, no html lang attribute, a canonical
    pointing at the homepage, and a noindex tag inside an indexable release. `npm run
    test:export` blocked the deploy on all ten findings, which is the audit doing its job.

    Dropping the route is better than emitting a placeholder for the same reason the
    sub-category rule exists: an empty category page is a dead end that costs a buyer a
    click and costs us a crawled URL with nothing on it. The moment a photograph lands on
    one of its products the category publishes itself, exactly like the product rule in
    src/data/products.ts. Nobody has to remember to switch it back on.
  */
  return categories.filter((category) =>
    publishedProducts.some((product) => product.categoryPath[0] === category.slug),
  );
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
  /*
    Built from getTopLevelCategories(), not the raw declaration, so the drawer cannot
    offer a category the build no longer writes. The drawer renders on every page, so an
    empty category here is not one broken link — on 2026-09-10 it was 1,342 references to
    two non-existent URLs across 675 pages, and the dead-link audit blocked the release.
  */
  return getTopLevelCategories().map((category) => {
    /*
      PUBLISHED only, so the number beside a menu label equals the number of cards the
      category page actually renders. Counting the withheld records made the menu promise
      42 panic devices and the page deliver 38, and it could keep a sub-category in the
      drawer whose every member is withheld — which lands the reader on exactly the
      "no products match this filter" dead end the note below says is a defect.
    */
    const inCategory = publishedProducts.filter((p) => p.categoryPath[0] === category.slug);

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
