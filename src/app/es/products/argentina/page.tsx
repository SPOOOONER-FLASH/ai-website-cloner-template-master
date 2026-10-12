import type { Metadata } from "next";
import { ArgentinaCollection } from "@/components/site/ArgentinaCollection";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

// Preview, not launched (638f1ffa46b): withheld until the client approves it, so the release audit
// does not treat it as a public page with eight missing language versions.
export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/products/argentina",
    locale: "es",
    title: "Colección HYDE Argentina — Cerraduras de embutir y cerrojos",
    description:
      "Cerraduras de embutir, cerrojos y cerraduras para batientes angostos fabricadas con matrices HYDE para distribuidores argentinos, con medidas de frente y caja de cada modelo.",
  }),
  robots: { index: false, follow: true },
  other: { "canton-withheld": "preview-not-launched" },
};

export default function ArgentinaCollectionSpanishPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: "Productos", href: "/es/products/" }, { label: "Argentina" }]} />
        </div>
      </div>
      <ArgentinaCollection lang="es" />
    </main>
  );
}
