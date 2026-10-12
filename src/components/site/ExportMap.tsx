import type { CSSProperties } from "react";
import type { Locale } from "@/data/site";
import exportMap from "@/data/generated/export-map.json";
import { dict } from "@/lib/i18n";
import { homeFamilies } from "@/lib/home-families";
import { FactoryClock } from "./FactoryClock";
import { MotionArm } from "./MotionArm";
import styles from "./HomeMotion.module.css";

/**
 * "Shipped from Zhongshan": the markets the company names on its own pages, drawn as routes
 * from the factory, with the model count per family underneath. From the 2026-10-12 motion
 * demo (design 3's map), which the client picked for the live homepage.
 *
 * Only public facts: the regions are the ones the company page lists, the one city named
 * outside China is the German office's. No customer, project or shipment volume appears —
 * those are confidential (see the project memory on what never goes on the site).
 *
 * The dots and points come from src/data/generated/export-map.json, projected once by
 * docs/design-references/2026-10-12-motion-demo/prep.mjs, so the site ships no map library.
 * The HTML is the finished picture; MotionArm only replays the routes, pins and bars when
 * the section scrolls in from below.
 */
const copy = {
  en: {
    eyebrow: "Export markets",
    title: "Shipped from Zhongshan",
    body: "Europe, Russia, the Americas, Turkey and Southeast Asia. An office in Germany, and a Spanish-speaking team.",
    clock: "Factory time, GMT+8",
    mapLabel: "Map: routes from the factory in Zhongshan, Guangdong, to the markets listed beside it",
    factory: "Factory",
    office: "Office, Brohl-Lützing",
    market: "Market",
    barsTitle: "Models on this site, by family",
    names: {
      zhongshan: "Zhongshan",
      germany: "Germany",
      europe: "Europe",
      russia: "Russia",
      turkey: "Turkey",
      southeastAsia: "Southeast Asia",
      northAmerica: "North America",
      southAmerica: "South America",
    },
  },
  es: {
    eyebrow: "Mercados de exportación",
    title: "Despachado desde Zhongshan",
    body: "Europa, Rusia, las Américas, Turquía y el Sudeste Asiático. Una oficina en Alemania y un equipo que habla español.",
    clock: "Hora de la fábrica, GMT+8",
    mapLabel: "Mapa: rutas desde la fábrica de Zhongshan, Guangdong, hasta los mercados indicados al lado",
    factory: "Fábrica",
    office: "Oficina, Brohl-Lützing",
    market: "Mercado",
    barsTitle: "Modelos en este sitio, por familia",
    names: {
      zhongshan: "Zhongshan",
      germany: "Alemania",
      europe: "Europa",
      russia: "Rusia",
      turkey: "Turquía",
      southeastAsia: "Sudeste Asiático",
      northAmerica: "Norteamérica",
      southAmerica: "Sudamérica",
    },
  },
  pt: {
    eyebrow: "Mercados de exportação",
    title: "Embarcado de Zhongshan",
    body: "Europa, Rússia, as Américas, Turquia e Sudeste Asiático. Um escritório na Alemanha e uma equipe que fala espanhol.",
    clock: "Hora da fábrica, GMT+8",
    mapLabel: "Mapa: rotas da fábrica em Zhongshan, Guangdong, até os mercados listados ao lado",
    factory: "Fábrica",
    office: "Escritório, Brohl-Lützing",
    market: "Mercado",
    barsTitle: "Modelos neste site, por família",
    names: {
      zhongshan: "Zhongshan",
      germany: "Alemanha",
      europe: "Europa",
      russia: "Rússia",
      turkey: "Turquia",
      southeastAsia: "Sudeste Asiático",
      northAmerica: "América do Norte",
      southAmerica: "América do Sul",
    },
  },
};

type MarketKey = keyof (typeof copy)["en"]["names"];

