import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence, MotionConfig, animate, motion, useInView, useMotionValue, useMotionValueEvent,
  useReducedMotion, useScroll, useSpring, useTransform,
} from "motion/react";
import Lenis from "lenis";
import { geoEqualEarth } from "d3-geo";
import data from "./data.json";

// The two curves every animation on the page uses: one for things arriving, one for wipes.
const CINE = [0.22, 1, 0.36, 1];
const CURTAIN = [0.76, 0, 0.24, 1];

const Demo = createContext(null);
const useDemo = () => useContext(Demo);

/* ------------------------------------------------------------------ app shell */

export function App() {
  const osReduce = useReducedMotion();
  const [opts, setOpts] = useState({ curtain: true, kenBurns: true, smooth: true, hideHeader: true, reduce: false });
  const [replay, setReplay] = useState(0);
  const reduce = opts.reduce || osReduce;
  const curtainOn = opts.curtain && !reduce;
  const ctx = { ...opts, reduce, curtainOn, introDelay: curtainOn ? 0.95 : 0.15, replay };

  useEffect(() => {
    if (!opts.smooth || reduce) return;
    const lenis = new Lenis({ lerp: 0.085 });
    let id = requestAnimationFrame(function raf(t) { lenis.raf(t); id = requestAnimationFrame(raf); });
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, [opts.smooth, reduce]);

  return (
    <Demo.Provider value={ctx}>
      <MotionConfig reducedMotion={opts.reduce ? "always" : "user"}>
        {curtainOn && <Curtain key={`c${replay}`} />}
        <Header />
        <main key={`m${replay}`}>
          <Hero />
          <Entries />
          <Facts />
          <Statement />
          <ExportMap />
          <FamilyIndex />
          <FactoryStory />
          <Anatomy />
          <RangeRail />
          <Timeline />
          <Closing />
        </main>
        <Panel opts={opts} setOpts={setOpts} onReplay={() => { window.scrollTo(0, 0); setReplay((n) => n + 1); }} />
      </MotionConfig>
    </Demo.Provider>
  );
}

/* ------------------------------------------------------------------ 0 curtain (design 4) */

function Curtain() {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 1500); return () => clearTimeout(t); }, []);
  if (done) return null;
  return (
    <div className="curtain" aria-hidden>
      <motion.div className="half top" initial={{ y: 0 }} animate={{ y: "-101%" }} transition={{ delay: 0.78, duration: 0.6, ease: CURTAIN }} />
      <motion.div className="half bottom" initial={{ y: 0 }} animate={{ y: "101%" }} transition={{ delay: 0.78, duration: 0.6, ease: CURTAIN }} />
      <motion.div className="center" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.72, duration: 0.2 }}>
        <div className="lockup">
          <motion.img src="img/hyde-icon-ink.svg" alt="" style={{ height: 64 }}
            initial={{ opacity: 0, scale: 0.7, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.45, ease: CINE }} />
          <motion.img src="img/hyde-horizontal-ink.svg" alt="" style={{ height: 30 }}
            initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 0.25, duration: 0.5, ease: CINE }} />
          <motion.div className="rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5, ease: CINE }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ header (design 4: hides on the way down) */

