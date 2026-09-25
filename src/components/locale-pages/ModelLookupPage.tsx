import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ModelIndex } from "@/components/site/ModelIndex";
import { ModelLookup } from "@/components/site/ModelLookup";
import type { Locale } from "@/data/locales";
import { tx } from "@/lib/i18n";
import { modelIndex } from "@/lib/model-index";
import { notShownModels, renamedRecords } from "@/lib/superseded-models";
import { localeMetadata, prefixer } from "./shared";

export function modelLookupMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/model-lookup",
    "Model Number Lookup",
    "What happened to a Canton Hyland model number that no longer resolves: renamed records with their permanent redirects, retired catalog paths, and models in the catalog that have no published photograph.",
  );
}

export function ModelLookupPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: tx(locale, "Home"), href: p("/") }, { label: tx(locale, "Model lookup") }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{tx(locale, "Reference")}</p>
            <h1 className="mt-16 text-h1 text-ink">
              {tx(locale, "Model number lookup. An old model number still means something here.")}
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              {tx(
                locale,
                "A quotation outlives the catalog that produced it. If a number on an old schedule no longer finds a page, one of three things happened to it, and this page says which — {renamed} records were renamed, {unpublished} are in the catalog without a published photograph, and one category path was retired.",
              )
                .replace("{renamed}", String(renamedRecords.length))
                .replace("{unpublished}", String(notShownModels.length))}
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {tx(locale, "None of these is a discontinued product. Where a model does go out of production we will say so here, in those words, with the date.")}
            </p>
          </div>
        </section>
        <ModelIndex locale={locale} entries={modelIndex(locale)} />
        <ModelLookup locale={locale} />
        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">{tx(locale, "Still not finding it?")}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              {tx(
                locale,
                "Send the number exactly as it appears on your document, including the letters after it — those carry the finish and the lock function, and they are often the part that identifies which of our models you were quoted. If the number came from another supplier, send it anyway; we cross-reference competitor codes.",
              )}
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href={p("/finishes")}>{tx(locale, "How to read our order codes")}</ArrowLink>
              <ArrowLink href={p("/contact")}>{tx(locale, "Ask about a model number")}</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
