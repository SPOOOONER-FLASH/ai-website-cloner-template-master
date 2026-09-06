import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { ProductCard, SectionHead, Shell } from "@/components/rayen/primitives";
import { getCategory, getProductsInCategory, stockedCategories, zhPath } from "@/data/rayen";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return stockedCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const count = getProductsInCategory(slug).length;
  return {
    title: category.name,
    description: `雷茵五金${category.name}，共 ${count} 个型号，含材质、尺寸与表面处理参数。`,
    alternates: { canonical: `/products/${slug}/` },
  };
}

/**
 * A category listing.
 *
 * Every model in the category, in model order, with no pagination. Forty tiles on one
 * page costs a scroll; splitting them across pages costs a buyer the ability to scan the
 * range, which is the only reason they opened a category page at all.
 */
export default async function RayenCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = getProductsInCategory(slug);

  return (
    <>
      <SiteHeader current="/products/" />

      <main className="flex-grow">
        <Shell className="py-12 md:py-16">
          <nav aria-label="面包屑" className="text-[13px] text-[var(--color-ink-3)]">
            <a href={zhPath("/products/")} className="hover:text-[var(--color-ink)]">
              产品中心
            </a>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-ink)]">{category.name}</span>
          </nav>

          <div className="mt-6">
            <SectionHead
              eyebrow={category.slug.replace(/-/g, " ")}
              title={category.name}
              intro={`共 ${items.length} 个型号。点开任意型号可以看到完整规格表。`}
              align="left"
            />
          </div>

          {category.children.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {category.children.map((child) => (
                <li
                  key={child.slug}
                  className="border border-[var(--color-line)] px-3 py-1 text-[13px] text-[var(--color-ink-2)]"
                >
                  {child.name}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </>
  );
}
