import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getAnsweredFaq } from "@/data/faq";
import { ArrowLink } from "@/components/site/ArrowLink";
import { FaqJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = pageMetadata({
  enPath: "/faq",
  locale: "es",
  title: "Preguntas frecuentes",
  description:
    "Pedido mínimo, muestras, plazos, acabados, sistemas de llave maestra, certificación y exportación — las respuestas del equipo de Canton Hyland.",
});

/**
 * The Spanish FAQ.
 *
 * Of everything that was still English-only, this is the page a buyer needs before they
 * can do business at all: minimum order, lead time, samples, payment terms, OEM. Those
 * five answers took a fortnight to get out of the client; leaving them in one language
 * wasted that.
 *
 * The Spanish text lives in content/faq.json beside the English, written by
 * scripts/add-faq-es.mjs — see the note there on why the incoterms stay in their
 * international form and why the numbers are carried rather than translated.
 *
 * A question with no Spanish yet falls back to English rather than vanishing, so the page
 * cannot silently shorten as new questions are added.
 */
export default function PreguntasFrecuentesPage() {
  const groups = getAnsweredFaq("es");

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <FaqJsonLd locale="es" />

      <section className="layout" aria-labelledby="faq-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink-secondary">Servicio</p>
            <h1 id="faq-title" className="mt-8 text-h1 text-ink">
              Preguntas frecuentes
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-14">
            <p className="text-c1 text-ink">
              Si la respuesta que necesita no está aquí, pregúntenos directamente —
              preferimos contestar a que usted tenga que suponerlo.
            </p>
            <div className="mt-16 flex flex-wrap gap-x-32 gap-y-16">
              <ArrowLink href="/es/contact/">Hacer una consulta</ArrowLink>
              <ArrowLink href="/es/products/">Ver el catálogo</ArrowLink>
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
                  <dt className="text-c1 font-bold text-ink">{item.question}</dt>
                  <dd className="mt-8 text-c1 text-ink-secondary">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </main>
  );
}
