import type { CSSProperties } from "react";
import type { Locale } from "@/data/site";
import exportMap from "@/data/generated/export-map.json";
import { LOCALE_TAG, dict } from "@/lib/i18n";
import { homeFamilies } from "@/lib/home-families";
import { FactoryClock } from "./FactoryClock";
import { MotionArm } from "./MotionArm";
import styles from "./HomeMotion.module.css";

/**
 * "Shipped from Zhongshan": routes from the factory to every country the client names as a
 * market, those countries lit in the dot map, and the model count per family underneath.
 * From the 2026-10-12 motion demo (design 3's map); country list from the client the same
 * day — every Western European country, Poland, Czechia, the Nordics except Iceland, the US and Canada, seven South American countries,
 * Japan, Korea and Australia, plus Russia, Turkey and Southeast Asia from the company page.
 *
 * Countries only, never customers: no buyer, project or volume appears (confidential).
 * Country names are not translated by hand — `Intl.DisplayNames` renders the ISO codes in
 * each of the ten languages at build time, so "DE" is Germany, Alemania, ドイツ, ألمانيا.
 *
 * Geometry comes from src/data/generated/export-map.json, projected once by
 * docs/design-references/2026-10-12-motion-demo/prep.mjs; the site ships no map library.
 * The HTML is the finished picture; MotionArm replays routes, pins and bars when the section
 * scrolls in from below, and pauses the travelling markers while it is off screen.
 */
const copy = {
  en: {
    eyebrow: "Export markets",
    title: "Shipped from Zhongshan",
    body: "Europe from Portugal to Finland, Russia and Turkey, North and South America, Japan, Korea, Southeast Asia and Australia. An office in Germany, and a Spanish-speaking team.",
    clock: "Factory time, GMT+8",
    mapLabel: "Map: routes from the factory in Zhongshan, Guangdong, to the countries listed beside it",
    zhongshan: "Zhongshan (Canton)",
    factory: "Factory",
    office: "Our office in Germany: Brohl-Lützing",
    europe: "Europe",
    americas: "The Americas",
    asiaPacific: "Asia-Pacific",
    southeastAsia: "Southeast Asia",
    barsTitle: "Models on this site, by family",
  },
  es: {
    eyebrow: "Mercados de exportación",
    title: "Despachado desde Zhongshan",
    body: "Europa de Portugal a Finlandia, Rusia y Turquía, Norteamérica y Sudamérica, Japón, Corea, el Sudeste Asiático y Australia. Una oficina en Alemania y un equipo que habla español.",
    clock: "Hora de la fábrica, GMT+8",
    mapLabel: "Mapa: rutas desde la fábrica de Zhongshan, Guangdong, hasta los países indicados al lado",
    zhongshan: "Zhongshan (Canton)",
    factory: "Fábrica",
    office: "Nuestra oficina en Alemania: Brohl-Lützing",
    europe: "Europa",
    americas: "América",
    asiaPacific: "Asia-Pacífico",
    southeastAsia: "Sudeste Asiático",
    barsTitle: "Modelos en este sitio, por familia",
  },
  pt: {
    eyebrow: "Mercados de exportação",
    title: "Embarcado de Zhongshan",
    body: "Europa de Portugal à Finlândia, Rússia e Turquia, Américas do Norte e do Sul, Japão, Coreia, Sudeste Asiático e Austrália. Um escritório na Alemanha e uma equipe que fala espanhol.",
    clock: "Hora da fábrica, GMT+8",
    mapLabel: "Mapa: rotas da fábrica em Zhongshan, Guangdong, até os países listados ao lado",
    zhongshan: "Zhongshan (Canton)",
    factory: "Fábrica",
    office: "Nosso escritório na Alemanha: Brohl-Lützing",
    europe: "Europa",
    americas: "Américas",
    asiaPacific: "Ásia-Pacífico",
    southeastAsia: "Sudeste Asiático",
    barsTitle: "Modelos neste site, por família",
  },
};

