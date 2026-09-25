import type { Metadata } from "next";
import { Suspense } from "react";
import { EmailLink } from "@/components/site/EmailLink";
import { InquiryForm } from "@/components/site/InquiryForm";
import type { Locale } from "@/data/locales";
import { siteSettings } from "@/data/navigation";
import { representatives } from "@/data/representatives";
import { tx } from "@/lib/i18n";
import { localeMetadata } from "./shared";

export function contactMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/contact",
    "Door Hardware Factory in China: Contact the Export Team",
    "Talk to an export engineer about a specification, a sample or a quotation. Include door type, finish, applicable standard, quantity and destination market.",
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const mailboxes = [
    { email: siteSettings.contact.technicalEmail, label: tx(locale, "Drawings, specification and test reports") },
    { email: siteSettings.contact.email, label: tx(locale, "Orders, pricing and samples") },
    { email: siteSettings.contact.brandEmail, label: tx(locale, "OEM, private label and everything else") },
  ]
    .filter((row): row is { label: string; email: string } => Boolean(row.email))
    .reduce<{ label: string; email: string }[]>((rows, row) => {
      const same = rows.find((r) => r.email === row.email);
      if (same) same.label = `${same.label}; ${row.label}`;
      else rows.push({ ...row });
      return rows;
    }, []);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h1 className="text-h1 text-ink">{tx(locale, "Contact the factory. Talk to the people who make it.")}</h1>
            <p className="mt-24 text-c1 text-ink">
              {tx(locale, "Write to the export team about a model, a sample, an OEM part or a project quotation. An engineer reads it, in English or Spanish.")}
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              {tx(locale, "Tell us the door type, the finish, the standard, the quantity and the destination market, and our first reply can already be a useful one.")}
            </p>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h2 text-ink">{tx(locale, "Email us directly")}</h2>
              <p className="mt-8 text-c1 text-ink-secondary">
                {tx(locale, "Email is the fastest route to a quotation — an engineer reads it, not a queue. Pick the mailbox that matches your question and it reaches the right desk first time.")}
              </p>
              <dl className="mt-24">
                {mailboxes.map((row) => (
                  <div key={row.email} className="border-b border-line py-16">
                    <dt className="text-c2 text-ink-secondary">{row.label}</dt>
                    <dd className="mt-4">
                      <EmailLink address={row.email} className="short-marker short-marker-compact text-h3 text-brand hover:text-brand-hover" />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">{tx(locale, "Price list")}</h2>
              <p className="mt-8 max-w-[52ch] text-c1 text-ink-secondary">
                {tx(locale, "Trade pricing is not published. It moves with specification, finish and quantity, so a list without those three is a number nobody can order against — and a price list on a public URL is out of date the week after it is posted.")}
              </p>
              <p className="mt-16 max-w-[52ch] text-c1 text-ink-secondary">
                {tx(locale, "Ask for it in the form, or write to the orders address above, and say which families you buy and roughly what volume. You will get current prices for what you actually order rather than a PDF you have to translate into your own schedule.")}
              </p>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">{tx(locale, "Order through Alibaba, or directly")}</h2>
              <p className="mt-8 max-w-[52ch] text-c1 text-ink-secondary">
                {tx(locale, "Both work. Some buyers place their first order through Alibaba, with the platform's payment protection, and move to direct orders once they know us. Others order directly from the first container.")}
              </p>
              <p className="mt-16 max-w-[52ch] text-c1 text-ink-secondary">
                {tx(locale, "The same export team handles both, at the same prices and the same specification.")}
              </p>
              <a
                href={siteSettings.alibaba.storefront}
                rel="noopener"
                target="_blank"
                className="short-marker short-marker-compact mt-16 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                {tx(locale, "Visit our Alibaba storefront")}
              </a>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">{tx(locale, "Address")}</h2>
              <p className="mt-8 text-c2 text-ink-secondary">{tx(locale, "Manufacturing, and where inspection visits are received.")}</p>
              {siteSettings.contact.factoryAddress ? (
                <div className="mt-24">
                  <p className="text-c2 text-ink-secondary">{tx(locale, "Factory")}</p>
                  <address className="mt-4 not-italic text-c1 text-ink" dir="ltr">
                    {siteSettings.contact.factoryAddress}
                    <br />
                    {siteSettings.contact.city}, {siteSettings.contact.province}, {siteSettings.contact.country}
                  </address>
                </div>
              ) : null}
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">{tx(locale, "Representative contacts")}</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                {tx(locale, "Manufacturing is in Zhongshan. These are the people to reach in each market.")}
              </p>
              <ul className="mt-24 space-y-24">
                {representatives.map((rep) => (
                  <li key={`${rep.region}-${rep.city}`}>
                    <p className="text-c2 uppercase tracking-wide text-ink-tertiary">
                      {tx(locale, rep.region, { es: rep.regionEs, pt: rep.regionPt })}
                    </p>
                    <p className="mt-4 text-c1 text-ink">{rep.city}</p>
                    <address className="mt-4 not-italic text-c1 text-ink-secondary" dir="ltr">
                      {rep.address}
                    </address>
                    {rep.phone ? (
                      <a
                        href={`tel:${rep.phone.replace(/\s/g, "")}`}
                        dir="ltr"
                        className="short-marker short-marker-compact mt-8 inline-block text-c1 text-brand hover:text-brand-hover"
                      >
                        {rep.phone}
                      </a>
                    ) : null}
                    <EmailLink address={rep.email} className="short-marker short-marker-compact mt-4 block text-c1 text-brand hover:text-brand-hover" />
                    {rep.note ? (
                      <p className="mt-8 max-w-[46ch] text-c2 text-ink-secondary">
                        {tx(locale, rep.note, { es: rep.noteEs, pt: rep.notePt })}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">{tx(locale, "Current product catalog")}</h2>
              <p className="mt-8 text-c1 text-ink-secondary">
                {tx(locale, "79 pages, every published model with its spec table and an index at the back. Searchable text, bookmarks by family, and it opens as a spread. The document is in English.")}
              </p>
              <a
                className="short-marker short-marker-compact mt-16 text-c1 text-brand hover:text-brand-hover"
                href="/downloads/hyde-export-catalogue-2026.pdf"
                download
              >
                {tx(locale, "Download catalog (PDF, 6.1 MB)")}
              </a>
            </div>
          </div>
          <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
            <Suspense
              fallback={
                <p className="min-h-160 border-t border-line pt-16 text-c1 text-ink-secondary">{tx(locale, "Preparing inquiry form…")}</p>
              }
            >
              <InquiryForm locale={locale} />
            </Suspense>
          </div>
          <p className="col-span-full border-t border-line pt-16 text-c2 text-ink-secondary">
            {tx(locale, "The form reaches the same export desks as the addresses above. If it cannot send, the page keeps everything you typed and offers it as a ready-addressed email — your inquiry is not lost either way.")}
          </p>
        </section>
      </div>
    </main>
  );
}
