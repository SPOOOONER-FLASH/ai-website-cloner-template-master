import type { Metadata } from "next";
import { ProductBody } from "@/components/rayen/pages";
import { absoluteUrl, getProduct, products, viewProduct } from "@/data/rayen";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({
    category: product.categoryPath[0] ?? "products",
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const record = getProduct(slug);
  if (!record) return {};
  const product = viewProduct(record, "en");
  const path = `/en/products/${category}/${slug}/`;
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    // Canonical carries the DEPLOYED path. Chinese deploys at "/", English at "/en/";
    // the /zh and /zh-en build prefixes never appear in a URL a buyer sees.
    alternates: { canonical: path },
    openGraph: { url: absoluteUrl(path) },
  };
}

export default async function Page({ params }: Props) {
  const { category, slug } = await params;
  return <ProductBody locale="en" categorySlug={category} slug={slug} />;
}
