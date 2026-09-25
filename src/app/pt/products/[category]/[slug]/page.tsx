import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/site/ProductDetail";
import { findCategoryByPath } from "@/data/categories";
import { getAllProductParams, getProductBySlug, isPublished, products } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { JsonLd, ProductFaqJsonLd, breadcrumbSchema, productSchema } from "@/components/site/JsonLd";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProductParams();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) return {};

  const name = product.namePt ?? product.name;
  const summary = product.summaryPt ?? product.summary;
  const path = `/pt/products/${category}/${slug}/`;
  const url = absoluteUrl(path);

  /*
    Built from the Portuguese record rather than from the English seoTitle/seoDescription,
    which are generated separately and in English. A model number is not translated —
    it is the order code — so it leads the title in both languages.

    seoTitlePt/seoDescriptionPt come from scripts/generate-product-seo.mjs, which
    assembles them from the product's own fields with glossary-checked Spanish; the
    inline pair below is only the fallback for a record the generator has not run on.
  */
  const metaTitle =
    product.seoTitlePt ??
    (() => {
      const title = `${product.modelTbc ? name : `${product.model} ${name}`} | Canton Hyland`;
      return title.length <= 62 ? title : `${product.model} | Canton Hyland`;
    })();
  const metaDescription =
    product.seoDescriptionPt ??
    (summary.length <= 165 ? summary : `${summary.slice(0, 160).trimEnd()}…`);

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    /*
      Mirrors the English route: a product with no photograph is unpublished, so this
      page is noindex too.

      Doing only the English side left 75 Spanish pages indexable and absent from the
      sitemap, which the SEO gate caught as `sitemap-missing-page` ×150. Worth
      remembering as a shape rather than as one bug — every indexability decision here
      has two pages, and the Spanish one is the easy half to forget.
    */
    ...(isPublished(product)
      ? {}
      : {
          robots: { index: false, follow: true },
          // Marks the noindex as deliberate. scripts/lib/seo-audit.mjs treats a public
          // page as withheld only when this is present, so an ACCIDENTAL noindex still
          // fails the gate — which is the whole reason that check exists.
          other: { "canton-withheld": "awaiting-photography" },
        }),
    /*
      All three, named explicitly.

      The copy of this route from /es inherited `es: url` — which, after the paths were
      rewritten, declared the SPANISH alternate as the Portuguese URL and never mentioned
      Portuguese at all. Every product page shipped that until the built HTML was read:
      `hreflang="es"` pointing at /pt/… is not a missing tag, it is a wrong one, and it
      tells Google the Spanish page is at an address that serves Portuguese.

      Product detail exists in all three languages, so all three are listed rather than
      asked for — `mirrorsOf` is for paths where that is in doubt.
    */
    alternates: {
      canonical: path,
      /* Ten locales since 2026-09-25: the seven overlay trees name this page, so it must name
         them back. alternateLanguages() derives the set from mirrorsOf(), same as every other route. */
      languages: alternateLanguages(`/products/${category}/${slug}/`),
    },
    openGraph: {
      type: "website",
      url,
      title: metaTitle,
      description: metaDescription,
      locale: "pt",
      images: product.heroImage.src
        ? [
            {
              url: absoluteUrl(product.heroImage.src),
              alt: product.heroImage.labelPt ?? product.heroImage.label,
            },
          ]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE" }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [absoluteUrl(product.heroImage.src ?? defaultOgImage)],
    },
  };
}

export default async function ProductoPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) notFound();

  const categoryRecord = findCategoryByPath([category]);
  const categoryName = categoryRecord?.namePt ?? categoryRecord?.name ?? "Produtos";
  const url = absoluteUrl(`/pt/products/${category}/${slug}/`);

  return (
    <>
      <JsonLd data={productSchema(product, url, "pt", categoryName)} />
      <ProductFaqJsonLd product={product} locale="pt" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/pt/") },
          { name: "Produtos", url: absoluteUrl("/pt/products/") },
          { name: categoryName, url: absoluteUrl(`/pt/products/${category}/`) },
          { name: product.namePt ?? product.name, url },
        ])}
      />
      <ProductDetail product={product} categoryName={categoryName} locale="pt" />
    </>
  );
}
