// Product Finder preview, revised plan (2026-10-13): Catalog, Configurator and Studio as one layout —
// the subject on the left, a panel on the right (the product page's 13 | 10 buy-box split from 1376px).
// Each view sets at most one figure at display size: none in the Catalog (a ruled model schedule),
// the match count in the Configurator, the order code in the Studio. Motion: one rise, once, on first
// render of those two figures; every later change is instant.
// Every record, count and photograph comes from src/finder.json, written by prep-finder.mjs from the
// site's own data and src/lib code. Routes: #catalog?…  #configurator?…  #studio?model=…
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import D from "./finder.json";

const LIVE = "https://cantonlock.com";
const TOTAL = D.total;
const CAT = Object.fromEntries(D.cats.map((c) => [c.slug, c]));
const SUB = Object.fromEntries(D.cats.flatMap((c) => c.subs.map((s) => [s.slug, s])));
const PAGE_SIZE = 20;
const ANY = "any"; // the Configurator's Skip sentinel: satisfies() ignores it, the URL keeps it
const productHref = (r) => `${LIVE}/products/${r.cat}/${r.slug}/`;
const titleOf = (r) => (r.tbc ? r.name : r.model);
const matLabel = (v) => D.materialLabels[v] ?? v;
const models = (n) => (n === 1 ? "1 model" : `${n} models`);
const headerHeight = () => document.querySelector(".pv-finder .f-site")?.offsetHeight ?? 0;

/* ------------------------------------------------------------------ route */

const MODES = ["catalog", "configurator", "studio"];
function parseHash() {
  const [m, qs = ""] = location.hash.slice(1).split("?");
  return { hash: location.hash, mode: MODES.includes(m) ? m : "catalog", params: new URLSearchParams(qs) };
}
function useRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    // a hash navigation fires both events; the second must not look like a new answer
    const on = () => setRoute((r) => (r.hash === location.hash ? r : parseHash()));
    addEventListener("hashchange", on);
    addEventListener("popstate", on);
    return () => { removeEventListener("hashchange", on); removeEventListener("popstate", on); };
  }, []);
  // pushState, not location.hash: the render is synchronous, so a scroll or focus after it lands
  const go = useCallback((mode, params, { replace = false } = {}) => {
    const qs = params ? params.toString() : "";
    history[replace ? "replaceState" : "pushState"](null, "", `#${mode}${qs ? `?${qs}` : ""}`);
    setRoute(parseHash());
  }, []);
  return [route, go];
}

