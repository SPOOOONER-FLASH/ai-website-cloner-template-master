// Inner-page previews: the 307 product page and the exit-device comparison guide, rebuilt with
// ideas from the four Yuangao designs (4 editorial chapters, 1 dark number band, 3 datasheet strip
// and section bars, 2 buy-box, magnifier and scroll-spy nav). Every word, number and photograph is
// the live record's (src/inner.json, written by prep-inner.mjs); nothing here is invented.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import inner from "./inner.json";
import "./inner.css";

const CINE = [0.22, 1, 0.36, 1];
const { product: P, guide: G } = inner;

/* ------------------------------------------------------------------ shared */

function InnerHeader({ crumb }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setHidden(y > 500 && y > (scrollY.getPrevious() ?? 0)));
  return (
    <motion.header className="ih" animate={{ y: hidden ? -72 : 0 }} transition={{ duration: 0.35, ease: CINE }}>
      <a href="#/"><img src="img/hyde-horizontal-ink.svg" alt="HYDE" /></a>
      <nav aria-label="Breadcrumb" className="crumb">{crumb.map((c, i) => <span key={c}>{i > 0 && <i>/</i>}{c}</span>)}</nav>
      <a className="btn sm" href="#ordering">Request a quote</a>
    </motion.header>
  );
}

const Reveal = ({ children, delay = 0, className, as = "div" }) => {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.9, delay, ease: CINE }}>
      {children}
    </M>
  );
};

/** Design 4's chapter row: a rule, a title that stays put while its content scrolls past. */
function Chapter({ id, title, aside, children }) {
  return (
    <section id={id} className="chapter wrap" aria-labelledby={`${id}-h`}>
      <div className="chapter-side">
        <div className="sticky">
          <h2 id={`${id}-h`}>{title}</h2>
          {aside && <p className="small">{aside}</p>}
        </div>
      </div>
      <div className="chapter-body">{children}</div>
    </section>
  );
}

function CopyButton({ text, label = "Copy" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 1800);
  };
  return (
    <button className="copy" onClick={copy}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={done ? "y" : "n"} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
          {done ? "Copied" : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** Scroll-spy: which of these ids is nearest the top third of the screen. */
function useSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: "-30% 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* ------------------------------------------------------------------ product page */

const spec = (label) => P.specs.find((s) => s.label === label)?.value;
const NAV = [["specifications", "Specifications"], ["drawings", "Drawings"], ["set", "In the set"], ["video", "Video"], ["ordering", "Ordering"], ["guides", "Guides"]];

export function ProductPage() {
  return (
    <>
      <InnerHeader crumb={["Products", P.family.name, P.model]} />
      <main className="product">
        <Opener />
        <SectionNav />
        <Specifications />
        <NumberBand />
        <Drawings />
        <InTheSet />
        <Video />
        <Ordering />
        <Guides />
        <Related />
      </main>
    </>
  );
}

function Opener() {
  const views = P.gallery.filter((g) => !/-(9|10)\.webp$/.test(g.src)); // the two drawings get their own chapter
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(null);
  const stage = useRef(null);
  const go = (d) => setI((n) => (n + d + views.length) % views.length);
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = stage.current.getBoundingClientRect();
    setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <section className="opener wrap">
      <div className="gallery">
        <div className="stage" ref={stage} onPointerMove={onMove} onPointerLeave={() => setZoom(null)}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img key={views[i].src} src={views[i].src} alt={views[i].label}
              initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: CINE }}
              style={{ transformOrigin: zoom ?? "50% 50%" }}
              className={zoom ? "zoomed" : ""} />
          </AnimatePresence>
          <div className="vcount"><b>{String(i + 1).padStart(2, "0")}</b> / {String(views.length).padStart(2, "0")}</div>
          <div className="arrows">
            <button onClick={() => go(-1)} aria-label="Previous view">←</button>
            <button onClick={() => go(1)} aria-label="Next view">→</button>
          </div>
          <span className="hint small">Point at the photograph to look closer</span>
        </div>
        <div className="thumbs" role="tablist" aria-label="Views">
          {views.map((v, k) => (
            <button key={v.src} role="tab" aria-selected={k === i} onClick={() => setI(k)}>
              <img src={v.src} alt="" />
              {k === i && <motion.span layoutId="thumb-bar" className="bar" transition={{ duration: 0.45, ease: CINE }} />}
            </button>
          ))}
        </div>
      </div>

      <div className="buybox">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {P.family.name} · {P.family.devices} devices in the family
        </motion.p>
        <h1 className="display">
          <span className="mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.15, ease: CINE }}>{P.model}</motion.span></span>
          <span className="mask name"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.25, ease: CINE }}>{P.name}</motion.span></span>
        </h1>
        <Reveal delay={0.35}><p className="lede">{P.summary}</p></Reveal>
        <Reveal delay={0.45} className="sheet">
          {[["Bar length", spec("Size")], ["Body", spec("Material")], ["Handing", spec("Application")], ["Minimum order", spec("Minimum order")]].map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </Reveal>
        <Reveal delay={0.55} className="ctas">
          <a className="btn" href="#ordering">Request a quote</a>
          <a className="btn ghost" href="#ordering">Ask a technical question</a>
        </Reveal>
        <Reveal delay={0.6} className="links small">
          <a href="#specifications">Spec sheet (PDF)</a><a href="#ordering">Export catalog (PDF)</a><a href="#ordering">Find 307 on our Alibaba storefront</a>
        </Reveal>
      </div>
    </section>
  );
}

