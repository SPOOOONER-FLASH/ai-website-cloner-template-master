// Mega-menu preview, revised plan of 2026-10-13: the HYDE header with the four shelves on one
// 24-column template (ledger 4 tracks + four 5-track columns), over the 307 product-page preview.
// Data: src/menu.json, written by prep-menu.mjs from content/ and the live source strings.
// Behaviour (plan §2 "Pointer intent", "Touch", "Keyboard"):
//   mouse only: opening, switching and closing all wait SHELF_INTENT_MS; leaving a trigger cancels a
//   pending open; entering the panel cancels a pending switch or close. Touch and pen never hover-open.
//   A click or tap on a button trigger toggles. Focus never opens. Enter / Space toggles and moves
//   focus into the panel; Tab off the last link closes and moves on; Shift+Tab off the first returns
//   to the opener; Escape closes and returns focus. A swap between shelves does not animate.
// URL: ?pin=products|company|resources|buy|drawer  ?stage=2b (rail "Buy it now" opens the Buy shelf)  ?dir=rtl
import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { ProductPage } from "./Inner.jsx";
import M from "./menu.json";

// Pointer tolerance, not motion: it does not shrink under reduced motion.
const SHELF_INTENT_MS = 180;
const SHELVES = ["products", "company", "resources", "buy"];
const CURRENT_FAMILY = "panic-exit-devices"; // the page underneath is the 307 product page
const LIVE = "https://cantonlock.com";
const LANGS = ["ES", "PT", "FR", "DE", "JA", "KO", "TR", "RU", "AR", "EN"];
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const Q = new URLSearchParams(location.search);
const PIN = Q.get("pin");
const L = M.labels;
const MARK = "img/menu/hyde-logo-horizontal-black.svg"; // the live header artwork, drawn at 32px as HydeLockup does

const focusFirst = (id) => document.getElementById(`pv-shelf-${id}`)?.querySelector(FOCUSABLE)?.focus();
const isTabbable = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden" && !el.closest(".pv-shelf");

