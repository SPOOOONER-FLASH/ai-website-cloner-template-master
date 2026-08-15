import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";

export const metadata: Metadata = {
  title: "Service + Downloads | Canton Hyland",
  description: "Catalogues, technical datasheets, CAD and BIM files, installation guides and certificates.",
};

/** Stub — real content lands in P8. Structure only, so navigation resolves. */
export default function ServiceDownloadsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <h1 className="text-h1 text-ink">Service + Downloads</h1>
          </div>
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink">Catalogues, technical datasheets, CAD and BIM files, installation guides and certificates.</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              This page is not built yet — it arrives in P8.
            </p>
            <div className="mt-48">
              <ArrowLink href="/">Back to the homepage</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