function SectionNav() {
  const ids = useMemo(() => NAV.map(([id]) => id), []);
  const active = useSpy(ids);
  return (
    <nav className="secnav" aria-label="On this page">
      <div className="wrap row">
        <span className="secnav-model">{P.model}</span>
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>
            {label}
            {active === id && <motion.span layoutId="secnav-bar" className="bar" transition={{ duration: 0.4, ease: CINE }} />}
          </a>
        ))}
        <a className="btn sm" href="#ordering">Request a quote</a>
      </div>
    </nav>
  );
}

function Specifications() {
  const text = `HYDE ${P.model} ${P.name}\n${P.specs.map((s) => `${s.label}: ${s.value}`).join("\n")}`;
  return (
    <Chapter id="specifications" title="Specifications" aside="As the record states them. A dash means the factory has not published that row yet.">
      <dl className="specs">
        {[...P.specs, { label: "Finish codes", value: null }, { label: "Fire rating", value: null }].map((s, k) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: k * 0.06, ease: CINE }}>
            <dt>{s.label}</dt><dd className={s.value ? "" : "dash"}>{s.value ?? "—  ask us"}</dd>
          </motion.div>
        ))}
      </dl>
      <div className="spec-actions">
        <CopyButton text={text} label="Copy these rows for a tender" />
        <span className="small">Plain text, model and rows, ready to paste.</span>
      </div>
    </Chapter>
  );
}

