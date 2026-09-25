import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ConfiguratorTeaser } from "@/components/site/ConfiguratorTeaser";
import { FinderModeSwitch } from "@/components/site/FinderModeSwitch";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { ProductFinderClient } from "@/components/site/ProductFinderClient";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { getTopLevelCategories } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { t, tx } from "@/lib/i18n";
import { toFinderProduct } from "@/lib/product-finder";
import { pageMetadata } from "@/lib/seo";
import { prefixer } from "./shared";

export function productFinderMetadata(locale: Locale): Metadata {
  return pageMetadata({
    enPath: "/product-finder",
    locale,
    title: tx(locale, "Product Finder — {count} Door Hardware Models").replace("{count}", String(publishedProducts.length)),
    description: tx(locale, "Filter the Canton Hyland catalog by category, series, material, finish, door type and certification to build a hardware schedule."),
  });
}

function categoryNameMap(locale: Locale): Record<string, string> {
  const map: Record<string, string> = {};
  for (const category of getTopLevelCategories()) {
    map[category.slug] = t(category, "name", locale);
    for (const child of category.children ?? []) map[child.slug] = t(child, "name", locale);
  }
  return map;
}

export function ProductFinderPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name: tx(locale, "Product Finder"), url: absoluteUrl(p("/product-finder")) },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          tx(locale, "Canton Hyland product categories"),
          getTopLevelCategories().map((category) => absoluteUrl(p(`/products/${category.slug}`))),
        )}
      />
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: tx(locale, "Products"), href: p("/products") }, { label: tx(locale, "Product Finder") }]} />
          </div>
          <div className="col-span-full xl:col-span-13">
            <h1 className="text-h1 text-ink">{tx(locale, "Product Finder")}</h1>
            <div className="mt-24">
              <FinderModeSwitch active="catalogue" locale={locale} />
            </div>
            <p className="mt-24 max-w-[68ch] text-c1 text-ink-secondary">
              {tx(locale, "Search the way you already write a door schedule: by category, material, finish and door type. Your selection stays in the link, so a colleague opens exactly the list you see.")}
            </p>
            <p className="mt-12 max-w-[68ch] text-c2 text-ink-tertiary">
              {tx(
                locale,
                "Showing {count} published products. Filters for backset, center distance and door thickness arrive with the full technical catalog; until then, each product page lists the figures it has.",
              ).replace("{count}", String(publishedProducts.length))}
            </p>
          </div>
          <div className="col-span-full xl:col-span-9 xl:col-start-16">
            <ConfiguratorTeaser locale={locale} />
          </div>
        </div>
      </div>
      <div className="layout mt-48">
        <ProductFinderClient products={publishedProducts.map(toFinderProduct)} categoryNames={categoryNameMap(locale)} locale={locale} />
      </div>
      <div className="layout mt-48">
        <div className="col-content grid w-full grid-cols gap-x">
          <ProductIndexList
            products={publishedProducts}
            label={tx(locale, "All {count} models").replace("{count}", String(publishedProducts.length))}
            locale={locale}
          />
        </div>
      </div>
    </main>
  );
}
