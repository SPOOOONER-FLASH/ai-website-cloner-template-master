import Link from "next/link";
import type { Event, WithContext } from "schema-dts";
import { bauCopy, bauEvent, bauFeatured, type BauLocale } from "@/data/bau-2027";
import { absoluteUrl, legalName, siteUrl } from "@/data/site";
import { JsonLd } from "./JsonLd";
import { BauMeetingForm } from "./BauMeetingForm";

/**
 * /bau-2027/ and /de/bau-2027/, layout B "product first" (client, 2026-09-28).
 *
 * Desktop: the featured products fill eight of twelve columns and the booking form sits
 * in the remaining four, sticky while the reader scrolls the products. Phone: one column
 * in the order title → products → form → facts → about → band, which is why the form
 * comes second in the DOM and the grid, not the source order, places it on the right.
 */
export function BauColumn({ locale }: { locale: BauLocale }) {
  const copy = bauCopy(locale);
  const featured = bauFeatured(locale);
  const base = locale === "en" ? "" : `/${locale}`;
  const path = `${base}/bau-2027/`;

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-96">
      <JsonLd data={bauEventSchema(locale, path, featured[0]?.image?.src)} />
      <div className="layout">
        <div className="col-content space-y-64 lg:space-y-96">
          <header className="max-w-[72rem]">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{copy.kicker}</p>
            <h1 className="mt-16 text-h1 text-ink">{copy.title}</h1>
            <p className="mt-24 text-c1 text-ink-secondary">{copy.intro}</p>
          </header>

          <div className="grid grid-cols-1 gap-48 lg:grid-cols-12 lg:gap-x-32">
            <section aria-labelledby="bau-featured" className="lg:col-span-8 lg:row-start-1">
              <h2 id="bau-featured" className="text-h3 text-ink">
                {copy.featuredHeading}
              </h2>
              <p className="mt-12 max-w-[64rem] text-c2 text-ink-secondary">{copy.featuredIntro}</p>
              <ul className="mt-24 grid grid-cols-1 gap-16 sm:grid-cols-2 xl:grid-cols-3">
                {featured.map((item) =>
                  item.image ? (
                    <li key={item.href}>
                      <Link href={item.href} className="group flex h-full flex-col border border-line bg-surface">
                        <span className="block aspect-square overflow-hidden border-b border-line bg-white">
                          <img
                            src={item.image.src}
                            alt={item.image.label}
                            width="600"
                            height="600"
                            loading="lazy"
                            className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </span>
                        <span className="block p-16">
                          <span className="block text-c1 font-semibold text-ink group-hover:text-brand-hover">{item.title}</span>
                          <span className="mt-8 block text-c2 text-ink-secondary">{item.body}</span>
                        </span>
                      </Link>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex h-full min-h-[16rem] flex-col justify-end border border-line bg-surface-alt p-24 text-c1 text-ink hover:text-brand-hover"
                      >
                        {item.body}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </section>

            <aside
              aria-labelledby="bau-form"
              className="border border-line bg-surface-alt p-24 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1 lg:self-start lg:p-32"
            >
              <h2 id="bau-form" className="text-h3 text-ink">
                {copy.form.heading}
              </h2>
              <p className="mt-12 mb-24 text-c2 text-ink-secondary">{copy.form.intro}</p>
              <BauMeetingForm locale={locale} copy={copy.form} models={featured.map((item) => item.model)} />
            </aside>

            <dl className="grid grid-cols-2 border-t border-ink md:grid-cols-4 lg:col-span-8 lg:row-start-2">
              {copy.facts.map((fact) => (
                <div key={fact.label} className="border-b border-line py-16 pr-16 md:border-b-0 md:border-r md:pl-16 md:first:pl-0 md:last:border-r-0">
                  <dt className="text-kicker uppercase tracking-[0.12em] text-ink-secondary">{fact.label}</dt>
                  <dd className="mt-8 text-c1 text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <section aria-labelledby="bau-about" className="border-t border-line pt-32 lg:col-span-8 lg:row-start-3">
              <h2 id="bau-about" className="text-h3 text-ink">
                {copy.about.heading}
              </h2>
              <p className="mt-16 max-w-[64rem] text-c1 text-ink">{copy.about.body}</p>
            </section>
          </div>

          <section className="flex flex-col gap-24 bg-surface-dark p-32 text-surface md:flex-row md:items-center md:justify-between lg:p-48">
            <div className="max-w-[60rem]">
              <h2 className="text-h3">{copy.notComing.heading}</h2>
              <p className="mt-12 text-c1 opacity-80">{copy.notComing.body}</p>
            </div>
            <Link
              href={`${base}/contact/`}
              className="inline-flex flex-none items-center justify-center bg-surface px-24 py-12 text-c1 font-semibold text-ink hover:bg-surface-alt"
            >
              {copy.notComing.cta}
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

/**
 * The fair as an Event: the organizer's dates and venue, and our stand in the name. Only
 * facts from content/bau-2027.json; the organizer is Messe München, not us.
 */
function bauEventSchema(locale: BauLocale, path: string, image?: string): WithContext<Event> {
  const copy = bauCopy(locale);
  const [street, postcodeCity] = bauEvent.address.split(", ");
  const [postalCode, ...city] = postcodeCity.split(" ");
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: copy.seoTitle,
    description: copy.seoDescription,
    url: absoluteUrl(path),
    inLanguage: locale,
    startDate: bauEvent.startDate,
    endDate: bauEvent.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(image ? { image: [absoluteUrl(image)] } : {}),
    location: {
      "@type": "Place",
      name: `${bauEvent.venue}, Hall ${bauEvent.hall}, Stand ${bauEvent.stand}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: street,
        postalCode,
        addressLocality: city.join(" "),
        addressCountry: "DE",
      },
    },
    organizer: { "@type": "Organization", name: "Messe München", url: "https://bau-muenchen.com/" },
    performer: { "@type": "Organization", name: legalName, url: siteUrl },
  };
}
