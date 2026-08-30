import { absoluteUrl, legalName, siteName, siteUrl } from "@/data/site";
import { siteSettings } from "@/data/navigation";
import { getAnsweredFaq } from "@/data/faq";
import { stats } from "@/data/company";
import type { NewsArticle, Product } from "@/data/types";
import { serializeJsonLd } from "@/lib/json-ld";
import type {
  BreadcrumbList,
  FAQPage,
  ItemList,
  NewsArticle as SchemaNewsArticle,
  TechArticle as SchemaTechArticle,
  Organization,
  Product as SchemaProduct,
  Thing,
  WebSite,
  WithContext,
} from "schema-dts";

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

export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function organisationSchema(): WithContext<Organization> {
  const facility = stats.find((s) => s.label === "Facility area")?.value;
  const workforce = stats.find((s) => s.label === "Workforce")?.value;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    legalName,
    url: siteUrl,
    logo: absoluteUrl("/images/brand/hyde/hyde-logo-horizontal-black.svg"),
    description:
      "Manufacturer of panic exit devices, mortise locks, lever handles, knob locks, glass door fittings and floor hinges for commercial and residential buildings.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Guangdong",
      addressCountry: "CN",
    },
    ...(workforce ? { numberOfEmployees: { "@type": "QuantitativeValue", description: workforce } } : {}),
    ...(facility ? { areaServed: "Worldwide" } : {}),
    /*
      sameAs is how a search engine or an LLM decides that cantonlock.com, "Canton
      Hyland", "HYDE" and the Alibaba storefront are one company rather than four.
      Sourced from the footer so there is one list to maintain, and filtered to profile
      URLs: the footer previously carried https://linkedin.com/feed/ and
      https://tumblr.com/dashboard, which are the signed-in user's own pages, not the
      company's. A sameAs pointing at a login screen is a broken identity claim, so those
      were removed rather than asserted here. Add the real LinkedIn company page and X
      handle to content/site-settings.json when the client supplies them.
    */
    sameAs: siteSettings.social.map((link) => link.href),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "ISO 9001",
    },
    knowsLanguage: ["en", "es", "zh-CN"],
  };
}

export function websiteSchema(): WithContext<WebSite> {
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
export function productSchema(
  product: Product,
  url: string,
  locale: "en" | "es" = "en",
  categoryName?: string,
): WithContext<SchemaProduct> {
  const es = locale === "es";
  const specs = (es && product.specsEs?.length ? product.specsEs : product.specs).filter(
    (spec) => spec.value,
  );
  const name = (es && product.nameEs) || product.name;
  const description = (es && product.summaryEs) || product.summary;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    // Model first, matching both the H1 and `seoTitle`. The audit test asserts this string
    // is visible on the page, so the three must be changed together or not at all.
    name: `${product.modelTbc ? "" : `${product.model} `}${name}`.trim(),
    ...(product.modelTbc ? {} : { model: product.model, sku: product.model, mpn: product.model }),
    description,
    url,
    image: [absoluteUrl(product.heroImage.src ?? ""), ...product.gallery.map((g) => absoluteUrl(g.src ?? ""))].filter(
      (s) => s !== siteUrl,
    ),
    brand: { "@type": "Brand", name: siteName },
    manufacturer: { "@id": `${siteUrl}/#organization` },
    category: categoryName ?? product.categoryPath.join(" / "),
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
export function newsArticleSchema(
  article: NewsArticle,
  url: string,
): WithContext<SchemaNewsArticle | SchemaTechArticle> {
  const images = [article.heroImage, ...(article.gallery ?? [])]
    .map((image) => image.src)
    .filter((src): src is string => Boolean(src))
    .map((src) => absoluteUrl(src));

  return {
    "@context": "https://schema.org",
    /*
      A specification guide is not news. NewsArticle is freshness-weighted and scoped to
      Google News; an evergreen piece like "EN 1125 vs ANSI 156.3" declared as NewsArticle
      decays in relevance by the month and never qualifies for the surface it claims.
      TechArticle is the type for standards, backset tables and installation guidance, and
      it is also what an answer engine looks for when deciding whether a page is reference
      material worth citing.
    */
    "@type": article.kind === "insight" ? "TechArticle" : "NewsArticle",
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
export function breadcrumbSchema(
  items: { name: string; url: string }[],
): WithContext<BreadcrumbList> {
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
export function itemListSchema(name: string, urls: string[]): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: urls.length,
    itemListElement: urls.map((url, i) => ({ "@type": "ListItem", position: i + 1, url })),
  };
}

/**
 * FAQPage structured data.
 *
 * Only answered questions are emitted — the same set the page renders. Google treats a
 * FAQPage whose answers do not appear on the page as a spam signal, so the two must not
 * be allowed to drift apart.
 */
export function FaqJsonLd() {
  const groups = getAnsweredFaq();
  const items = groups.flatMap((group) => group.items);
  if (!items.length) return null;

  const data: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return <JsonLd data={data} />;
}
