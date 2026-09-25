import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/site/Button";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { ProductsEditorialOverview } from "@/components/site/ProductsEditorialOverview";
import { getTopLevelCategories } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { getProductsByCategory, publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { t, tx } from "@/lib/i18n";
import { localeMetadata, lower, prefixer } from "./shared";

export function productsIndexMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/products",
    "Products — Door Hardware Catalog",
    "Mortise locks, lever handles, glass door fittings, panic exit devices, cylinders and accessories — the full Canton Hyland catalog.",
  );
}

export function ProductsIndexPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  const categories = getTopLevelCategories();
  const categoryCounts = Object.fromEntries(
    categories.map((category) => [category.slug, getProductsByCategory(category.slug).length]),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          tx(locale, "Canton Hyland product categories"),
          categories.map((category) => absoluteUrl(p(`/products/${category.slug}`))),
        )}
      />
      <main className="isolate mt-32 flex-grow justify-self-start lg:mt-64">
        <ProductsEditorialOverview locale={locale} totalProducts={publishedProducts.length} categoryCounts={categoryCounts} />
        <div className="layout mt-48">
          <Link href={p("/product-studies")} className="col-content short-marker short-marker-compact text-c1 text-ink">
            {tx(locale, "Hardware in focus — explore product photographs and component selections")}
          </Link>
        </div>
        <section className="layout mt-128 lg:mt-176" aria-labelledby="compare-index-heading">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full flex items-end justify-between gap-24 border-b border-line pb-16">
              <h2 id="compare-index-heading" className="text-h3 text-ink">
                {tx(locale, "Compare models side by side")}
              </h2>
              <p className="text-c2 text-ink-secondary">{tx(locale, "One table per category")}</p>
            </div>
            <div className="col-span-full">
              <p className="max-w-[68ch] text-c1 text-ink-secondary">
                {tx(locale, "Every model in a range on one row each, across the specifications that differ between them — backset, center distance, door thickness, finish.")}
              </p>
              <ul className="mt-24 grid grid-cols-1 gap-x-24 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {categories
                  .filter((category) => getProductsByCategory(category.slug).length >= 3)
                  .map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={p(`/compare/${category.slug}`)}
                        className="short-marker short-marker-compact text-c1 text-ink hover:text-brand-hover"
                      >
                        {tx(locale, "Compare {name}").replace("{name}", lower(t(category, "name", locale), locale))}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="layout mt-144 lg:mt-192" aria-labelledby="finder-gateway-heading">
          <div className="col-content grid w-full grid-cols gap-x gap-y-48">
            <div className="col-span-full border-t border-line pt-48 xl:col-span-13">
              <p className="text-c1 text-ink-secondary">{tx(locale, "Find the right model")}</p>
              <h2 id="finder-gateway-heading" className="mt-8 text-h1 text-ink">
                {tx(locale, "{count} models. Narrow them by what is on your schedule.").replace("{count}", String(publishedProducts.length))}
              </h2>
              <p className="mt-24 max-w-[54ch] text-c1 text-ink-secondary">
                {tx(
                  locale,
                  "The Product Finder filters the full catalog by category, type, series, material, finish, door type and certification. Filters combine, counts update as you go, and the address bar keeps your selection — so a narrowed view can be pasted straight into an email to a colleague.",
                )}
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                {tx(locale, "Not sure which attributes to filter on? The guided configurator asks one question at a time and never offers a choice that leads nowhere.")}{" "}
                <Link href={p("/configurator")} className="short-marker short-marker-compact text-brand hover:text-brand-hover">
                  {tx(locale, "Open the guided configurator")}
                </Link>
              </p>
              <div className="mt-32 flex flex-wrap items-center gap-16">
                <Button href={p("/product-finder")}>{tx(locale, "Open the Product Finder")}</Button>
                <Button href={p("/configurator")} variant="secondary">
                  {tx(locale, "Guided selection")}
                </Button>
                <Button href={p("/contact")} variant="secondary">
                  {tx(locale, "Ask an export engineer")}
                </Button>
              </div>
            </div>
            <ProductIndexList
              products={publishedProducts}
              label={tx(locale, "All {count} models").replace("{count}", String(publishedProducts.length))}
              locale={locale}
            />
          </div>
        </section>
      </main>
    </>
  );
}