export function MenuPreview() {
  const [state, setState] = useState(() => {
    const pinned = SHELVES.includes(PIN);
    return { open: pinned ? PIN : null, swap: false, pinned };
  });
  const [drawer, setDrawer] = useState(PIN === "drawer");
  const [stage2b, setStage2b] = useState(Q.get("stage") === "2b");
  const [rtl, setRtl] = useState(Q.get("dir") === "rtl");
  const head = useRef(null);
  const timer = useRef(0);
  const opener = useRef(null); // the trigger that opened the shelf: each shelf has a wide-nav and a rail trigger
  const openedBy = useRef(null); // "hover" | "click" | "key"
  const drawerOpener = useRef(null);

  /** One state update per change, so the swap flag lands with the swap. `pin` set = reviewer control. */
  const show = useCallback((next, pin) => setState((s) => {
    if (s.pinned && pin === undefined) return s;
    return { open: next, swap: next !== null && s.open !== null && s.open !== next, pinned: pin ?? s.pinned };
  }), []);
  const cancel = () => clearTimeout(timer.current);
  const later = (fn) => { cancel(); timer.current = setTimeout(fn, SHELF_INTENT_MS); };
  const close = () => show(null);

  useEffect(() => {
    if (state.open && openedBy.current === "key") focusFirst(state.open);
  }, [state.open]);

  useEffect(() => {
    const down = (e) => { if (!head.current?.contains(e.target) && !e.target.closest?.(".pv-pin")) show(null); };
    const esc = (e) => {
      if (e.key !== "Escape") return;
      cancel();
      setState((s) => (s.open ? { open: null, swap: false, pinned: false } : s));
      if (head.current?.contains(document.activeElement)) opener.current?.focus();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", esc); cancel(); };
  }, [show]);

  const openFrom = (id, el, by) => { cancel(); opener.current = el; openedBy.current = by; show(id); };

  /** Mouse intent for every shelf trigger. Touch and pen are ignored here; they tap. */
  const intent = (id) => ({
    onPointerEnter: (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      if (state.open === id) cancel();
      else later(() => openFrom(id, el, "hover"));
    },
    onPointerLeave: (e) => { if (e.pointerType === "mouse") cancel(); },
  });
  /** Button triggers (Resources, Company, Buy, the Products disclosure): click / tap / Enter / Space toggle. */
  const button = (id, extra) => ({
    ...intent(id),
    type: "button",
    "aria-expanded": state.open === id,
    "aria-controls": `pv-shelf-${id}`,
    "data-open": state.open === id ? "" : undefined,
    onClick: (e) => {
      cancel();
      const by = e.detail === 0 ? "key" : "click";
      if (state.open !== id) return openFrom(id, e.currentTarget, by);
      // Deviation from "click toggles": the first click on a shelf the hover already opened keeps it
      // open, or the usual rest-then-click would close the menu the buyer is reaching for.
      if (by === "click" && openedBy.current === "hover") { openedBy.current = "click"; return; }
      close();
    },
    ...extra,
  });
  /** Products stays a plain link (no aria-expanded); its disclosure button follows it. */
  const productsLink = { ...intent("products"), href: `${LIVE}/products/`, "data-open": state.open === "products" ? "" : undefined };
  /** A plain nav item (Product Finder): resting on it closes the shelf after the grace period. */
  const closesShelf = {
    onPointerEnter: (e) => { if (e.pointerType === "mouse" && state.open) later(close); },
    onPointerLeave: (e) => { if (e.pointerType === "mouse") cancel(); },
  };

  const onKeyDown = (e) => {
    if (!state.open || e.key !== "Tab") return;
    // Tab from the opener goes into its panel, which sits after the whole header in the DOM.
    if (!e.shiftKey && e.target === opener.current) { e.preventDefault(); focusFirst(state.open); return; }
    const panel = document.getElementById(`pv-shelf-${state.open}`);
    if (!panel?.contains(e.target) || !opener.current) return;
    const items = [...panel.querySelectorAll(FOCUSABLE)];
    if (e.shiftKey && e.target === items[0]) { e.preventDefault(); opener.current.focus(); }
    else if (!e.shiftKey && e.target === items.at(-1)) {
      // The panels sit after the whole header in the DOM, so Tab-out goes to the item after the opener.
      e.preventDefault();
      const all = [...document.querySelectorAll(FOCUSABLE)].filter(isTabbable);
      const next = all[all.indexOf(opener.current) + 1];
      close();
      next?.focus();
    }
  };

  const openDrawer = (el) => { drawerOpener.current = el; cancel(); show(null, false); setDrawer(true); };
  const closeDrawer = () => { setDrawer(false); drawerOpener.current?.focus(); };
  const pin = (id) => { setDrawer(false); show(id, id !== null); };
  const disclosure = <button className="pv-disc" aria-label={L.drawerFamilies} {...button("products")}><Chevron /></button>;

  return (
    <div className={`pv-menu${new URLSearchParams(location.search).get("type") === "large" ? " pv-large" : ""}`}>
      <div
        ref={head}
        className="pv-head"
        dir={rtl ? "rtl" : undefined}
        data-shelf-swap={state.swap ? "" : undefined}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") cancel(); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse" && state.open) later(close); }}
        onBlur={(e) => { if (!head.current.contains(e.relatedTarget)) close(); }}
        onKeyDown={onKeyDown}
      >
        <div className="pv-band pv-top">
          {/* ≥1600: one row, nav left, mark centred. */}
          <nav className="pv-wide" aria-label="Main navigation">
            <span className="pv-pair"><a className="nm cur" {...productsLink}>{L.products}</a>{disclosure}</span>
            <a className="nm" href={`${LIVE}/product-finder/`} {...closesShelf}>{L.finder}</a>
            <button className="nm" {...button("resources")}>{L.resources}</button>
            <button className="nm" {...button("company")}>{L.company}</button>
            <button className="nm" {...button("buy")}>{L.buy}</button>
          </nav>
          <a className="pv-mark" href={`${LIVE}/`} aria-label="HYDE"><img src={MARK} alt="" /></a>
          <div className="pv-tools">
            <span className="pv-langs">
              {LANGS.map((c) => <a key={c} href={c === "EN" ? `${LIVE}/` : `${LIVE}/${c.toLowerCase()}/`} hrefLang={c.toLowerCase()} className={c === "EN" ? "on" : undefined}>{c}</a>)}
            </span>
            <button type="button" className="pv-icon" aria-label="Search">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" /><path d="m13 13 5 5" /></svg>
            </button>
            <button type="button" className="pv-icon" aria-label="Open menu" onClick={(e) => openDrawer(e.currentTarget)}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" /></svg>
            </button>
          </div>
        </div>

        {/* <1600: the rail. 1376–1599 its Products, Resources and Company open shelves; below 1376 plain links. */}
        <div className="pv-railbar">
          <div className="pv-band pv-railrow">
            <nav className="pv-rail" aria-label="Main navigation">
              <span className="pv-pair xl"><a className="ri nm cur" {...productsLink}>{L.products}</a>{disclosure}</span>
              <a className="ri cur lt-xl" href={`${LIVE}/products/`}>{L.products}</a>
              <a className="ri" href={`${LIVE}/product-finder/`} {...closesShelf}>{L.finder}</a>
              <button className="ri nm xl" {...button("resources")}>{L.resources}</button>
              <a className="ri lt-xl" href={`${LIVE}/guides/`}>{L.guides}</a>
              <a className="ri lt-xl" href={`${LIVE}/news/`}>{L.news}</a>
              <button className="ri nm xl" {...button("company")}>{L.company}</button>
              <a className="ri lt-xl" href={`${LIVE}/company/`}>{L.company}</a>
            </nav>
            {/* Stage 1/2: the CTA opens the sourcing drawer at every rail width. Stage 2b: at 1376–1599 it opens the Buy shelf. */}
            {stage2b && <button className="pv-cta xl" {...button("buy")}>{L.buy}<span className="chev" aria-hidden="true">›</span></button>}
            <button type="button" className={`pv-cta${stage2b ? " lt-xl" : ""}`} onClick={(e) => openDrawer(e.currentTarget)}>
              {L.buy}<span className="chev" aria-hidden="true">›</span>
            </button>
          </div>
        </div>

        <Shelf id="products" label={L.products} open={state.open} onEnter={cancel}><ProductsShelf /></Shelf>
        <Shelf id="company" label={L.company} open={state.open} onEnter={cancel}><CompanyShelf /></Shelf>
        <Shelf id="resources" label={L.resources} open={state.open} onEnter={cancel}><ResourcesShelf /></Shelf>
        <Shelf id="buy" label={L.buy} open={state.open} onEnter={cancel}><BuyShelf /></Shelf>
      </div>

      <MotionConfig reducedMotion="user"><ProductPage /></MotionConfig>

      {drawer && <Drawer onClose={closeDrawer} />}

      <div className="pv-pin" role="group" aria-label="评审用：固定展开一个菜单">
        <span>固定展开</span>
        {SHELVES.map((id) => (
          <button key={id} type="button" className="pin-xl" aria-pressed={state.pinned && state.open === id} onClick={() => pin(id)}>{L[id]}</button>
        ))}
        <button type="button" aria-pressed={drawer} onClick={() => { show(null, false); setDrawer(true); }}>手机抽屉</button>
        <button type="button" aria-pressed={!state.pinned && !drawer} onClick={() => pin(null)}>取消</button>
        <button type="button" className="pin-xl" aria-pressed={stage2b} onClick={() => setStage2b((v) => !v)}
          title="2b：1376–1599 宽度下 Buy it now 打开购买菜单（需甲方单独同意）">2b</button>
        <button type="button" className="pin-xl" aria-pressed={rtl} onClick={() => setRtl((v) => !v)} title="阿拉伯语方向：栅格与箭头镜像">RTL</button>
      </div>
    </div>
  );
}

