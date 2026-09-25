import { JsonLd } from "@/components/site/JsonLd";
import type { FAQPage, WithContext } from "schema-dts";
import type { MarketLocale } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketBreadcrumbs, MarketLink, MarketMain } from "./MarketPrimitives";

/**
 * The FAQ in a market language, with FAQPage structured data built from the SAME strings
 * the page renders. `audit-seo` checks that every answer in the JSON-LD is visible on the
 * page, which is the guarantee that the machine-readable copy and the human-readable copy
 * cannot drift apart.
 */
export function MarketFaq({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const text = copy.faq;
  const items = text.groups.flatMap((group) => group.items);

  const schema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <MarketMain locale={locale} page="/faq">
      <JsonLd data={schema} />
      <div className="layout">
        <div className="col-content">
          <MarketBreadcrumbs locale={locale} page="/faq" />
        </div>
      </div>
      <section className="layout" aria-labelledby="market-faq-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink-secondary">{text.kicker}</p>
            <h1 id="market-faq-title" className="mt-8 text-h1 text-ink">
              {text.h1}
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-c1 text-ink">{text.intro}</p>
            <div className="mt-16">
              <MarketLink href={marketHref(locale, "/contact")}>{text.askCta}</MarketLink>
            </div>
          </div>
        </div>
      </section>

      {text.groups.map((group, groupIndex) => (
        <section key={group.title} className="layout" aria-labelledby={`market-faq-group-${groupIndex}`}>
          <div className="col-content grid w-full grid-cols gap-x gap-y-24 border-t border-line pt-32">
            <h2 id={`market-faq-group-${groupIndex}`} className="col-span-full text-h2 text-ink xl:col-span-12">
              {group.title}
            </h2>
            <dl className="col-span-full xl:col-span-10 xl:col-start-14">
              {group.items.map((item) => (
                <div key={item.question} className="border-t border-line py-16">
                  <dt className="text-c1 font-semibold text-ink">{item.question}</dt>
                  <dd className="mt-8 text-c1 text-ink-secondary">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </MarketMain>
  );
}
