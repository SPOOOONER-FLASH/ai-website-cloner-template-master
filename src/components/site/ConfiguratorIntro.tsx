import Link from "next/link";
import type { Locale } from "@/data/site";
import { publishedProducts } from "@/data/products";
import { STEPS, STEPS_ES } from "@/lib/configurator";

/**
 * What the configurator is, what it asks, and what comes out — before it is used.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * The page opened with three sentences of description and no numbers at all. Two problems
 * came out of that at once. A buyer landing on it could not tell whether the tool was
 * worth three minutes — how many questions, how many models, what they get at the end —
 * so the most-built thing on the site was also the least explained. And it scored lowest
 * of every page type on citability, with zero concrete figures: an answer engine asked
 * "how do I choose a lock from Canton Hyland" had nothing quotable to return.
 *
 * Both are fixed by the same thing: say what it actually does, in numbers.
 *
 * ---------------------------------------------------------------------------
 * WHY THE NUMBERS ARE COUNTED
 *
 * Step count and model count come from the configurator's own step definitions and the
 * catalogue. Typed in by hand they would be right today and wrong at the next content
 * change — on the one page whose whole promise is that it never shows you a dead end.
 */

const COPY = {
  en: {
    lede: "A few questions about the door, and the catalogue narrows to the models that fit. Every option shown leads somewhere — you cannot reach an empty result.",
    stepsLabel: "questions about the opening",
    modelsLabel: "models it selects from",
    outValue: "A model number",
    outNote: "with its backset, centre distance, finish and handing — the six values an order needs.",
    how: "How it works",
    steps: [
      ["Answer only what applies", "Each answer removes the models that cannot be installed on that door. Options that would lead nowhere are not offered."],
      ["Watch the count fall", "The number of matching models updates as you go, so you can see how much each choice actually decides."],
      ["Leave with a model number", "The result is a published model with its specification, not a category — ready to paste into an enquiry or a door schedule."],
    ],
    shortcut: "Already know what you need?",
    shortcutLink: "Filter the catalogue directly",
    reassure: "No account, no email, nothing saved. Change any answer at any point and the list re-forms.",
  },
  es: {
    lede: "Unas preguntas sobre la puerta y el catálogo se reduce a los modelos que encajan. Toda opción mostrada lleva a algún sitio: no se puede llegar a un resultado vacío.",
    stepsLabel: "preguntas sobre el hueco",
    modelsLabel: "modelos entre los que elige",
    outValue: "Un número de modelo",
    outNote: "con su entrada, distancia entre ejes, acabado y mano: los seis valores que necesita un pedido.",
    how: "Cómo funciona",
    steps: [
      ["Responda solo lo que aplique", "Cada respuesta elimina los modelos que no se pueden instalar en esa puerta. Las opciones que no llevarían a nada no se ofrecen."],
      ["Vea bajar el recuento", "El número de modelos coincidentes se actualiza sobre la marcha, así ve cuánto decide realmente cada elección."],
      ["Termine con un número de modelo", "El resultado es un modelo publicado con su ficha, no una categoría: listo para pegar en una consulta o en un cuadro de puertas."],
    ],
    shortcut: "¿Ya sabe lo que necesita?",
    shortcutLink: "Filtre el catálogo directamente",
    reassure: "Sin cuenta, sin correo, nada se guarda. Cambie cualquier respuesta y la lista se rehace.",
  },
} as const;

export function ConfiguratorIntro({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale];
  const steps = (locale === "es" ? STEPS_ES : STEPS).length;
  const models = publishedProducts.length;
  const finderHref = locale === "es" ? "/es/product-finder/" : "/product-finder/";

  return (
    <>
      <p className="text-lead text-ink">{t.lede}</p>

      {/*
        Three figures, set apart from their labels. This is the same treatment the
        homepage strip uses, for the same reason: a number a reader can lift out is a
        number an answer engine can quote, and it is what a buyer scans before deciding
        whether to spend three minutes here.
      */}
      <dl className="mt-32 grid grid-cols-2 gap-x-24 gap-y-24 border-t border-ink pt-24 sm:grid-cols-3">
        <div>
          <dd className="text-h2 tabular-nums text-ink">{steps}</dd>
          <dt className="mt-8 block max-w-[16ch] text-c2 text-ink-secondary">{t.stepsLabel}</dt>
        </div>
        <div>
          <dd className="text-h2 tabular-nums text-ink">{models}</dd>
          <dt className="mt-8 block max-w-[16ch] text-c2 text-ink-secondary">{t.modelsLabel}</dt>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dd className="text-h3 text-ink">{t.outValue}</dd>
          <dt className="mt-8 block max-w-[26ch] text-c2 text-ink-secondary">{t.outNote}</dt>
        </div>
      </dl>

      <h2 className="drawer-eyebrow mt-40">{t.how}</h2>
      <ol className="mt-16">
        {t.steps.map(([title, body], index) => (
          <li key={title} className="grid grid-cols-[2.4rem_1fr] gap-x-16 border-t border-line py-16">
            <span className="text-c2 tabular-nums text-ink-tertiary">0{index + 1}</span>
            <span>
              <span className="block text-c1 text-ink">{title}</span>
              <span className="mt-4 block text-c2 text-ink-secondary">{body}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-24 text-c2 text-ink-secondary">{t.reassure}</p>

      <p className="mt-16 text-c2 text-ink-secondary">
        {t.shortcut}{" "}
        <Link
          href={finderHref}
          className="short-marker short-marker-compact text-brand hover:text-brand-hover"
        >
          {t.shortcutLink}
        </Link>
        .
      </p>
    </>
  );
}