const Chevron = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" /></svg>
);

function Shelf({ id, label, open, onEnter, children }) {
  // tabIndex -1: a click on blank shelf space keeps focus inside the header, so onBlur does not close it.
  return (
    <section id={`pv-shelf-${id}`} tabIndex={-1} aria-label={label} className={`pv-shelf${open === id ? " open" : ""}`} onPointerEnter={onEnter}>
      <div className="pv-clip">
        <div className="pv-scroll" data-lenis-prevent="">
          <div className="pv-band pv-pad"><div className="pv-g24">{children}</div></div>
        </div>
      </div>
    </section>
  );
}

function ProductsShelf() {
  const P = M.products;
  return (
    <>
      <div className="pv-ledger pv-ruled">
        <p className="pv-fig">{P.total}</p>
        <p className="pv-sm">{P.recordsLabel}</p>
        <p className="pv-sm pv-note">{P.noModel}</p>
        {P.tools.map((t) => <a key={t.href} className="pv-tool" href={t.href}><span className="mk">{t.label}</span></a>)}
      </div>
      {P.groups.map((g, i) => (
        <div key={g.title} className="pv-col">
          <p className="pv-gh" id={`pv-g${i}`}>{g.title}</p>
          <ul aria-labelledby={`pv-g${i}`}>
            {g.families.map((f) => (
              <li key={f.slug} className="pv-famrow">
                <a className="pv-fam" href={f.href} aria-current={f.slug === CURRENT_FAMILY ? "true" : undefined}>
                  <span className="mk">{f.label}</span><span className="pv-ct">{f.count}</span>
                </a>
                {f.children.length > 0 && (
                  <ul className="pv-subs">
                    {f.children.map((c) => <li key={c.slug}><a href={c.href}>{c.label}</a></li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

const Item = ({ label, href, count, children }) => (
  <div className="pv-col">
    <a className="pv-item" href={href}>
      <span className="pv-itrow"><span className="mk pv-it">{label}</span>{count !== undefined && <span className="pv-ct">{count}</span>}</span>
      <span className="pv-dt">{children}</span>
    </a>
  </div>
);

function CompanyShelf() {
  const C = M.company;
  const b = C.bau;
  // After the fair ends the detail falls back to the current line (decided at build time on the site).
  const bauLive = new Date() <= new Date(`${b.endDate}T23:59:59Z`);
  return (
    <>
      <div className="pv-ledger pv-ruled">
        <p className="pv-strong">{C.legalName}</p>
        <p className="pv-sm">{C.town}</p>
      </div>
      {C.items.map((it) => (
        <Item key={it.href} label={it.label} href={it.href}>
          {it.href.endsWith("/events/") && bauLive ? (
            <>
              <span className="pv-line">BAU {b.year}, {b.venue}</span>
              <span className="pv-line">{b.dates}</span>
              <span className="pv-line">{b.hall}, {b.stand}</span>
            </>
          ) : it.detail}
        </Item>
      ))}
    </>
  );
}

function ResourcesShelf() {
  return (
    <>
      {/* Every shelf opens with a ruled ledger; here it names the newest guide, which the reader can check. */}
      <div className="pv-ledger pv-ruled">
        <p className="pv-sm">{M.resources.latest.label}, {M.resources.latest.date}</p>
        <a className="pv-tool" href={M.resources.latest.href}><span className="mk">{M.resources.latest.title}</span></a>
      </div>
      {M.resources.items.map((it) => <Item key={it.href} label={it.label} href={it.href} count={it.count}>{it.detail}</Item>)}
    </>
  );
}

function BuyShelf() {
  const B = M.buy;
  return (
    <>
      <div className="pv-ledger pv-ruled">
        <p className="pv-sm">{B.promise}</p>
        <a className="pv-tool pv-mail" href={`mailto:${B.email}`}><span className="mk">{B.email}</span></a>
      </div>
      {B.items.map((it) => <Item key={it.href} label={it.label} href={it.href}>{it.detail}</Item>)}
      <div className="pv-col pv-col-cta">
        <a className="pv-ali" href={B.alibaba.href} target="_blank" rel="noopener noreferrer">
          <span>{B.alibaba.label}</span><span aria-hidden="true">›</span>
        </a>
      </div>
    </>
  );
}

/** The live drawer (SiteMenuDrawer.tsx): concierge, contact, phone-only family list in the four groups, footer. */
function Drawer({ onClose }) {
  const closeRef = useRef(null);
  const panel = useRef(null);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  const C = M.drawer.concierge;
  const B = M.buy;
  const contact = B.items.find((it) => it.href.endsWith("/contact/"));
  /** Escape closes; Tab wraps first <-> last, as the live handleKeyDown does. */
  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); onClose(); }
    if (e.key !== "Tab") return;
    const els = [...panel.current.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex="0"]')].filter((el) => el.getClientRects().length > 0);
    if (e.shiftKey && document.activeElement === els[0]) { e.preventDefault(); els.at(-1)?.focus(); }
    else if (!e.shiftKey && document.activeElement === els.at(-1)) { e.preventDefault(); els[0]?.focus(); }
  };
  return (
    <div className="pv-drawer-wrap" onKeyDown={onKeyDown}>
      <div className="pv-scrim" onClick={onClose} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Menu" className="pv-drawer">
        <div className="pv-dr-head">
          <img src={MARK} alt="HYDE" />
          <button ref={closeRef} type="button" className="pv-icon" aria-label="Close menu" onClick={onClose}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16" /></svg>
          </button>
        </div>
        <p className="pv-dr-title">{C.title}</p>
        <ul className="pv-dr-routes">
          {C.routes.map((r) => <li key={r.href}><a href={r.href}><span>{r.label}</span><span className="pv-dr-detail">{r.detail}</span></a></li>)}
        </ul>
        <div className="pv-dr-contact">
          <p className="pv-dr-promise">{B.promise}</p>
          <a className="mk" href={`mailto:${B.email}`}>{B.email}</a>
        </div>
        <details open className="pv-dr-fam">
          <summary>{L.drawerFamilies}<Chevron /></summary>
          {M.products.groups.map((g, i) => (
            <div key={g.title} className="pv-dr-group">
              <p className="pv-dr-gh" id={`pv-drg${i}`}>{g.title}</p>
              <ul aria-labelledby={`pv-drg${i}`}>
                {g.families.map((f) => {
                  if (!f.children.length) return (
                    <li key={f.slug}><a className="pv-dr-link" href={f.href}><span>{f.label}</span><span className="pv-dr-count">{f.count}</span></a></li>
                  );
                  const on = expanded === f.slug;
                  return (
                    <li key={f.slug}>
                      <button type="button" className="pv-dr-link" aria-expanded={on} aria-controls={`pv-dr-${f.slug}`}
                        onClick={() => setExpanded(on ? null : f.slug)}>
                        <span>{f.label}</span><span className="pv-dr-count">{f.count}<Chevron /></span>
                      </button>
                      {on && (
                        <ul id={`pv-dr-${f.slug}`} className="pv-dr-sub">
                          <li><a className="pv-dr-link" href={f.href}><span>All {f.label}</span><span className="pv-dr-count">{f.count}</span></a></li>
                          {f.children.map((c) => <li key={c.slug}><a className="pv-dr-link" href={c.href}><span>{c.label}</span></a></li>)}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </details>
        <footer className="pv-dr-foot">
          <a className="mk pv-strong" href={B.alibaba.href} target="_blank" rel="noopener noreferrer">{B.alibaba.label}</a>
          <a href={contact.href}>{contact.label}</a>
        </footer>
      </div>
    </div>
  );
}
