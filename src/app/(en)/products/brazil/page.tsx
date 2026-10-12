import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BrazilCollection } from "@/components/site/brazil/BrazilCollection";
import { pageMetadata } from "@/lib/seo";

// The Brazil panic-bar collection (client 2026-10-12). English and Portuguese only: see PARTIAL_ROUTES.
// OFFLINE until the client approves the page and the stamped customer marks are retouched out:
// not indexed, not in the sitemap, linked from nowhere.
export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/products/brazil",
    locale: "en",
    title: "Panic Bars for Brazil — Single and Double Doors, Outside Levers",
    description:
      "Panic bars made in HYDE's own molds for the Brazilian market: single and double doors, side latch or top-and-bottom rods, with or without an outside lever.",
  }),
  robots: { index: false, follow: false },
};

export default function BrazilCollectionPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }, { label: "Brazil" }]} />
        </div>
      </div>
      <BrazilCollection lang="en" />
    </main>
  );
}
