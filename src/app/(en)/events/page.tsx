import type { Metadata } from "next";
import Link from "next/link";
import { formatEventDateRange, getPublishedEvents } from "@/data/events";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/events",
  locale: "en",
  title: "Exhibitions + Market Visits",
  description:
    "Confirmed organiser dates and Canton Hyland meeting plans for Canton Fair, BAU Munich and FEICON Brazil.",
});

export default function EventsPage() {
  const events = getPublishedEvents();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Events</p>
            <h1 className="mt-16 text-h1 text-ink">Meet the market before the product list is fixed.</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              These dates come from the event organisers. Canton Hyland&apos;s status is shown
              separately: a planned visit or buyer meeting is not presented as an exhibition stand.
            </p>
            <Link
              href="/contact"
              className="short-marker short-marker-compact mt-32 text-c1 text-brand hover:text-brand-hover"
            >
              Request a meeting
            </Link>
          </div>
        </section>

        <section className="col-content border-t border-line">
          {events.map((event, index) => (
            <article
              key={event.slug}
              className="grid grid-cols gap-x gap-y-24 border-b border-line py-32 lg:py-48"
            >
              <div className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-3">
                <p className="text-kicker text-ink-secondary">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-16 text-h3 text-ink">
                  {formatEventDateRange(event.startDate!, event.endDate!)}
                </p>
              </div>
              <div className="col-span-full sm:col-span-3 md:col-span-5 xl:col-span-10">
                <p className="text-kicker uppercase tracking-[0.12em] text-ink-secondary">
                  {event.market}
                </p>
                <h2 className="mt-16 text-h2 text-ink">{event.name}</h2>
                <p className="mt-16 text-c1 text-ink-secondary">
                  {event.venue} · {event.city}
                </p>
              </div>
              <div className="col-span-full md:col-span-5 md:col-start-8 xl:col-span-9 xl:col-start-16">
                <p className="text-kicker text-ink">{event.statusLabel}</p>
                <p className="mt-16 text-c1 text-ink-secondary">{event.summary}</p>
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
                >
                  Verify organiser dates
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <h2 className="col-span-full lg:col-span-5 xl:col-span-8 text-h2 text-ink">
            Meeting information still needed
          </h2>
          <p className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15 text-c1 text-ink-secondary">
            Booth or meeting point, staff contact, appointment hours and the exact Japan event.
            Once supplied, these can be updated from the CMS without redesigning the page.
          </p>
        </section>
      </div>
    </main>
  );
}
