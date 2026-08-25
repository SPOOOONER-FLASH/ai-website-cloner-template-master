import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AssetRequestForm } from "@/components/site/AssetRequestForm";
import { ArrowLink } from "@/components/site/ArrowLink";

export const metadata: Metadata = pageMetadata({
  enPath: "/request/price-list",
  locale: "en",
  title: "Request the price list",
  description:
    "Trade price list for Canton Hyland panic exit devices, locks, handles and architectural hardware. Sent by email to distributors and project buyers.",
});

/**
 * Gated price list.
 *
 * The reference site does the same thing, and for the same reason: a trade price list is
 * the one document that should not sit on a public URL where a competitor can bookmark
 * it. Gating it also turns the most commercially-motivated visitor on the site into a
 * named contact, which — given this site's job is to produce email enquiries — is the
 * single highest-intent conversion available.
 *
 * Nothing is delivered automatically. The form sends an enquiry; a person replies with
 * the current list. That is deliberate: prices change, and an auto-responder attached to
 * a stale PDF is worse than a slower human answer.
 */
export default function PriceListRequestPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="price-list-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink-secondary">Service</p>
            <h1 id="price-list-title" className="mt-8 text-h1 text-ink">
              Request the price list
            </h1>
          </div>

          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-c1 text-ink">
              Trade pricing is sent by email rather than published, because it depends on
              specification, finish and volume. Tell us who you are and our export team
              will reply with the current list.
            </p>
            <p className="mt-16 text-c2 text-ink-secondary">
              Already know the models you need? A quote is usually faster than a full
              list.
            </p>
            <div className="mt-16">
              <ArrowLink href="/contact/">Request a quote instead</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="layout mt-96 lg:mt-136" aria-label="Price list request form">
        <div className="col-content grid w-full grid-cols gap-x">
          <div className="col-span-full xl:col-span-14">
            <AssetRequestForm
              asset="Trade price list"
              successMessage="Thank you — your request has reached our export team. The current price list will be emailed to you, usually within one working day."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
