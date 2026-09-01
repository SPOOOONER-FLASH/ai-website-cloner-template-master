/*
 * A retired slug is a redirect, not a page — so it must not be indexable.
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
 * The server-side 301s in deploy/nginx/legacy-redirects.conf are the real fix for legacy
 * URLs. These stubs only exist for paths Next itself generates.
 */

/** Retired catalogue routes that must continue resolving after taxonomy cleanup. */
const CATEGORY_ALIASES = {
  "door-hinges": {
    canonical: "brass-steel-hinges",
    productSlugs: ["f100-ss-door-hinge", "stainless-steel-door-hinge"],
  },
} as const;

export function canonicalCategorySlug(slug: string): string {
  return CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES]?.canonical ?? slug;
}

export function getLegacyCategoryParams(): { category: string }[] {
  return Object.keys(CATEGORY_ALIASES).map((category) => ({ category }));
}

export function getLegacyProductParams(): { category: string; slug: string }[] {
  return Object.entries(CATEGORY_ALIASES).flatMap(([category, alias]) =>
    alias.productSlugs.map((slug) => ({ category, slug })),
  );
}