/* Design 4's dark band of rising words, carrying the three numbers a buyer checks first (design 1). */
function NumberBand() {
  const items = [["1000", "mm", "bar length"], ["L / R", "", "reversible for either hand"], ["50", "pcs", "minimum order"]];
  // The trigger sits on the row: a span clipped inside its mask never counts as "in view".
  return (
    <section className="band ink">
      <motion.div className="wrap band-row" initial="off" whileInView="on" viewport={{ once: true, margin: "0px 0px -15% 0px" }}>
        {items.map(([n, u, l], k) => (
          <div key={l} className="band-item">
            <span className="mask"><motion.span className="display big" variants={{ off: { y: "110%" }, on: { y: 0 } }}
              transition={{ duration: 1, delay: k * 0.1, ease: CINE }}>{n}<small>{u}</small></motion.span></span>
            <motion.span className="small" variants={{ off: { opacity: 0 }, on: { opacity: 1 } }} transition={{ delay: 0.4 + k * 0.1 }}>{l}</motion.span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function Drawings() {
  const drawings = P.gallery.filter((g) => /-(9|10)\.webp$/.test(g.src));
  const [open, setOpen] = useState(null);
  return (
    <Chapter id="drawings" title="Drawings" aside="The dimension and installation drawings supplied with the 307. Select one to enlarge.">
      <div className="drawings">
        {drawings.map((d, k) => (
          <Reveal key={d.src} delay={k * 0.1}>
            <button className="drawing" onClick={() => setOpen(d)}>
              <motion.img layoutId={d.src} src={d.src} alt={k ? "Installation drawing" : "Dimension drawing"} />
              <span className="small">{k ? "Installation drawing" : "Dimension drawing"}</span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.img layoutId={open.src} src={open.src} alt="" transition={{ duration: 0.5, ease: CINE }} />
            <button className="close">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </Chapter>
  );
}

function InTheSet() {
  const kit = P.gallery.find((g) => /-5\.webp$/.test(g.src));
  return (
    <Chapter id="set" title="In the set" aside="The 307 works with a mortise lock body and an outside trim. These are the parts its record names.">
      <div className="set">
        <Reveal className="set-photo"><img src={kit.src} alt="307 with lock case, cylinder and outside trim" /></Reveal>
        <ul className="set-parts">
          {P.worksWith.map((w, k) => (
            <Reveal as="li" key={w.slug} delay={k * 0.08}>
              <a href="#set">
                <img src={w.img} alt="" />
                <span><em className="small">{w.role} · {w.note}</em><b>{w.model}</b><span className="small">{w.name}</span></span>
                <i aria-hidden>→</i>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

function Video() {
  const [play, setPlay] = useState(false);
  return (
    <Chapter id="video" title="Video" aside={`${P.video.seconds} seconds: the bar being pressed and released.`}>
      <Reveal className="video">
        {play ? (
          <video src={P.video.src} poster={P.video.poster} controls autoPlay playsInline />
        ) : (
          <button className="poster" onClick={() => setPlay(true)} aria-label={`Play: ${P.video.label}`}>
            <img src={P.video.poster} alt="" />
            <motion.span className="play" whileHover={{ scale: 1.08 }} transition={{ duration: 0.25 }}>▶</motion.span>
          </button>
        )}
      </Reveal>
    </Chapter>
  );
}

function Ordering() {
  const asks = [
    ["Model and finish", "307, and the colour of the housing and bar"],
    ["Quantity", "from 50 pieces"],
    ["Door thickness", "it sets the cylinder length"],
    ["Door leaf width", "the bar is 1000 mm; we confirm the fit"],
    ["Outside trim", "015 or 9080E, or none"],
    ["Destination country", "for freight and documents"],
  ];
  const body = `Model: 307 Panic Exit Device\n${asks.map(([a]) => `${a}: `).join("\n")}`;
  return (
    <Chapter id="ordering" title="Ordering" aside="Six answers and the first reply can be a price, not a question.">
      <ol className="asks">
        {asks.map(([a, b], k) => (
          <Reveal as="li" key={a} delay={k * 0.05}><b>{a}</b><span className="small">{b}</span></Reveal>
        ))}
      </ol>
      <div className="ctas">
        <a className="btn" href={`mailto:tec@cantonlock.com?subject=${encodeURIComponent("307 enquiry")}&body=${encodeURIComponent(body)}`}>Email these six answers</a>
        <CopyButton text={body} label="Copy the list" />
      </div>
    </Chapter>
  );
}

function Guides() {
  return (
    <Chapter id="guides" title="Guides that cite the 307" aside={`${P.guides.length} articles compare or reference this model.`}>
      <ul className="rows">
        {P.guides.map((g, k) => (
          <Reveal as="li" key={g.slug} delay={k * 0.04}><a href="#/guide"><span>{g.title}</span><i aria-hidden>→</i></a></Reveal>
        ))}
      </ul>
    </Chapter>
  );
}

function Related() {
  return (
    <section className="related wrap">
      <h2 className="h3">More in the series</h2>
      <div className="cards">
        {P.related.map((r, k) => (
          <Reveal key={r.slug} delay={k * 0.08}>
            <a className="rcard" href="#/product">
              <div className="rcard-img"><img src={r.img} alt="" /></div>
              <b>{r.model}</b><span className="small">{r.name}</span>
              {r.specs.map((s) => <span key={s.label} className="small row2"><em>{s.label}</em>{s.value}</span>)}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ guide page */

const ACRONYMS = /\b(en|ansi|bhma|ce|dop|pdf)\b/gi;
const sentence = (s) => (s[0] + s.slice(1).toLowerCase()).replace(ACRONYMS, (m) => m.toUpperCase());
const slugOf = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sectionText = (s) => s.blocks.map((b) => b.p ?? [b.table.head, ...b.table.rows].flat().join(" ")).join(" ");
const mentions = (s) => G.models.filter((m) => new RegExp(`(^|[^\\w-])${m.model.replace(/[-]/g, "\\-")}(?![\\w-])`).test(sectionText(s))).map((m) => m.model);
const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function GuidePage() {
  const body = useRef(null);
  const { scrollYProgress } = useScroll({ target: body, offset: ["start 80px", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const ids = useMemo(() => G.sections.map((s) => slugOf(s.title)), []);
  const active = useSpy(ids);
  const ai = Math.max(0, ids.indexOf(active));
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));
  const left = Math.max(0, Math.round(G.minutes * (1 - pct / 100)));
  const lit = new Set(mentions(G.sections[ai]));

  return (
    <>
      <InnerHeader crumb={["Guides", "Exit devices"]} />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <main className="guide">
        <GuideCover />
        <SectionBars ids={ids} active={active} />
        <GuideHero />
        <div className="article wrap" ref={body}>
          <aside className="toc">
            <div className="sticky">
              <p className="small toc-count"><b>{String(ai + 1).padStart(2, "0")}</b> / {String(ids.length).padStart(2, "0")} · {pct}% read</p>
              <ol>
                {G.sections.map((s, k) => (
                  <li key={s.title} className={k === ai ? "on" : k < ai ? "past" : ""}>
                    <a href={`#${ids[k]}`}>
                      {k === ai && <motion.span layoutId="toc-bar" className="bar" transition={{ duration: 0.45, ease: CINE }} />}
                      {sentence(s.title)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
          <article>
            {G.sections.map((s, k) => (
              <section key={s.title} id={ids[k]}>
                {k > 0 && <Reveal as="h2">{sentence(s.title)}</Reveal>}
                <GuideBlocks blocks={s.blocks} />
                {k === 3 && <PullQuote />}
              </section>
            ))}
            <p className="end small">■ End of guide. Updated {fmt(G.updatedAt)}.</p>
          </article>
          <aside className="grail">
            <div className="sticky">
              <p className="small">Models in this guide <span className="muted">· lit where this section names them</span></p>
              <ul>
                {G.models.map((m) => (
                  <li key={m.slug} className={lit.has(m.model) ? "lit" : ""}>
                    <a href="#/product"><img src={m.img} alt="" /><b>{m.model}</b></a>
                  </li>
                ))}
              </ul>
              <a className="btn sm" href="#/product">Ask which one fits</a>
            </div>
          </aside>
        </div>
        <AnimatePresence>
          {pct > 3 && pct < 98 && (
            <motion.div className="left-pill" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              {left ? `About ${left} min left` : "Nearly done"}
            </motion.div>
          )}
        </AnimatePresence>
        <PrevNext />
      </main>
    </>
  );
}

function GuideCover() {
  const t = G.title.split(": ");
  return (
    <section className="cover wrap">
      <div className="cover-no display" aria-hidden>
        <span className="mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: CINE }}>{String(G.index).padStart(2, "0")}</motion.span></span>
        <span className="small">Guide {G.index} of {G.total}</span>
      </div>
      <div className="cover-main">
        <Reveal className="meta small">
          <span>Published {fmt(G.publishedAt)}</span><span>Updated {fmt(G.updatedAt)}</span>
          <span>{G.minutes} min read</span><span>{G.sections.length} sections</span><span>{G.models.length} models</span>
        </Reveal>
        <h1 className="display">
          <span className="mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease: CINE }}>{t[0]}</motion.span></span>
        </h1>
        <Reveal delay={0.2}><p className="sub">{t.slice(1).join(": ")}</p></Reveal>
        <Reveal delay={0.3}><p className="lede ruled">{G.summary}</p></Reveal>
        <Reveal delay={0.35} className="byline small"><b>{G.author.name}</b> · {G.author.role} · {G.author.credential}</Reveal>
        <div className="cover-models">
          {G.models.map((m, k) => (
            <motion.a key={m.slug} href="#/product" title={`${m.model} ${m.name}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + k * 0.04, duration: 0.6, ease: CINE }}>
              <img src={m.img} alt="" /><span>{m.model}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Design 3's section bars: the guide's shape at a glance; each bar is as long as its section. */
function SectionBars({ ids, active }) {
  const lens = G.sections.map((s) => sectionText(s).length);
  const max = Math.max(...lens);
  return (
    <section className="secbars wrap" aria-label="Sections of this guide">
      {G.sections.map((s, k) => (
        <a key={s.title} href={`#${ids[k]}`} className={ids[k] === active ? "on" : ""}>
          <span className="small">{sentence(s.title)}</span>
          <span className="track">
            <motion.span className="fill" style={{ width: `${(lens[k] / max) * 100}%` }}
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: k * 0.07, ease: CINE }} />
          </span>
        </a>
      ))}
    </section>
  );
}

function GuideHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <figure className="ghero wrap" ref={ref}>
      <div className="ghero-frame"><motion.img style={{ y }} src={G.hero.src} alt={G.hero.label} /></div>
      <figcaption className="small">{G.hero.label}</figcaption>
    </figure>
  );
}

const TABLE_NO = new Map(G.sections.flatMap((s) => s.blocks.filter((b) => b.table)).map((b, k) => [b.table, k + 1]));
function GuideBlocks({ blocks }) {
  return blocks.map((b, k) =>
    b.p ? <Reveal as="p" key={k}>{b.p}</Reveal> : <GuideTable key={k} table={b.table} />);
}

function GuideTable({ table }) {
  const no = TABLE_NO.get(table);
  const thumb = (m) => G.models.find((x) => x.model === m);
  return (
    <figure className="gtable">
      <figcaption className="small">Table {no} · {table.rows.length} rows · every cell from a product record</figcaption>
      <div className="scroller">
        <table>
          <thead><tr>{table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {table.rows.map((r, k) => (
              <motion.tr key={r[0]} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: k * 0.06, ease: CINE }}>
                {r.map((c, i) => (
                  <td key={i} className={c === "not published" || c === "no rows yet" || c === "no other rows" ? "dash" : ""}>
                    {i === 0 && thumb(c) ? <span className="mcell"><img src={thumb(c).img} alt="" />{c}</span> : c}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small swipe">Swipe the table sideways for more columns.</p>
    </figure>
  );
}

function PullQuote() {
  const all = G.sections.flatMap((s) => s.blocks.map((b) => b.p).filter(Boolean)).join(" ");
  const q = all.match(/On any pair, the device is only half the answer[^.]*\./)?.[0];
  if (!q) return null;
  return (
    <motion.blockquote className="pull display" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: CINE }}>
      {q}
    </motion.blockquote>
  );
}

function PrevNext() {
  return (
    <nav className="prevnext ink" aria-label="More guides">
      {[["Previous guide", G.prev], ["Next guide", G.next]].map(([label, n]) => (
        <a key={n.slug} href="#/guide" className="pn">
          {n.img && <img src={n.img} alt="" />}
          <span className="small">{label}</span>
          <b>{n.title.split(": ")[0]}</b>
          <span className="small clamp">{n.summary}</span>
        </a>
      ))}
    </nav>
  );
}
