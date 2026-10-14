import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEvents, type TradeEvent } from "@/data/events";
import { pageMetadata } from "@/lib/seo";
import styles from "./EventsPage.module.css";

export const metadata: Metadata = pageMetadata({
  enPath: "/events",
  locale: "en",
  title: "Exhibitions + Market Visits",
  description:
    "Confirmed organiser dates and Canton Hyland market plans across Mexico, Japan, China, Germany, Brazil and Argentina. Request buyer meetings with our export team.",
});

/*
  2026-10-13, from the preview the client approved (「内页预览：Events 页……没问题 请上架」): the
  page leads with the fair we are exhibiting at, its dates set like the product page's model
  number on the one ink band, then every date as ruled rows. Past dates are marked "Held" at
  build time; the site rebuilds often enough for that to stay true.
*/
const day = (d: string) => new Date(`${d}T00:00:00Z`);
const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(day(d));
function dates(e: TradeEvent) {
  const [s, t] = [e.startDate!, e.endDate!];
  const sameMonth = s.slice(0, 7) === t.slice(0, 7);
  return {
    days: sameMonth ? `${fmt(s, { day: "numeric" })}–${fmt(t, { day: "numeric" })}` : `${fmt(s, { day: "numeric", month: "short" })}–${fmt(t, { day: "numeric", month: "short" })}`,
    month: sameMonth ? fmt(t, { month: "short", year: "numeric" }) : fmt(t, { year: "numeric" }),
  };
}

export default function EventsPage() {
  const events = getPublishedEvents();
  const today = new Date().toISOString().slice(0, 10);
  const lead = events.find((e) => e.status === "exhibiting" && e.endDate! >= today);
  const leadDates = lead ? dates(lead) : undefined;
  const hall = lead?.venue.match(/Hall (\w+)/)?.[1];
  const stand = lead?.venue.match(/Stand (\w+)/)?.[1];

  return (
    <main className="isolate flex-grow justify-self-start">
      {lead && leadDates ? (
        <section className={`layout ${styles.ink}`}>
          <div className="col-content grid w-full grid-cols gap-x gap-y-32">
            <div className="col-span-full xl:col-span-7">
              <p className="text-c2 text-surface/70">Events</p>
              <h1 className="mt-12 text-h3">Where to meet us</h1>
              <p className="mt-12 max-w-[36ch] text-c2 text-surface/70">The next date we are exhibiting, then every date on our calendar.</p>
            </div>
            <div className="col-span-full min-w-0 xl:col-span-16 xl:col-start-9">
              <p className="text-c1 text-surface/70">{lead.name}, {lead.city}</p>
              <p className={styles.figure}>
                <span className={styles.mask}><span>{leadDates.days}<small> {leadDates.month}</small></span></span>
              </p>
              <dl className={styles.sheet}>
                <div><dt>Venue</dt><dd>{lead.venue.split(",")[0]}</dd></div>
                {hall ? <div><dt>Hall</dt><dd>{hall}</dd></div> : null}
                {stand ? <div><dt>Stand</dt><dd>{stand}</dd></div> : null}
              </dl>
              <div className="mt-32 flex flex-wrap gap-16">
                {lead.relatedHref ? <Link href={lead.relatedHref} className={styles.btnLight}>{lead.relatedLabel}</Link> : null}
                <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>Organiser&apos;s dates</a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="layout mt-48 lg:mt-96">
          <div className="col-content">
            <p className="text-c2 text-ink-secondary">Events</p>
            <h1 className="mt-12 text-h1 text-ink">Where to meet us</h1>
          </div>
        </section>
      )}

      <section className={`layout ${styles.chapter}`}>
        <div className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full xl:col-span-7">
            <div className={styles.sticky}>
              <h2 className="text-h3 text-ink">Calendar</h2>
              <p className="mt-12 max-w-[36ch] text-c2 text-ink-secondary">
                Dates come from the organisers. Our status is stated separately: a planned visit is never shown as a stand.
              </p>
              <Link href="/contact" className="short-marker mt-24 inline-block text-c1 text-ink no-underline">Request a meeting</Link>
            </div>
          </div>
          <ol className="col-span-full min-w-0 border-t border-ink xl:col-span-16 xl:col-start-9">
            {events.map((event) => {
              const past = event.endDate! < today;
              const d = dates(event);
              return (
                <li key={event.slug} className={styles.row} data-past={past || undefined}>
                  <p className={styles.when}><span className={styles.days}>{d.days}</span><span className="text-c2 text-ink-secondary">{d.month}</span></p>
                  <div className="min-w-0">
                    <h3 className={styles.name}>{event.name}</h3>
                    <p className="mt-4 text-c2 text-ink-secondary">{event.venue.split(",")[0]}, {event.city}</p>
                    <p className="mt-12 max-w-[58ch] text-c2 text-ink-secondary">{event.summary}</p>
                  </div>
                  <div className={styles.status}>
                    <span className={styles.tag} data-kind={past ? "past" : event.status}>{past ? "Held" : event.status === "exhibiting" ? "Exhibiting" : event.statusLabel}</span>
                    {!past && event.relatedHref ? <Link href={event.relatedHref} className={styles.link}>{event.relatedLabel}</Link> : null}
                    {!past ? <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="short-marker mt-8 text-c2 text-ink-secondary">Organiser&apos;s dates</a> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
