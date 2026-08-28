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
