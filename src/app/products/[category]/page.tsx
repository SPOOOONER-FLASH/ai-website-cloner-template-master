import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getTopLevelCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === categorySlug);

  if (!category) return {};

  return pageMetadata({
    enPath: `/products/${categorySlug}`,
    locale: "en",
    title: category.name,
    description: category.summary,
    image: category.image.src,
    imageAlt: category.image.label,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === categorySlug);

  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const categoryUrl = absoluteUrl(`/products/${category.slug}/`);
  const options = category.children?.map(({ slug, name }) => ({ slug, name })) ?? [];

  return (
    <>
      <JsonLd
        data={itemListSchema(
          category.name,
          products.map((p) => absoluteUrl(`/products/${p.categoryPath[0]}/${p.slug}/`)),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: category.name, url: categoryUrl },
        ])}
      />
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="category-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products/" },
                { label: category.name },
              ]}
            />
          </div>
          <div className="col-span-full mt-24 xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Canton Product Collection</p>
            <h1 id="category-title" className="mt-8 text-h1 text-ink">{category.name}</h1>
          </div>
          <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
            <p className="text-h3 text-ink">{category.summary}</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Product data shown here is limited to verified client records. Additional references
              from the legacy catalogue are being prepared for structured publication.
            </p>
          </div>
        </div>
      </section>

      <section className="layout mt-144 lg:mt-288" aria-label={`${category.name} catalogue`}>
        <div className="col-content grid w-full grid-cols gap-x">
          <CategoryFilter products={products} options={options} />
        </div>
      </section>
    </main>
    </>
  );
}
