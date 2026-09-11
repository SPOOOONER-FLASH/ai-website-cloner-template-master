import type { Metadata } from "next";
import { CategoryBody } from "@/components/rayen/pages";
import { getCategoryFor, products } from "@/data/rayen";
import { STRINGS } from "@/data/rayen-i18n";
import { categoriesFor } from "@/data/rayen";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categoriesFor("en").map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryFor(slug, "en");
  if (!category) return {};
  const count = products.filter((p) => p.categoryPath[0] === slug).length;
  return {
    title: category.name,
    description: STRINGS.en.products.categoryIntro(count),
    alternates: { canonical: `/en/products/${slug}/` },
  };
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  return <CategoryBody locale="en" categorySlug={category} />;
}
