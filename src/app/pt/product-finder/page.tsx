import type { Metadata } from "next";
import { toFinderProduct } from "@/lib/product-finder";

import { ProductFinderClient } from "@/components/site/ProductFinderClient";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FinderModeSwitch } from "@/components/site/FinderModeSwitch";
import { ConfiguratorTeaser } from "@/components/site/ConfiguratorTeaser";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { publishedProducts } from "@/data/products";
import { getTopLevelCategories } from "@/data/categories";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * The Portuguese mirror of /product-finder/.
 *
 * It renders the SAME component with `locale="pt"`, not a translated copy — a second
 * implementation drifts the first time a facet is added, and the drift is visible only to
 * somebody reading Portuguese.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/product-finder",
  locale: "pt",
  title: `Localizador de produtos — ${publishedProducts.length} modelos de ferragem`,
  description:
    "Filtre o catálogo da Canton Hyland por categoria, série, material, acabamento, tipo de porta e certificação para montar uma planilha de ferragens.",
});

/** slug -> nome, para que as facetas se leiam como rótulos e não como slugs. */
function categoryNameMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const category of getTopLevelCategories()) {
    map[category.slug] = category.namePt ?? category.name;
    for (const child of category.children ?? []) map[child.slug] = child.namePt ?? child.name;
  }
  return map;
}

export default function LocalizadorDeProdutosPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/pt/") },
          { name: "Produtos", url: absoluteUrl("/pt/products/") },
          { name: "Localizador de produtos", url: absoluteUrl("/pt/product-finder/") },
        ])}
      />

      {/*
        The results grid is client-rendered, so the built HTML carries the catalogue as
        data but not one crawlable product link. This ItemList is what tells a crawler
        what the page indexes — categories, not every model, because the category pages
        are the crawl path.
      */}
      <JsonLd
        data={itemListSchema(
          "Categorias de produto da Canton Hyland",
          getTopLevelCategories().map((category) => absoluteUrl(`/pt/products/${category.slug}/`)),
        )}
      />

      {/* Two columns from xl up, same as the English route — see ConfiguratorTeaser. */}
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: "Produtos", href: "/pt/products" },
                { label: "Localizador de produtos" },
              ]}
            />
          </div>
          <div className="col-span-full xl:col-span-13">
            <h1 className="text-h1 text-ink">Localizador de produtos</h1>
            <div className="mt-24">
              <FinderModeSwitch active="catalogue" locale="pt" />
            </div>
            <p className="mt-24 max-w-[68ch] text-c1 text-ink-secondary">
              Pesquise do jeito que você já monta uma planilha de portas: por categoria, material, acabamento e tipo de porta. A sua seleção fica no link, então um colega abre exatamente a mesma lista.
            </p>
            {/*
              Honest scope note, same as the English route: most records carry no dimensional
              data yet, so there is no size or backset filter. Those facets appear on their
              own once the spec tables are filled — buildFacets derives its options from the
              data rather than from a hard-coded list.
            */}
            <p className="mt-12 max-w-[68ch] text-c2 text-ink-tertiary">
              Mostrando {publishedProducts.length} produtos publicados. Os filtros por distância ao eixo, entre-eixos e espessura de porta chegam com o catálogo técnico completo; até lá, cada ficha mostra as medidas que tem.
            </p>
          </div>
          <div className="col-span-full xl:col-span-9 xl:col-start-16">
            <ConfiguratorTeaser locale="pt" />
          </div>
        </div>
      </div>

      <div className="layout mt-48">
        <ProductFinderClient
          products={publishedProducts.map(toFinderProduct)}
          categoryNames={categoryNameMap()}
          locale="pt"
        />
      </div>

      <div className="layout mt-48">
        <div className="col-content grid w-full grid-cols gap-x">
          <ProductIndexList
            products={publishedProducts}
            label={`Os ${publishedProducts.length} modelos`}
            locale="pt"
          />
        </div>
      </div>
    </main>
  );
}
