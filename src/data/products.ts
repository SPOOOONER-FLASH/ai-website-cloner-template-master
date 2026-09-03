import type { Product } from "./types";
import { canonicalCategorySlug } from "./category-aliases";

/**
 * Canton Hyland product catalogue — 20 products from the client's own material.
 *
 * SOURCES, and what each one actually supports:
 *   - Product names, model codes and photography: the client's asset pack delivered
 *     2026-08-15 (WeChat). First-party, no stock library.
 *   - Category tree and product range: the client's cantonlock.com catalogue, checked
 *     2026-08-16. Alibaba remains a secondary source for delivered product imagery.
 *   - Selected model-specific fields: stahlock.com, an alternate company storefront
 *     the client explicitly authorised as a secondary reference on 2026-08-16. Only
 *     fields matching an exact client-supplied model/image are used; its brand story,
 *     broad performance claims and unrelated certification claims are excluded.
 *   - Company standards claims: the client's own English profile (公司英文简介.docx).
 *
 * ⚠ SPEC TABLES ARE MOSTLY EMPTY, ON PURPOSE.
 * Alibaba product DETAIL pages are captcha-protected and could not be read, so no
 * dimension, material or finish data was obtainable. Rather than invent plausible
 * numbers, `specs` carries only values that are stated in the client's own product
 * names (e.g. "LC14 85×50" gives centre distance and backset). Everything else waits
 * for the client's catalogue. An empty spec table is honest; a fabricated one is not.
 *
 * ⚠ CERTIFICATIONS ARE DELIBERATELY CONSERVATIVE.
 * The four certificate scans each name a SPECIFIC model (KD070/30-290, KD070/20-101,
 * 607 SS ET). None of them names the models below, so they are published as company
 * credentials in src/data/company.ts and NOT attached to individual products.
 * Per-product entries carry only:
 *   - ISO 9001, stated company-wide by the client and dated 2002
 *   - no ANSI/BHMA grade anywhere: the client confirmed on 2026-08-27 that there is no
 *     BHMA certification, and the one record whose name asserted "ANSI Grade 3" has been
 *     renamed. Do not reintroduce a grade from a product name.
 * Every claim still needs checking against a real test report before launch.
 */
/**
 * Records live in content/products/*.json so the CMS can edit them as files.
 * The barrel is regenerated from disk on every build (npm prebuild), so it cannot
 * drift from what is actually in content/.
 */
import { products as generatedProducts } from "./generated/products";
import { applyImageAltOverride, applyImageAltOverrides } from "./image-alt-overrides";
import { brandProductImageRef, brandProductImageRefs } from "./product-image-branding";

export const products: Product[] = generatedProducts.map((product) => ({
  ...product,
  heroImage: brandProductImageRef(applyImageAltOverride(product.heroImage)),
  gallery: brandProductImageRefs(applyImageAltOverrides(product.gallery)),
  videos: product.videos?.map((video) => ({
    ...video,
    poster: video.poster
      ? brandProductImageRef(applyImageAltOverride(video.poster))
      : undefined,
  })),
}));

/**
 * A product without a photograph is not published.
 *
 * WHY THIS IS A RULE AND NOT A FLAG. 75 records have no hero image, and a product page
 * with no photograph is a page a buyer cannot use: they arrive from a search for a model
 * number, find a name and a half-filled spec table, and leave. The client's instruction
 * was to take them down until there is a photograph.
 *
 * Deriving it from the data rather than hand-setting a `hidden` flag means the reverse
 * also happens on its own — the moment a photograph lands in the record, the product
 * publishes itself. Nobody has to remember to flip anything back, which is exactly the
 * kind of bookkeeping that gets forgotten and leaves finished work invisible.
 *
 * WHAT UNPUBLISHED MEANS HERE. Out of every listing, the finder, the sitemap, the search
 * index and llms.txt — but the page is still BUILT, and marked noindex. That is
 * deliberate: deleting the route would 404 any link that already exists in the wild,
 * including the model numbers sitting in old quotations and on the trade directories.
 * A quiet page is recoverable; a 404 throws away whatever the URL had earned.
 *
 * The current list is printed by `npm run sheets` (section four of the design brief),
 * which is also the sheet asking for the photographs.
 */
export function isPublished(product: Product): boolean {
  return Boolean(product.heroImage?.src);
}

/** Everything a visitor should be able to find by browsing. */
export const publishedProducts: Product[] = products.filter(isPublished);

/* -------------------------------------------------------------------------
 * Lookup helpers — pure functions, no side effects.
 * ---------------------------------------------------------------------- */

/** Find one product by model number (the business key). */
export function getProductByModel(model: string): Product | undefined {
  return products.find((p) => p.model === model);
}

/** Find one product by its top-level category slug and its own slug — the URL pair. */
export function getProductBySlug(categorySlug: string, slug: string): Product | undefined {
  const canonicalSlug = canonicalCategorySlug(categorySlug);
  return products.find((p) => p.categoryPath[0] === canonicalSlug && p.slug === slug);
}

/**
 * All PUBLISHED products whose category path starts with the given slug.
 *
 * This is the browsing path — category pages, the comparison tables, the collections —
 * so it hides the photograph-less records. `getProductBySlug` deliberately does not, so
 * a direct link to one still resolves instead of 404ing.
 */
export function getProductsByCategory(categorySlug: string): Product[] {
  const canonicalSlug = canonicalCategorySlug(categorySlug);
  return publishedProducts.filter((p) => p.categoryPath[0] === canonicalSlug);
}

/**
 * Resolve Product.relatedModels into real records, skipping any model that is
 * not in the catalogue yet.
 */
export function getRelatedProducts(product: Product): Product[] {
  return product.relatedModels
    .map(getProductByModel)
    .filter((p): p is Product => p !== undefined)
    // Never recommend a page we have taken down for having no photograph.
    .filter(isPublished);
}

/**
 * Every { category, slug } pair — generateStaticParams() needs this to enumerate
 * /products/[category]/[slug] routes for the static export.
 */
export function getAllProductParams(): { category: string; slug: string }[] {
  return products.map((p) => ({ category: p.categoryPath[0], slug: p.slug }));
}
