import Link from "next/link";
import type { Locale } from "@/data/site";
import { publishedProducts } from "@/data/products";
import { STEPS, STEPS_ES, STEPS_PT } from "@/lib/configurator";

/**
 * The configurator, offered from inside the catalogue.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * The Catalogue header occupied the left half of the content band and nothing occupied
 * the right. On a 1440px screen that is roughly a third of the first viewport spent on
 * white — beside a heading whose own copy asks "Don't know the model?" and a mode switch
 * whose second tab was grey and unselected.
 *
 * A tab nobody presses is not an argument for emboldening the tab. It is an argument for
 * making the case for the tool where the reader already is. So the figures that persuade
 * somebody to spend three minutes in the configurator — how many questions, how many
 * models, what comes out — are stated here, next to the filters, rather than only on the
 * page a reader reaches after deciding to go there.
 *
 * This is a SUMMARY, not a move. `ConfiguratorIntro` stays on /configurator/ in full: it
 * is that page's only source of quotable figures, and stripping it to fill a gap here
 * would trade one page's citability for another's layout.
 *
 * ---------------------------------------------------------------------------
 * WHY THE NUMBERS ARE COUNTED
 *
 * Same rule as the intro. Step count comes from the configurator's own step definitions
 * and the model count from the catalogue, so neither can disagree with the tool it is
 * describing — or with the other page that prints the same two numbers.
 */

const COPY = {
  en: {
    eyebrow: "No model number yet?",
    heading: (n: number) => `Describe the door. ${n} questions find the part.`,
    body: "Tell us what you are specifying, what it should be made of, what door it goes on and the finish. Every answer sets aside the models that won't fit, and every choice we show still leads to a part we supply.",
    stepsLabel: "questions",
    modelsLabel: "models we choose from",
    outValue: "A model number",
    outNote: "ready to quote, with backset, center distance, finish and handing.",
    cta: "Find my model",
    reassure: "No sign-up.",
  },
  es: {
    eyebrow: "¿Aún no tiene el número de modelo?",
    heading: (n: number) => `Describa la puerta: ${n} preguntas bastan para dar con la pieza.`,
    body: "Díganos qué está especificando, de qué material, en qué puerta va y con qué acabado. Cada respuesta aparta los modelos que no encajan, y cada opción que le mostramos lleva a una pieza que suministramos.",
    stepsLabel: "preguntas",
    modelsLabel: "modelos entre los que buscamos",
    outValue: "Un número de modelo",
    outNote: "listo para cotizar, con entrada, distancia entre ejes, acabado y mano.",
    cta: "Encontrar mi modelo",
    reassure: "Sin registro.",
  },
  pt: {
    eyebrow: "Ainda sem o número do modelo?",
    heading: (n: number) => `Descreva a porta: ${n} perguntas bastam para achar a peça.`,
    body: "Diga o que você está especificando, de que material, em que porta vai e com qual acabamento. Cada resposta separa os modelos que não servem, e cada opção que mostramos leva a uma peça que fornecemos.",
    stepsLabel: "perguntas",
    modelsLabel: "modelos entre os quais buscamos",
    outValue: "Um número de modelo",
    outNote: "pronto para cotação, com distância ao eixo, entre-eixos, acabamento e mão.",
    cta: "Encontrar meu modelo",
    reassure: "Sem cadastro.",
  },
} as const;

export function ConfiguratorTeaser({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale];
  const steps = (locale === "es" ? STEPS_ES : locale === "pt" ? STEPS_PT : STEPS).length;
  const models = publishedProducts.length;
  const href = `${locale === "en" ? "" : `/${locale}`}/configurator/`;

  return (
    <aside className="border-t border-ink pt-16">
      <p className="drawer-eyebrow">{t.eyebrow}</p>
      <p className="mt-12 text-h3 text-ink">{t.heading(steps)}</p>
      <p className="mt-12 max-w-[46ch] text-c2 text-ink-secondary">{t.body}</p>

      {/*
        The same three figures the configurator page prints, in the same order. A reader
        who clicks through should meet numbers they have already read, not a second set.
      */}
      <dl className="mt-24 grid grid-cols-2 gap-x-24 gap-y-16 border-t border-line pt-16">
        <div>
          <dd className="text-h3 tabular-nums text-ink">{steps}</dd>
          <dt className="mt-4 block text-c2 text-ink-secondary">{t.stepsLabel}</dt>
        </div>
        <div>
          <dd className="text-h3 tabular-nums text-ink">{models}</dd>
          <dt className="mt-4 block max-w-[16ch] text-c2 text-ink-secondary">{t.modelsLabel}</dt>
        </div>
        <div className="col-span-2">
          <dd className="text-c1 text-ink">{t.outValue}</dd>
          <dt className="mt-4 block max-w-[34ch] text-c2 text-ink-secondary">{t.outNote}</dt>
        </div>
      </dl>

      <Link href={href} className="btn btn-primary mt-24">
        {t.cta}
      </Link>
      <p className="mt-12 text-c2 text-ink-tertiary">{t.reassure}</p>
    </aside>
  );
}
