import type { Metadata } from "next";
import { ConfiguratorIntro } from "@/components/site/ConfiguratorIntro";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ConfiguratorClient } from "@/components/site/ConfiguratorClient";
import { HardwareGlossary } from "@/components/site/HardwareGlossary";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { toFinderProduct } from "@/lib/product-finder";
import { pageMetadata } from "@/lib/seo";

/** The Portuguese mirror of /configurator/. See the English route for the reasoning. */

export const metadata: Metadata = pageMetadata({
  enPath: "/configurator",
  locale: "pt",
  title: "Configurador — Encontre o modelo",
  description:
    "Responda a algumas perguntas sobre a porta e reduzimos o catálogo aos modelos que servem. Material, tipo de porta e acabamento, até um número de modelo cotável.",
});

export default function ConfiguradorPage() {
  const products = publishedProducts.map(toFinderProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/pt/") },
          { name: "Produtos", url: absoluteUrl("/pt/products/") },
          { name: "Configurador", url: absoluteUrl("/pt/configurator/") },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="configurator-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Início", href: "/pt/" },
                  { label: "Produtos", href: "/pt/products/" },
                  { label: "Configurador" },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-12">
              <h1 id="configurator-title" className="text-h1 text-ink">
                Encontre o modelo
              </h1>
            </div>
            <div className="col-span-full xl:col-span-10 xl:col-start-15">
              <ConfiguratorIntro locale="pt" />
            </div>
          </div>
        </section>

        <section className="layout mt-64 lg:mt-96" aria-label="Seleção guiada">
          <div className="col-content">
            {/* ssr: false and NOT inside Suspense — see the Spanish route and
                ConfiguratorClient for why the boundary never resolves under export. */}
            <ConfiguratorClient products={products} locale="pt" />
          </div>
        </section>

        <HardwareGlossary locale="pt" />
      </main>
    </>
  );
}
