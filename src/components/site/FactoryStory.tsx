import type { Locale } from "@/data/site";
import { companyEditorialStudies } from "@/data/company";
import { dict } from "@/lib/i18n";
import { getResponsiveEditorialImageProps } from "./editorial-images";
import { StoryStage } from "./StoryStage";
import styles from "./HomeMotion.module.css";

/**
 * "A factory, not a trading office": four steps through the plant, the photograph pinned on
 * the left and wiped to the next as each step reaches the middle of the screen. From the
 * 2026-10-12 motion demo (design 4's sticky narrative), which the client picked for the
 * live homepage.
 *
 * The three photographs are the client's own (companyEditorialStudies, src/data/company.ts,
 * where their provenance and captions are recorded), in process order. The fourth photo in
 * that record, the laser cutter, is left out: its housing carries the machine maker's brand,
 * and another firm's logo is what the RAYEN homepage note (src/components/rayen/pages.tsx)
 * keeps off a home page. Each step's sentence restates what the record's caption says;
 * nothing here is a new claim about the plant.
 */
const STEP_IMAGES = [
  "/images/company/press-shop.webp",
  "/images/company/polishing-line.webp",
  "/images/company/assembly-line.webp",
];

const copy = {
  en: {
    eyebrow: "The factory",
    title: "A factory, not a trading office.",
    body: "We stamp, polish, assemble and inspect our own parts. Bring a drawing or a sample and we tool it.",
    steps: [
      { title: "Stamping", text: "Our press shop: mechanical punch presses with their tooling set, where lock cases, plates and handle blanks are stamped." },
      { title: "Polishing", text: "The polishing line decides whether a satin finish is even across a whole production run." },
      { title: "Assembly and inspection", text: "Sets are built, checked and bagged at the benches, with finished goods palletized behind them." },
    ],
  },
  es: {
    eyebrow: "La fábrica",
    title: "Una fábrica, no una oficina comercial.",
    body: "Estampamos, pulimos, montamos e inspeccionamos nuestras propias piezas. Tráiganos un plano o una muestra y hacemos el utillaje.",
    steps: [
      { title: "Estampado", text: "Una fila de prensas mecánicas con su utillaje, donde se estampan cajas de cerradura, placas y piezas en bruto de manillas." },
      { title: "Pulido", text: "La línea de pulido decide si un acabado satinado sale uniforme en toda una serie de producción." },
      { title: "Montaje e inspección", text: "Los juegos se montan, revisan y embolsan en los puestos, con el producto terminado paletizado detrás." },
    ],
  },
  pt: {
    eyebrow: "A fábrica",
    title: "Uma fábrica, não um escritório comercial.",
    body: "Estampamos, polimos, montamos e inspecionamos as nossas próprias peças. Traga um desenho ou uma amostra e fazemos o ferramental.",
    steps: [
      { title: "Estampagem", text: "Uma fila de prensas mecânicas com a ferramenta montada, onde são estampadas caixas de fechadura, espelhos e peças brutas de maçanetas." },
      { title: "Polimento", text: "A linha de polimento decide se um acabamento acetinado sai uniforme em todo um lote de produção." },
      { title: "Montagem e inspeção", text: "Os conjuntos são montados, conferidos e ensacados nas bancadas, com o produto acabado paletizado atrás." },
    ],
  },
};

function alt(src: string, locale: Locale) {
  const ref = companyEditorialStudies.find((s) => s.src === src);
  if (!ref) throw new Error(`FactoryStory: ${src} is not in companyEditorialStudies`);
  return (locale === "es" ? ref.labelEs : locale === "pt" ? ref.labelPt : undefined) ?? ref.label;
}

export function FactoryStory({ locale = "en" }: { locale?: Locale }) {
  const text = dict(copy, locale);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="layout mt-96 bg-ink text-surface lg:mt-136" aria-labelledby="factory-story-heading">
      <StoryStage />
      <div className="col-full grid lg:grid-cols-[7fr_5fr]">
        <div className={styles.stage} data-stage data-active="0" aria-hidden="true">
          {STEP_IMAGES.map((src, k) => (
            <div key={src} className={styles.shot} data-k={k}>
              {/* eslint-disable-next-line @next/next/no-img-element -- responsive editorial props, as MediaPlaceholder renders them */}
              <img
                {...getResponsiveEditorialImageProps(src, "(min-width: 1032px) 58vw, 100vw")}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full"
              />
            </div>
          ))}
          <div className={styles.progress}>
            {STEP_IMAGES.map((src) => <i key={src} />)}
          </div>
        </div>

        <div className="px-24 lg:px-64">
          <div className="flex min-h-[60svh] flex-col justify-center py-64">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-surface/60">{text.eyebrow}</p>
            <h2 id="factory-story-heading" className="mt-8 text-h2">{text.title}</h2>
            <p className="mt-16 text-c1 text-surface/70">{text.body}</p>
          </div>
          {text.steps.map((step, k) => (
            <article key={step.title} className={styles.step} data-step={k}>
              {/* eslint-disable-next-line @next/next/no-img-element -- responsive editorial props, as MediaPlaceholder renders them */}
              <img
                {...getResponsiveEditorialImageProps(STEP_IMAGES[k], "100vw")}
                alt={alt(STEP_IMAGES[k], locale)}
                loading="lazy"
                decoding="async"
                className={`${styles.stepShot} mb-24 aspect-[3/2] w-full object-cover`}
              />
              <p className="text-c2 font-semibold tabular-nums text-surface/60">
                {pad(k + 1)} / {pad(text.steps.length)}
              </p>
              <h3 className="mt-12 text-h2">{step.title}</h3>
              <p className="mt-12 max-w-[34em] text-c1 text-surface/70">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
