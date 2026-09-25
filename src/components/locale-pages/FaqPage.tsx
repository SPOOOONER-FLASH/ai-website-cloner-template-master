import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { FaqJsonLd } from "@/components/site/JsonLd";
import { getAnsweredFaq } from "@/data/faq";
import type { Locale } from "@/data/locales";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

export function faqMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/faq",
    "Frequently asked questions",
    "Ordering, samples, lead times, finishes, master key systems, certification and export questions for Canton Hyland door hardware.",
  );
}

export function FaqPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  const groups = getAnsweredFaq(locale);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <FaqJsonLd locale={locale} />
      <section className="layout" aria-labelledby="faq-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink-secondary">{tx(locale, "Service")}</p>
            <h1 id="faq-title" className="mt-8 text-h1 text-ink">
              {tx(locale, "Frequently asked questions")}
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-c1 text-ink">
              {tx(locale, "If the answer you need is not here, ask us directly — we would rather reply than have you guess.")}
            </p>
            <div className="mt-16 flex flex-wrap gap-x-32 gap-y-16">
              <ArrowLink href={p("/contact")}>{tx(locale, "Ask a question")}</ArrowLink>
              <ArrowLink href={p("/products")}>{tx(locale, "Browse the catalog")}</ArrowLink>
            </div>
          </div>
        </div>
      </section>
      {groups.map((group, index) => (
        <section key={group.title} className="layout mt-96 lg:mt-136" aria-labelledby={`faq-group-${index}`}>
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full xl:col-span-8">
              <h2 id={`faq-group-${index}`} className="text-h3 text-ink">
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
