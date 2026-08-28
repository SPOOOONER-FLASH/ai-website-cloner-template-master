import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/newsletter",
  locale: "en",
  title: "Door Hardware & Export Newsletter",
  description:
    "Request Canton Hyland updates on new hardware ranges, specification guidance, export documents and international exhibitions.",
});

const UPDATE_TOPICS = [
  {
    number: "01",
    title: "Product releases",
    body: "New lock, exit-device, handle and architectural-hardware families with links to verified product data.",
  },
  {
    number: "02",
    title: "Specification notes",
    body: "Practical guidance on model codes, functions, finishes and the documents needed before quotation.",
  },
  {
    number: "03",
    title: "Export meetings",
    body: "Confirmed exhibition dates and meeting information once the company attendance plan is approved.",
  },
] as const;

export default function NewsletterPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Newsletter</p>
            <h1 className="mt-16 text-h1 text-ink">Useful updates, sent with restraint.</h1>
            <p className="mt-24 text-c1 text-ink">
              Product releases, specification guidance, export documentation changes and confirmed
              opportunities to meet our team.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              This form sends a subscription request to the export team. It does not silently add
              an address to a third-party marketing list.
            </p>
            <Link
              className="short-marker short-marker-compact mt-32 text-c1 text-brand hover:text-brand-hover"
              href="/news"
            >
              Read current insights
            </Link>
          </div>

          <div className="col-span-full border-t border-line pt-24 lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
            <NewsletterForm />
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink">What we send</h2>
          {UPDATE_TOPICS.map((topic) => (
            <article
              key={topic.number}
              className="col-span-full border-t border-line pt-16 sm:col-span-2 md:col-span-4 xl:col-span-8"
            >
              <p className="text-kicker text-ink-secondary">{topic.number}</p>
              <h3 className="mt-24 text-h3 text-ink">{topic.title}</h3>
              <p className="mt-16 text-c1 text-ink-secondary">{topic.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