function Header() {
  const { hideHeader } = useDemo();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(hideHeader && y > 400 && y > prev);
  });
  return (
    <motion.header className={`header ${solid ? "solid" : ""}`} animate={{ y: hidden ? -80 : 0 }} transition={{ duration: 0.35, ease: CINE }}>
      <a href="#top" aria-label="HYDE home"><img className="mark" src="img/hyde-horizontal-ink.svg" alt="HYDE" /></a>
      <nav aria-label="Main">
        <a href="#range">Products</a><a href="#export">Markets</a><a href="#factory">Factory</a><a href="#contact">Contact</a>
      </nav>
      <a className="btn" href="#contact">Request a quote</a>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ 1 hero (design 4 + design 1) */

const SLIDES = [
  { src: "img/hero-1.webp", label: "Panic exit devices", pos: "60% 50%" },
  { src: "img/hero-2.webp", label: "Mortise lock cases", pos: "55% 50%" },
  { src: "img/hero-3.webp", label: "Lever sets", pos: "50% 50%" },
  { src: "img/hero-4.webp", label: "Cylinders", pos: "50% 50%" },
];
const TITLE = ["Door hardware,", "made in our own", "factory since 1998."];

function Hero() {
  const { kenBurns, introDelay, reduce } = useDemo();
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const hold = i === 0 ? 8 : 6.5;
  useEffect(() => { const t = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), hold * 1000); return () => clearTimeout(t); }, [i, hold]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);

  return (
    <section className="hero" ref={ref} id="top">
      <motion.div className="hero-copy" style={{ y: reduce ? 0 : copyY }}>
        <h1 className="hero-title display">
          {TITLE.map((line, k) => (
            <span className="line-mask" key={line}>
              <motion.span
                initial={{ y: "110%", fontVariationSettings: '"wdth" 75' }}
                animate={{ y: "0%", fontVariationSettings: '"wdth" 125' }}
                transition={{ delay: introDelay + k * 0.12, duration: 1.05, ease: CINE }}
              >{line}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: introDelay + 0.55, duration: 0.7, ease: CINE }}>
          Panic exit devices, lock cases, cylinders, handles and hinges from Zhongshan, the town that ships close to a third of
          China&apos;s lock exports. Drawings, samples and OEM tooling handled by the people who make the parts.
        </motion.p>
        <motion.div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: introDelay + 0.68, duration: 0.7, ease: CINE }}>
          <a className="btn" href="#range">See the range</a>
          <a className="btn ghost" href="#contact">Request a quote</a>
        </motion.div>
      </motion.div>

      <div className="hero-photo">
        <motion.div style={{ position: "absolute", inset: "-8% 0 0 0", y: reduce ? 0 : photoY }}>
          <AnimatePresence initial={false}>
            <motion.div key={i} className="slide"
              initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 1, transition: { duration: 1.1 } }} transition={{ duration: 1.1, ease: CURTAIN }}
              style={{ zIndex: 1 }}>
              <motion.img src={SLIDES[i].src} alt={SLIDES[i].label} style={{ objectPosition: SLIDES[i].pos }}
                initial={{ scale: kenBurns ? 1.02 : 1 }} animate={{ scale: kenBurns ? 1.13 : 1 }}
                transition={{ duration: kenBurns ? 14 : 0, ease: "linear" }} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="hero-meta">
          <div className="veil" />
          <div>
            <div className="counter"><b>{String(i + 1).padStart(2, "0")}</b> / {String(SLIDES.length).padStart(2, "0")}</div>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.4, ease: CINE }} style={{ fontSize: 15, marginTop: 4 }}>{SLIDES[i].label}</motion.div>
            </AnimatePresence>
          </div>
          <div className="bars" role="tablist" aria-label="Slides">
            {SLIDES.map((s, k) => (
              <button key={s.src} role="tab" aria-selected={k === i} aria-label={`Show ${s.label}`} onClick={() => setI(k)}>
                {k < i && <i />}
                {k === i && <motion.i key={`p${i}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: hold, ease: "linear" }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <HeroArc />
    </section>
  );
}

// Design 1's signature arc, in ink: one hairline drawn across copy and photo. `difference`
// makes the same white stroke read black on paper and white on the photograph.
function HeroArc() {
  const { introDelay, reduce } = useDemo();
  const d = "M 790 940 C 960 820, 1080 640, 1230 520 S 1480 240, 1660 140";
  return (
    <svg className="arc" viewBox="0 0 1600 900" preserveAspectRatio="none" style={{ mixBlendMode: "difference" }} aria-hidden>
      <motion.path d={d} fill="none" stroke="#fff" strokeWidth="1.2" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: introDelay + 0.4, duration: 1.6, ease: CINE }} />
      {!reduce && (
        <circle r="4" fill="#fff">
          <animateMotion dur="7s" begin={`${introDelay + 2}s`} repeatCount="indefinite" path={d} />
        </circle>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ 2 entry strip (design 4) */

function Entries() {
  const items = [
    ["See the range", `${data.facts.products} products across ${data.facts.categories} categories`, "#range"],
    ["Download the catalogue", "PDF, 92 pages, every published model", "https://cantonlock.com/downloads/hyde-export-catalogue-2026.pdf"],
    ["Request a quote", "Model, finish code, quantity and door thickness", "#contact"],
  ];
  return (
    <section className="entries">
      {items.map(([h, p, href]) => (
        <a className="entry" key={h} href={href}>
          <span className="fill" />
          <div><h3>{h}</h3><p>{p}</p></div>
        </a>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ 3 facts strip (design 1 + 4 count-up) */

function Count({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const { reduce } = useDemo();
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.6, ease: CINE, onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-US"); } });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{to.toLocaleString("en-US")}</span>;
}

function Facts() {
  const f = data.facts;
  const items = [
    [<Count to={f.products} />, "verified product records"],
    [<Count to={f.categories} />, "catalogue categories"],
    [<Count to={f.withVideo} />, "models with a demonstration video"],
    ["1998", "manufacturing since"],
    ["2002", "ISO 9001 quality system since"],
    [f.staff, "people on site"],
  ];
  return (
    <section className="wrap facts" aria-label="The factory, in figures">
      {items.map(([n, l], k) => (<div className="fact" key={k}><div className="n">{n}</div><div className="l">{l}</div></div>))}
    </section>
  );
}

/* ------------------------------------------------------------------ 4 statement (design 4 + design 1) */

const STATEMENT = "A buyer who orders a container of door hardware cannot adjust it when it lands. Hole positions, backsets and finish codes have to be right before the parts are made. That is the job we do.";

function Word({ w, k, n, progress }) {
  const color = useTransform(progress, [k / n, (k + 1) / n], ["#9c978d", "#14130f"]);
  return <motion.span style={{ color }}>{w} </motion.span>;
}

function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const words = STATEMENT.split(" ");
  return (
    <section className="wrap statement" ref={ref}>
      <p className="display" style={{ fontStretch: "112%" }}>
        {words.map((w, k) => <Word key={k} w={w} k={k} n={words.length} progress={scrollYProgress} />)}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ 5 export map (design 3) */

const ORIGIN = { name: "Zhongshan", sub: "Factory", at: [113.39, 22.52] };
const MARKETS = [
  { name: "Germany", sub: "Office · Brohl-Lützing", at: [7.32, 50.49], dx: -10, dy: -14, anchor: "end" },
  { name: "Europe", sub: "", at: [-3.7, 40.4], dx: -10, dy: 18, anchor: "end" },
  { name: "Russia", sub: "", at: [37.6, 55.75], dx: 10, dy: -12 },
  { name: "Turkey", sub: "", at: [32.85, 39.9], dx: 10, dy: 18 },
  { name: "Southeast Asia", sub: "", at: [106.8, -6.2], dx: 12, dy: 16 },
  { name: "North America", sub: "", at: [-95, 39], dx: 0, dy: -16, anchor: "middle" },
  { name: "South America", sub: "", at: [-58.4, -34.6], dx: 12, dy: 6 },
];

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t.toLocaleTimeString("en-GB", { timeZone: "Asia/Shanghai", hour12: false });
}

function ExportMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const { reduce } = useDemo();
  const clock = useClock();
  const W = 1000, H = 500;
  const proj = useMemo(() => geoEqualEarth().rotate([-15, 0]).fitExtent([[0, 0], [W, H]], { type: "Sphere" }).scale(205).translate([W / 2 + 10, H / 2 + 40]), []);
  const o = proj(ORIGIN.at);
  const dots = useMemo(() => data.dots.map(([lon, lat]) => {
    const [x, y] = proj([lon, lat]);
    return [x, y, Math.hypot(x - o[0], y - o[1])];
  }), [proj, o]);
  const routes = MARKETS.map((m) => {
    const p = proj(m.at);
    const mx = (o[0] + p[0]) / 2, my = (o[1] + p[1]) / 2 - Math.hypot(p[0] - o[0], p[1] - o[1]) * 0.28;
    return { ...m, p, d: `M ${o[0]} ${o[1]} Q ${mx} ${my} ${p[0]} ${p[1]}` };
  });
  const max = Math.max(...data.families.map((f) => f.count));

  return (
    <section className="ink export" id="export" ref={ref}>
      <div className="wrap export-grid">
        <div className="export-head">
          <h2 className="display h2">Shipped from Zhongshan</h2>
          <p className="lede" style={{ marginTop: 20 }}>Europe, Russia, the Americas, Turkey and Southeast Asia. An office in Germany, and a Spanish-speaking team.</p>
          <div className="clock">Factory time, GMT+8<b>{clock}</b></div>
          <ul className="markets">
            {routes.map((r) => <li key={r.name}><span>{r.name}</span><span>{r.sub || "Market"}</span></li>)}
          </ul>
        </div>
        <svg className="map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of the markets HYDE ships to from Zhongshan">
          <g className={inView && !reduce ? "ripple-on" : ""}>
            {dots.map(([x, y, dist], k) => (
              <circle key={k} cx={x} cy={y} r="1.7" className="land-dot" style={{ animationDelay: `${(dist / 900).toFixed(2)}s` }} />
            ))}
          </g>
          {routes.map((r, k) => (
            <g key={r.name}>
              <motion.path d={r.d} fill="none" stroke="#fff" strokeWidth="1.1" strokeOpacity="0.85"
                initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.5 + k * 0.14, duration: 1.1, ease: "easeInOut" }} />
              {inView && !reduce && (
                <circle r="2.6" fill="#fff">
                  <animateMotion dur={`${2.4 + (k % 3) * 0.5}s`} begin={`${1.8 + k * 0.2}s`} repeatCount="indefinite" path={r.d} />
                </circle>
              )}
              <motion.g initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} style={{ originX: `${r.p[0]}px`, originY: `${r.p[1]}px` }}
                transition={{ delay: 1.2 + k * 0.14, type: "spring", stiffness: 260, damping: 18 }}>
                <circle cx={r.p[0]} cy={r.p[1]} r="4" fill="#fff" />
              </motion.g>
              <motion.text className="label" x={r.p[0] + (r.dx ?? 10)} y={r.p[1] + (r.dy ?? 4)} textAnchor={r.anchor ?? "start"}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.4 + k * 0.14 }}>{r.name}</motion.text>
            </g>
          ))}
          <circle cx={o[0]} cy={o[1]} r="6" fill="#fff" />
          {!reduce && <circle cx={o[0]} cy={o[1]} r="6" className="pulse" />}
          {!reduce && <circle cx={o[0]} cy={o[1]} r="6" className="pulse late" />}
          <text className="label" x={o[0] + 12} y={o[1] + 4}>{ORIGIN.name}</text>
          <text className="label sub" x={o[0] + 12} y={o[1] + 19}>{ORIGIN.sub}</text>
        </svg>
      </div>
      <div className="wrap">
        <h3 style={{ margin: "88px 0 0", fontSize: 20, fontWeight: 560 }}>Models on cantonlock.com, by family</h3>
        <div className="families-board">
          {data.families.map((f, k) => (
            <div className="fam-bar" key={f.title}>
              <div className="row"><span>{f.title}</span><b><Count to={f.count} /></b></div>
              <div className="track"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: f.count / max }} viewport={{ once: true }}
                transition={{ delay: k * 0.06, duration: 1.1, ease: CINE }} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 6 family index (design 4 + design 3) */

function FamilyIndex() {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const [hover, setHover] = useState(-1);
  return (
    <section className="wrap index" id="range" onMouseMove={(e) => { x.set(e.clientX + 28); y.set(e.clientY - 130); }}>
      <h2 className="display h2">The range, family by family</h2>
      <p className="lede" style={{ marginTop: 18 }}>Eight families, one factory catalogue. Point at a family to see the model we show first.</p>
      <ul className="index-list" onMouseLeave={() => setHover(-1)}>
        {data.families.map((f, k) => (
          <li key={f.title} onMouseEnter={() => setHover(k)}>
            <motion.a href={f.url} initial={false} animate={{ x: hover === k ? 18 : 0 }} transition={{ duration: 0.45, ease: CINE }}>
              <motion.span className="name" animate={{ fontVariationSettings: hover === k ? '"wdth" 125' : '"wdth" 100' }} transition={{ duration: 0.45, ease: CINE }}>
                {f.title}
              </motion.span>
              <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <img className="thumb" src={f.img} alt="" />
                <span className="count">{f.count} models</span>
              </span>
            </motion.a>
          </li>
        ))}
      </ul>
      <motion.div className="follow" style={{ x: sx, y: sy }} initial={false}
        animate={{ opacity: hover >= 0 ? 1 : 0, scale: hover >= 0 ? 1 : 0.92 }} transition={{ duration: 0.25 }} aria-hidden>
        <AnimatePresence initial={false}>
          {hover >= 0 && (
            <motion.img key={hover} src={data.families[hover].img} alt="" style={{ position: "absolute", inset: 0 }}
              initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: CURTAIN }} />
          )}
        </AnimatePresence>
        {hover >= 0 && <div style={{ position: "absolute", left: 12, bottom: 10, fontSize: 13, fontWeight: 600 }}>{data.families[hover].model}</div>}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ 7 factory story (design 4 sticky narrative) */

const STEPS = [
  { title: "Stamping", img: "img/f-stamp.webp", text: "Parts are pressed in our own press shop." },
  { title: "Machining", img: "img/f-cnc.webp", text: "CNC machining in house, on the same site." },
  { title: "Polishing", img: "img/f-polish.webp", text: "Finishes are polished in our own workshop before plating or coating." },
  { title: "Assembly and inspection", img: "img/f-assembly.webp", text: "Sets are assembled and inspected before they are packed." },
];

function Step({ s, k, setActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  useEffect(() => { if (inView) setActive(k); }, [inView, k, setActive]);
  return (
    <article className="step" ref={ref}>
      <img className="mobile-shot" src={s.img} alt={s.title} style={{ display: "none" }} />
      <div className="num">{String(k + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</div>
      <h3 className="display">{s.title}</h3>
      <p>{s.text}</p>
    </article>
  );
}

function StoryBar({ progress, k }) {
  const s = useTransform(progress, [k / STEPS.length, (k + 1) / STEPS.length], [0, 1]);
  return <i><motion.b style={{ scaleX: s }} /></i>;
}

function FactoryStory() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="ink story" id="factory" ref={ref}>
      <div className="story-grid">
        <div className="story-stage">
          {STEPS.map((s, k) => (
            <motion.div key={s.title} className="shot" style={{ zIndex: k }} initial={false}
              animate={{ clipPath: active >= k ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: active === k ? 1 : active > k ? 1.08 : 1.02 }}
              transition={{ duration: 1.1, ease: CURTAIN }}>
              <img src={s.img} alt={s.title} />
            </motion.div>
          ))}
          <div className="progress">{STEPS.map((s, k) => <StoryBar key={s.title} progress={scrollYProgress} k={k} />)}</div>
        </div>
        <div className="story-steps">
          <div className="story-intro">
            <h2 className="display h2">A factory, not a trading office.</h2>
            <p className="lede" style={{ marginTop: 20 }}>We stamp, polish, assemble and inspect our own parts. Bring a drawing or a sample and we tool it.</p>
          </div>
          {STEPS.map((s, k) => <Step key={s.title} s={s} k={k} setActive={setActive} />)}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 8 product anatomy (design 2 hotspots) */

function Anatomy() {
  const h = data.hotspot;
  const spec = Object.fromEntries(h.specs.map((s) => [s.label, s.value]));
  // Points sit on parts that are unambiguous in the photograph; the words come straight from
  // the record's Material line ("Aluminum alloy body, iron bar").
  const SPOTS = [
    { x: 44, y: 62, title: "Push bar", value: "Iron bar", cx: 30, cy: 70 },
    { x: 89, y: 34, title: "Body", value: "Aluminum alloy", cx: 58, cy: 4 },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const [open, setOpen] = useState(-1);
  useEffect(() => { if (inView) { const t = setTimeout(() => setOpen(0), 1100); return () => clearTimeout(t); } }, [inView]);
  return (
    <section className="anatomy" ref={ref}>
      <div className="wrap anatomy-grid">
        <div className="figure">
          <img src={h.img} alt={`${h.model} ${h.name}`} />
          {SPOTS.map((s, k) => (
            <div key={s.title}>
              <motion.button className="dot" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-expanded={open === k}
                aria-label={`${s.title}: ${s.value}`} onClick={() => setOpen(open === k ? -1 : k)}
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.3 + k * 0.18, type: "spring", stiffness: 300, damping: 16 }}>
                <motion.span className="ring" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
                {open === k ? "–" : "+"}
              </motion.button>
              <AnimatePresence>
                {open === k && (
                  <motion.div className="callout" style={{ left: `${s.cx}%`, top: `${s.cy}%` }}
                    initial={{ opacity: 0, y: 10, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.4, ease: CINE }}>
                    <b>{s.title}</b>{s.value}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div>
          <h2 className="display h2" style={{ fontSize: "clamp(34px,3.6vw,56px)" }}>{h.model} {h.name}</h2>
          <p className="lede" style={{ marginTop: 16 }}>Open the points on the photograph. Every value below is copied from the product record.</p>
          <div className="chips">
            {["Material", "Size", "Fire Rating", "Application"].filter((l) => spec[l]).map((l) => (
              <div key={l}><span>{l}</span><span>{spec[l]}</span></div>
            ))}
          </div>
          <a className="btn" style={{ marginTop: 28 }} href="https://cantonlock.com/products/307-panic-exit-device/">Open the 307 page</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 9 range rail (design 2 drag gallery) */

function RangeRail() {
  const rail = useRef(null), track = useRef(null);
  const x = useMotionValue(0);
  const [max, setMax] = useState(0);
  useLayoutEffect(() => {
    const measure = () => setMax(Math.max(0, track.current.scrollWidth - rail.current.clientWidth));
    measure();
    const ro = new ResizeObserver(measure); ro.observe(rail.current);
    return () => ro.disconnect();
  }, []);
  const progress = useTransform(x, (v) => (max ? Math.min(1, Math.max(0, -v / max)) : 0));
  const nudge = (dir) => animate(x, Math.max(-max, Math.min(0, x.get() - dir * 340)), { type: "spring", stiffness: 220, damping: 30 });
  return (
    <section className="rail-sec">
      <div className="wrap rail-head">
        <div>
          <h2 className="display h2">Twelve models to start with</h2>
          <p className="lede" style={{ marginTop: 16 }}>Drag the row, or use the arrows. Photographs are the catalogue plates.</p>
        </div>
        <div className="rail-ctrl">
          <button onClick={() => nudge(-1)} aria-label="Previous models">‹</button>
          <button onClick={() => nudge(1)} aria-label="Next models">›</button>
        </div>
      </div>
      <div className="rail" ref={rail}>
        <motion.div className="rail-track" ref={track} style={{ x }} drag="x" dragConstraints={{ left: -max, right: 0 }} dragElastic={0.08}>
          {data.range.map((p) => (
            <article className="card" key={p.slug}>
              <div className="pic"><img src={p.img} alt={`${p.model} ${p.name}`} draggable="false" /></div>
              <div className="txt">
                <div className="model">{p.model}</div>
                <div className="nm">{p.name}</div>
                {p.specs.map((s) => <div className="sp" key={s.label}><span>{s.label}</span><span>{s.value}</span></div>)}
              </div>
            </article>
          ))}
        </motion.div>
      </div>
      <div className="rail-progress"><motion.i style={{ scaleX: progress }} /></div>
    </section>
  );
}

/* ------------------------------------------------------------------ 10 timeline (design 4 pinned horizontal) */

const EVENTS = [
  { year: "1998", title: "Founded in Xiaolan, Zhongshan", text: "Door hardware made in our own factory from the start." },
  { year: "2002", title: "ISO 9001 quality system", text: "The quality system the factory has run since." },
  { year: null, title: "Office in Germany", text: "Koblenzerstr. 29, 56656 Brohl-Lützing." },
  { year: "2027", title: "BAU 2027, Munich", text: "January 11–15, 2027, Messe München. Hall C4, Stand 523." },
];

function Timeline() {
  const ref = useRef(null), track = useRef(null);
  const { reduce } = useDemo();
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);
  return (
    <section className="timeline" ref={ref} style={{ height: reduce ? "auto" : `calc(100svh + ${dist * 0.9}px)` }}>
      <div className="tl-sticky" style={reduce ? { position: "relative", height: "auto", paddingBlock: 100 } : undefined}>
        <div className="wrap"><h2 className="display h2">Since 1998</h2></div>
        <motion.div className="tl-track" ref={track} style={{ x: reduce ? 0 : x, overflowX: reduce ? "auto" : undefined }}>
          {EVENTS.map((e) => (
            <div className="tl-item" key={e.title}>
              <div className={`tl-year ${e.year ? "" : "tbd"}`}>{e.year ?? "—"}</div>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
              {!e.year && <span className="tbd-tag">年份待甲方提供</span>}
            </div>
          ))}
        </motion.div>
        {!reduce && <div className="tl-bar"><motion.i style={{ scaleX: smooth }} /></div>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 11 closing */

function Closing() {
  return (
    <section className="ink" id="contact">
      <div className="wrap closing">
        <h2 className="display">Send the model, finish code, quantity and door thickness.</h2>
        <motion.div className="rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: CINE }} />
        <div className="row">
          <a className="btn" href="mailto:tec@cantonlock.com">Email tec@cantonlock.com</a>
          <a className="btn ghost" href="https://cantonlock.com/downloads/hyde-export-catalogue-2026.pdf">Download the catalogue</a>
        </div>
        <p className="small" style={{ marginTop: 28 }}>A sample confirms the rest. Samples are charged and credited against the first order.</p>
      </div>
      <div className="wrap footer">
        <span>Canton Hyland Hardware &amp; Building Material Co., Ltd.</span>
        <span>No. 76 Haiwei Road, Zhongshan, Guangdong, China</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ demo controls (for the client, in Chinese) */

function Panel({ opts, setOpts, onReplay }) {
  const [open, setOpen] = useState(() => window.innerWidth > 760);
  const set = (k) => (e) => setOpts((o) => ({ ...o, [k]: e.target.checked }));
  const rows = [
    ["curtain", "开场幕布（问题 2）"],
    ["kenBurns", "首屏照片慢慢推近（问题 1）"],
    ["hideHeader", "下滑时隐藏页头（问题 5）"],
    ["smooth", "平滑滚动"],
    ["reduce", "模拟“减少动效”"],
  ];
  return (
    <aside className="panel" aria-label="演示开关">
      <header><span>演示开关</span><button onClick={() => setOpen(!open)}>{open ? "收起" : "展开"}</button></header>
      {open && (
        <div className="opts">
          {rows.map(([k, label]) => (
            <label key={k}><span>{label}</span><input type="checkbox" checked={opts[k]} onChange={set(k)} /></label>
          ))}
          <button className="replay" onClick={onReplay}>从头再播一遍</button>
          <div className="note">演示页，不是正式站。图片和数字取自 cantonlock.com（{data.snapshot} 快照）。</div>
        </div>
      )}
    </aside>
  );
}
