import type { Metadata } from "next";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/services",
  locale: "en",
  title: "Door Hardware Services",
  description:
    "Product selection, hardware schedule review, OEM development, samples, technical documents and export coordination from Canton Hyland.",
});

const SERVICES = [
  {
    number: "01",
    title: "Product selection + schedule review",
    body: "Match door type, function, dimensions, finish and market requirements to catalogue products before quotation.",
    outcome: "Start with a schedule, product list or marked-up drawing.",
  },
  {
    number: "02",
    title: "OEM + private-label development",
    body: "Review an existing reference, target market and packaging requirement with the factory team before a custom proposal is prepared.",
    outcome: "Send the reference model, expected quantity and required market.",
  },
  {
    number: "03",
    title: "Samples + quotation",
    body: "Confirm the exact model, function and finish to keep samples aligned with the product that will be quoted.",
    outcome: "Include destination, quantity and the decision the sample must support.",
  },
  {
    number: "04",
    title: "Technical documents",
    body: "Locate available drawings, datasheets, installation instructions and model-bound certificates without extending one document to unrelated products.",
    outcome: "Ask by model number and document purpose.",
  },
  {
    number: "05",
    title: "Export coordination",
    body: "Organise confirmed product lines, finishes, quantities and destination information into a clearer quotation and shipment discussion.",
    outcome: "Share the requested Incoterm and destination port when known.",
  },
  {
    number: "06",
    title: "After-sales documentation",
    body: "Trace an installed product by model, photograph and order reference so the right installation or replacement information can be checked.",
    outcome: "Keep the product label and installation photographs in the request.",
  },
] as const;

export default function ServicesPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Services</p>
            <h1 className="mt-16 text-h1 text-ink">From a product code to a coordinated hardware answer.</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Canton Hyland supports distributors, project buyers and OEM customers before and
              after the product list is chosen. Useful work starts with accurate inputs: door type,
              dimensions, function, finish, quantity and destination market.
            </p>
            <div className="mt-32 flex flex-wrap gap-x-32 gap-y-16">
              <Link
                href="/contact"
                className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              >
                Send a service request
              </Link>
              <Link
                href="/product-finder"
                className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              >
                Start with Product Finder
              </Link>
            </div>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24">
          <div className="col-span-full lg:col-span-7 xl:col-span-15">
            <MediaPlaceholder
              src="/images/editorial/project-glass-entrance.webp"
              ratio="3 / 2"
              label="Representative architectural entrance combining glass, metal and coordinated door hardware"
              className="h-full min-h-320"
              priority
            />
          </div>
          <aside className="col-span-full flex flex-col justify-between border border-line p-24 lg:col-span-4 lg:col-start-9 xl:col-span-8 xl:col-start-17">
            <div>
              <p className="text-kicker text-ink-secondary">Before we begin</p>
              <h2 className="mt-24 text-h2 text-ink">The first useful package</h2>
            </div>
            <ul className="mt-48 space-y-16 border-t border-line pt-16 text-c1 text-ink-secondary">
              <li>Door or application type</li>
              <li>Model, drawing or reference photograph</li>
              <li>Function and finish</li>
              <li>Quantity and destination market</li>
            </ul>
          </aside>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-48 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink">Six practical service paths</h2>
          {SERVICES.map((service) => (
            <article
              key={service.number}
              className="col-span-full border-t border-line pt-16 sm:col-span-2 md:col-span-4 xl:col-span-8"
            >
              <div className="flex items-start justify-between gap-16">
                <h3 className="text-h3 text-ink">{service.title}</h3>
                <span className="text-kicker text-ink-secondary">{service.number}</span>
              </div>
              <p className="mt-24 text-c1 text-ink-secondary">{service.body}</p>
              <p className="mt-24 border-t border-line pt-16 text-c2 text-ink">
                {service.outcome}
              </p>
            </article>
          ))}
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <h2 className="text-h2 text-ink">Documents already available</h2>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">
              Browse catalogues, technical files and model-bound evidence before requesting a new
              document. Unknown or unverified specifications remain blank until the right source is supplied.
            </p>
            <Link
              href="/downloads"
              className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
            >
              Open download centre
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