/* A shallow arc from the factory to each point, bowed upward by a quarter of its length. */
function route(x: number, y: number) {
  const { x: ox, y: oy } = exportMap.origin;
  const lift = Math.hypot(x - ox, y - oy) * 0.28;
  return `M${ox} ${oy}Q${(ox + x) / 2} ${(oy + y) / 2 - lift} ${x} ${y}`;
}

export function ExportMap({ locale = "en" }: { locale?: Locale }) {
  const text = dict(copy, locale);
  const families = homeFamilies(locale);
  const max = Math.max(...families.map((f) => f.count));
  const [w, h] = exportMap.viewBox;
  const { origin } = exportMap;

  return (
    <section className="layout mt-96 bg-ink py-96 text-surface lg:mt-136 lg:py-136" aria-labelledby="export-map-heading">
      <MotionArm />
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-4 xl:col-span-8">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-surface/60">{text.eyebrow}</p>
          <h2 id="export-map-heading" className="mt-8 text-h2">{text.title}</h2>
          <p className="mt-16 text-c1 text-surface/70">{text.body}</p>
          <p className="mt-32 text-c2 text-surface/70">
            {text.clock}
            <span className="mt-4 block text-h3 font-semibold text-surface">
              <FactoryClock />
            </span>
          </p>
          <ul className="mt-32 border-t border-surface/15">
            {exportMap.markets.map((m) => (
              <li key={m.key} className="flex justify-between gap-16 border-b border-surface/15 py-12 text-c2">
                <span>{text.names[m.key as MarketKey]}</span>
                <span className="text-surface/60">{m.key === "germany" ? text.office : text.market}</span>
              </li>
            ))}
          </ul>
        </div>

        <svg
          className={`${styles.map} col-span-full mt-48 lg:col-span-8 lg:col-start-5 lg:mt-0 xl:col-span-15 xl:col-start-10`}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={text.mapLabel}
        >
          <path className={styles.dots} d={exportMap.dots} />
          {exportMap.markets.map((m, i) => {
            const d = route(m.x, m.y);
            const style = { "--i": i } as CSSProperties;
            return (
              <g key={m.key}>
                <path className={styles.route} d={d} pathLength={1} style={style} />
                {/* Loop speed of an ambient marker, not a UI transition; SMIL takes no CSS variables. */}
                <circle className={styles.travel} r="2.6">
                  <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${1.8 + i * 0.2}s`} repeatCount="indefinite" path={d} />
                </circle>
                <circle className={styles.pin} cx={m.x} cy={m.y} r="4" style={style} />
                <text className={styles.label} x={m.x + m.dx} y={m.y + m.dy} textAnchor={m.anchor as "start" | "middle" | "end"} style={style}>
                  {text.names[m.key as MarketKey]}
                </text>
              </g>
            );
          })}
          <circle cx={origin.x} cy={origin.y} r="6" fill="currentColor" />
          <circle className={styles.pulse} cx={origin.x} cy={origin.y} r="6" />
          <circle className={`${styles.pulse} ${styles.pulseLate}`} cx={origin.x} cy={origin.y} r="6" />
          <text className={styles.label} x={origin.x + 12} y={origin.y + 4}>{text.names.zhongshan}</text>
          <text className={styles.labelSub} x={origin.x + 12} y={origin.y + 19}>{text.factory}</text>
        </svg>

        <h3 className="col-span-full mt-64 text-h3 font-semibold lg:mt-96">{text.barsTitle}</h3>
        <ul className="col-span-full mt-24 grid gap-x-40 gap-y-24 sm:grid-cols-2 xl:grid-cols-4">
          {families.map((f, i) => (
            <li key={f.key}>
              <a href={f.href} className="short-marker-surface flex justify-between gap-16 text-c2">
                <span className="short-marker-group">{f.name}</span>
                <span className="font-semibold tabular-nums">{f.count}</span>
              </a>
              <span className={`${styles.barTrack} mt-8 block`}>
                <span
                  className={styles.barFill}
                  style={{ width: `${(f.count / max) * 100}%`, "--i": i } as CSSProperties}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
