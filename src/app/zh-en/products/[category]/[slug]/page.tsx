import type { Metadata } from "next";
import { ProductBody } from "@/components/rayen/pages";
import { absoluteUrl, alternatesFor, getProduct, products, viewProduct } from "@/data/rayen";

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
    alternates: alternatesFor("en", path.replace(/^\/en/, "")),
    openGraph: {
      url: absoluteUrl(path),
      /*
        The product photograph itself, so a link pasted into WeChat or WhatsApp shows the
        part rather than the press hall the root layout supplies as a default. It is the
        RAYEN-stamped copy — the same file the page renders — so a shared card carries the
        mark too.
      */
      images: product.heroImage ? [{ url: absoluteUrl(product.heroImage.src) }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { category, slug } = await params;
  return <ProductBody locale="en" categorySlug={category} slug={slug} />;
}
