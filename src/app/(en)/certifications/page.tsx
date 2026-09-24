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
    "Model-scoped HYDE test reports and conformity records with issuer, reference and exact product scope. Intertek reports and CE conformity for panic exit devices.",
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
            <h1 className="mt-16 text-h1 text-ink">Certificates and test reports. What is tested, and in whose name.</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              The records below are listed with the exact model scope printed on each document, and a report for one model is never presented as approval for another. Much of what we make for private-label customers is certified in our customers' own names, at their request and their cost, so those certificates are theirs to share. CE and ANSI testing in Canton Hyland's own name is being prepared for our core ranges; each new report will appear here, with its scope, as it is issued.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              The issuers restrict how their reports may be copied, so we send a complete copy on request, for a named model, rather than publishing extracts.
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
                  The details are public. The full report is sent on request, complete, as the issuer requires.
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
            Check the report before you specify the part.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Send the standard you need, the model number and the destination market. We will tell you whether a report names that exact model before we send it, and say so if none does.
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
