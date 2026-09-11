import type { MetadataRoute } from "next";
import { absoluteUrl, hasSpanishMirror, indexable } from "@/data/site";
import { isoUploadDate } from "@/lib/upload-date";
import { getTopLevelCategories } from "@/data/categories";
import {
  getAllProductParams,
  getProductBySlug,
  getProductsByCategory,
  isPublished,
  products,
} from "@/data/products";
import { getAllProjectParams } from "@/data/projects";
import { getPublishedNews } from "@/data/news";
import { buildLocaleSitemapEntries, type SitemapVideo } from "@/lib/seo-policy";

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
/**
 * Escapes text that Next drops into the sitemap without escaping it.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS HAS TO BE DONE HERE
 *
 * Next serialises `<video:title>` and `<video:description>` by string interpolation —
 * `node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js`, around
 * line 130 — with no escaping at all. A URL cannot contain a bare `&` and survives; a
 * product summary can, and ours do: "Supports top & bottom bolt linkage",
 * "solid brass/zinc & brass cylinder", "suitable for left & right usage".
 *
 * Ten of them shipped, and Google's Search Console reported the whole file as
 * unreadable — "我们无法阅读您的 Sitemap 文件", parse error at line 3740 — on 2026-09-08.
 * An XML parser stops at the first bare `&`, so ten characters of product copy cost the
 * indexing of all 1,142 URLs. Zero pages and zero videos discovered.
 *
 * Escaping at the call site rather than post-processing `out/sitemap.xml` keeps the fix
 * where the data enters: a later field that also carries prose gets the same treatment by
 * being wrapped, and there is no second file that has to be remembered. `sitemap-escaping.test.ts`
 * asserts the built file has no bare ampersand left.
 */
function xmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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
    videos?: SitemapVideo[],
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
      videos,
    });
  };

  const urls: MetadataRoute.Sitemap = [
    ...entry("/", PRIORITY.home, "weekly"),
    ...entry("/products", PRIORITY.section, "weekly"),
    ...entry("/product-studies", PRIORITY.section, "monthly"),
    ...entry("/products/argentina-ar4", PRIORITY.category, "weekly"),
    // The finder is a real landing page, not a widget: it is the page that ranks for
    // attribute queries ("panic bar 1000mm stainless") rather than model numbers.
    ...entry("/product-finder", PRIORITY.section, "weekly"),
    // Guided selection, bilingual. Same tier as the Finder: both are catalogue entry
    // points rather than content, and both are how a buyer reaches a model.
    ...entry("/configurator", PRIORITY.section, "weekly"),
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
  for (const category of getTopLevelCategories()) {
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
  for (const category of getTopLevelCategories()) {
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
  for (const category of getTopLevelCategories()) {
    if (getProductsByCategory(category.slug).length < 3) continue;
    urls.push(...entry(`/compare/${category.slug}`, PRIORITY.support, "monthly"));
  }

  /*
    Product detail: the commercial core, highest priority after the homepage.

    Each entry carries every photograph and video on the page — see below. A crawler
    indexing the page does not thereby index the media on it; pages, images and videos are
    three separate paths.
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
    /*
      Every photograph on the page, not only the hero.

      Buyers in this trade search Google Images for a shape — a patch fitting, a lock case
      forend — before they have a model number, and the shape they recognise is often the
      third gallery view rather than the catalogue hero. Listing the hero alone offered a
      crawler 360 pictures out of the 1,584 the site publishes.

      Every one carries alt text (verified: 0 of 1,584 missing), which is what makes them
      worth listing at all — an image sitemap entry for a picture with no description asks
      a crawler to index something it cannot caption.
    */
    const images = [
      product.heroImage?.src,
      ...product.gallery.map((g) => g.src),
      ...(product.videos ?? []).map((v) => v.poster?.src),
    ].filter((src): src is string => Boolean(src));
    /*
      Demonstration clips, listed so they can earn a video result of their own.

      Filtered to the ones carrying every field Google requires: a video entry missing a
      thumbnail, a duration or a publication date is not partially accepted — it
      invalidates the whole <url> block, taking the page listing with it. Products with a
      clip but incomplete metadata are simply listed without one.
    */
    const videos: SitemapVideo[] = (product.videos ?? [])
      /* Same normalisation as the JSON-LD — see src/lib/upload-date.ts. A bare date
         here is what Google's video report rejected. */
      .filter((v) => v.src.startsWith("/") && v.poster?.src && v.durationSeconds)
      .filter((v) => isoUploadDate(v.uploadDate))
      .map((v) => ({
        title: xmlText(v.label),
        thumbnail_loc: absoluteUrl(v.poster!.src ?? ""),
        description: xmlText(product.summary || v.label),
        content_loc: absoluteUrl(v.src),
        duration: v.durationSeconds!,
        publication_date: isoUploadDate(v.uploadDate)!,
      }));
    urls.push(
      ...entry(
        `/products/${category}/${slug}`,
        PRIORITY.productDetail,
        "monthly",
        undefined,
        images.length ? images.map(absoluteUrl) : undefined,
        videos.length ? videos : undefined,
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
