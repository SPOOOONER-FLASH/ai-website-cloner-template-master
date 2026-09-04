import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ConfiguratorClient } from "@/components/site/ConfiguratorClient";
import { HardwareGlossary } from "@/components/site/HardwareGlossary";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { toFinderProduct } from "@/lib/product-finder";
import { pageMetadata } from "@/lib/seo";

/** The Spanish mirror of /configurator/. See the English route for the reasoning. */

export const metadata: Metadata = pageMetadata({
  enPath: "/configurator",
  locale: "es",
  title: "Configurador — Encuentre el modelo",
  description:
    "Responda unas preguntas sobre la puerta y reducimos el catálogo a los modelos que encajan. Material, tipo de puerta y acabado, hasta un número de modelo cotizable.",
});

export default function ConfiguradorPage() {
  const products = publishedProducts.map(toFinderProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
          { name: "Configurador", url: absoluteUrl("/es/configurator/") },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="configurator-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Inicio", href: "/es/" },
                  { label: "Productos", href: "/es/products/" },
                  { label: "Configurador" },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-12">
              <h1 id="configurator-title" className="text-h1 text-ink">
                Encuentre el modelo
              </h1>
            </div>
            <div className="col-span-full xl:col-span-10 xl:col-start-15">
              <p className="text-lead text-ink">
                Unas preguntas sobre la puerta y el catálogo se reduce a los modelos que
                encajan. Toda opción que se muestra lleva a algún sitio — no es posible
                llegar a un resultado vacío.
              </p>
              <p className="mt-16 text-c2 text-ink-secondary">
                ¿Ya sabe lo que necesita?{" "}
                <Link
                  href="/es/products/"
                  className="short-marker short-marker-compact text-brand hover:text-brand-hover"
                >
                  Ver el catálogo completo
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="layout mt-64 lg:mt-96" aria-label="Selección guiada">
          <div className="col-content">
            {/*
              Loaded with ssr: false, NOT wrapped in Suspense.

              It was in a Suspense boundary until 2026-09-04 and the fallback never
              resolved: under `output: "export"` there is no server to stream the boundary
              from, so "Cargando el catálogo…" was the whole page in production for as
              long as the route existed. See ConfiguratorClient for the full account.
            */}
            <ConfiguratorClient products={products} locale="es" />
          </div>
        </section>

        <HardwareGlossary locale="es" />
      </main>
    </>
  );
}
