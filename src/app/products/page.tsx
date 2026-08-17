import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { ProductCategoryRail } from "@/components/site/ProductCategoryRail";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory, products } from "@/data/products";

export const metadata: Metadata = pageMetadata({
  enPath: "/products",
  locale: "en",
  title: "Products",
  description:
    "Mortise locks, lever handles, glass door fittings, panic exit devices, cylinders and accessories — the full Canton Hyland catalogue.",
});

export default function ProductsPage() {
  const categories = getTopLevelCategories();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
          </div>
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Canton Product Collection</p>
            <h1 className="mt-8 text-h1 text-ink">Door locks and architectural hardware</h1>
          </div>
          <div className="col-span-full xl:col-span-7 xl:col-start-12">
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
          <div className="col-span-full mt-24 xl:col-span-5 xl:col-start-20 xl:mt-0">
            <ProductCategoryRail categories={categories} />
          </div>
        </div>
      </div>

      <section className="layout mt-96 lg:mt-144" aria-label="Featured hardware applications">
        <div className="col-outset grid gap-16 px-outset md:grid-cols-2 md:px-0">
          <Link href="/products/panic-exit-devices/" className="group block">
            <MediaPlaceholder
              src="/images/company/hero-panic-exit-banner.webp"
              ratio="1024 / 397"
              label="Panic exit hardware installed in a commercial interior"
            />
            <span className="mt-16 block text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
              Panic exit devices — fast release for emergency doors
            </span>
          </Link>
          <Link href="/products/lever-handles/" className="group block">
            <MediaPlaceholder
              src="/images/company/hero-grip-handle-banner.webp"
              ratio="1024 / 397"
              label="Lever and grip handle sets installed on timber doors"
            />
            <span className="mt-16 block text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
              Lever and grip handle systems
            </span>
          </Link>
        </div>
      </section>

      <section className="layout mt-144 lg:mt-192" aria-labelledby="category-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-42">
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

      {/*
        The full index, FSB-style: every product on one page, grouped by category.
        Category cards tell you what exists; this tells you what you can actually order,
        and it is the page a specifier scrolls when they do not yet know the model number.
        Empty categories are skipped rather than rendered as an empty heading.
      */}
      <section className="layout mt-144 lg:mt-192" aria-labelledby="all-products-heading">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full flex flex-wrap items-end justify-between gap-24 border-b border-line pb-16">
            <h2 id="all-products-heading" className="text-h3 text-ink">
              All products
            </h2>
            <p className="text-c2 text-ink-secondary">
              {products.length} products ·{" "}
              <Link
                href="/product-finder/"
                className="text-brand underline-offset-4 hover:text-brand-hover hover:underline"
              >
                filter by material, finish and door type
              </Link>
            </p>
          </div>

          {categories.map((category) => {
            const items = getProductsByCategory(category.slug);
            if (!items.length) return null;

            return (
              <div key={category.slug} className="col-span-full">
                <div className="flex flex-wrap items-baseline justify-between gap-16">
                  <h3 className="text-h3 text-ink">
                    <Link
                      href={`/products/${category.slug}/`}
                      className="underline-offset-4 hover:text-brand-hover hover:underline"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <span className="text-c2 text-ink-tertiary">
                    {items.length} {items.length === 1 ? "product" : "products"}
                  </span>
                </div>

                <ul className="mt-24 grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-4">
                  {items.map((product) => (
                    <li key={product.slug}>
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
