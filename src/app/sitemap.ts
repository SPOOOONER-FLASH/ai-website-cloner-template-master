import type { MetadataRoute } from "next";
import { absoluteUrl, hasSpanishMirror, indexable } from "@/data/site";
import { categories } from "@/data/categories";
import { getAllProductParams } from "@/data/products";
import { getAllProjectParams } from "@/data/projects";

/**
 * Emits /sitemap.xml at build time (works under `output: "export"`).
 *
 * Every entry is generated from the same data the pages are, so the sitemap cannot
 * drift out of sync with the routes — add a product and it appears here automatically.
 *
 * Each English URL carries hreflang alternates to its Spanish mirror and back, which is
 * what tells Google the two are translations rather than duplicates.
 *
 * Returns empty while `indexable` is false: submitting a sitemap for a staging host
 * would invite exactly the indexing we are suppressing in robots.txt.
 */
export const dynamic = "force-static";

/** Relative priority within the site. Not a ranking factor, but it does guide crawl order. */
const PRIORITY = {
  home: 1.0,
  productDetail: 0.9,
  category: 0.8,
  section: 0.7,
  projectDetail: 0.6,
  support: 0.5,
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];

  const now = new Date();

  /** One entry per locale pair, with reciprocal hreflang. */
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ): MetadataRoute.Sitemap => {
    const clean = path === "/" ? "" : `/${path.replace(/^\/|\/$/g, "")}`;
    const en = absoluteUrl(`${clean}/`);
    const es = absoluteUrl(`/es${clean}/`);

    // English-only sections get one row and no alternates. Listing a Spanish URL that
    // does not exist would put 404s in the sitemap and trigger hreflang errors.
    if (!hasSpanishMirror(path)) {
      return [{ url: en, lastModified: now, changeFrequency, priority }];
    }

    const languages = { en, es, "x-default": en };
    return [
      { url: en, lastModified: now, changeFrequency, priority, alternates: { languages } },
      { url: es, lastModified: now, changeFrequency, priority, alternates: { languages } },
    ];
  };

  const urls: MetadataRoute.Sitemap = [
    ...entry("/", PRIORITY.home, "weekly"),
    ...entry("/products", PRIORITY.section, "weekly"),
    ...entry("/projects", PRIORITY.section),
    ...entry("/company", PRIORITY.section),
    ...entry("/downloads", PRIORITY.support),
    ...entry("/contact", PRIORITY.support),
  ];

  // Top-level category listings only — sub-categories are a filter dimension, not a URL.
  for (const category of categories) {
    urls.push(...entry(`/products/${category.slug}`, PRIORITY.category, "weekly"));
  }

  // Product detail: the commercial core, highest priority after the homepage.
  for (const { category, slug } of getAllProductParams()) {
    urls.push(...entry(`/products/${category}/${slug}`, PRIORITY.productDetail));
  }

  for (const { slug } of getAllProjectParams()) {
    urls.push(...entry(`/projects/${slug}`, PRIORITY.projectDetail));
  }

  return urls;
}
