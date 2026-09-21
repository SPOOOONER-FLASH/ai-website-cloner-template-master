import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ModelLookup } from "@/components/site/ModelLookup";
import { ModelIndex } from "@/components/site/ModelIndex";
import { modelIndex } from "@/lib/model-index";
import { notShownModels, renamedRecords } from "@/lib/superseded-models";
import { pageMetadata } from "@/lib/seo";

/**
 * Model number lookup — the second of the three references the client asked for on
 * 2026-09-13, after MIWA's 廃止品対照表.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT IS FOR, IN ONE SENTENCE
 *
 * A quotation outlives the catalogue that produced it, and the buyer holding a 2023
 * schedule needs to learn that `023 PS Panic Exit Device` is now called a trim — from us,
 * rather than from the silence that follows an unanswered search.
 *
 * The page is deliberately plain. It is a lookup, and the thing that makes a lookup
 * trustworthy is that every row says which of three different things happened, rather
 * than flattening them into one comforting word. See src/lib/superseded-models.ts.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/model-lookup",
  locale: "en",
  title: "Model Number Lookup",
  description:
    "What happened to a Canton Hyland model number that no longer resolves: renamed records with their permanent redirects, retired catalogue paths, and models in the catalogue that have no published photograph.",
});

export default function ModelLookupPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Model lookup" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Reference
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              An old model number still means something here.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              A quotation outlives the catalogue that produced it. If a number on an old
              schedule no longer finds a page, one of three things happened to it, and this
              page says which — {renamedRecords.length} records were renamed,{" "}
              {notShownModels.length} are in the catalogue without a published photograph,
              and one category path was retired.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              None of these is a discontinued product. Where a model does go out of
              production we will say so here, in those words, with the date.
            </p>
          </div>
        </section>

        <ModelIndex locale="en" entries={modelIndex("en")} />

        <ModelLookup locale="en" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Still not finding it?
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Send the number exactly as it appears on your document, including the letters
              after it — those carry the finish and the lock function, and they are often the
              part that identifies which of our models you were quoted. If the number came
              from another supplier, send it anyway; we cross-reference competitor codes.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/finishes/">How to read our order codes</ArrowLink>
              <ArrowLink href="/contact/">Ask about a model number</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
