import type { Metadata } from "next";
import { ConfiguratorIntro } from "@/components/site/ConfiguratorIntro";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ConfiguratorClient } from "@/components/site/ConfiguratorClient";
import { HardwareGlossary } from "@/components/site/HardwareGlossary";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import type { Locale } from "@/data/locales";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { tx } from "@/lib/i18n";
import { toFinderProduct } from "@/lib/product-finder";
import { localeMetadata, prefixer } from "./shared";

export function configuratorMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/configurator",
    "Configurator — Find the Right Model",
    "Answer a few questions about the door and we narrow the catalog to the models that fit. Material, door type and finish, ending at a model number you can quote.",
  );
}

export function ConfiguratorPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  const products = publishedProducts.map(toFinderProduct);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name: tx(locale, "Configurator"), url: absoluteUrl(p("/configurator")) },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="configurator-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: tx(locale, "Home"), href: p("/") },
                  { label: tx(locale, "Products"), href: p("/products") },
                  { label: tx(locale, "Configurator") },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-12">
              <h1 id="configurator-title" className="text-h1 text-ink">
                {tx(locale, "Find the right model")}
              </h1>
            </div>
            <div className="col-span-full xl:col-span-10 xl:col-start-15">
              <ConfiguratorIntro locale={locale} />
            </div>
          </div>
        </section>
        <section className="layout mt-64 lg:mt-96" aria-label={tx(locale, "Guided selection")}>
          <div className="col-content">
            {/* ssr: false and NOT inside Suspense — see ConfiguratorClient for why. */}
            <ConfiguratorClient products={products} locale={locale} />
          </div>
        </section>
        <HardwareGlossary locale={locale} />
      </main>
    </>
  );
}
