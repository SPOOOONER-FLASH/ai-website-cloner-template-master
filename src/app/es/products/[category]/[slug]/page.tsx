import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/site/ProductDetail";
import { findCategoryByPath } from "@/data/categories";
import { getAllProductParams, getProductBySlug } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { JsonLd, breadcrumbSchema, productSchema } from "@/components/site/JsonLd";
import { defaultOgImage } from "@/lib/seo";

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

  const name = product.nameEs ?? product.name;
  const summary = product.summaryEs ?? product.summary;
  const path = `/es/products/${category}/${slug}/`;
  const url = absoluteUrl(path);

  /*
    Built from the Spanish record rather than from the English seoTitle/seoDescription,
    which are generated separately and in English. A model number is not translated —
    it is the order code — so it leads the title in both languages.
  */
  const title = `${product.modelTbc ? name : `${product.model} ${name}`} | Canton Hyland`;
  const metaTitle = title.length <= 62 ? title : `${product.model} | Canton Hyland`;
  const metaDescription =
    summary.length <= 165 ? summary : `${summary.slice(0, 160).trimEnd()}…`;

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: {
      canonical: path,
      languages: {
        en: absoluteUrl(`/products/${category}/${slug}/`),
        es: url,
        "x-default": absoluteUrl(`/products/${category}/${slug}/`),
      },
    },
    openGraph: {
      type: "website",
      url,
      title: metaTitle,
      description: metaDescription,
      locale: "es",
      images: product.heroImage.src
        ? [
            {
              url: absoluteUrl(product.heroImage.src),
              alt: product.heroImage.labelEs ?? product.heroImage.label,
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
  const categoryName = categoryRecord?.nameEs ?? categoryRecord?.name ?? "Productos";
  const url = absoluteUrl(`/es/products/${category}/${slug}/`);

  return (
    <>
      <JsonLd data={productSchema(product, url, "es", categoryName)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
          { name: categoryName, url: absoluteUrl(`/es/products/${category}/`) },
          { name: product.nameEs ?? product.name, url },
        ])}
      />
      <ProductDetail product={product} categoryName={categoryName} locale="es" />
    </>
  );
}
