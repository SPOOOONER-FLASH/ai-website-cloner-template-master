import { useEffect, useMemo, useRef, useState } from "react";
import data from "./pages.json";

/*
  Inner pages in the product page's language (client 2026-10-13: 「内页 内容 要上浮视差等等吗」).
  The product page works because of three things these pages lacked: a figure set as the
  headline, one ink band as the only loud moment, and rows under an ink rule instead of grey
  paragraphs. Motion stays where the product page has it: the headline rises once on load, and
  the FAQ answers open. Rows are data, so they do not fade in.
*/

const LIVE = "https://cantonlock.com";
const TODAY = new Date();
const iso = (d) => new Date(`${d}T00:00:00Z`);
const fmt = (d, o) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(iso(d));
const days = (a, b) => `${fmt(a, { day: "numeric" })}–${fmt(b, { day: "numeric" })}`;
const month = (d) => fmt(d, { month: "short", year: "numeric" });

function Header() {
  return (
    <header className="pv-head">
      <div className="pv-wrap pv-headrow">
        <nav className="pv-nav" aria-label="Main">
          {["Products", "Product Finder", "Resources", "Company", "Buy it now"].map((l) => <a key={l} href="#">{l}</a>)}
        </nav>
        <img className="pv-logo" src="img/pages/hyde-logo.svg" alt="HYDE" />
        <span className="pv-langs">ES PT FR DE JA KO TR RU AR <b>EN</b></span>
      </div>
    </header>
  );
}

function Rise({ children, delay = 0 }) {
  return <span className="pv-mask"><span style={{ animationDelay: `${delay}ms` }}>{children}</span></span>;
}

/* ------------------------------------------------------------------ Events */

