import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { downloads, formatDownloadSize, getDownloadsByKind } from "@/data/downloads";
import type { DownloadKind } from "@/data/types";

export const metadata: Metadata = {
  title: "Service + Downloads | Canton Hyland",
  description: "Canton Hyland product catalogue, model-scoped test reports and technical document request service.",
};

const visibleGroups: Array<{ kind: DownloadKind; title: string; note: string }> = [
  {
    kind: "catalogue",
    title: "Product catalogue",
    note: "The current English product catalogue supplied by Canton Hyland.",
  },
  {
    kind: "certificate",
    title: "Test reports and certificates",
    note: "Each document is labelled with its exact tested model. A report does not automatically certify other catalogue products.",
  },
];

export default function ServiceDownloadsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="downloads-title">
        <div className="col-content grid w-full grid-cols gap-x-42 gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Service + Downloads" }]} />
          </div>
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Technical library</p>
            <h1 id="downloads-title" className="mt-8 text-h1 text-ink">Service + Downloads</h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-13">
            <p className="text-h3 text-ink">Catalogues and evidence files for project review.</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              {downloads.length} client-supplied files are available locally. Datasheets,
              installation guides, CAD and BIM files are issued against a confirmed project brief.
            </p>
          </div>
        </div>
      </section>

      <div className="layout mt-144 lg:mt-192">
        <div className="col-content space-y-144">
          {visibleGroups.map((group) => {
            const files = getDownloadsByKind(group.kind);
            return (
              <section key={group.kind} aria-labelledby={`${group.kind}-title`}>
                <div className="grid grid-cols gap-x-42 gap-y-24">
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
                          className="group grid gap-12 py-24 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-24"
                        >
                          <span>
                            <span className="block text-c1 font-semibold text-ink group-hover:text-brand-hover group-hover:underline">
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

          <section className="border-t border-line pt-48" aria-labelledby="request-files-title">
            <div className="grid grid-cols gap-x-42 gap-y-24">
              <div className="col-span-full xl:col-span-7">
                <h2 id="request-files-title" className="text-h3 text-ink">Need another file?</h2>
              </div>
              <div className="col-span-full xl:col-span-15 xl:col-start-10">
                <p className="max-w-[68rem] text-c1 text-ink">
                  Send the product model, door preparation and required format. Our team will
                  confirm whether a datasheet, installation guide, CAD drawing or BIM object is available.
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
