import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BrazilCollection } from "@/components/site/brazil/BrazilCollection";
import { pageMetadata } from "@/lib/seo";

// English and Portuguese only: see PARTIAL_ROUTES. OFFLINE until the client approves (see the English page).
export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/products/brazil",
    locale: "pt",
    title: "Barras antipânico para o Brasil — portas de uma e duas folhas",
    description:
      "Barras antipânico feitas em moldes próprios da HYDE para o mercado brasileiro: uma ou duas folhas, trava lateral ou travamento vertical, com ou sem maçaneta externa.",
  }),
  robots: { index: false, follow: false },
};

export default function BrazilCollectionPortuguesePage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs items={[{ label: "Início", href: "/pt/" }, { label: "Produtos", href: "/pt/products/" }, { label: "Brasil" }]} />
        </div>
      </div>
      <BrazilCollection lang="pt" />
    </main>
  );
}
