import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { certificates } from "@/data/company";
import { downloads, formatDownloadSize, getDownloadsByKind } from "@/data/downloads";
import type { DownloadKind } from "@/data/types";
import { ModelLibrary } from "@/components/site/ProductModel";

export const metadata: Metadata = pageMetadata({
  enPath: "/downloads",
  locale: "en",
  title: "Service + Downloads",
  description:
    "Download the 46-page Canton Hyland catalog covering locks, handles, panic exit devices, glass hardware and closers, plus model-scoped test reports.",
});

const visibleGroups: Array<{ kind: DownloadKind; title: string; note: string }> = [
  {
    kind: "catalogue",
    title: "Product catalog",
    note: "The current English product catalog supplied by Canton Hyland.",
  },
  /*
    A planning sheet is not a document to read, it is a form to send back, so it gets its
    own group rather than sitting among the catalogues. The master key article ends by
    asking for a door schedule; this is that request made fillable, with a worked example
    on the third tab — see docs/research/2026-09-13-miwa-lock-structure.md for where the
    shape came from.
  */
  {
    kind: "planning",
    title: "Planning sheets",
    note: "Fill these in and send them back. Each carries a worked example — copy its pattern rather than inventing a format.",
  },
];

export default function ServiceDownloadsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="downloads-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Service + Downloads" }]} />
          </div>
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Technical library</p>
            <h1 id="downloads-title" className="mt-8 text-h1 text-ink">Catalog and technical downloads</h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-13">
            <p className="text-h3 text-ink">What you can have now, and what we send on request.</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              {downloads.length} files are here to download now. Datasheets, installation guides and CAD or BIM files are sent for a named model on a real project, so we can check them against current production first.
            </p>
          </div>
        </div>
      </section>

      <div className="layout mt-144 lg:mt-192">
        <div className="col-content space-y-144">
          <ModelLibrary locale="en" />
          {visibleGroups.map((group) => {
            const files = getDownloadsByKind(group.kind);
            return (
              <section key={group.kind} aria-labelledby={`${group.kind}-title`}>
                <div className="grid grid-cols gap-x gap-y-24">
                  <div className="col-span-full xl:col-span-7">
                    <h2 id={`${group.kind}-title`} className="text-h3 text-ink">{group.title}</h2>
                    <p className="mt-16 text-c1 text-ink-secondary">{group.note}</p>
                  </div>
                  <ul className="col-span-full divide-y divide-line border-t border-line xl:col-span-15 xl:col-start-10">
                    {files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={file.url}
                          download
                          className="group short-marker-surface grid gap-12 py-24 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-24"
                        >
                          <span>
                            <span className="short-marker short-marker-group inline-block text-c1 font-semibold text-ink">
                              {file.title}
                            </span>
                            {file.relatedModels.length ? (
                              <span className="mt-8 block text-c2 text-ink-secondary">
                                Documented model: {file.relatedModels.join(", ")}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-c2 uppercase text-ink-secondary">
                            {file.format} · {formatDownloadSize(file.sizeBytes)} · Download
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}

          <section aria-labelledby="certificate-title">
            <div className="grid grid-cols gap-x gap-y-24">
              <div className="col-span-full xl:col-span-7">
                <h2 id="certificate-title" className="text-h3 text-ink">
                  What is tested, and in whose name
                </h2>
                <p className="mt-16 text-c1 text-ink-secondary">
                  {certificates.length} records, each listed with the one model it covers. A report on one model does not cover another. Ask for a copy and we will send it in full, as the issuer requires.
                </p>
              </div>
              <ul className="col-span-full divide-y divide-line border-t border-line xl:col-span-15 xl:col-start-10">
                {certificates.map((certificate) => {
                  const request = new URLSearchParams({
                    subject: "certificate-request",
                    reference: certificate.reference,
                    model: certificate.coversModel,
                  });

                  return (
                    <li key={`${certificate.reference}-${certificate.coversModel}`}>
                      <Link
                        href={`/contact/?${request.toString()}`}
                        className="group short-marker-surface grid gap-12 py-24 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-24"
                      >
                        <span>
                          <span className="short-marker short-marker-group inline-block text-c1 font-semibold text-ink">
                            {certificate.title}
                          </span>
                          <span className="mt-8 block text-c2 text-ink-secondary">
                            Exact model scope: {certificate.coversModel}
                          </span>
                          <span className="mt-4 block text-c2 text-ink-secondary">
                            {certificate.issuer} · Reference {certificate.reference} · {certificate.issued}
                          </span>
                        </span>
                        <span className="text-c2 font-semibold uppercase text-ink">
                          Request verified copy
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="border-t border-line pt-48" aria-labelledby="request-files-title">
            <div className="grid grid-cols gap-x gap-y-24">
              <div className="col-span-full xl:col-span-7">
                <h2 id="request-files-title" className="text-h3 text-ink">Need another file?</h2>
              </div>
              <div className="col-span-full xl:col-span-15 xl:col-start-10">
                <p className="max-w-[68rem] text-c1 text-ink">
                  Send the model, the door preparation and the format you need. We will tell you whether a datasheet, installation guide, CAD drawing or BIM object exists for it, and say so plainly if it does not.
                </p>
                <Link href="/contact/?subject=technical-document" className="btn btn-primary mt-32">
                  Request technical documents
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
