import { absoluteUrl, legalName, siteName, siteUrl } from "@/data/site";
import { stats } from "@/data/company";
import type { NewsArticle, Product } from "@/data/types";

/**
 * Schema.org structured data.
 *
 * ⚠ HONESTY RULE FOR THIS FILE. Structured data is machine-read and can surface as rich
 * results, so a wrong value here is a public claim, not a styling bug. Nothing below
 * asserts anything the site cannot evidence:
 *   - no aggregateRating / review (we have none)
 *   - no price or availability (not published, and this is not a shop)
 *   - no foundingDate (the client's own sources conflict — see PROGRESS.md decision 9)
 *   - certifications appear only where a scanned certificate names that exact model
 */

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema payloads are built from our own typed data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organisationSchema() {
  const facility = stats.find((s) => s.label === "Facility area")?.value;
  const workforce = stats.find((s) => s.label === "Workforce")?.value;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    legalName,
    url: siteUrl,
    logo: absoluteUrl("/images/brand/hyland-mark.png"),
    description:
      "Manufacturer of panic exit devices, mortise locks, lever handles, knob locks, glass door fittings and floor hinges for commercial and residential buildings.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Guangdong",
      addressCountry: "CN",
    },
    ...(workforce ? { numberOfEmployees: { "@type": "QuantitativeValue", description: workforce } } : {}),
    ...(facility ? { areaServed: "Worldwide" } : {}),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "ISO 9001",
    },
    knowsLanguage: ["en", "es", "zh-CN"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["en", "es"],
  };
}

/**
 * Product schema. Deliberately omits `offers` — no price or stock is published, and
 * emitting an empty/placeholder offer is a common way to earn a Search Console penalty.
 */
export function productSchema(product: Product, url: string) {
  const specs = product.specs.filter((s) => s.value);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name}${product.modelTbc ? "" : ` ${product.model}`}`.trim(),
    ...(product.modelTbc ? {} : { model: product.model, sku: product.model, mpn: product.model }),
    description: product.summary,
    url,
    image: [absoluteUrl(product.heroImage.src ?? ""), ...product.gallery.map((g) => absoluteUrl(g.src ?? ""))].filter(
      (s) => s !== siteUrl,
    ),
    brand: { "@type": "Brand", name: siteName },
    manufacturer: { "@id": `${siteUrl}/#organization` },
    category: product.categoryPath.join(" / "),
    material: product.material,
    ...(specs.length
      ? {
          additionalProperty: specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.unit ? `${s.value} ${s.unit}` : s.value,
          })),
        }
      : {}),
  };
}

/**
 * NewsArticle schema for a press release.
 *
 * `author` and `publisher` are both the company: these are corporate announcements, not
 * bylined journalism, and inventing a writer to fill the field would be a fabricated
 * attribution. `dateModified` is left equal to `datePublished` because the content model
 * has no revision timestamp — claiming a later edit date we do not track would be a
 * freshness signal we cannot back up.
 */
export function newsArticleSchema(article: NewsArticle, url: string) {
  const images = [article.heroImage, ...(article.gallery ?? [])]
    .map((image) => image.src)
    .filter((src): src is string => Boolean(src))
    .map((src) => absoluteUrl(src));

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    ...(images.length ? { image: images } : {}),
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

export function NewsArticleJsonLd({ article }: { article: NewsArticle }) {
  return (
    <JsonLd data={newsArticleSchema(article, absoluteUrl(`/news/${article.slug}/`))} />
  );
}

/** Breadcrumb trail. `items` is ordered root → current, each with an absolute URL. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Category listing as an ItemList, so Google understands the collection. */
export function itemListSchema(name: string, urls: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: urls.length,
    itemListElement: urls.map((url, i) => ({ "@type": "ListItem", position: i + 1, url })),
  };
}
