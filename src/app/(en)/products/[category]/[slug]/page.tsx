import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProductDetail } from "@/components/site/ProductDetail";
import { findCategoryByPath } from "@/data/categories";
import { getAllProductParams, getProductBySlug } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { JsonLd, breadcrumbSchema, productSchema } from "@/components/site/JsonLd";
import { defaultOgImage } from "@/lib/seo";
import {
  canonicalProductCategory,
  getLegacyProductParams,
} from "@/data/category-aliases";

type ProductPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getAllProductParams(), ...getLegacyProductParams()];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const canonicalCategory = canonicalProductCategory(category, slug);

  /*
    THE REDIRECT CHECK COMES BEFORE THE LOOKUP, AND THAT ORDER IS LOAD-BEARING.

    A moved product no longer resolves under its OLD category — `getProductBySlug` looks
    at `categoryPath[0]`, which now names the new home. So looking it up first and
    bailing on `!product` would return `{}` for exactly the paths that need a canonical,
    dropping it to the site root; that is the redirect-canonical-mismatch the SEO audit
    caught once already. A retired path is a redirect stub whether or not the product is
    findable at the old address, so answer that first.
  */
  if (canonicalCategory !== category) {
    return {
      robots: { index: false, follow: true },
      alternates: { canonical: `/products/${canonicalCategory}/${slug}/` },
    };
  }

  const product = getProductBySlug(category, slug);
  if (!product) return {};
  const path = `/products/${canonicalCategory}/${slug}/`;
  const url = absoluteUrl(path);
  const spanishUrl = absoluteUrl(`/es${path}`);

  return {
    // seoTitle already carries the brand, so opt out of the layout's "%s | Canton Hyland".
    title: { absolute: product.seoTitle },
    description: product.seoDescription,
    alternates: {
      canonical: path,
      languages: {
        en: url,
        es: spanishUrl,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      url,
      title: product.seoTitle,
      description: product.seoDescription,
      // 112 products still have no photography. Falling back to the shared card keeps
      // their links from pasting into chat as a grey box.
      images: product.heroImage.src
        ? [{ url: absoluteUrl(product.heroImage.src), alt: product.heroImage.label }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE architectural door hardware" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle,
      description: product.seoDescription,
      images: [absoluteUrl(product.heroImage.src ?? defaultOgImage)],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const canonicalCategory = canonicalProductCategory(category, slug);

  if (canonicalCategory !== category) {
    permanentRedirect(`/products/${canonicalCategory}/${slug}/`);
  }

  const product = getProductBySlug(category, slug);

  if (!product) notFound();

  const categoryRecord = findCategoryByPath([canonicalCategory]);
  const categoryName = categoryRecord?.name ?? "Products";
  const url = absoluteUrl(`/products/${canonicalCategory}/${slug}/`);

  return (
    <>
      <JsonLd data={productSchema(product, url)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: categoryName, url: absoluteUrl(`/products/${canonicalCategory}/`) },
          { name: product.name, url },
        ])}
      />
      <ProductDetail product={product} categoryName={categoryName} />
    </>
  );
}
