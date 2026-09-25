import type { MarketLocale } from "@/data/market-locales";
import { marketCopy, marketHref } from "@/lib/market";
import { MarketBreadcrumbs, MarketLink, MarketMain, MarketPageIntro } from "./MarketPrimitives";

/**
 * The certificate register, translated. Same honesty rule as the English page and
 * src/data/company.ts: a record names the exact model it covers and nothing wider. The
 * issuer, reference and model scope are copied verbatim from the English records by the
 * translation brief; only the title, the labels and the date format are in the reader's
 * language.
 */
export function MarketCertifications({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const text = copy.certifications;
  const fields = [
    ["coversModel", text.fields.coversModel],
    ["issuer", text.fields.issuer],
    ["reference", text.fields.reference],
    ["issued", text.fields.issued],
  ] as const;

  return (
    <MarketMain locale={locale} page="/certifications">
      <div className="layout">
        <div className="col-content">
          <MarketBreadcrumbs locale={locale} page="/certifications" />
        </div>
      </div>
      <MarketPageIntro kicker={text.kicker} title={text.h1} lead={text.intro}>
        <p className="mt-24 text-c2 text-ink-secondary">{text.note}</p>
      </MarketPageIntro>

      <section className="layout" aria-labelledby="market-certificates">
        <div className="col-content border-t border-line">
          <h2 id="market-certificates" className="sr-only">
            {text.kicker}
          </h2>
          {text.records.map((record, index) => (
            <article key={record.reference + record.coversModel} className="grid grid-cols gap-x gap-y-24 border-b border-line py-32 lg:py-48">
              <div className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-3">
                <p className="text-kicker text-ink-secondary">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-16 text-c2 font-semibold uppercase tracking-[0.08em] text-ink">{text.recordLabel}</p>
              </div>
              <div className="col-span-full sm:col-span-3 md:col-span-5 xl:col-span-10">
                <h2 className="text-h2 text-ink">{record.title}</h2>
                <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">{text.detailsLine}</p>
              </div>
              <dl className="col-span-full grid grid-cols-1 gap-16 md:col-span-5 md:col-start-8 xl:col-span-9 xl:col-start-16">
                {fields.map(([key, label]) => (
                  <div key={key} className="border-t border-line pt-12">
                    <dt className="text-c2 text-ink-secondary">{label}</dt>
                    <dd className="mt-4 text-c1 text-ink" lang={key === "issued" ? undefined : "en"}>
                      {record[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="layout">
        <div className="col-content grid grid-cols gap-x gap-y-32 pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">{text.closingHeading}</h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">{text.closingBody}</p>
            <div className="mt-24">
              <MarketLink href={marketHref(locale, "/contact")}>{text.cta}</MarketLink>
            </div>
          </div>
        </div>
      </section>
    </MarketMain>
  );
}