function Events() {
  const lead = data.events.find((e) => e.status === "exhibiting");
  const toGo = Math.ceil((iso(lead.startDate) - TODAY) / 864e5);
  const [hall, stand] = [lead.venue.match(/Hall (\w+)/)?.[1], lead.venue.match(/Stand (\w+)/)?.[1]];
  return (
    <main>
      <section className="pv-ink">
        <div className="pv-wrap pv-grid">
          <div className="pv-side">
            <p className="pv-c2 pv-on70">Events</p>
            <h1 className="pv-h3 pv-mt12">Where to meet us</h1>
            <p className="pv-c2 pv-on70 pv-mt12 pv-aside">The next date we are exhibiting, then every date on our calendar.</p>
          </div>
          <div className="pv-main">
            <p className="pv-c1 pv-on70">{lead.name}, {lead.city}</p>
            <h2 className="pv-figure"><Rise>{days(lead.startDate, lead.endDate)}<small> {month(lead.startDate)}</small></Rise></h2>
            <dl className="pv-sheet pv-sheet-ink">
              <div><dt>Venue</dt><dd>{lead.venue.split(",")[0]}</dd></div>
              <div><dt>Hall</dt><dd>{hall}</dd></div>
              <div><dt>Stand</dt><dd>{stand}</dd></div>
              {toGo > 0 && <div><dt>Opens in</dt><dd>{toGo} days</dd></div>}
            </dl>
            <div className="pv-actions">
              <a className="pv-btn pv-btn-light" href={`${LIVE}${lead.relatedHref}`}>Book a meeting at the stand</a>
              <a className="pv-btn pv-btn-ghost" href={lead.sourceUrl}>Organiser's dates</a>
            </div>
          </div>
        </div>
      </section>

      <section className="pv-chapter">
        <div className="pv-wrap pv-grid">
          <div className="pv-side"><div className="pv-sticky">
            <h2 className="pv-h3">Calendar</h2>
            <p className="pv-c2 pv-grey pv-mt12 pv-aside">Dates come from the organisers. Our status is stated separately: a planned visit is never shown as a stand.</p>
          </div></div>
          <ol className="pv-main pv-table">
            {data.events.map((e) => {
              const past = iso(e.endDate) < TODAY;
              return (
                <li key={e.slug} className="pv-event" data-past={past || undefined} data-lead={e === lead || undefined}>
                  <p className="pv-when"><span className="pv-days">{days(e.startDate, e.endDate)}</span><span className="pv-c2 pv-grey">{month(e.startDate)}</span></p>
                  <div>
                    <p className="pv-name">{e.name}</p>
                    <p className="pv-c2 pv-grey pv-mt4">{e.venue.split(",")[0]}, {e.city}</p>
                    <p className="pv-c2 pv-grey pv-mt12 pv-summary">{e.summary}</p>
                  </div>
                  <div className="pv-status">
                    <span className="pv-tag" data-kind={past ? "past" : e.status}>{past ? "Held" : e.status === "exhibiting" ? "Exhibiting" : e.statusLabel}</span>
                    {!past && <a className="pv-link pv-mt12" href={`${LIVE}${e.relatedHref}`}>{e.relatedLabel}</a>}
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

/* ------------------------------------------------------------------ FAQ */

function Faq() {
  const total = data.faq.reduce((n, g) => n + g.items.length, 0);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(() => new Set(["0-0"]));
  const [current, setCurrent] = useState(0);
  const refs = useRef([]);
  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    let n = 0;
    return data.faq.map((g, gi) => ({ ...g, gi, items: g.items.map((it, ii) => ({ ...it, key: `${gi}-${ii}`, no: ++n })).filter((it) => !t || `${it.q} ${it.a}`.toLowerCase().includes(t)) }));
  }, [q]);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setCurrent(Number(e.target.dataset.gi));
    }, { rootMargin: "-30% 0px -60% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [q]);

  const toggle = (k) => setOpen((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <main>
      <section className="pv-hero">
        <div className="pv-wrap pv-grid">
          <div className="pv-side">
            <p className="pv-c2 pv-grey">FAQ</p>
            <h1 className="pv-h3 pv-mt12">Before you order</h1>
          </div>
          <div className="pv-main">
            <p className="pv-figure pv-figure-ink"><Rise>{total}<small> answers</small></Rise></p>
            <p className="pv-lead pv-mt24">Minimum order, lead time, samples, payment, standards. If yours is not here, ask us: we would rather reply than have you guess.</p>
            <div className="pv-actions">
              <a className="pv-btn" href={`${LIVE}/contact/`}>Ask a question</a>
              <a className="pv-btn pv-btn-line" href={`${LIVE}/request/price-list/`}>Request the price list</a>
            </div>
          </div>
        </div>
      </section>

      <section className="pv-chapter">
        <div className="pv-wrap pv-grid">
          <div className="pv-side"><div className="pv-sticky">
            <label className="pv-search">
              <span className="pv-c2 pv-grey">Search the answers</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="MOQ, sample, EN 1125…" />
            </label>
            <p className="pv-c2 pv-grey pv-mt12" aria-live="polite"><b className="pv-count">{shown}</b> of {total}</p>
            <ol className="pv-index">
              {groups.map((g) => (
                <li key={g.gi} data-on={g.gi === current || undefined} data-empty={!g.items.length || undefined}>
                  <a href={`#g${g.gi}`} onClick={(e) => { e.preventDefault(); refs.current[g.gi]?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                    <span>{g.title}</span><span className="pv-c2 pv-grey">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div></div>
          <div className="pv-main">
            {groups.map((g) => (
              <section key={g.gi} id={`g${g.gi}`} data-gi={g.gi} ref={(el) => (refs.current[g.gi] = el)} className="pv-group" hidden={!g.items.length}>
                <h2 className="pv-h3">{g.title}</h2>
                <ul className="pv-table pv-mt24">
                  {g.items.map((it) => {
                    const on = open.has(it.key) || !!q.trim();
                    return (
                      <li key={it.key} className="pv-qa" data-open={on || undefined}>
                        <button type="button" aria-expanded={on} onClick={() => toggle(it.key)}>
                          <span className="pv-no">{String(it.no).padStart(2, "0")}</span>
                          <span className="pv-q">{it.q}</span>
                          <span className="pv-plus" aria-hidden="true" />
                        </button>
                        <div className="pv-a"><div><p>{it.a}</p></div></div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
            {!shown && <p className="pv-lead">Nothing matches “{q}”. <a className="pv-link" href={`${LIVE}/contact/`}>Ask the export team</a>.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ shell */

export function PagesPreview() {
  const [page, setPage] = useState(() => (location.hash === "#faq" ? "faq" : "events"));
  useEffect(() => {
    const on = () => { setPage(location.hash === "#faq" ? "faq" : "events"); scrollTo(0, 0); };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return (
    <div className="pv-pages" key={page}>
      <Header />
      {page === "faq" ? <Faq /> : <Events />}
      <nav className="pv-switch" aria-label="预览页面" lang="zh-CN">
        <a href="#events" data-on={page === "events" || undefined}>Events 页</a>
        <a href="#faq" data-on={page === "faq" || undefined}>FAQ 页</a>
      </nav>
    </div>
  );
}
