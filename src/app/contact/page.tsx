import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { certificates } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact | Canton Hyland",
  description: "Talk to an export engineer about a specification, a sample or a quotation.",
};

export default function ContactPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-8 xl:col-span-7">
            <h1 className="text-h1 text-ink">Contact</h1>
            <p className="mt-24 text-c1 text-ink">
              Talk to our export team about product selection, specifications, samples, OEM work
              or a project quotation.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Include the door type, required finish, applicable standard, quantity and destination
              market so we can prepare a useful first response.
            </p>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Current product catalogue</h2>
              <p className="mt-8 text-c1 text-ink-secondary">
                46 pages covering locks, handles, panic exit devices, glass hardware, closers and
                accessories.
              </p>
              <a
                className="underscore mt-16 inline-block text-c1 text-brand hover:text-brand-hover"
                href="/downloads/canton-hyland-product-catalogue-2026.pdf"
                download
              >
                Download catalogue (PDF, 4.4 MB)
              </a>
            </div>
          </div>

          <div className="col-span-full lg:col-span-14 lg:col-start-11 xl:col-span-15 xl:col-start-10">
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

        <section className="col-content border-t border-line pt-48">
          <div className="grid grid-cols gap-x gap-y-48">
            <div className="col-span-full lg:col-span-8 xl:col-span-7">
              <h2 className="text-h2 text-ink">Test reports and conformity</h2>
              <p className="mt-24 text-c1 text-ink-secondary">
                These documents support the exact models or series printed on each report. Please
                ask us to confirm whether a current SKU is covered before specifying it.
              </p>
            </div>

            <div className="col-span-full grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 lg:col-span-14 lg:col-start-11 xl:col-span-15 xl:col-start-10">
              {certificates.map((certificate) => (
                <article key={certificate.reference} className="border-t border-line pt-16">
                  <MediaPlaceholder {...certificate.image} className="bg-surface-alt object-contain" />
                  <h3 className="mt-16 text-h3 text-ink">{certificate.title}</h3>
                  <dl className="mt-16 space-y-8 text-c2 text-ink-secondary">
                    <div>
                      <dt className="inline font-semibold text-ink">Scope: </dt>
                      <dd className="inline">{certificate.coversModel}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">Issuer: </dt>
                      <dd className="inline">{certificate.issuer}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">Reference: </dt>
                      <dd className="inline">{certificate.reference}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">Issued: </dt>
                      <dd className="inline">{certificate.issued}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
