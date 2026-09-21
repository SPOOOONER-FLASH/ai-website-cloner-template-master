import Link from "next/link";
import type { Locale } from "@/data/site";
import { termsByGroup } from "@/lib/hardware-term-usage";

/**
 * The glossary body.
 *
 * ---------------------------------------------------------------------------
 * WHY EACH ENTRY IS TWO PARAGRAPHS AND NOT ONE
 *
 * The definition tells a reader what the word means. The second paragraph tells them why
 * it is on the page — what goes wrong when the number is wrong. That second half is the
 * part a general glossary never has, and it is the part that turns a word list into
 * evidence that we have fitted these things and seen them fail.
 *
 * It is also what an answer engine quotes. A definition is interchangeable with every
 * other site's definition of the same word; "a door already bored for 60mm will not take
 * a 70mm lock" is ours.
 *
 * ---------------------------------------------------------------------------
 * <dl> RATHER THAN HEADINGS
 *
 * A glossary is the one piece of content a definition list is literally for, and the
 * `dt`/`dd` pairing is what lets an extractor take the term with its definition instead
 * of guessing where one entry ends. The count and the article link live inside the `dd`
 * so they travel with it.
 */

const COPY = {
  en: {
    groups: {
      dimensions: "Dimensions",
      mechanism: "Mechanism",
      ordering: "Ordering and evidence",
    },
    models: (n: number) =>
      n === 1 ? "1 model states it" : `${n} models state it`,
    notPublished: "a term, not a spec row",
    read: "Read more",
  },
  es: {
    groups: {
      dimensions: "Cotas",
      mechanism: "Mecanismo",
      ordering: "Pedido y evidencia",
    },
    models: (n: number) =>
      n === 1 ? "1 modelo la indica" : `${n} modelos la indican`,
    notPublished: "un término, no una fila de ficha",
    read: "Leer más",
  },
  pt: {
    groups: {
      dimensions: "Cotas",
      mechanism: "Mecanismo",
      ordering: "Pedido e evidência",
    },
    models: (n: number) =>
      n === 1 ? "1 modelo a indica" : `${n} modelos a indicam`,
    notPublished: "um termo, não uma linha de ficha",
    read: "Ler mais",
  },
} as const;

export function HardwareTerms({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const prefix = locale === "en" ? "" : `/${locale}`;
  /*
    English is the fallback, never the other translation. A Portuguese entry that quietly
    borrowed the Spanish one would read as almost-right to a Brazilian specifier, which is
    worse on this page than reading as foreign: the whole argument here is that we are
    precise about words.
  */
  const pick = (en: string, es: string, pt: string) =>
    locale === "es" ? es : locale === "pt" ? pt : en;

  return (
    <>
      {termsByGroup.map(({ group, terms }) => (
        <section
          key={group}
          className="col-content"
          aria-labelledby={`group-${group}`}
        >
          <h2 id={`group-${group}`} className="text-h2 text-ink">
            {copy.groups[group]}
          </h2>
          <dl className="mt-24 border-t border-line">
            {terms.map(({ term, models }) => (
              <div
                key={term.id}
                id={term.id}
                className="grid grid-cols gap-x gap-y-12 border-b border-line py-32 lg:py-40"
              >
                <dt className="col-span-full lg:col-span-3 xl:col-span-6">
                  <span className="text-h3 text-ink">
                    {pick(term.term, term.termEs, term.termPt)}
                  </span>
                  <span className="mt-8 block text-c2 text-ink-secondary">
                    {models > 0 ? copy.models(models) : copy.notPublished}
                  </span>
                </dt>
                <dd className="col-span-full lg:col-span-7 lg:col-start-5 xl:col-span-14 xl:col-start-9">
                  <p className="max-w-[64ch] text-c1 text-ink">
                    {pick(
                      term.definition,
                      term.definitionEs,
                      term.definitionPt,
                    )}
                  </p>
                  <p className="mt-16 max-w-[64ch] text-c2 text-ink-secondary">
                    {pick(
                      term.consequence,
                      term.consequenceEs,
                      term.consequencePt,
                    )}
                  </p>
                  {term.article ? (
                    <p className="mt-16">
                      <Link
                        href={`${prefix}/news/${term.article}/`}
                        className="short-marker short-marker-compact text-c2 text-brand hover:text-brand-hover"
                      >
                        {copy.read}
                      </Link>
                    </p>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
