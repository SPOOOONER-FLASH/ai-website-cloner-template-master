import type { Metadata } from "next";
import Link from "next/link";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { ProductsEditorialOverview } from "@/components/site/ProductsEditorialOverview";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory, publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * The Spanish catalogue index.
 *
 * This route also closes a hole rather than only adding a page: /es/products/ was
 * returning 403 because the directory existed (for /es/products/argentina-ar4/) with no
 * index of its own and nginx has autoindex off. Nothing linked it, but a crawler walking
 * up from the Argentina page would hit it, and a 403 is a worse signal than a 404.
 */
export const metadata: Metadata = pageMetadata({
  enPath: "/products",
  locale: "pt",
  title: "Produtos — Catálogo de ferragens para portas",
  description:
    "Fechaduras de embutir, maçanetas, ferragens para vidro, barras antipânico, cilindros e acessórios — o catálogo completo da Canton Hyland.",
});

export default function ProdutosPagePt() {
  const categories = getTopLevelCategories();
  const categoryCounts = Object.fromEntries(
    categories.map((category) => [category.slug, getProductsByCategory(category.slug).length]),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/pt/") },
          { name: "Produtos", url: absoluteUrl("/pt/products/") },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Categorias de produto da Canton Hyland",
          categories.map((category) => absoluteUrl(`/pt/products/${category.slug}/`)),
        )}
      />

      <main className="isolate mt-32 flex-grow justify-self-start lg:mt-64">
        <ProductsEditorialOverview
          locale="pt"
          totalProducts={publishedProducts.length}
          categoryCounts={categoryCounts}
        />
        <div className="layout mt-48">
          <Link href="/product-studies/" className="col-content short-marker short-marker-compact text-c1 text-ink">
            Ferragens em detalhe — fotografias e selecção de componentes
          </Link>
        </div>

        {/*
          Mirrors the English catalogue index. The comparison pages had exactly one
          inbound link each — from the spec table at the bottom of their own category
          page — which is how a page ends up crawled but never ranked. Fifteen links from
          the page a buyer lands on fixes that and gives the reader somewhere obvious to
          go when they are choosing between models rather than browsing.
        */}
        <section className="layout mt-128 lg:mt-176" aria-labelledby="comparar">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full flex items-end justify-between gap-24 border-b border-line pb-16">
              <h2 id="comparar" className="text-h3 text-ink">
                Comparar modelos en paralelo
              </h2>
              <p className="text-c2 text-ink-secondary">Uma tabela por categoria</p>
            </div>
            <div className="col-span-full">
              <p className="max-w-[68ch] text-c1 text-ink-secondary">
                Todos los modelos de una gama, una fila cada uno, con las especificaciones
                que los distinguen —distancia al eje, entrepuntos, espesor de puerta,
                acabado. </p>
              <ul className="mt-24 grid grid-cols-1 gap-x-24 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {categories
                  .filter((category) => getProductsByCategory(category.slug).length >= 3)
                  .map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/pt/compare/${category.slug}/`}
                        className="short-marker short-marker-compact text-c1 text-ink hover:text-brand-hover"
                      >
                        Comparar {(category.namePt ?? category.name).toLowerCase()}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="layout mt-144 lg:mt-192" aria-labelledby="consulta">
          <div className="col-content grid w-full grid-cols gap-x gap-y-48">
            <div className="col-span-full border-t border-line pt-48 xl:col-span-13">
              <p className="text-c1 text-ink-secondary">Encontre o modelo</p>
              <h2 id="consulta" className="mt-8 text-h1 text-ink">
                {publishedProducts.length} modelos. Diga-nos o que diz o desenho.
              </h2>
              <p className="mt-24 max-w-[54ch] text-c1 text-ink-secondary">
                Se tem um quadro de ferragens, envie-o: respondemos que conjuntos
                conseguimos completar, quais ficam à espera de uma peça e quais não
                fabricamos. É mais rápido do que orçamentar linha a linha.
              </p>
              {/* Mirrors the English catalogue index — the configurator's only inbound
                  link on this side, and the reason it is not an orphan page. */}
              <p className="mt-24 max-w-[54ch] text-c1 text-ink-secondary">
                ¿No sabe por qué atributo filtrar? El{" "}
                <Link
                  href="/configurator/"
                  className="short-marker short-marker-compact text-brand hover:text-brand-hover"
                >
                  configurador guiado
                </Link>{" "}
                pregunta de una en una y nunca ofrece una opción que no lleve a ningún
                sitio.
              </p>
              <div className="mt-32 flex flex-wrap items-center gap-24">
                <Link href="/pt/contact/" className="text-c1 text-brand hover:text-brand-hover">
                  Escrever à equipa de exportação
                </Link>
                <Link
                  href="/configurator/"
                  className="text-c1 text-brand hover:text-brand-hover"
                >
                  Abrir o configurador
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="layout mt-96">
          <div className="col-content grid w-full grid-cols gap-x">
            <ProductIndexList
              products={publishedProducts}
              label={`Los ${publishedProducts.length} modelos`}
              locale="pt"
            />
          </div>
        </section>
      </main>
    </>
  );
}
