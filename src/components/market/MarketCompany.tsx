import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import type { MarketLocale } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketBreadcrumbs, MarketButton, MarketMain, MarketPageIntro } from "./MarketPrimitives";

export function MarketCompany({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const text = copy.company;

  return (
    <MarketMain locale={locale} page="/company">
      <div className="layout">
        <div className="col-content">
          <MarketBreadcrumbs locale={locale} page="/company" />
        </div>
      </div>
      <MarketPageIntro kicker={text.kicker} title={text.h1}>
        {text.paragraphs.map((paragraph, index) => (
          <p key={index} className={index ? "mt-16 text-c1 text-ink" : "text-c1 text-ink"}>
            {paragraph}
          </p>
        ))}
      </MarketPageIntro>

      <section className="layout">
        <div className="col-content grid grid-cols-1 gap-x gap-y-24 md:grid-cols-2">
          <MediaPlaceholder
            ratio="3 / 2"
            src="/images/company/press-shop.webp"
            label={text.h1}
            sizes="(min-width: 744px) 50vw, 100vw"
          />
          <MediaPlaceholder
            ratio="3 / 2"
            src="/images/company/polishing-line.webp"
            label={text.statsHeading}
            sizes="(min-width: 744px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className="layout" aria-labelledby="market-stats">
        <div className="col-content border-t border-line pt-32">
          <h2 id="market-stats" className="text-h2 text-ink">
            {text.statsHeading}
          </h2>
          <dl className="mt-24 grid grid-cols-1 gap-x gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
            {text.stats.map((row) => (
              <div key={row.label} className="border-t border-line pt-12">
                <dt className="text-c2 text-ink-secondary">{row.label}</dt>
                <dd className="mt-4 text-c1 text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-6 xl:col-span-12">{text.marketsHeading}</h2>
          <p className="col-span-full text-c1 text-ink-secondary lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            {text.marketsBody}
          </p>
        </div>
      </section>

      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-6 xl:col-span-12">{text.visitHeading}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{text.visitBody}</p>
            <div className="mt-24">
              <MarketButton href={marketHref(locale, "/contact")}>{text.visitCta}</MarketButton>
            </div>
          </div>
        </div>
      </section>
    </MarketMain>
  );
}
