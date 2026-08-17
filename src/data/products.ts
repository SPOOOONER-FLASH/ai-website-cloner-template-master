import type { Product } from "./types";

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
 *   - ANSI Grade 3, only where the client's own product name asserts it
 * Every claim still needs checking against a real test report before launch.
 */
/**
 * Records live in content/products/*.json so the CMS can edit them as files.
 * The barrel is regenerated from disk on every build (npm prebuild), so it cannot
 * drift from what is actually in content/.
 */
import { products } from "./generated/products";

export { products };

/* -------------------------------------------------------------------------
 * Lookup helpers — pure functions, no side effects.
 * ---------------------------------------------------------------------- */

/** Find one product by model number (the business key). */
export function getProductByModel(model: string): Product | undefined {
  return products.find((p) => p.model === model);
}

/** Find one product by its top-level category slug and its own slug — the URL pair. */
export function getProductBySlug(categorySlug: string, slug: string): Product | undefined {
  return products.find((p) => p.categoryPath[0] === categorySlug && p.slug === slug);
}

/** All products whose category path starts with the given slug. */
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categoryPath[0] === categorySlug);
}

/**
 * Resolve Product.relatedModels into real records, skipping any model that is
 * not in the catalogue yet.
 */
export function getRelatedProducts(product: Product): Product[] {
  return product.relatedModels
    .map(getProductByModel)
    .filter((p): p is Product => p !== undefined);
}

/**
 * Every { category, slug } pair — generateStaticParams() needs this to enumerate
 * /products/[category]/[slug] routes for the static export.
 */
export function getAllProductParams(): { category: string; slug: string }[] {
  return products.map((p) => ({ category: p.categoryPath[0], slug: p.slug }));
}
