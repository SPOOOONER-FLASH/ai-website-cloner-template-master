import type { Metadata } from "next";
import { ArgentinaAr4Showcase } from "@/components/site/ArgentinaAr4Showcase";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { getProductByModel } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

const models = ["AR4-110", "AR4-140", "AR4-101", "AR4-1121"];

export const metadata: Metadata = pageMetadata({
  enPath: "/products/argentina-ar4",
  locale: "en",
  title: "HYDE Argentina AR-4 Mortise Lock Collection",
  description:
    "Four HYDE mortise lock bodies selected for Argentina-market distributors, private-label programmes and OEM enquiries. Models AR4-110, AR4-140, AR4-101 and AR4-1121.",
  image: "/images/editorial/argentina-ar4-entry.webp",
  imageAlt: "HYDE Argentina AR-4 mortise lock collection",
});

export default function ArgentinaAr4Page() {
  const products = models
    .map((model) => getProductByModel(model))
    .filter((product) => product !== undefined);
  const urls = products.map((product) =>
    absoluteUrl(`/products/${product.categoryPath[0]}/${product.slug}/`),
  );

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd data={itemListSchema("HYDE Argentina AR-4", urls)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products/") },
          { name: "HYDE Argentina AR-4", url: absoluteUrl("/products/argentina-ar4/") },
        ])}
      />

      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products/" },
              { label: "HYDE Argentina AR-4" },
            ]}
          />
        </div>
      </div>

      <ArgentinaAr4Showcase pageHeading />
    </main>
  );
}
