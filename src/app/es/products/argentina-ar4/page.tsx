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
  locale: "es",
  title: "Colección de cerraduras HYDE Argentina AR-4",
  description:
    "Cuatro cerraduras de embutir HYDE para distribuidores del mercado argentino, marcas privadas y consultas OEM.",
  image: "/images/editorial/argentina-ar4-entry.webp",
  imageAlt: "Colección de cerraduras HYDE Argentina AR-4",
});

export default function ArgentinaAr4SpanishPage() {
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
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/products/") },
          { name: "HYDE Argentina AR-4", url: absoluteUrl("/es/products/argentina-ar4/") },
        ])}
      />

      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/es/" },
              { label: "Productos", href: "/products/" },
              { label: "HYDE Argentina AR-4" },
            ]}
          />
        </div>
      </div>

      <ArgentinaAr4Showcase locale="es" pageHeading />
    </main>
  );
}
