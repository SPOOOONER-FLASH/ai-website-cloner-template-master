import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { certificates } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/certifications",
  locale: "en",
  title: "Certification + Test Evidence",
  description:
    "Model-scoped HYDE test reports and conformity records, with issuer, reference, issue date and exact product scope.",
});

const fields = [
  ["Exact model scope", "coversModel"],
  ["Issuer", "issuer"],
  ["Document reference", "reference"],
  ["Issue date", "issued"],
] as const;

export default function CertificationsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Certifications" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Quality evidence
            </p>
            <h1 className="mt-16 text-h1 text-ink">Evidence belongs to a model, not a marketing claim.</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              These three records belong to Canton Hyland and are listed with the exact model scope
              printed on the supporting document. A report for one model is not presented as approval
              for another product or an entire catalogue family.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Complete report copies are supplied through the export team only when document
              redistribution permission and the requested model mapping have been confirmed.
            </p>
          </div>
        </section>

        <section className="col-content border-t border-line" aria-labelledby="certificate-register">
          <h2 id="certificate-register" className="sr-only">Certificate register</h2>
          {certificates.map((certificate, index) => (
            <article
              key={certificate.reference}
              className="grid grid-cols gap-x gap-y-24 border-b border-line py-32 lg:py-48"
            >
              <div className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-3">
                <p className="text-kicker text-ink-secondary">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-16 text-c2 font-semibold uppercase tracking-[0.08em] text-ink">
                  Verified record
                </p>
              </div>
              <div className="col-span-full sm:col-span-3 md:col-span-5 xl:col-span-10">
                <h2 className="text-h2 text-ink">{certificate.title}</h2>
                <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">
                  Registry details are public; the full document is available through controlled
                  technical-document requests.
                </p>
              </div>
              <dl className="col-span-full grid grid-cols-1 gap-16 md:col-span-5 md:col-start-8 xl:col-span-9 xl:col-start-16">
                {fields.map(([label, key]) => (
                  <div key={key} className="border-t border-line pt-12">
                    <dt className="text-c2 text-ink-secondary">{label}</dt>
                    <dd className="mt-4 text-c1 text-ink">{certificate[key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Match the report before specifying the hardware.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Send the required standard, model number and destination market. The export team will
              confirm whether the document names that exact model before supplying a copy.
            </p>
            <div className="mt-24">
              <ArrowLink href="/contact/">Request technical documents</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
