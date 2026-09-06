import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/rayen/Chrome";
import { Photo, SectionHead, Shell } from "@/components/rayen/primitives";
import { countInCategory, products, stockedCategories, zhPath } from "@/data/rayen";

export const metadata: Metadata = {
  title: "产品中心",
  description: `${stockedCategories.length} 个品类、${products.length} 个在售型号：逃生推杠、球锁、执手锁、插芯锁体、锁芯、合页、玻璃门夹与门控配件。`,
  alternates: { canonical: "/products/" },
};

/**
 * The catalogue index.
 *
 * Fifteen categories, each with the count of models actually behind it. The count is the
 * point: a category tile that says 40 型号 and opens onto 40 models is a small promise
 * kept, and this page is a buyer's first chance to see whether this supplier keeps them.
 */
export default function RayenProductsPage() {
  return (
    <>
      <SiteHeader current="/products/" />

      <main className="flex-grow">
        <Shell className="py-14 md:py-20">
          <SectionHead
            eyebrow="Products"
            title="产品中心"
            intro={`${stockedCategories.length} 个品类，${products.length} 个在售型号。每个型号页都有独立规格表，尺寸以实物为准。`}
            align="left"
          />

          <div className="mt-10 grid gap-px bg-[var(--color-line)] md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {stockedCategories.map((category) => (
              <a
                key={category.slug}
                href={zhPath(`/products/${category.slug}/`)}
                className="group flex gap-5 bg-white p-5 transition-colors hover:bg-[var(--color-surface-alt)] md:p-6"
              >
                <div className="w-28 shrink-0 md:w-32">
                  {category.image?.src ? (
                    <Photo src={category.image.src} alt={category.name} aspect="1 / 1" />
                  ) : (
                    <div className="aspect-square bg-[var(--color-surface-alt)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[17px]">{category.name}</p>
                  <p className="latin mt-1 text-[12px] text-[var(--color-ink-3)]">
                    {countInCategory(category.slug)} models
                  </p>
                  {category.children.length ? (
                    <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-2)]">
                      {category.children.map((child) => child.name).join(" · ")}
                    </p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </>
  );
}
