import Link from "next/link";
import type { Locale } from "@/data/site";
import { publishedProducts } from "@/data/products";
import { STEPS, STEPS_ES, STEPS_PT } from "@/lib/configurator";

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
    lede: "Describe the door and we narrow the catalog to the models that fit it. Every choice we show still leads to a part we supply.",
    stepsLabel: "questions about the door",
    modelsLabel: "models we choose from",
    outValue: "A model number",
    outNote: "with its backset, center distance, finish and handing: the values an order needs.",
    how: "How it works",
    steps: [
      ["Answer what you know", "Each answer sets aside the models that won't fit that door. Choices that lead nowhere are never offered."],
      ["See what each choice decides", "The count of matching models falls as you answer, so you can see which question actually mattered."],
      ["Leave with a model number", "A published model with its full specification, not a category: ready for an inquiry or a door schedule."],
    ],
    shortcut: "Already know what you need?",
    shortcutLink: "Filter the catalog directly",
    reassure: "No sign-up. Change any answer and the list rebuilds.",
  },
  es: {
    lede: "Describa la puerta y reducimos el catálogo a los modelos que le sirven. Cada opción que le mostramos lleva a una pieza que suministramos.",
    stepsLabel: "preguntas sobre la puerta",
    modelsLabel: "modelos entre los que buscamos",
    outValue: "Un número de modelo",
    outNote: "con su entrada, distancia entre ejes, acabado y mano: los valores que necesita un pedido.",
    how: "Cómo funciona",
    steps: [
      ["Responda lo que sepa", "Cada respuesta aparta los modelos que no sirven para esa puerta. Las opciones que no llevan a ninguna parte no aparecen."],
      ["Vea qué decide cada respuesta", "El número de modelos baja a medida que responde, así ve qué pregunta pesó de verdad."],
      ["Termine con un número de modelo", "Un modelo publicado con su ficha completa, no una categoría: listo para una consulta o una planilla de puertas."],
    ],
    shortcut: "¿Ya sabe lo que necesita?",
    shortcutLink: "Filtre el catálogo directamente",
    reassure: "Sin registro. Cambie cualquier respuesta y la lista se rehace.",
  },
  pt: {
    lede: "Descreva a porta e reduzimos o catálogo aos modelos que servem para ela. Cada opção que mostramos leva a uma peça que fornecemos.",
    stepsLabel: "perguntas sobre a porta",
    modelsLabel: "modelos entre os quais buscamos",
    outValue: "Um número de modelo",
    outNote: "com a distância ao eixo, entre-eixos, acabamento e mão: os valores de que um pedido precisa.",
    how: "Como funciona",
    steps: [
      ["Responda o que você sabe", "Cada resposta separa os modelos que não servem para essa porta. Opções que não levam a lugar nenhum não aparecem."],
      ["Veja o que cada resposta decide", "O número de modelos cai conforme você responde, então dá para ver qual pergunta pesou de verdade."],
      ["Saia com um número de modelo", "Um modelo publicado com a ficha completa, não uma categoria: pronto para uma consulta ou uma planilha de portas."],
    ],
    shortcut: "Já sabe o que precisa?",
    shortcutLink: "Filtre o catálogo direto",
    reassure: "Sem cadastro. Mude qualquer resposta e a lista se refaz.",
  },
} as const;

export function ConfiguratorIntro({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale];
  const steps = (locale === "es" ? STEPS_ES : locale === "pt" ? STEPS_PT : STEPS).length;
  const models = publishedProducts.length;
  const finderHref = `${locale === "en" ? "" : `/${locale}`}/product-finder/`;

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
