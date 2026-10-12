import type { Metadata } from "next";
import { BrazilCollectionB } from "@/components/site/brazil/BrazilCollectionB";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

// Design proposal B for the client to choose from (2026-10-12). Not linked, not indexed, not in the sitemap.
export const metadata: Metadata = { title: "Brazil panic bars — proposal B", robots: { index: false, follow: false } };

export default function BrazilPreviewBPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }, { label: "Brazil" }]} />
        </div>
      </div>
      <BrazilCollectionB lang="en" />
    </main>
  );
}
