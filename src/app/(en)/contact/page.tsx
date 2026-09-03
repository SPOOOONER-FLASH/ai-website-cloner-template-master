import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { siteSettings } from "@/data/navigation";
import { representatives } from "@/data/representatives";

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
              <h2 className="text-h3 text-ink">Addresses</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                Office for correspondence and documents; factory for production and
                inspection visits.
              </p>

              {/*
                The Chinese line is gone from both addresses.

                It was there as a courtesy for a courier, but this page is read by export
                buyers in thirty markets and a script none of them read is noise in the
                middle of the one block they came for. The Chinese wording is still held
                in content/site-settings.json for quotations and shipping documents —
                removed from the page, not from the record.
              */}
              <div className="mt-24">
                <p className="text-c2 text-ink-secondary">Office</p>
                <address className="mt-4 not-italic text-c1 text-ink">
                  {siteSettings.contact.address}
                  <br />
                  {siteSettings.contact.city}, {siteSettings.contact.province},{" "}
                  {siteSettings.contact.country}
                </address>
              </div>

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
                46 pages covering locks, handles, panic exit devices, glass hardware, closers and
                accessories.
              </p>
              <a
                className="short-marker short-marker-compact mt-16 text-c1 text-brand hover:text-brand-hover"
                href="/downloads/canton-hyland-product-catalogue-2026.pdf"
                download
              >
                Download catalogue (PDF, 4.4 MB)
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

          <p className="col-span-full border-t border-line pt-16 text-c2 text-ink-secondary">
            This static website sends inquiries through Web3Forms. Submission is enabled when the
            deployment contains a valid NEXT_PUBLIC_W3F_KEY.
          </p>
        </section>
      </div>
    </main>
  );
}
