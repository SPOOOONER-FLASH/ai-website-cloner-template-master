import type { MetadataRoute } from "next";
import { absoluteUrl, hasSpanishMirror, indexable } from "@/data/site";
import { categories } from "@/data/categories";
import {
  getAllProductParams,
  getProductBySlug,
  getProductsByCategory,
  isPublished,
  products,
} from "@/data/products";
import { getAllProjectParams } from "@/data/projects";
import { getPublishedNews } from "@/data/news";
import { buildLocaleSitemapEntries } from "@/lib/seo-policy";

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
  newsDetail: 0.6,
  support: 0.5,
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];

  /** One entry per locale pair, with reciprocal hreflang. */
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
    lastModified?: Date,
    images?: string[],
  ): MetadataRoute.Sitemap => {
    const clean = path === "/" ? "" : `/${path.replace(/^\/|\/$/g, "")}`;
    const en = absoluteUrl(`${clean}/`);
    const es = absoluteUrl(`/es${clean}/`);

    return buildLocaleSitemapEntries({
      en,
      es,
      bilingual: hasSpanishMirror(path),
      priority,
      changeFrequency,
      lastModified,
      images,
    });
  };

  const urls: MetadataRoute.Sitemap = [
    ...entry("/", PRIORITY.home, "weekly"),
    ...entry("/products", PRIORITY.section, "weekly"),
    ...entry("/products/argentina-ar4", PRIORITY.category, "weekly"),
    // The finder is a real landing page, not a widget: it is the page that ranks for
    // attribute queries ("panic bar 1000mm stainless") rather than model numbers.
    ...entry("/product-finder", PRIORITY.section, "weekly"),
    ...entry("/projects", PRIORITY.section),
    ...entry("/company", PRIORITY.section),
    ...entry("/certifications", PRIORITY.support),
    ...entry("/news", PRIORITY.section, "weekly"),
    ...entry("/downloads", PRIORITY.support),
    ...entry("/services", PRIORITY.section),
    ...entry("/events", PRIORITY.section, "monthly"),
    // Both of these answer questions buyers actually search, and /faq already emits
    // FAQPage structured data — leaving them out of the sitemap wasted that.
    ...entry("/faq", PRIORITY.support),
    ...entry("/request/price-list", PRIORITY.support),
    ...entry("/contact", PRIORITY.support),
    ...entry("/newsletter", PRIORITY.support, "monthly"),
  ];

  // Top-level category listings only — sub-categories are a filter dimension, not a URL.
  for (const category of categories) {
    urls.push(...entry(`/products/${category.slug}`, PRIORITY.category, "weekly"));
  }

  /*
    Comparison pages, English only.

    One per category with three or more models — the route 404s below that, so listing a
    URL the build does not emit would put a dead entry in the sitemap. Priority sits
    under the category listing: these serve a narrower query and should not compete with
    the page a buyer browsing the range actually wants.
  */
  /*
    Sub-category collections. Only those the catalogue declares AND that hold products —
    the same rule the menu uses, so the sitemap never lists a page the build skipped.
  */
  for (const category of categories) {
    for (const child of category.children ?? []) {
      const count = products.filter(
        (p) => p.categoryPath[0] === category.slug && p.categoryPath[1] === child.slug,
      ).length;
      if (!count) continue;
      // Both locales since 2026-09-03; `entry()` emits the pair with reciprocal hreflang.
      urls.push(
        ...entry(`/collections/${category.slug}-${child.slug}`, PRIORITY.category, "monthly"),
      );
    }
  }

  /*
    Comparison tables, both locales. `entry()` rather than a bare push because these now
    have a Spanish mirror — it emits the pair with reciprocal hreflang, which a hand-built
    single URL would not, and a Spanish page absent from the sitemap is the thing the
    graph audit calls `indexable-not-in-sitemap`.
  */
  for (const category of categories) {
    if (getProductsByCategory(category.slug).length < 3) continue;
    urls.push(...entry(`/compare/${category.slug}`, PRIORITY.support, "monthly"));
  }

  /*
    Product detail: the commercial core, highest priority after the homepage.

    Each entry carries its hero image. A crawler indexing the page does not thereby index
    the photograph on it — pages and images are separate paths — and buyers in this trade
    routinely search Google Images for a shape before they have a model number. 360 of
    the 435 records have a photograph; the rest are still awaiting one and are emitted
    without an image rather than with a placeholder.
  */
  for (const { category, slug } of getAllProductParams()) {
    const product = getProductBySlug(category, slug);
    /*
      A product with no photograph is unpublished: taken out of every listing and marked
      noindex, so advertising it here would be asking a crawler to index a page we have
      told it not to — the exact contradiction the SEO audit flags as
      `noindex-in-sitemap`. The page is still built; it is simply not promoted.
    */
    if (!product || !isPublished(product)) continue;
    const hero = product.heroImage?.src;
    urls.push(
      ...entry(
        `/products/${category}/${slug}`,
        PRIORITY.productDetail,
        "monthly",
        undefined,
        hero ? [absoluteUrl(hero)] : undefined,
      ),
    );
  }

  for (const { slug } of getAllProjectParams()) {
    urls.push(...entry(`/projects/${slug}`, PRIORITY.projectDetail));
  }

  // Every published release, not just one of them — FSB lists 1 of its 9 and the rest
  // are invisible to search. lastModified is the publication date, since the content
  // model tracks no revision timestamp.
  for (const article of getPublishedNews()) {
    urls.push(...entry(
      `/news/${article.slug}`,
      PRIORITY.newsDetail,
      "monthly",
      new Date(article.publishedAt),
    ));
  }

  return urls;
}
