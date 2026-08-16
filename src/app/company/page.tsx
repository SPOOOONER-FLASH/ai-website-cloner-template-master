import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";

export const metadata: Metadata = {
  title: "Company | Canton Hyland",
  description: "Door lock and architectural hardware manufacturing in Guangdong, China since 1998.",
};

/** Stub — real content lands in P6. Structure only, so navigation resolves. */
export default function CompanyPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <h1 className="text-h1 text-ink">Company</h1>
          </div>
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink">Door lock and architectural hardware manufacturing in Guangdong, China since 1998.</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              This page is not built yet — it arrives in P6.
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
