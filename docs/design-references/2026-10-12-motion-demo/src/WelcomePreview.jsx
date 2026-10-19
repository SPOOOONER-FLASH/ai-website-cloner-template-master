import { useEffect } from "react";
import Lenis from "lenis";
import data from "./welcome.json";

// Homepage welcome band, revised plan of 2026-10-13: teaser (parallax) -> chapter (word brighten)
// -> figures (rise). All three effects are CSS scroll timelines in welcome.css; this file only
// lays out the page. ?still renders the final state, the same thing reduced motion shows.
const still = new URLSearchParams(location.search).has("still");
const LANGS = ["ES", "PT", "FR", "DE", "JA", "KO", "TR", "RU", "AR"];

export function WelcomePreview() {
  // Same rule as src/components/site/HomeSmoothScroll.tsx.
  useEffect(() => {
    if (still || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, anchors: true });
    let id = requestAnimationFrame(function frame(t) { lenis.raf(t); id = requestAnimationFrame(frame); });
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  let k = 0;
  return (
    <div className={`pv-welcome${still ? " pv-still" : ""}`} lang="en">
      <nav className="pv-panel" aria-label="预览状态" lang="zh-CN">
        <a href="?" className={still ? "" : "on"}>动效</a>
        <a href="?still" className={still ? "on" : ""}>静态对照</a>
      </nav>
      <header className="pv-header">
        <div className="pv-bar">
          <a href="https://cantonlock.com/" aria-label="HYDE home"><img className="pv-logo" src="img/welcome/hyde-horizontal-ink.svg" alt="HYDE" /></a>
          <div className="pv-tools">
            <span className="pv-langs">
              <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
              {LANGS.map((l) => <a key={l} className="pv-lang-more" href={`https://cantonlock.com/${l.toLowerCase()}/`}>{l}</a>)}
              <b>EN</b>
            </span>
            <button type="button" aria-label="Search"><Icon d="M10.5 3.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20.5 20.5l-5-5" /></button>
            <button type="button" aria-label="Menu"><Icon d="M3 6h18M3 12h18M3 18h18" /></button>
          </div>
        </div>
        <div className="pv-menu">
          <nav className="pv-nav" aria-label="Main">
            <a href="https://cantonlock.com/products/">Products</a>
            <a href="https://cantonlock.com/product-finder/">Product Finder</a>
            <button type="button">Resources</button>
            <a href="https://cantonlock.com/company/">Company</a>
          </nav>
          <button type="button" className="pv-buy">Buy it now <span aria-hidden>›</span></button>
        </div>
      </header>

      <main className="pv-main">
        <div className="pv-modules">
          <figure className="pv-layout pv-standin">
            <div>
              <img src="img/welcome/hero-standin.webp" alt="" width="1774" height="887" />
              <figcaption className="pv-note">占位：首页大图轮播，不在本次改动内</figcaption>
            </div>
          </figure>

          {/* View 1: parallax. Card 2 starts 64px lower and lands flush (pointer: fine only). */}
          <div className="pv-layout pv-teaser">
            <h2 className="pv-teaser-h">{data.teaser.heading}</h2>
            <div className="pv-outset">
              <div className="pv-snap">
                {data.teaser.cards.map((c) => (
                  <a key={c.title} className="pv-card" href={c.href}>
                    <img src={c.img} alt={c.alt} width="1254" height="1254" />
                    <p className="pv-card-cap">
                      <strong className="pv-marker">{c.title}</strong>
                      <br />
                      <span className="pv-card-sub">{c.subtitle}</span>
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View 2: the chapter. Rail = H1 + letterhead; right = statement (brightens), credentials, offer. */}
        <div className="pv-intro">
          <div className="pv-layout">
            <div className="pv-chapter">
              <h1 className="pv-h1">
                {data.h1[0]}
                <span className="pv-h1-light">{data.h1[1]}</span>
              </h1>
              <div className="pv-content">
                <p className="pv-statement" style={{ "--n": data.statement.n }}>
                  {data.statement.seg.map((s, i) => (s.w ? <span key={i} style={{ "--k": k++ }}>{s.t}</span> : s.t))}
                </p>
                <p className="pv-credentials">{data.credentials}</p>
                <p className="pv-offer">{data.offer}</p>
              </div>
              <div className="pv-letterhead">
                <p className="pv-company">{data.company}</p>
                <p className="pv-headcount">{data.headcount.value} {data.headcount.label}</p>
                <img className="pv-iso" src="img/welcome/certification-marks.svg" alt="ISO 9001 certification mark" />
                <ul className="pv-rail">
                  {data.rail.map((r) => <li key={r.label}><a href={r.href}>{r.label}</a></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* View 3: figures rise out of a clip mask. The true number is in the DOM in every state. */}
        <section className="pv-layout pv-facts" aria-labelledby="pv-facts-heading">
          <div>
            <h2 id="pv-facts-heading" className="pv-sr-only">{data.factsHeading}</h2>
            {/* The whole figure is the link, so its accessible name is "549 published products". */}
            <ul className="pv-figures">
              {data.facts.map((f) => (
                <li key={f.label}>
                  <a className="pv-fact" href={f.href}>
                    <span className="pv-figure-mask"><span className="pv-figure">{f.value}</span></span>{" "}
                    <span className="pv-fact-label">{f.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pv-layout pv-map">
          <div>
            <h2 className="pv-map-h">{data.exportTitle}</h2>
            <p className="pv-note">占位：出口地图（黑色带），不在本次改动内</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
