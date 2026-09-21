import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { siteSettings } from "@/data/navigation";
import { representatives } from "@/data/representatives";
import { EmailLink } from "@/components/site/EmailLink";

export const metadata: Metadata = pageMetadata({
  enPath: "/contact",
  locale: "en",
  title: "Contact the Export Team",
  description:
    "Talk to an export engineer about a specification, a sample or a quotation. Include door type, finish, applicable standard, quantity and destination market.",
});

export default function ContactPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h1 className="text-h1 text-ink">Contact</h1>
            <p className="mt-24 text-c1 text-ink">
              Talk to our export team about product selection, specifications, samples, OEM work
              or a project quotation.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Include the door type, required finish, applicable standard, quantity and destination
              market so we can prepare a useful first response.
            </p>

            {/*
              THE THREE MAILBOXES COME FIRST. Client instruction, 2026-09-20:
              「联系页面英西葡，都可以有优先最先看到三个 cantonlock 邮件。比目录和地址都先。」

              They used to sit third or fourth, under the catalogue and the address. Clarity
              shows why that order cost money. A Spanish visitor on 2026-09-18 spent 17:56 on
              /es/contact/, filled the form, submitted it at 14:23 — and then went on clicking
              contact elements at 16:08 and 16:47, because the submit had failed silently and
              the addresses were below the fold. Somebody who has decided to make contact should
              not have to scroll past a PDF and a street to find out how.

              The address is the largest text in each row and the subject line is the caption,
              not the other way round. That inverts the previous treatment on purpose: the
              buyer is scanning for something to copy, and the thing to copy is the address.
            */}
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h2 text-ink">Email us directly</h2>
              <p className="mt-8 text-c1 text-ink-secondary">
                Email is the fastest route to a quotation — an engineer reads it, not a queue.
                Pick the mailbox that matches your question and it reaches the right desk
                first time.
              </p>
              <dl className="mt-24">
                {[
                /*
                  TECHNICAL FIRST. Client instruction, 2026-09-21: it is the mailbox he
                  reads himself, so it is the one that should be first.

                  It also happens to be the right order for the traffic. The 2026-09-20
                  Clarity reading has every one of our 33 AI citations landing on an
                  article that answers a technical question — finish codes, backset,
                  cylinder length, push bar versus touch bar — and none on a price page.
                  A reader who arrives from one of those and decides to write is carrying
                  a drawing, not a purchase order.
                */
                  {
                    email: siteSettings.contact.technicalEmail,
                    label: "Drawings, specification and test reports",
                  },
                  {
                    email: siteSettings.contact.email,
                    label: "Orders, pricing and samples",
                  },
                  {
                    email: siteSettings.contact.brandEmail,
                    label: "OEM, private label and everything else",
                  },
                ]
                  /*
                    A type predicate, not a bare truthiness filter. The rows are built
                    from optional settings fields, and the compiler cannot see that this
                    line removes the undefined ones — it used to not matter because a
                    template literal swallows undefined, and it started mattering the
                    moment the address became a typed prop. Saying what the filter
                    guarantees is better than asserting it away at the call site.
                  */
                  .filter((row): row is { label: string; email: string } => Boolean(row.email))
                  .map((row) => (
                    <div
                      key={row.email}
                      className="border-b border-line py-16"
                    >
                      <dt className="text-c2 text-ink-secondary">{row.label}</dt>
                      <dd className="mt-4">
                        <EmailLink address={row.email} className="short-marker short-marker-compact text-h3 text-brand hover:text-brand-hover" />
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/*
              The manufacturing address, on the page people reach when they need it.

              A customer building a quotation on 2026-09-01 could not find an address
              anywhere on the site: it was region-and-country in the JSON-LD and nowhere
              in the copy. An export quotation, a customs declaration and a courier
              booking all need the street; a buyer who cannot find one on a factory's own
              site reasonably wonders whether it is a factory.

              Placed above the catalogue block rather than below the form, because
              someone hunting for an address is scanning, not reading, and this column is
              where the eye goes after the heading.
            */}
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Address</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                Manufacturing, and where inspection visits are received.
              </p>

              {/*
                THE OFFICE ADDRESS IS NOT PUBLISHED. Client decision, 2026-09-03.

                Two earlier decisions led here. The Chinese line came off both addresses
                because this page is read by buyers in thirty markets and a script none of
                them read is noise in the block they came for. Now the Lehe Road office
                comes off entirely: publishing two addresses in one town invites the
                question of which one is the company, and the factory is the answer that
                matters to an importer — it is the one they can visit and audit.

                Both are still held in content/site-settings.json for quotations and
                shipping documents. Removed from the page, not from the record.
              */}
              {siteSettings.contact.factoryAddress ? (
                <div className="mt-24">
                  <p className="text-c2 text-ink-secondary">Factory</p>
                  <address className="mt-4 not-italic text-c1 text-ink">
                    {siteSettings.contact.factoryAddress}
                    <br />
                    {siteSettings.contact.city}, {siteSettings.contact.province},{" "}
                    {siteSettings.contact.country}
                  </address>
                </div>
              ) : null}
            </div>


            {/*
              Overseas representatives.

              Labelled "representative contacts", not offices — see the note in
              src/data/representatives.ts. Two of these addresses are residential and one
              is a fairground, and a buyer who looks one up will find that; the wording
              has to survive the check.
            */}
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Representative contacts</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                Manufacturing is in Zhongshan. These are the people to reach in each market.
              </p>
              <ul className="mt-24 space-y-24">
                {representatives.map((rep) => (
                  <li key={`${rep.region}-${rep.city}`}>
                    <p className="text-c2 uppercase tracking-wide text-ink-tertiary">
                      {rep.region}
                    </p>
                    <p className="mt-4 text-c1 text-ink">{rep.city}</p>
                    <address className="mt-4 not-italic text-c1 text-ink-secondary">
                      {rep.address}
                    </address>
                    {rep.phone ? (
                      <a
                        href={`tel:${rep.phone.replace(/\s/g, "")}`}
                        className="short-marker short-marker-compact mt-8 inline-block text-c1 text-brand hover:text-brand-hover"
                      >
                        {rep.phone}
                      </a>
                    ) : null}
                    {/* Where mail for this market lands — see representatives.ts. */}
                    <EmailLink address={rep.email} className="short-marker short-marker-compact mt-4 block text-c1 text-brand hover:text-brand-hover" />
                    {rep.note ? (
                      <p className="mt-8 max-w-[46ch] text-c2 text-ink-secondary">{rep.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Current product catalogue</h2>
              <p className="mt-8 text-c1 text-ink-secondary">
                79 pages, every published model with its spec table and an index at the back.
                Searchable text, bookmarks by family, and it opens as a spread.
              </p>
              <a
                className="short-marker short-marker-compact mt-16 text-c1 text-brand hover:text-brand-hover"
                href="/downloads/hyde-export-catalogue-2026.pdf"
                download
              >
                Download catalogue (PDF, 6.1 MB)
              </a>
            </div>
          </div>

          <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
            <Suspense
              fallback={
                <p className="min-h-160 border-t border-line pt-16 text-c1 text-ink-secondary">
                  Preparing inquiry form…
                </p>
              }
            >
              <InquiryForm />
            </Suspense>
          </div>

          {/*
            WHAT A VISITOR NEEDS TO KNOW, NOT WHAT A DEPLOYMENT NEEDS.

            This paragraph used to read "Submission is enabled when the deployment contains a
            valid NEXT_PUBLIC_W3F_KEY". The 2026-09-17 work took that sentence out of the
            form's failure branch, on the grounds that a site selling precision answered a
            buyer's enquiry with a deployment memo. The standing paragraph survived that pass.
          */}
          <p className="col-span-full border-t border-line pt-16 text-c2 text-ink-secondary">
            The form reaches the same export desks as the addresses above. If it cannot send,
            the page keeps everything you typed and offers it as a ready-addressed email — your
            enquiry is not lost either way.
          </p>
        </section>
      </div>
    </main>
  );
}
