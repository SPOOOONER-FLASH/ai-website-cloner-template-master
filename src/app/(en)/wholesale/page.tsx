import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ArrowLink } from "@/components/site/ArrowLink";
import { AssetRequestForm } from "@/components/site/AssetRequestForm";
import { EmailLink } from "@/components/site/EmailLink";
import { downloads, formatDownloadSize } from "@/data/downloads";
import { siteSettings, whatsappHref } from "@/data/navigation";

export const metadata: Metadata = pageMetadata({
  enPath: "/wholesale",
  locale: "en",
  title: "Catalog, wholesale prices and MOQ",
  description:
    "Download the HYDE product catalog, see how wholesale prices are quoted, and check minimum order quantities, lead time, samples and payment terms for door hardware.",
});

/*
  The page a buyer's first email asks for (client, 2026-10-05). The importer's opening
  message is nearly always the same three nouns: "your catalog, wholesale prices and
  minimum order quantities". Each answer already existed on the site, on three different
  pages under three different names (Downloads, Contact, FAQ). This page puts them in the
  order the buyer asks, and it is the one link the export team can paste into a reply.

  Every figure here is the FAQ's own (content/faq.json, "Ordering and samples"). Nothing
  is rounded up to sound better: MOQ is a range by model, lead time is "from" 30 days, and
  prices are quoted, not published — the 2026-09-22 decision against a "Price list" link
  that promised a document we do not publish still stands.
*/
const catalog = downloads.find((file) => file.id === "export-catalogue-2026");

const terms = [
  {
    term: "Minimum order",
    value: "Most models 300 to 5,000 pieces, set by model and finish. Some Alibaba listings carry a lower published minimum. Confirmed for each line before you commit.",
  },
  { term: "Lead time", value: "Production from 30 days after order confirmation. The exact date is confirmed before you pay a deposit." },
  { term: "Samples", value: "Charged, with freight quoted to your address. The sample cost is credited against your first production order." },
  { term: "Payment", value: "T/T with a deposit and the balance against shipping documents or before dispatch. Irrevocable L/C at sight for larger orders." },
  { term: "Trade terms", value: "EXW at the factory, FOB at the port, or DDP delivered. The term changes the price, so tell us which one you need." },
];

const steps = [
  { title: "Shortlist from the catalog", body: "Mark the models and finishes you sell. Model numbers are enough; the export team reads them directly." },
  { title: "Send models, quantities, destination", body: "We reply with the price and the minimum for each line, on the trade term you asked for." },
  { title: "Approve a sample", body: "Optional, and credited against the first order if it leads to business." },
  { title: "Confirm the proforma", body: "Terms in writing before any payment. Production starts from 30 days." },
  { title: "Shipment", body: "Shipped on the trade term you chose: EXW, FOB or DDP." },
];

export default function WholesalePage() {
  const whatsapp = whatsappHref();
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="wholesale-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Catalog & prices" }]} />
          </div>
          <div className="col-span-full xl:col-span-11">
            <p className="text-c1 text-ink-secondary">For importers, distributors and wholesalers</p>
            <h1 id="wholesale-title" className="mt-8 text-h1 text-ink">Catalog, prices and minimum orders</h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-h3 text-ink">The three things a buyer asks first, answered on one page.</p>
          </div>
        </div>
      </section>

      <section className="layout mt-96 lg:mt-144" aria-label="Catalog, prices and minimum order">
        <ol className="col-content grid gap-x gap-y-48 border-t border-line pt-32 md:grid-cols-3">
          <li>
            <p className="text-c2 tabular-nums text-ink-secondary">01</p>
            <h2 className="mt-8 text-h3 text-ink">Product catalog</h2>
            <p className="mt-16 text-c1 text-ink-secondary">
              {catalog
                ? `79 pages, searchable and bookmarked. English PDF, ${formatDownloadSize(catalog.sizeBytes)}. No form: it is yours now.`
                : "Searchable and bookmarked. English PDF."}
            </p>
            {catalog ? (
              <a href={catalog.url} download className="nav-rail-cta mt-24">
                Download the catalog <span aria-hidden="true">↓</span>
              </a>
            ) : null}
          </li>
          <li>
            <p className="text-c2 tabular-nums text-ink-secondary">02</p>
            <h2 className="mt-8 text-h3 text-ink">Wholesale prices</h2>
            <p className="mt-16 text-c1 text-ink-secondary">
              Quoted, not published, because the price moves with model, finish, quantity and
              trade term. Send those four and the export team usually replies within one working day.
            </p>
            <div className="mt-24">
              <ArrowLink href="#request">Ask for prices</ArrowLink>
            </div>
          </li>
          <li>
            <p className="text-c2 tabular-nums text-ink-secondary">03</p>
            <h2 className="mt-8 text-h3 text-ink">Minimum order</h2>
            <p className="mt-16 text-c1 text-ink-secondary">
              Most models 300 to 5,000 pieces, set by model and finish. We confirm the minimum
              for each line on the quotation, before you commit to anything.
            </p>
            <div className="mt-24">
              <ArrowLink href="/faq/#faq-ordering-and-samples">Ordering answers in full</ArrowLink>
            </div>
          </li>
        </ol>
      </section>

      <section className="layout mt-144 lg:mt-192" aria-labelledby="terms-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-7">
            <h2 id="terms-title" className="text-h3 text-ink">Terms at a glance</h2>
          </div>
          <dl className="col-span-full divide-y divide-line border-t border-line xl:col-span-15 xl:col-start-10">
            {terms.map((row) => (
              <div key={row.term} className="grid gap-8 py-20 sm:grid-cols-[14rem_1fr] sm:gap-24">
                <dt className="text-c1 font-semibold text-ink">{row.term}</dt>
                <dd className="text-c1 text-ink-secondary">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="layout mt-144 lg:mt-192" aria-labelledby="steps-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-7">
            <h2 id="steps-title" className="text-h3 text-ink">How an order works</h2>
          </div>
          <ol className="col-span-full grid gap-24 border-t border-line pt-24 sm:grid-cols-2 xl:col-span-15 xl:col-start-10 xl:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="text-c2 tabular-nums text-ink-secondary">{index + 1}</p>
                <p className="mt-8 text-c1 font-semibold text-ink">{step.title}</p>
                <p className="mt-8 text-c2 text-ink-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="request" className="layout mt-144 scroll-mt-160 lg:mt-192" aria-labelledby="request-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-8">
            <h2 id="request-title" className="text-h3 text-ink">Ask for prices and MOQ</h2>
            <p className="mt-16 text-c1 text-ink-secondary">
              In the message, list the models and finishes, the quantity of each, and the
              destination port or country. A photograph or drawing helps if you want anything changed.
            </p>
            <ul className="mt-24 space-y-8 text-c1">
              {siteSettings.contact.email ? (
                <li><EmailLink address={siteSettings.contact.email} className="short-marker inline-block text-ink" /></li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="short-marker inline-block text-ink">
                    WhatsApp {siteSettings.contact.whatsapp}
                  </a>
                </li>
              ) : null}
              <li>
                <a href={siteSettings.alibaba.storefront} target="_blank" rel="noopener noreferrer" className="short-marker inline-block text-ink-secondary">
                  Prefer Alibaba? Our verified storefront
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-full xl:col-span-14 xl:col-start-11">
            <AssetRequestForm
              asset="Wholesale prices and MOQ"
              submitLabel="Ask for prices and MOQ"
              messageLabel="Models, finishes, quantities and destination (optional)"
              successMessage="Thank you. Your request has reached our export team, and prices with the minimum for each line are usually emailed within one working day."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
