import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/site/ProductDetail";
import { findCategoryByPath } from "@/data/categories";
import { getAllProductParams, getProductBySlug } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { JsonLd, breadcrumbSchema, productSchema } from "@/components/site/JsonLd";

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

  const path = `/products/${category}/${slug}/`;
  const url = absoluteUrl(path);

  return {
    // seoTitle already carries the brand, so opt out of the layout's "%s | Canton Hyland".
    title: { absolute: product.seoTitle },
    description: product.seoDescription,
    alternates: {
      canonical: path,
      // No Spanish product pages exist yet, so no hreflang here. See site.ts.
    },
    openGraph: {
      type: "website",
      url,
      title: product.seoTitle,
      description: product.seoDescription,
      images: product.heroImage.src
        ? [{ url: absoluteUrl(product.heroImage.src), alt: product.heroImage.label }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);

  if (!product) notFound();

  const categoryRecord = findCategoryByPath([category]);
  const categoryName = categoryRecord?.name ?? "Products";
  const url = absoluteUrl(`/products/${category}/${slug}/`);

  return (
    <>
      <JsonLd data={productSchema(product, url)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: categoryName, url: absoluteUrl(`/products/${category}/`) },
          { name: product.name, url },
        ])}
      />
      <ProductDetail product={product} categoryName={categoryName} />
    </>
  );
}
