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
    eyebrow: "Don't know the model?",
    heading: (n: number) => `Answer ${n} questions about the door instead`,
    body: "Each answer removes the models that cannot be installed on that opening. Every option shown leads somewhere — you cannot reach an empty result.",
    stepsLabel: "questions",
    modelsLabel: "models it selects from",
    outValue: "A model number",
    outNote: "with backset, center distance, finish and handing.",
    cta: "Open the configurator",
    reassure: "No account, no email, nothing saved.",
  },
  es: {
    eyebrow: "¿No sabe el modelo?",
    heading: (n: number) => `Responda ${n} preguntas sobre la puerta`,
    body: "Cada respuesta elimina los modelos que no se pueden instalar en ese hueco. Toda opción mostrada lleva a algún sitio: no se puede llegar a un resultado vacío.",
    stepsLabel: "preguntas",
    modelsLabel: "modelos entre los que elige",
    outValue: "Un número de modelo",
    outNote: "con entrada, distancia entre ejes, acabado y mano.",
    cta: "Abrir el configurador",
    reassure: "Sin cuenta, sin correo, nada se guarda.",
  },
  pt: {
    eyebrow: "Não sabe o modelo?",
    heading: (n: number) => `Responda ${n} perguntas sobre a porta`,
    body: "Cada resposta elimina os modelos que não podem ser instalados nesse vão. Todas as opções mostradas levam a algum lado: não é possível chegar a um resultado vazio.",
    stepsLabel: "perguntas",
    modelsLabel: "modelos entre os quais escolher",
    outValue: "Um número de modelo",
    outNote: "com entrada, distância entre eixos, acabamento e mão.",
    cta: "Abrir o configurador",
    reassure: "Sem conta, sem e-mail, nada é guardado.",
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
