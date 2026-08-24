import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getAnsweredFaq } from "@/data/faq";
import { ArrowLink } from "@/components/site/ArrowLink";
import { FaqJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = pageMetadata({
  enPath: "/faq",
  locale: "en",
  title: "Frequently asked questions",
  description:
    "Ordering, samples, lead times, finishes, master key systems, certification and export questions for Canton Hyland door hardware.",
});

/**
 * The FAQ.
 *
 * Two jobs, both of which matter more here than on a consumer site. It answers the
 * questions that otherwise arrive as an email a salesperson has to write out again, and
 * it is the site's only real long-tail search surface — product pages rank for model
 * numbers, but nobody searches for a model number until they already know the brand.
 *
 * Questions the client has not answered yet do not render. Half a page of real answers
 * is worth more than a full page where a third of them are invented.
 */
export default function FaqPage() {
  const groups = getAnsweredFaq();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <FaqJsonLd />

      <section className="layout" aria-labelledby="faq-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink-secondary">Service</p>
            <h1 id="faq-title" className="mt-8 text-h1 text-ink">
              Frequently asked questions
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-c1 text-ink">
              If the answer you need is not here, ask us directly — we would rather reply
              than have you guess.
            </p>
            <div className="mt-16 flex flex-wrap gap-x-32 gap-y-16">
              <ArrowLink href="/contact/">Ask a question</ArrowLink>
              <ArrowLink href="/request/price-list/">Request the price list</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section
          key={group.title}
          className="layout mt-96 lg:mt-136"
          aria-labelledby={`faq-${group.title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full xl:col-span-8">
              <h2
                id={`faq-${group.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-h3 text-ink"
              >
                {group.title}
              </h2>
            </div>

            <dl className="col-span-full border-t border-line xl:col-span-14 xl:col-start-11">
              {group.items.map((item) => (
                <div key={item.question} className="border-b border-line py-24">
                  <dt className="text-c1 font-bold text-ink">{item.question}</dt>
                  <dd className="mt-8 text-c1 text-ink-secondary">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </main>
  );
}
