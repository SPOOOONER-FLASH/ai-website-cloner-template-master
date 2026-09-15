import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  OrderCodeFooter,
  OrderCodeTables,
  WorkedOrderCode,
} from "@/components/site/OrderCodeTables";
import { modelsWithReadableFinish, publishedModelCount } from "@/lib/finish-usage";
import { pageMetadata } from "@/lib/seo";

/**
 * How to read a Canton Hyland order code.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS PAGE, AND WHY NOW
 *
 * Two things pointed at it from opposite directions.
 *
 * The first is our own traffic. The most-cited page on this site is the article that
 * explains how to read a model number — seven citations, against three for every category
 * page put together. Readers and answer engines both want the key to the catalogue more
 * than they want another product page.
 *
 * The second is MIWA. Their site carries an order-code-to-finish table, a glossary and a
 * discontinued-model chart, and those three pages are why a specifier can work with their
 * catalogue without phoning them. The client asked on 2026-09-13 for our own version of
 * the three. This is the first.
 *
 * ---------------------------------------------------------------------------
 * THE PAGE PRINTS WHAT WE KNOW AND SAYS SO WHERE WE DO NOT
 *
 * Twelve finish codes and five function codes are in demonstrable use and have no
 * confirmed expansion. They are in the tables with the expansion left blank, because a
 * buyer holding a quotation that says `GP` is better served by "we recognise this code and
 * are checking it" than by a table that silently omits it and looks complete. See
 * src/data/finish-codes.ts for the evidence rule, which a test enforces.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/finishes",
  locale: "en",
  title: "Order Codes + Finishes",
  description:
    "How to read a Canton Hyland model number: the finish codes (SSS, PB, SN, GM), the lock-function codes (ET, BK, PS) and the single/double door letter, with the models each appears on.",
});

export default function FinishesPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Order codes" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Reference
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              A model number is three facts, not one name.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              The letters after the number are the finish and the lock function, in that
              order. Once you can read them, a four-hundred-line price list becomes a short
              list of products and two suffix tables — and you can specify a variant we have
              never sent you a photograph of.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {modelsWithReadableFinish} of {publishedModelCount} published models carry a
              finish in the number itself. The rest state it in the specification instead.
            </p>
          </div>
          <div className="col-span-full xl:col-span-14">
            <WorkedOrderCode locale="en" />
          </div>
        </section>

        <OrderCodeTables locale="en" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            A finish code is not a BHMA number.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              North American specifications are written in ANSI/BHMA numbers, and those
              encode the base metal as well as the appearance — 626 is satin chrome on
              brass, 652 is the same colour on steel, and substituting one for the other is
              a rejected submittal. So our finish code alone cannot be converted. Each
              product page carries the BHMA number where the material is stated and a dash
              where it is not.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/news/reading-door-hardware-model-numbers/">
                How to read a model number
              </ArrowLink>
              <ArrowLink href="/contact/">Ask about a code</ArrowLink>
            </div>
            <div className="mt-32">
              <OrderCodeFooter locale="en" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
