import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getAnsweredFaq } from "@/data/faq";
import { ArrowLink } from "@/components/site/ArrowLink";
import { FaqJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = pageMetadata({
  enPath: "/faq",
  locale: "pt",
  title: "Perguntas frequentes",
  description:
    "Quantidade mínima, amostras, prazos, acabamentos, sistemas de chave-mestra, certificação e exportação — as respostas da equipe de exportação da Canton Hyland.",
});

/**
 * The Portuguese FAQ.
 *
 * Of everything that was still English-only, this is the page a buyer needs before they
 * can do business at all: minimum order, lead time, samples, payment terms, OEM. Those
 * five answers took a fortnight to get out of the client; leaving them in one language
 * wasted that.
 *
 * The Portuguese text lives in content/faq.json beside the English, written by
 * scripts/add-faq-pt.mjs — see the note there on why the incoterms stay in their
 * international form, why the numbers are carried rather than translated, and why this
 * tree is Brazilian rather than European Portuguese.
 *
 * A question with no Portuguese yet falls back to ENGLISH, never to Spanish, so a page
 * that is not finished looks unfinished.
 */
export default function PreguntasFrecuentesPagePt() {
  const groups = getAnsweredFaq("pt");

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <FaqJsonLd locale="pt" />

      <section className="layout" aria-labelledby="faq-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink-secondary">Serviço</p>
            <h1 id="faq-title" className="mt-8 text-h1 text-ink">
              Perguntas frequentes
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-c1 text-ink">
              Se a resposta de que precisa não está aqui, pergunte diretamente —
              preferimos responder a deixar você supondo.
            </p>
            <div className="mt-16 flex flex-wrap gap-x-32 gap-y-16">
              <ArrowLink href="/pt/contact/">Fazer uma consulta</ArrowLink>
              <ArrowLink href="/pt/products/">Ver o catálogo</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section
          key={group.title}
          className="layout mt-96 lg:mt-136"
          aria-labelledby={`faq-${group.title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full xl:col-span-8">
              <h2
                id={`faq-${group.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-h3 text-ink"
              >
                {group.title}
              </h2>
            </div>

            <dl className="col-span-full border-t border-line xl:col-span-14 xl:col-start-11">
              {group.items.map((item) => (
                <div key={item.question} className="border-b border-line py-24">
                  <dt className="text-c1 font-bold text-ink">
                    {item.question}
                  </dt>
                  <dd className="mt-8 text-c1 text-ink-secondary">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </main>
  );
}
