import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";

export const metadata: Metadata = {
  title: "Contact | Canton Hyland",
  description: "Talk to an export engineer about a specification, a sample or a quotation.",
};

/** Stub — real content lands in P5. Structure only, so navigation resolves. */
export default function ContactPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <h1 className="text-h1 text-ink">Contact</h1>
          </div>
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink">Talk to an export engineer about a specification, a sample or a quotation.</p>
            <p className="mt-24 text-c1 text-ink-secondary">
              This page is not built yet — it arrives in P5.
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
