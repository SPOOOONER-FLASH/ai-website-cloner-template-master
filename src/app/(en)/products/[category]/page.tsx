import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import {
  canonicalCategorySlug,
  getLegacyCategoryParams,
} from "@/data/category-aliases";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...getTopLevelCategories().map((category) => ({ category: category.slug })),
    ...getLegacyCategoryParams(),
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const canonicalSlug = canonicalCategorySlug(categorySlug);
  const category = getTopLevelCategories().find((item) => item.slug === canonicalSlug);

  if (!category) return {};

  // Bare category names came out at ~25 characters once the brand suffix was added,
  // leaving more than half the title budget unused. The qualifier is the one buyers
  // actually type — "panic exit device manufacturer" — and it is a plain statement of
  // what this company is, not a claim.
  const withRole = `${category.name} — Manufacturer & Supplier`;
  const title = withRole.length + " | Canton Hyland".length <= 62 ? withRole : category.name;

  // Several category summaries stop around 65 characters. The count is read from the
  // catalogue, and the closing clause repeats copy already published site-wide.
  const count = getProductsByCategory(category.slug).length;
  const tail = `${count} models manufactured in Guangdong, China and exported to over thirty markets.`;
  const full = `${category.summary} ${tail}`;
  const description = full.length <= 165 ? full : category.summary;

  return pageMetadata({
    enPath: `/products/${canonicalSlug}`,
    locale: "en",
    title,
    description,
    image: category.image.src,
    imageAlt: category.image.label,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const canonicalSlug = canonicalCategorySlug(categorySlug);

  if (canonicalSlug !== categorySlug) {
    permanentRedirect(`/products/${canonicalSlug}/`);
  }

  const category = getTopLevelCategories().find((item) => item.slug === canonicalSlug);

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
          <ProductIndexList products={products} label={`${products.length} ${category.name.toLowerCase()}`} />
        </div>
      </section>
    </main>
    </>
  );
}