function useWide() {
  const q = "(min-width: 1032px)";
  const [wide, setWide] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const m = matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

export function FinderPreview() {
  const [{ mode, params }, go] = useRoute();
  const last = useRef(mode);
  useEffect(() => {
    if (last.current !== mode) scrollTo(0, 0);
    last.current = mode;
  }, [mode]);
  return (
    <div className="pv-finder">
      <SiteHeader />
      <BauBand />
      <main className="f-main">
        {mode === "catalog" && <Catalog params={params} go={go} />}
        {mode === "configurator" && <Configurator params={params} go={go} />}
        {mode === "studio" && <Studio params={params} go={go} />}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ site chrome (live, simplified) */

const Icon = ({ d }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d={d} /></svg>
);
const GLOBE = "M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM2.5 10h15M10 2.5c2 2 3 4.6 3 7.5s-1 5.5-3 7.5c-2-2-3-4.6-3-7.5s1-5.5 3-7.5Z";
const SEARCH = "M8.5 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM12.6 12.6 17 17";
const MENU = "M2.5 5.5h15M2.5 10h15M2.5 14.5h15";

function SiteHeader() {
  return (
    <header className="f-site">
      <div className="f-site-top">
        <div className="f-wrap f-site-row">
          <a href="#catalog" className="f-logo"><img src="img/hyde-horizontal-ink.svg" alt="HYDE" width="102" height="30" /></a>
          <div className="f-tools">
            <span className="f-langs"><Icon d={GLOBE} />
              {["ES", "PT", "FR", "DE", "JA", "KO", "TR", "RU", "AR"].map((l) => <span key={l} className="f-lang-x">{l}</span>)}
              <b>EN</b>
            </span>
            <span className="f-icon" aria-hidden="true"><Icon d={SEARCH} /></span>
            <span className="f-icon" aria-hidden="true"><Icon d={MENU} /></span>
          </div>
        </div>
      </div>
      <nav className="f-wrap f-site-row f-site-nav" aria-label="Main">
        <div className="f-site-links">
          <a href={`${LIVE}/products/`}>Products</a>
          <a href="#catalog" aria-current="page">Product Finder</a>
          <a href={`${LIVE}/guides/`}>Resources</a>
          <a href={`${LIVE}/company/`}>Company</a>
        </div>
        <span className="f-buy">Buy it now <span aria-hidden="true">›</span></span>
      </nav>
    </header>
  );
}

function BauBand() {
  return (
    <div className="f-bau">
      <div className="f-wrap f-bau-row">
        <b>HYDE at BAU 2027</b>
        <span className="f-bau-mid"><span>11 – 15 Jan 2027</span><span>Messe München</span><span>Hall C4 · Stand 523</span></span>
        <span className="f-bau-end"><b>Book a meeting <span aria-hidden="true">→</span></b><span>Deutsch</span></span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shared: breadcrumb, mode row, head */

const MODE_LIST = [["catalog", "Catalog"], ["configurator", "Configurator"], ["studio", "Studio"]];

/** Home › Products › {page}, then the three modes as plain links: a static 2px ink rule marks the current one. */
function Shell({ mode, page, children }) {
  return (
    <>
      <div className="f-wrap">
        <nav aria-label="Breadcrumb" className="f-crumb">
          <ol>
            <li><a href={`${LIVE}/`}>Home</a></li>
            <li><a href={`${LIVE}/products/`}>Products</a></li>
            <li aria-current="page">{page}</li>
          </ol>
        </nav>
      </div>
      <nav className="f-modes" aria-label="How to browse the catalog">
        <div className="f-wrap f-modes-row">
          {MODE_LIST.map(([k, label]) => <a key={k} href={`#${k}`} aria-current={k === mode ? "page" : undefined}>{label}</a>)}
        </div>
      </nav>
      <div className="f-wrap f-body">{children}</div>
    </>
  );
}

function Head({ title, lede, children }) {
  return (
    <div className="f-head">
      <h1 className="f-h1">{title}</h1>
      <p className="f-lede">{lede}</p>
      {children}
    </div>
  );
}

const Dash = () => (<><span aria-hidden="true">—</span><span className="f-vh">Not stated</span></>);

/** One schedule row: the whole row is the link. Model, name, one stated dimension (or a dash). */
function Row({ r }) {
  return (
    <li>
      <a className="f-row" href={productHref(r)}>
        <span className="f-thumb"><img src={r.img} alt="" loading="lazy" decoding="async" /></span>
        <span className="f-row-id">
          <span className="f-row-model">{titleOf(r)}</span>
          <span className="f-row-name">{r.tbc ? "Model code to be confirmed" : r.name}</span>
        </span>
        <span className="f-fig">
          <span className="f-fig-l">{r.figure ? r.figure.label : "Dimensions"}</span>
          <span className="f-fig-v">{r.figure ? r.figure.value : <Dash />}</span>
        </span>
      </a>
    </li>
  );
}

/* ------------------------------------------------------------------ catalog */

const FACETS = ["category", "type", "material", "finish"];
const valuesFor = (r, key) =>
  key === "category" ? [r.cat] : key === "type" ? (r.sub ? [r.sub] : []) : key === "material" ? (r.material ? [r.material] : []) : r.finishes;
const matchesQuery = (r, q) => q.trim().toLowerCase().split(/\s+/).filter(Boolean).every((t) => r.q.includes(t));
const filterBy = (sel, q, skip) =>
  D.records.filter((r) => matchesQuery(r, q) && FACETS.every((k) => k === skip || !sel[k].length || sel[k].some((v) => valuesFor(r, k).includes(v))));
function countsFor(pool, key) {
  const m = new Map();
  for (const r of pool) for (const v of valuesFor(r, key)) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
}
const byCount = (m) => [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

function Catalog({ params, go }) {
  const wide = useWide();
  const sel = useMemo(() => Object.fromEntries(FACETS.map((k) => [k, params.getAll(k)])), [params]);
  const q = params.get("q") ?? "";
  const active = FACETS.reduce((n, k) => n + sel[k].length, 0) + (q.trim() ? 1 : 0);
  const results = useMemo(() => filterBy(sel, q), [sel, q]);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(params.get("page")) || 1));
  const oneCat = sel.category.length === 1;
  const sched = useRef(null);
  const dialog = useRef(null);
  const countText = active ? `${results.length} of ${TOTAL} models` : models(TOTAL);

  /** Bring the schedule's head back into view when it has scrolled above the header. */
  const toSchedule = (always) => requestAnimationFrame(() => {
    const el = sched.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY - headerHeight() - 16;
    if (always || scrollY > top) scrollTo({ top, behavior: "instant" });
  });
  const write = (next, opts) => {
    const p = new URLSearchParams();
    for (const k of FACETS) for (const v of next.sel[k]) p.append(k, v);
    if (next.q) p.set("q", next.q);
    if (next.page > 1) p.set("page", String(next.page));
    go("catalog", p, opts);
  };
  const toggle = (key, value) => {
    const on = sel[key].includes(value);
    const next = { ...sel, [key]: on ? sel[key].filter((v) => v !== value) : [...sel[key], value] };
    // Type, material and finish are offered inside one category; a new category set starts them afresh.
    if (key === "category") Object.assign(next, { type: [], material: [], finish: [] });
    write({ sel: next, q, page: 1 }, { replace: true });
    if (wide) toSchedule(false);
  };
  const clear = () => write({ sel: Object.fromEntries(FACETS.map((k) => [k, []])), q: "", page: 1 });
  const setQuery = (text) => write({ sel, q: text, page: 1 }, { replace: true });
  const setPage = (n) => { write({ sel, q, page: n }); toSchedule(true); };

  // group heads: category name and its count, where a category's run starts on this page
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const perCat = countsFor(results, "category");
  const groups = [];
  for (const r of shown) {
    if (groups.at(-1)?.cat !== r.cat) groups.push({ cat: r.cat, rows: [] });
    groups.at(-1).rows.push(r);
  }
  const sheet = <FilterSheet sel={sel} q={q} active={active} onToggle={toggle} onClear={clear} />;

  return (
    <Shell mode="catalog" page="Product Finder">
      <div className="f-split f-catalog">
        <Head title="Product Finder"
          lede="Search the way you already write a door schedule: by category, type, material and finish. Your selection stays in the link, so a colleague opens exactly the list you see." />

        <aside className="f-panel" {...(wide ? { tabIndex: 0, role: "region", "aria-label": "Filters" } : {})}>
          <p className="f-count" role="status">{countText}</p>
          <label className="f-label f-search-l" htmlFor="f-q">Search</label>
          <input id="f-q" className="f-input" type="search" placeholder="Model, name or finish…" value={q} onChange={(e) => setQuery(e.target.value)} />
          {wide ? sheet : (
            <button type="button" className="f-btn f-btn-secondary f-filters" onClick={() => dialog.current?.showModal()}>
              Filters{active ? ` (${active})` : ""}
            </button>
          )}
        </aside>

        <section className="f-sched" ref={sched} aria-label={countText}>
          {results.length === 0 ? (
            <div className="f-empty">
              <p className="f-empty-t">Nothing matches this combination.</p>
              <p><button type="button" className="f-u" onClick={clear}>Clear all ({active})</button></p>
              <p className="f-empty-h">Or answer a few questions in the <a className="f-u" href="#configurator">Configurator</a>.</p>
            </div>
          ) : (
            groups.map((g, i) => (
              <section key={`${g.cat}-${i}`} className="f-group" aria-labelledby={oneCat && wide ? undefined : `g-${g.cat}`}>
                {/* one category: the wide panel names it; on a phone the filters sit behind a button, so the heading does */}
                {(!oneCat || !wide) && (
                  <h2 id={`g-${g.cat}`} className="f-group-head">
                    <span>{CAT[g.cat].name}</span> <span className="f-n">{perCat.get(g.cat)}</span>
                  </h2>
                )}
                <ol className="f-rows">{g.rows.map((r) => <Row key={r.slug} r={r} />)}</ol>
              </section>
            ))
          )}
          {pages > 1 && <Pagination page={page} pages={pages} onPage={setPage} />}
        </section>
      </div>

      {!wide && (
        <dialog ref={dialog} className="f-dialog" aria-labelledby="f-dlg-h" onClick={(e) => e.target === dialog.current && dialog.current.close()}>
          <div className="f-dlg-in">
            <div className="f-dlg-head">
              <h2 id="f-dlg-h">Filters</h2>
              <button type="button" className="f-u f-dlg-close" onClick={() => dialog.current.close()}>Close</button>
            </div>
            <div className="f-dlg-body">{sheet}</div>
            <div className="f-dlg-foot">
              <button type="button" className="f-btn f-btn-primary" onClick={() => { dialog.current.close(); toSchedule(false); }}>
                Show {models(results.length)}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </Shell>
  );
}

/** Category as a ruled sheet of native checkboxes; Type and Material-and-finish only inside one category. */
function FilterSheet({ sel, q, active, onToggle, onClear }) {
  const one = sel.category.length === 1 ? CAT[sel.category[0]] : null;
  const mfN = sel.material.length + sel.finish.length;
  const [mfOpen, setMfOpen] = useState(mfN > 0);
  const cell = (key, value, label, n) => {
    const checked = sel[key].includes(value);
    return (
      <label key={value} className="f-cell" data-zero={!n || undefined}>
        <input type="checkbox" checked={checked} disabled={!n && !checked} onChange={() => onToggle(key, value)} />
        <span className="f-cell-name">{label}</span>
        <span className="f-cell-n">{n ?? 0}</span>
      </label>
    );
  };
  const listed = (key) => {
    const counts = countsFor(filterBy(sel, q, key), key);
    for (const v of sel[key]) if (!counts.has(v)) counts.set(v, 0);
    return byCount(counts);
  };
  const catCounts = countsFor(filterBy(sel, q, "category"), "category");
  const typeCounts = countsFor(filterBy(sel, q, "type"), "type");
  const showType = (one && one.subs.length > 1) || sel.type.length > 0;
  const showMF = one || mfN > 0;
  return (
    <div className="f-sheet">
      <fieldset className="f-fs">
        <legend className="f-label">Category</legend>
        <div className="f-cells f-cells-2">{D.cats.map((c) => cell("category", c.slug, c.name, catCounts.get(c.slug)))}</div>
      </fieldset>
      {showType && (
        <fieldset className="f-fs">
          <legend className="f-label">Type</legend>
          <div className="f-cells">
            {(one ? one.subs.map((s) => s.slug) : sel.type).map((s) => cell("type", s, SUB[s]?.name ?? s, typeCounts.get(s)))}
          </div>
        </fieldset>
      )}
      {showMF && (
        <details className="f-more" open={mfOpen} onToggle={(e) => setMfOpen(e.currentTarget.open)}>
          <summary>Material and finish{mfN ? ` (${mfN})` : ""}</summary>
          <fieldset className="f-fs">
            <legend className="f-label">Material</legend>
            <div className="f-cells">{listed("material").map(([v, n]) => cell("material", v, matLabel(v), n))}</div>
          </fieldset>
          <fieldset className="f-fs">
            <legend className="f-label">Finish</legend>
            <div className="f-cells">{listed("finish").map(([v, n]) => cell("finish", v, v, n))}</div>
          </fieldset>
        </details>
      )}
      {active > 0 && <button type="button" className="f-u f-clear" onClick={onClear}>Clear all ({active})</button>}
    </div>
  );
}

function Pagination({ page, pages, onPage }) {
  const want = new Set([1, pages, page - 1, page, page + 1, page <= 2 ? 3 : 0, page >= pages - 1 ? pages - 2 : 0]);
  const nums = [...want].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return (
    <nav className="f-pages" aria-label="Pages">
      <div className="f-pages-nums">
        <button type="button" disabled={page === 1} onClick={() => onPage(page - 1)}>Previous</button>
        {nums.map((n, i) => (
          <span key={n} className="f-pages-n">
            {i > 0 && n - nums[i - 1] > 1 && <span aria-hidden="true">…</span>}
            <button type="button" aria-current={n === page ? "page" : undefined} onClick={() => onPage(n)}>{n}</button>
          </span>
        ))}
        <button type="button" disabled={page === pages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
      <p className="f-pages-of">Page {page} of {pages}</p>
    </nav>
  );
}

/* ------------------------------------------------------------------ configurator */

const STEPS = D.steps;
const cValues = (r, key) =>
  key === "category" ? [r.cat] : key === "subCategory" ? (r.sub ? [r.sub] : []) : key === "material" ? (r.material ? [r.material] : []) : r.finishes;
const satisfies = (r, a) => Object.entries(a).every(([k, v]) => !v || v === ANY || cValues(r, k).includes(v));
const remaining = (a) => D.records.filter((r) => satisfies(r, a));
function optionsFor(a, key) {
  const m = new Map();
  for (const r of remaining({ ...a, [key]: undefined })) for (const v of cValues(r, key)) {
    const e = m.get(v) ?? { count: 0, img: r.img }; // the first record in catalogue order, as live
    e.count++;
    m.set(v, e);
  }
  return [...m.entries()].map(([value, e]) => ({ value, ...e })).sort((x, y) => y.count - x.count || x.value.localeCompare(y.value));
}
const stated = (left, key) => left.filter((r) => cValues(r, key).length).length;
/** The next question: unanswered, more than one option, and its options cover at least half of what is left. */
function nextStep(a) {
  const left = remaining(a);
  if (left.length <= 3) return null;
  return STEPS.find((s) => !a[s.key] && optionsFor(a, s.key).length > 1 && stated(left, s.key) * 2 >= left.length) ?? null;
}
const optionLabel = (key, v) => (key === "category" ? CAT[v]?.name ?? v : key === "subCategory" ? SUB[v]?.name ?? v : key === "material" ? matLabel(v) : v);
const CATALOG_KEY = { category: "category", subCategory: "type", material: "material", finish: "finish" };
/** Every answered facet, so the Catalog opens on the same count the panel shows. */
const toCatalog = (a) => {
  const p = new URLSearchParams();
  for (const s of STEPS) if (a[s.key] && a[s.key] !== ANY) p.append(CATALOG_KEY[s.key], a[s.key]);
  return `#catalog?${p}`;
};
function answersFrom(params) {
  const a = {};
  for (const s of STEPS) {
    const v = params.get(s.key);
    if (!v) continue;
    if (s.key === "category" && !CAT[v]) break; // Category is never skipped; nothing after a bad one counts
    a[s.key] = v;
  }
  if (!a.category) return {};
  return a;
}

function Configurator({ params, go }) {
  const wide = useWide();
  const answersKey = JSON.stringify(answersFrom(params));
  const answers = useMemo(() => JSON.parse(answersKey), [answersKey]);
  const left = useMemo(() => remaining(answers), [answers]);
  const step = useMemo(() => nextStep(answers), [answers]);
  const answered = STEPS.filter((s) => answers[s.key] && answers[s.key] !== ANY);
  const panel = useRef(null);
  const focusEl = useRef(null);
  const first = useRef(true);

  // After an answer: the count and the next question both on screen, focus on the question, no animation.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!wide) panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
    else {
      const top = focusEl.current?.getBoundingClientRect().top ?? 0;
      if (top < headerHeight() + 16) scrollTo({ top: scrollY + top - headerHeight() - 24, behavior: "instant" });
    }
    focusEl.current?.focus({ preventScroll: true });
  }, [answers]); // eslint-disable-line react-hooks/exhaustive-deps

  const write = (a) => {
    const p = new URLSearchParams();
    for (const s of STEPS) if (a[s.key]) p.set(s.key, a[s.key]);
    go("configurator", p);
  };
  const answer = (key, value) => write({ ...answers, [key]: value });
  const revise = (key) => {
    const a = {};
    for (const s of STEPS) { if (s.key === key) break; if (answers[s.key]) a[s.key] = answers[s.key]; }
    write(a);
  };
  // the live form reads only product, model and from (src/lib/inquiry-prefill.ts), so the answers ride in product
  const quote = `${LIVE}/contact/#${new URLSearchParams({
    product: left.length === 1 ? titleOf(left[0]) : answered.map((s) => `${s.label}: ${optionLabel(s.key, answers[s.key])}`).join("; "),
  })}`;
  const actions = (
    <>
      <div className="f-actions">
        {left.length > 1 && <a className="f-btn f-btn-inverse" href={toCatalog(answers)}>Open these {left.length} in the Catalog</a>}
        {answered.length > 0 && <a className="f-btn f-btn-inverse-ghost" href={quote}>Request a quote for this configuration</a>}
      </div>
      {answered.length > 0 && <p className="f-help">The contact form opens with these answers in its Product field.</p>}
    </>
  );

  let body;
  if (step) {
    const options = optionsFor(answers, step.key);
    const silent = left.length - stated(left, step.key);
    const thumbs = step.key === "category" || step.key === "subCategory";
    body = (
      <>
        <h2 className="f-q" tabIndex={-1} ref={focusEl}>{step.question}</h2>
        {step.hint && <p className="f-q-hint">{step.hint}</p>}
        <ul className="f-opts">
          {options.map((o) => (
            <li key={o.value}>
              <button type="button" className="f-opt" data-thumb={thumbs || undefined} onClick={() => answer(step.key, o.value)}>
                {thumbs && <span className="f-thumb f-thumb-s"><img src={o.img} alt="" loading="lazy" decoding="async" /></span>}
                <span className="f-opt-text">
                  <span className="f-opt-label">{optionLabel(step.key, o.value)}</span>
                  {D.notes[o.value] && <span className="f-opt-note">{D.notes[o.value]}</span>}
                </span>
                <span className="f-opt-n">{o.count}</span>
              </button>
            </li>
          ))}
          {step.key !== "category" && (
            <li className="f-skip">
              <button type="button" className="f-opt" onClick={() => answer(step.key, ANY)}>
                <span className="f-opt-text">
                  <span className="f-opt-label">Skip this question</span>
                  {silent > 0 && <span className="f-opt-note">{silent === 1 ? "1 of these does not state it" : `${silent} of these do not state it`}</span>}
                </span>
                <span className="f-opt-n">{left.length}</span>
              </button>
            </li>
          )}
        </ul>
      </>
    );
  } else {
    body = (
      <>
        <h2 className="f-vh" tabIndex={-1} ref={focusEl}>{left.length === 1 ? "1 model matches" : `${left.length} models match`}</h2>
        <ol className="f-rows f-rows-top">{left.slice(0, PAGE_SIZE).map((r) => <Row key={r.slug} r={r} />)}</ol>
        {left.length > PAGE_SIZE && (
          <p className="f-shown">{PAGE_SIZE} of {left.length} shown. <a className="f-u" href={toCatalog(answers)}>See all {left.length} in the Catalog</a></p>
        )}
      </>
    );
  }

  return (
    <Shell mode="configurator" page="Configurator">
      <div className="f-split f-config">
        <Head title="Find the right model"
          lede="Answer what you know and we narrow the catalog to the models that match. Every choice we show still leads to a part we supply." />

        <aside className="f-panel f-ink" aria-label="Your selection" ref={panel}>
          <p className="f-match" aria-live="polite">
            <span className="f-rise"><span className="f-display">{left.length}</span></span>{" "}
            <span className="f-match-unit">{left.length === 1 ? "model matches" : "models match"}</span>
          </p>
          {answered.length > 0 && (
            <dl className="f-answers">
              {answered.map((s) => (
                <div key={s.key}>
                  <dt>{s.label}</dt>
                  <dd>{optionLabel(s.key, answers[s.key])}</dd>
                  <button type="button" onClick={() => revise(s.key)}>Change<span className="f-vh"> {s.label}</span></button>
                </div>
              ))}
            </dl>
          )}
          {wide && actions}
        </aside>

        <div className="f-question">{body}</div>
        {/* phone: the panel is only the count and the answers, so the next question starts on screen */}
        {!wide && <div className="f-ink f-ink-after">{actions}</div>}
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ studio */

const S = D.studio;
const MEMBERS = Object.fromEntries(S.families.flatMap((f) => f.members.map((m) => [m.slug, { family: f, member: m }])));
const REC = Object.fromEntries(D.records.map((r) => [r.slug, r]));
const finishName = (code) => code.split("+").map((c) => S.finishNames[c] ?? c).join(" / ");
/** The member nearest to `want` in `family`: same finish and function, then either, then the first. */
const nearest = (family, want) =>
  family.members.find((m) => m.finish === want.finish && m.fn === want.fn) ??
  family.members.find((m) => m.finish === want.finish) ??
  family.members.find((m) => m.fn === want.fn) ??
  family.members[0];

function Studio({ params, go }) {
  const slug = MEMBERS[params.get("model")] ? params.get("model") : S.opening;
  const { family, member } = MEMBERS[slug];
  const record = REC[member.slug];
  const pick = (m) => go("studio", new URLSearchParams({ model: m.slug }), { replace: true });
  const finishes = [...new Set(family.members.map((m) => m.finish).filter(Boolean))];
  const fns = [...new Set(family.members.map((m) => m.fn).filter(Boolean))];
  /* Change one axis, keep the other where that combination is made. */
  const memberFor = (axis, value) => {
    const other = axis === "finish" ? "fn" : "finish";
    const c = family.members.filter((m) => m[axis] === value);
    return c.find((m) => m[other] === member[other]) ?? c[0];
  };
  /** "PB only" when this option is not made in the current finish (or function), so choosing it changes that too. */
  const onlyIn = (axis, value) => {
    const other = axis === "finish" ? "fn" : "finish";
    const c = family.members.filter((m) => m[axis] === value);
    if (!member[other] || c.some((m) => m[other] === member[other])) return null;
    return `${[...new Set(c.map((m) => m[other]).filter(Boolean))].map((v) => v.replace("+", "")).join(", ")} only`;
  };
  const rows = [
    ["Range", "range", S.ranges.map((r) => ({ key: r.slug, label: r.name, on: r.slug === family.cat, pick: () => pick(nearest(S.families.find((f) => f.cat === r.slug), member)) }))],
    ["Model", "model", S.families.filter((f) => f.cat === family.cat).map((f) => ({ key: f.key, label: f.base, on: f.key === family.key, pick: () => pick(nearest(f, member)) }))],
    ["Finish", "finish", finishes.map((c) => ({ key: c, code: c.replace("+", ""), label: finishName(c), note: onlyIn("finish", c), on: c === member.finish, pick: () => pick(memberFor("finish", c)) }))],
    // IK and KT have no name in the order-code table: say so rather than guess one
    ["Function", "fn", fns.map((c) => ({ key: c, code: c, label: S.functions[c] ?? "", tbc: !S.functions[c], note: onlyIn("fn", c), on: c === member.fn, pick: () => pick(memberFor("fn", c)) }))],
  ].filter(([, , opts]) => opts.length);
  const long = member.model.length > 6 || /\s/.test(member.model);

  return (
    <Shell mode="studio" page="Studio">
      <div className="f-split f-studio">
        <Head title="Configurator Studio"
          lede="Choose a range and a model, then switch finish and function. Every picture is a photograph of the exact model, and the order code assembles as you choose.">
          <p className="f-scope">{S.models} of the {TOTAL} models: the {S.families.length} families the catalog lists in more than one finish or function.</p>
        </Head>

        {/* the code and the controls are one right-hand column from 1032px; below it, display: contents */}
        <div className="f-sside">
        <div className="f-scode" aria-live="polite">
          <p className="f-code-l">Order code</p>
          <p className="f-rise"><span className="f-code" data-long={long || undefined}>{member.model}</span></p>
          <p className="f-sname">{record.name}</p>
        </div>

        <div className="f-scontrols">
          {rows.map(([legend, name, opts]) => (
            <fieldset key={name} className="f-tog">
              <legend className="f-tog-l">{legend}</legend>
              <div className="f-tog-opts">
                {opts.map((o) => (
                  <label key={o.key} className="f-tog-o">
                    <input type="radio" name={`studio-${name}`} checked={o.on} onChange={o.pick} />
                    <span>
                      {o.code && <b>{o.code}</b>}{o.code ? " " : ""}{o.label}
                      {o.tbc && <>{" "}<span className="f-tog-note">name to be confirmed</span></>}
                      {o.note && <>{" "}<span className="f-tog-note">({o.note})</span></>}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="f-studio-actions">
            <a className="f-btn f-btn-primary" href={`${LIVE}/contact/#${new URLSearchParams({ model: member.model })}`}>Request a quote for {member.model}</a>
            <a className="f-btn f-btn-secondary" href={productHref(record)}>Product page</a>
          </div>
        </div>
        </div>

        <figure className="f-sstage">
          <div className="f-stage">
            {family.members.map((m) => (
              <img key={m.slug} hidden={m.slug !== slug} src={REC[m.slug].img} alt={m.slug === slug ? `${m.model} ${record.name}` : ""} decoding="async" />
            ))}
          </div>
          {record.fnSpec && <figcaption className="f-caption">{record.fnSpec}</figcaption>}
        </figure>
      </div>
    </Shell>
  );
}
