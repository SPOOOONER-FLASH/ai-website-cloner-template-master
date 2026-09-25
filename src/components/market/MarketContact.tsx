import { EmailLink } from "@/components/site/EmailLink";
import { siteSettings } from "@/data/navigation";
import { representatives } from "@/data/representatives";
import type { MarketLocale } from "@/data/market-locales";
import { marketCopy } from "@/lib/market";
import { MarketBreadcrumbs, MarketButton, MarketLink, MarketMain } from "./MarketPrimitives";

/**
 * The contact page without the form.
 *
 * The three mailboxes come first — client instruction of 2026-09-20, the same order as
 * the English page — and the enquiry form is a link to the English one rather than a copy:
 * the form posts to a service with English field names and an English confirmation, and
 * a German reader who fills in a German form and receives an English receipt has been
 * misled about what happens next. A mailto, in their own language, is the honest route.
 */
export function MarketContact({ locale }: { locale: MarketLocale }) {
  const copy = marketCopy[locale];
  const text = copy.contact;
  const contact = siteSettings.contact;
  const mailboxes = [
    { address: contact.technicalEmail, label: text.mailboxes.technical },
    { address: contact.email, label: text.mailboxes.orders },
    { address: contact.brandEmail, label: text.mailboxes.brand },
  ].filter((row): row is { address: string; label: string } => Boolean(row.address));
  const usPhone = representatives.find((rep) => rep.region === "United States")?.phone;

  return (
    <MarketMain locale={locale} page="/contact">
      <div className="layout">
        <div className="col-content">
          <MarketBreadcrumbs locale={locale} page="/contact" />
        </div>
      </div>
      <section className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-6 xl:col-span-12">
            <h1 className="text-h1 text-ink">{text.h1}</h1>
            <p className="mt-24 text-c1 text-ink">{text.intro}</p>
            <p className="mt-16 text-c1 text-ink-secondary">{text.hint}</p>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h2 text-ink">{text.mailboxesHeading}</h2>
              <p className="mt-8 text-c1 text-ink-secondary">{text.mailboxesIntro}</p>
              <dl className="mt-24">
                {mailboxes.map((row) => (
                  <div key={row.address} className="border-t border-line py-16">
                    <dd>
                      <EmailLink address={row.address} className="text-h3 text-brand hover:text-brand-hover" />
                    </dd>
                    <dt className="mt-4 text-c2 text-ink-secondary">{row.label}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-16 max-w-[60ch] text-c2 text-ink-secondary">{text.languageNote}</p>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h2 text-ink">{text.formHeading}</h2>
              <p className="mt-8 max-w-[60ch] text-c1 text-ink-secondary">{text.formBody}</p>
              <div className="mt-16">
                <MarketButton href="/contact/" hrefLang="en" variant="secondary">
                  {text.formCta}
                </MarketButton>
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-10 xl:col-start-15">
            <h2 className="text-h2 text-ink">{text.factoryHeading}</h2>
            <p className="mt-8 text-c1 text-ink-secondary">{text.factoryBody}</p>

            <h2 className="mt-48 text-h2 text-ink">{text.representativesHeading}</h2>
            <dl className="mt-16">
              {text.representatives.map((rep) => (
                <div key={rep.region} className="border-t border-line py-16">
                  <dt className="text-c1 font-semibold text-ink">{rep.region}</dt>
                  <dd className="mt-4 text-c2 text-ink-secondary">
                    <span className="block">{rep.cities}</span>
                    <span className="mt-4 block">{rep.note}</span>
                    {rep.region === text.representatives[0]?.region && usPhone ? (
                      <a
                        href={`tel:${usPhone.replace(/\s/g, "")}`}
                        dir="ltr"
                        className="mt-4 inline-block text-brand hover:text-brand-hover"
                      >
                        {usPhone}
                      </a>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-48 text-h2 text-ink">{text.alibabaHeading}</h2>
            <p className="mt-8 text-c1 text-ink-secondary">{text.alibabaBody}</p>
            <div className="mt-16">
              <MarketLink href={siteSettings.alibaba.storefront} hrefLang="en">
                {text.alibabaCta}
              </MarketLink>
            </div>
          </div>
        </div>
      </section>
    </MarketMain>
  );
}
