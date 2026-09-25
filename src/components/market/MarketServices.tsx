import type { MarketLocale } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketBreadcrumbs, MarketButton, MarketLink, MarketMain, MarketPageIntro } from "./MarketPrimitives";

export function MarketServices({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const text = copy.services;

  return (
    <MarketMain locale={locale} page="/services">
      <div className="layout">
        <div className="col-content">
          <MarketBreadcrumbs locale={locale} page="/services" />
        </div>
      </div>
      <MarketPageIntro kicker={text.kicker} title={text.h1} lead={text.intro}>
        <div className="mt-24">
          <MarketButton href={marketHref(locale, "/contact")}>{text.cta}</MarketButton>
        </div>
      </MarketPageIntro>

      <section className="layout" aria-labelledby="market-brief">
        <div className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <div className="col-span-full lg:col-span-6 xl:col-span-12">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{text.briefKicker}</p>
            <h2 id="market-brief" className="mt-8 text-h2 text-ink">
              {text.briefHeading}
            </h2>
          </div>
          <ol className="col-span-full list-decimal space-y-8 ps-24 text-c1 text-ink lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            {text.briefItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="layout" aria-labelledby="market-services">
        <div className="col-content border-t border-line pt-32">
          <h2 id="market-services" className="text-h2 text-ink">
            {text.listHeading}
          </h2>
          <ol className="mt-24">
            {text.services.map((service) => (
              <li key={service.number} className="grid grid-cols gap-x gap-y-16 border-t border-line py-24">
                <p className="col-span-2 text-kicker text-ink-secondary xl:col-span-3">{service.number}</p>
                <div className="col-span-full md:col-span-10 xl:col-span-21">
                  <h3 className="text-h3 text-ink">{service.title}</h3>
                  <p className="mt-8 max-w-[70ch] text-c1 text-ink-secondary">{service.body}</p>
                  <p className="mt-8 max-w-[70ch] text-c2 text-ink">{service.outcome}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-6 xl:col-span-12">{text.docsHeading}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{text.docsBody}</p>
            <div className="mt-16 flex flex-wrap gap-x-32 gap-y-8">
              <MarketLink href="/downloads/" hrefLang="en">
                {text.docsCta}
              </MarketLink>
              <MarketLink href={marketHref(locale, "/contact")}>{text.cta}</MarketLink>
            </div>
          </div>
        </div>
      </section>
    </MarketMain>
  );
}
