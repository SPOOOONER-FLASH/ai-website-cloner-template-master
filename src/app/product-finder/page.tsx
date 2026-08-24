import type { Metadata } from "next";

import { ProductFinderClient } from "@/components/site/ProductFinderClient";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/product-finder",
  locale: "en",
  // The count comes from the catalogue rather than being typed in, so the title cannot
  // go stale as products are added. This page is what ranks for attribute searches
  // ("stainless steel panic bar 1000mm") rather than for a model number.
  title: `Product Finder — ${products.length} Door Hardware Models`,
  description:
    "Filter the Canton Hyland catalogue by category, series, material, finish, door type and certification to build a hardware schedule.",
});

/** slug -> display name for every category and sub-category, so facets read as labels. */
function categoryNameMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const category of categories) {
    map[category.slug] = category.name;
    for (const child of category.children ?? []) map[child.slug] = child.name;
  }
  return map;
}

export default function ProductFinderPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: "Product Finder", url: absoluteUrl("/product-finder/") },
        ])}
      />

      {/*
        The results grid is rendered by a client component, so the built HTML carries the
        catalogue as serialised data but not one crawlable product link. This ItemList is
        what tells a crawler — and an answer engine — what the page actually indexes.
        Categories rather than all 431 products: the category pages are the crawl path to
        individual models, and a 431-entry list would add ~60 KB to every load.
      */}
      <JsonLd
        data={itemListSchema(
          "Canton Hyland product categories",
          categories.map((category) => absoluteUrl(`/products/${category.slug}/`)),
        )}
      />

      <div className="layout">
        <div className="col-content">
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              { label: "Product Finder" },
            ]}
          />
          <h1 className="mt-24 text-h1 text-ink">Product Finder</h1>
          <p className="mt-16 max-w-[68ch] text-c1 text-ink-secondary">
            Narrow the catalogue by the attributes that appear on a hardware schedule.
            Filters combine, counts update as you go, and the address bar keeps your
            selection so you can send it to a colleague.
          </p>
          {/*
            Honest scope note. The catalogue here is a subset and most records have no
            dimensional data yet, so there is no size or backset filter. Those facets
            appear on their own once the spec tables are populated — buildFacets derives
            options from the data rather than from a hard-coded list.
          */}
          <p className="mt-12 max-w-[68ch] text-c2 text-ink-tertiary">
            Showing {products.length} published products. Dimensional filters (backset,
            centre distance, door thickness) arrive with the full technical catalogue.
          </p>
        </div>
      </div>

      <div className="layout mt-48">
        <ProductFinderClient products={products} categoryNames={categoryNameMap()} />
      </div>
    </main>
  );
}
