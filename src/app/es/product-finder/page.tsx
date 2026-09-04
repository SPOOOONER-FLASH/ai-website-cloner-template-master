import type { Metadata } from "next";
import { toFinderProduct } from "@/lib/product-finder";

import { ProductFinderClient } from "@/components/site/ProductFinderClient";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FinderModeSwitch } from "@/components/site/FinderModeSwitch";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * The Spanish mirror of /product-finder/.
 *
 * It renders the SAME ProductFinder component with `locale="es"`, not a translated copy
 * of it. A second implementation would drift the first time a facet was added, and the
 * drift would only be visible to somebody reading Spanish — which is to say, not to
 * anybody working on this repository.
 *
 * Sub-category names come from `nameEs` on the taxonomy where one exists, so a facet
 * reads "Barras antipánico" rather than the English label under a Spanish heading.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/product-finder",
  locale: "es",
  title: `Buscador de productos — ${products.length} modelos de herrajes`,
  description:
    "Filtre el catálogo de Canton Hyland por categoría, serie, material, acabado, tipo de puerta y certificación para armar una relación de herrajes.",
});

/** slug -> nombre, para que las facetas se lean como etiquetas y no como slugs. */
function categoryNameMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const category of categories) {
    map[category.slug] = category.nameEs ?? category.name;
    for (const child of category.children ?? []) map[child.slug] = child.nameEs ?? child.name;
  }
  return map;
}

export default function BuscadorDeProductosPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
          { name: "Buscador de productos", url: absoluteUrl("/es/product-finder/") },
        ])}
      />

      {/*
        The results grid is client-rendered, so the built HTML carries the catalogue as
        data but not one crawlable product link. This ItemList is what tells a crawler
        what the page indexes — categories, not all 435 models, because the category
        pages are the crawl path and a 435-entry list would cost every load ~60 KB.
      */}
      <JsonLd
        data={itemListSchema(
          "Categorías de producto de Canton Hyland",
          categories.map((category) => absoluteUrl(`/es/products/${category.slug}/`)),
        )}
      />

      <div className="layout">
        <div className="col-content">
          <Breadcrumbs
            items={[
              { label: "Productos", href: "/es/products" },
              { label: "Buscador de productos" },
            ]}
          />
          <h1 className="mt-24 text-h1 text-ink">Buscador de productos</h1>
          <div className="mt-24">
            <FinderModeSwitch active="catalogue" locale="es" />
          </div>
          <p className="mt-24 max-w-[68ch] text-c1 text-ink-secondary">
            Acote el catálogo por los atributos que aparecen en una relación de herrajes.
            Los filtros se combinan, los recuentos se actualizan sobre la marcha, y la
            barra de direcciones conserva su selección para que pueda enviarla a un
            colega.
          </p>
          {/*
            Honest scope note, same as the English route: most records carry no
            dimensional data yet, so there is no size or backset filter. Those facets
            appear on their own once the spec tables are filled — buildFacets derives its
            options from the data rather than from a hard-coded list.
          */}
          <p className="mt-12 max-w-[68ch] text-c2 text-ink-tertiary">
            Mostrando {products.length} productos publicados. Los filtros dimensionales
            (distancia al eje, entre-ejes, espesor de puerta) llegan con el catálogo
            técnico completo.
          </p>
        </div>
      </div>

      <div className="layout mt-48">
        <ProductFinderClient
          products={products.map(toFinderProduct)}
          categoryNames={categoryNameMap()}
          locale="es"
        />
      </div>

      <div className="layout mt-48">
        <div className="col-content grid w-full grid-cols gap-x">
          <ProductIndexList
            products={products}
            label={`Los ${products.length} modelos`}
            locale="es"
          />
        </div>
      </div>
    </main>
  );
}
