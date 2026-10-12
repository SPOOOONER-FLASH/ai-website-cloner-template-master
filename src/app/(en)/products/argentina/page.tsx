import type { Metadata } from "next";
import { ArgentinaCollection } from "@/components/site/ArgentinaCollection";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

// Preview, not launched (638f1ffa46b): withheld until the client approves it, so the release audit
// does not treat it as a public page with eight missing language versions.
export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/products/argentina",
    locale: "en",
    title: "HYDE Argentina Collection — Mortise Locks and Deadlocks",
    description:
      "Mortise locks, deadlocks and narrow-stile locks made on HYDE molds for Argentine distributors, with faceplate and case dimensions for every model.",
  }),
  robots: { index: false, follow: true },
  other: { "canton-withheld": "preview-not-launched" },
};

export default function ArgentinaCollectionPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout mb-48 lg:mb-96">
        <div className="col-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }, { label: "Argentina" }]} />
        </div>
      </div>
      <ArgentinaCollection lang="en" />
    </main>
  );
}
