import type { CSSProperties } from "react";
import type { Locale } from "@/data/site";
import { companyEditorialStudies, factoryAssemblyLine, factoryCncMachining, factoryPolishingWorkshop } from "@/data/company";
import { dict } from "@/lib/i18n";
import { getResponsiveEditorialImageProps } from "./editorial-images";
import { StoryStage } from "./StoryStage";
import styles from "./HomeMotion.module.css";

/**
 * "A factory, not a trading office": five steps through the plant, the photograph pinned on
 * the left and wiped to the next as each step reaches the middle of the screen. From the
 * 2026-10-12 motion demo (design 4's sticky narrative), which the client picked for the
 * live homepage; the client's screen recording of the demo the same evening asked for its
 * wipe and its photographs here (「我要这个 那个滚动的视频 要这些图片」), so CNC machining
 * joins as step 3 and the wipe now pushes in with a slight scale, as the demo's does.
 *
 * The photographs are the client's own (companyEditorialStudies and factoryCncMachining,
 * src/data/company.ts, where their provenance and captions are recorded), in process order. The laser cutter
 * carries its maker's brand on the housing; it was left out on first build and put back at
 * the client's request (2026-10-12: 「激光切割加进去」) — equipment branding, not another
 * hardware brand, as content/rayen/assets.json already cleared for the company page. Each
 * step's sentence restates what the record's caption says; nothing here is a new claim.
 */
const STEP_IMAGES = [
  "/images/company/factory-laser-cutter.webp",
  "/images/company/press-shop.webp",
  "/images/company/factory-cnc-machining.webp",
  // The demo's polishing and assembly photographs, confirmed as the factory's own 2026-10-13.
  "/images/company/factory-polishing-workshop.webp",
  "/images/company/factory-assembly-quality-line.webp",
];

const copy = {
  en: {
    eyebrow: "The factory",
    title: "A factory, not a trading office.",
    body: "We cut, stamp, machine, polish, assemble and inspect our own parts. Bring a drawing or a sample and we tool it.",
    steps: [
      { title: "Cutting", text: "A fiber laser cutter on our shop floor cuts the steel plate that becomes lock cases and backplates." },
      { title: "Stamping", text: "Our press shop: mechanical punch presses with their tooling set, where lock cases, plates and handle blanks are stamped." },
      { title: "Machining", text: "CNC machining in house, on the same site as the press shop." },
      { title: "Polishing", text: "The polishing line decides whether a satin finish is even across a whole production run." },
      { title: "Assembly and inspection", text: "Sets are built and checked on the assembly line, each part taken from its own labeled bin." },
    ],
  },
  es: {
    eyebrow: "La fábrica",
    title: "Una fábrica, no una oficina comercial.",
    body: "Cortamos, estampamos, mecanizamos, pulimos, montamos e inspeccionamos nuestras propias piezas. Tráiganos un plano o una muestra y hacemos el utillaje.",
    steps: [
      { title: "Corte", text: "Una cortadora láser de fibra en nuestra planta corta la chapa de acero de la que salen cajas de cerradura y placas." },
      { title: "Estampado", text: "Una fila de prensas mecánicas con su utillaje, donde se estampan cajas de cerradura, placas y piezas en bruto de manillas." },
      { title: "Mecanizado", text: "Mecanizado CNC propio, en la misma planta que las prensas." },
      { title: "Pulido", text: "La línea de pulido decide si un acabado satinado sale uniforme en toda una serie de producción." },
      { title: "Montaje e inspección", text: "Los juegos se montan y revisan en la línea de montaje, cada pieza tomada de su propia caja etiquetada." },
    ],
  },
  pt: {
    eyebrow: "A fábrica",
    title: "Uma fábrica, não um escritório comercial.",
    body: "Cortamos, estampamos, usinamos, polimos, montamos e inspecionamos as nossas próprias peças. Traga um desenho ou uma amostra e fazemos o ferramental.",
    steps: [
      { title: "Corte", text: "Uma cortadora laser de fibra na nossa fábrica corta a chapa de aço de que saem caixas de fechadura e espelhos." },
      { title: "Estampagem", text: "Uma fila de prensas mecânicas com a ferramenta montada, onde são estampadas caixas de fechadura, espelhos e peças brutas de maçanetas." },
      { title: "Usinagem", text: "Usinagem CNC própria, no mesmo local da estamparia." },
      { title: "Polimento", text: "A linha de polimento decide se um acabamento acetinado sai uniforme em todo um lote de produção." },
      { title: "Montagem e inspeção", text: "Os conjuntos são montados e conferidos na linha de montagem, cada peça tirada da sua própria caixa etiquetada." },
    ],
  },
};

function alt(src: string, locale: Locale) {
  const ref = [...companyEditorialStudies, factoryCncMachining, factoryPolishingWorkshop, factoryAssemblyLine].find((s) => s.src === src);
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
        <div className={styles.stage} data-stage aria-hidden="true">
          {STEP_IMAGES.map((src, k) => (
            <div key={src} className={styles.shot} data-shot={k === 0 ? "on" : "next"}>
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
          {/* Each bar fills as the reader scrolls through its step; StoryStage sets --story-p. */}
          <div className={styles.progress}>
            {STEP_IMAGES.map((src, k) => <i key={src} style={{ "--k": k, "--n": STEP_IMAGES.length } as CSSProperties} />)}
          </div>
        </div>

        <div className="px-24 lg:px-64">
          <div className="flex min-h-[60svh] flex-col justify-center py-64">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-surface/60">{text.eyebrow}</p>
            <h2 id="factory-story-heading" className="mt-8 text-h2">{text.title}</h2>
            <p className="mt-16 text-c1 text-surface/70">{text.body}</p>
          </div>
          {text.steps.map((step, k) => (
            <article key={step.title} className={styles.step}>
              {/* eslint-disable-next-line @next/next/no-img-element -- responsive editorial props, as MediaPlaceholder renders them */}
              <img
                {...getResponsiveEditorialImageProps(STEP_IMAGES[k], "100vw")}
                alt={alt(STEP_IMAGES[k], locale)}
                loading="lazy"
                decoding="async"
                className={`${styles.stepShot} mb-24 aspect-[3/2] w-full object-cover`}
              />
              {/* The photograph switches when THIS block reaches mid-screen (StoryStage), not when the
                  tall article does — that made the picture change while its text was still low. */}
              <div data-step={k}>
                <p className="text-c2 font-semibold tabular-nums text-surface/60">
                  {pad(k + 1)} / {pad(text.steps.length)}
                </p>
                <h3 className="mt-12 text-h2">{step.title}</h3>
                <p className="mt-12 max-w-[34em] text-c1 text-surface/70">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
