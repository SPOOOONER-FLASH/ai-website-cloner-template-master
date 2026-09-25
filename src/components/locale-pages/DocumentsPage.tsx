import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { DocumentInventory } from "@/components/site/DocumentInventory";
import type { Locale } from "@/data/locales";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

export function documentsMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/documents",
    "Documents We Can Supply",
    "Dimensioned drawings, specification tables, the catalog and test documents — what is published today, what we send on request, and the two things we do not have.",
  );
}

export function DocumentsPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-64">
      <div className="layout space-y-48 lg:space-y-64">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: tx(locale, "Home"), href: p("/") }, { label: tx(locale, "Documents") }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <h1 className="mt-16 text-h1 text-ink">
              {tx(locale, "Door hardware documents. What we can send you, and what we cannot.")}
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              {tx(
                locale,
                "People arrive here looking for a file rather than a product: a cutsheet for a lock, a DWG, a BIM object, a ficha técnica. This page is the honest inventory, in the order of how much of it exists.",
              )}
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {tx(
                locale,
                "Saying which is which is more useful than a download page that promises everything. Where something does not exist, it says so on this page rather than in a reply three days later.",
              )}
            </p>
          </div>
        </section>
        <DocumentInventory locale={locale} />
      </div>
    </main>
  );
}
