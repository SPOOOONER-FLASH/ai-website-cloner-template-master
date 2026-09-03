import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory, products } from "@/data/products";
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
  locale: "es",
  title: "Productos — Catálogo de herrajes para puertas",
  description:
    "Cerraduras de embutir, manijas, herrajes para vidrio, barras antipánico, cilindros y accesorios — el catálogo completo de Canton Hyland.",
});

export default function ProductosPage() {
  const categories = getTopLevelCategories();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Categorías de producto de Canton Hyland",
          categories.map((category) => absoluteUrl(`/es/products/${category.slug}/`)),
        )}
      />

      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <div className="layout">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full mb-24">
              <Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: "Productos" }]} />
            </div>
            <div className="col-span-full xl:col-span-10">
              <p className="text-c1 text-ink-secondary">Colección Canton</p>
              <h1 className="mt-8 text-h1 text-ink">
                Cerraduras y herrajes arquitectónicos para puertas
              </h1>
            </div>
            <div className="col-span-full xl:col-span-7 xl:col-start-12">
              <h2 className="text-h3 text-ink">
                Un solo fabricante para todo el herraje de una puerta.
              </h2>
              <p className="mt-24 text-c1 text-ink-secondary">
                Canton Hyland fabrica cerraduras y herrajes para proyectos comerciales y
                residenciales, con desarrollo OEM para formas y mecanismos nuevos.
              </p>
            </div>
          </div>
        </div>

        <section className="layout mt-96 lg:mt-144" aria-labelledby="categorias">
          <div className="col-content grid w-full grid-cols gap-x gap-y-42">
            <div className="col-span-full flex items-end justify-between gap-24 border-b border-line pb-16">
              <h2 id="categorias" className="text-h3 text-ink">
                Categorías de producto
              </h2>
              <p className="text-c2 text-ink-secondary">
                {categories.length} categorías · {products.length} fichas verificadas
              </p>
            </div>
            {categories.map((category, index) => (
              <CategoryCard
                key={category.slug}
                category={category}
                index={index}
                productCount={getProductsByCategory(category.slug).length}
                locale="es"
              />
            ))}
          </div>
        </section>

        {/*
          Mirrors the English catalogue index. The comparison pages had exactly one
          inbound link each — from the spec table at the bottom of their own category
          page — which is how a page ends up crawled but never ranked. Fifteen links from
          the page a buyer lands on fixes that and gives the reader somewhere obvious to
          go when they are choosing between models rather than browsing.
        */}
        <section className="layout mt-96 lg:mt-136" aria-labelledby="comparar">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full flex items-end justify-between gap-24 border-b border-line pb-16">
              <h2 id="comparar" className="text-h3 text-ink">
                Comparar modelos en paralelo
              </h2>
              <p className="text-c2 text-ink-secondary">Una tabla por categoría</p>
            </div>
            <div className="col-span-full">
              <p className="max-w-[68ch] text-c1 text-ink-secondary">
                Todos los modelos de una gama, una fila cada uno, con las especificaciones
                que los distinguen — distancia al eje, entrepuntos, espesor de puerta,
                acabado.
              </p>
              <ul className="mt-24 grid grid-cols-1 gap-x-24 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {categories
                  .filter((category) => getProductsByCategory(category.slug).length >= 3)
                  .map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/es/compare/${category.slug}/`}
                        className="short-marker short-marker-compact text-c1 text-ink hover:text-brand-hover"
                      >
                        Comparar {(category.nameEs ?? category.name).toLowerCase()}
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
              <p className="text-c1 text-ink-secondary">Encuentre el modelo</p>
              <h2 id="consulta" className="mt-8 text-h1 text-ink">
                {products.length} modelos. Dígannos qué dice el plano.
              </h2>
              <p className="mt-24 max-w-[54ch] text-c1 text-ink-secondary">
                Si tiene una planilla de herrajes, envíela: le respondemos qué juegos
                podemos completar, cuáles quedan a falta de una pieza y cuáles no
                fabricamos. Es más rápido que cotizar línea por línea.
              </p>
              {/* Mirrors the English catalogue index — the configurator's only inbound
                  link on this side, and the reason it is not an orphan page. */}
              <p className="mt-24 max-w-[54ch] text-c1 text-ink-secondary">
                ¿No sabe por qué atributo filtrar? El{" "}
                <Link
                  href="/es/configurator/"
                  className="short-marker short-marker-compact text-brand hover:text-brand-hover"
                >
                  configurador guiado
                </Link>{" "}
                pregunta de una en una y nunca ofrece una opción que no lleve a ningún
                sitio.
              </p>
              <div className="mt-32 flex flex-wrap items-center gap-24">
                <Link href="/es/contact/" className="text-c1 text-brand hover:text-brand-hover">
                  Escribir al equipo de exportación
                </Link>
                <Link
                  href="/es/configurator/"
                  className="text-c1 text-brand hover:text-brand-hover"
                >
                  Abrir el configurador
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="layout mt-96">
          <div className="col-content grid w-full grid-cols gap-x">
            <ProductIndexList
              products={products}
              label={`Los ${products.length} modelos`}
              locale="es"
            />
          </div>
        </section>
      </main>
    </>
  );
}
