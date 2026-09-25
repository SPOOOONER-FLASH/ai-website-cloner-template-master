import type { Metadata } from "next";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import type { Locale } from "@/data/locales";
import { getProductByModel } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

const models = ["AR4-110", "AR4-140", "AR4-101", "AR4-1121"];

export function argentinaAr4Metadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/products/argentina-ar4",
    "HYDE Argentina AR-4 Mortise Lock Collection",
    "Four HYDE mortise lock bodies selected for Argentina-market distributors, private-label programs and OEM inquiries. Models AR4-110, AR4-140, AR4-101 and AR4-1121.",
    { image: "/images/editorial/argentina-ar4-entry.webp", imageAlt: tx(locale, "HYDE Argentina AR-4 mortise lock collection") },
  );
}

/**
 * The AR-4 market collection. The home page links to it from every tree, so every tree
 * carries it; the Portuguese exception in src/lib/spanish-mirror.ts predates that and is
 * the copy session's to lift.
 */
export function ArgentinaAr4Page({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  const products = models.map((model) => getProductByModel(model)).filter((product) => product !== undefined);
  const urls = products.map((product) => absoluteUrl(p(`/products/${product.categoryPath[0]}/${product.slug}`)));

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd data={itemListSchema("HYDE Argentina AR-4", urls)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name: "HYDE Argentina AR-4", url: absoluteUrl(p("/products/argentina-ar4")) },
        ])}
      />
      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs
            items={[
              { label: tx(locale, "Home"), href: p("/") },
              { label: tx(locale, "Products"), href: p("/products") },
              { label: "HYDE Argentina AR-4" },
            ]}
          />
        </div>
      </div>
      <ArgentinaAr4Showcase locale={locale} pageHeading />
    </main>
  );
}