const GROUPS = ["europe", "americas", "asiaPacific"] as const;
/* One travelling marker per region, not per country: 27 looping SMIL markers cost frames. */
const TRAVEL = new Set(["DE", "RU", "US", "BR", "AR", "JP", "AU", "SEA"]);

/* A shallow arc from the factory to each point, bowed upward by a quarter of its length. */
function route(x: number, y: number) {
  const { x: ox, y: oy } = exportMap.origin;
  const lift = Math.hypot(x - ox, y - oy) * 0.28;
  return `M${ox} ${oy}Q${(ox + x) / 2} ${(oy + y) / 2 - lift} ${x} ${y}`;
}

export function ExportMap({ locale = "en" }: { locale?: Locale }) {
  const text = dict(copy, locale);
  const tag = LOCALE_TAG[locale];
  const regionName = new Intl.DisplayNames([tag], { type: "region" });
  const list = new Intl.ListFormat(tag, { style: "short", type: "unit" });
  const name = (iso: string) => (iso === "SEA" ? text.southeastAsia : (regionName.of(iso) ?? iso));
  const families = homeFamilies(locale);
  const max = Math.max(...families.map((f) => f.count));
  const [w, h] = exportMap.viewBox;
  const { origin, targets } = exportMap;

  return (
    <section className="layout bg-ink py-96 text-surface lg:py-136" aria-labelledby="export-map-heading">
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
          <dl className="mt-32 border-t border-surface/15">
            {GROUPS.map((group) => (
              <div key={group} className="border-b border-surface/15 py-12">
                <dt className="text-c2 font-semibold">{text[group]}</dt>
                <dd className="mt-4 text-c2 text-surface/70">
                  {list.format(targets.filter((t) => t.group === group).map((t) => name(t.iso)))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-16 text-c2 text-surface/60">{text.office}</p>
        </div>

        <svg
          className={`${styles.map} col-span-full mt-48 lg:col-span-8 lg:col-start-5 lg:mt-0 xl:col-span-15 xl:col-start-10`}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={text.mapLabel}
        >
          <path className={styles.dots} d={exportMap.dots} />
          <path className={styles.marketDots} d={exportMap.marketDots} />
          {targets.map((t, i) => {
            const d = route(t.x, t.y);
            const label = typeof t.label === "object" ? t.label : null;
            const style = { "--i": i * 0.4 } as CSSProperties;
            return (
              <g key={t.iso}>
                <path className={styles.route} d={d} pathLength={1} style={style} />
                {TRAVEL.has(t.iso) && (
                  /* Loop speed of an ambient marker, not a UI transition; SMIL takes no CSS variables. */
                  <circle className={styles.travel} r="2.4" visibility="hidden">
                    {/* Hidden until its motion begins: before that a bare circle sits at the SVG origin. */}
                    <set attributeName="visibility" to="visible" begin={`${1.8 + (i % 8) * 0.25}s`} />
                    <animateMotion dur={`${2.6 + (i % 3) * 0.5}s`} begin={`${1.8 + (i % 8) * 0.25}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
                <circle className={styles.pin} cx={t.x} cy={t.y} r={label ? 3.4 : 2.2} style={style} />
                {label && (
                  <text className={styles.label} x={t.x + label.dx} y={t.y + label.dy} textAnchor={label.anchor as "start" | "end"} style={style}>
                    {name(t.iso)}
                  </text>
                )}
              </g>
            );
          })}
          <circle cx={origin.x} cy={origin.y} r="6" fill="currentColor" />
          <circle className={styles.pulse} cx={origin.x} cy={origin.y} r="6" />
          <circle className={`${styles.pulse} ${styles.pulseLate}`} cx={origin.x} cy={origin.y} r="6" />
          <text className={styles.label} x={origin.x + 12} y={origin.y + 4}>{text.zhongshan}</text>
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
