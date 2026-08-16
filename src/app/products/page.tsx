import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { CategoryCard } from "@/components/site/CategoryCard";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory, products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products | Canton Hyland",
  description: "Mortise locks, lever handles, glass door fittings, panic exit devices, cylinders and accessories — the full Canton Hyland catalogue.",
};

export default function ProductsPage() {
  const categories = getTopLevelCategories();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x-42 gap-y-24">
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Product Collection</p>
            <h1 className="mt-8 text-h1 text-ink">Door locks and architectural hardware</h1>
          </div>
          <div className="col-span-full xl:col-span-12 xl:col-start-13">
            <h2 className="text-h3 text-ink">One manufacturer, a complete door-hardware schedule.</h2>
            <p className="mt-24 text-c1 text-ink-secondary">
              Canton Hyland manufactures door locks and building hardware for commercial and
              residential projects, with OEM development available for new forms and mechanisms.
            </p>
            <div className="mt-32 flex flex-col items-start gap-12">
              <ArrowLink href="/contact/">Request the current catalogue</ArrowLink>
              <ArrowLink href="/downloads/">Service + Downloads</ArrowLink>
            </div>
          </div>
        </div>
      </div>

      <section className="layout mt-144 lg:mt-288" aria-labelledby="category-heading">
        <div className="col-content grid w-full grid-cols gap-x-42 gap-y-42">
          <div className="col-span-full flex items-end justify-between gap-24 border-b border-line pb-16">
            <h2 id="category-heading" className="text-h3 text-ink">Product categories</h2>
            <p className="text-c2 text-ink-secondary">
              {categories.length} categories · {products.length} verified product records
            </p>
          </div>
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={index}
              productCount={getProductsByCategory(category.slug).length}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
