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

/**
 * Guided selection — one question at a time, ending at a model.
 *
 * WHY THIS AND NOT JUST THE FINDER. The Finder is a filter for somebody who already
 * knows the vocabulary: seven facets, all at once, a grid underneath. Clarity shows the
 * other kind of visitor — paging through category listings, going back, paging again.
 * Asked "material?" cold they cannot answer; asked "what are you specifying?" and then
 * given the three materials that remain, they can answer every question in the sequence.
 *
 * The invariant is that no offered choice can lead to nothing, which a filter cannot
 * promise. src/lib/configurator.ts holds the rules and its test walks the real catalogue
 * to prove it.
 *
 * WHAT IS SHIPPED TO THE BROWSER. `toFinderProduct` narrows each record to the fourteen
 * fields the client actually needs — the same projection the Finder uses, and the reason
 * that page went from 1.29MB to 493KB. Passing `products` whole would send every spec
 * row and both languages of every summary for 360 products to answer five questions.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/configurator",
  locale: "en",
  title: "Configurator — Find the Right Model",
  description:
    "Answer a few questions about the door and we narrow the catalogue to the models that fit. Material, door type and finish, ending at a model number you can quote.",
});

export default function ConfiguratorPage() {
  const products = publishedProducts.map(toFinderProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: "Configurator", url: absoluteUrl("/configurator/") },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="configurator-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Products", href: "/products/" },
                  { label: "Configurator" },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-12">
              <h1 id="configurator-title" className="text-h1 text-ink">
                Find the right model
              </h1>
            </div>
            <div className="col-span-full xl:col-span-10 xl:col-start-15">
              <ConfiguratorIntro />
            </div>
          </div>
        </section>

        <section className="layout mt-64 lg:mt-96" aria-label="Guided selection">
          <div className="col-content">
            {/*
              Loaded with ssr: false, NOT wrapped in Suspense.

              It was in a Suspense boundary until 2026-09-04 and the fallback never
              resolved: under `output: "export"` there is no server to stream the boundary
              from, so "Loading the catalogue…" was the whole page in production for as long as
              the route existed. See ConfiguratorClient for the full account.
            */}
            <ConfiguratorClient products={products} />
          </div>
        </section>

        <HardwareGlossary />
      </main>
    </>
  );
}
