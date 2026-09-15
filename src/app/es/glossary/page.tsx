import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HardwareTerms } from "@/components/site/HardwareTerms";
import { HARDWARE_TERMS } from "@/data/hardware-terms";
import { modelsWithGlossaryTerm } from "@/lib/hardware-term-usage";
import { pageMetadata } from "@/lib/seo";

/** The Spanish mirror of /glossary. Path stays in English, as every /es route does. */

export const metadata: Metadata = pageMetadata({
  enPath: "/glossary",
  locale: "es",
  title: "Glosario de herrajes de puerta",
  description:
    "Backset, distancia entre ejes, mano, chasis, eje cuadradillo, recorrido del pestillo y taladro pasante — los términos de las fichas técnicas de Canton Hyland, definidos y con lo que cuesta equivocarse en cada uno.",
});

export default function GlossaryPageEs() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Inicio", href: "/es/" }, { label: "Glosario" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Referencia
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Las palabras de nuestras fichas técnicas, y lo que cuesta equivocarse en cada
              una.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Estos {HARDWARE_TERMS.length} términos no salen de un diccionario del sector. Son
              las etiquetas de especificación que más aparecen en nuestras propias fichas
              publicadas, contadas — así que todas son campos que encontrará en esta web, y la
              cifra que acompaña a cada entrada es cuántos modelos la declaran.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {modelsWithGlossaryTerm} modelos publicados declaran al menos uno. Cada entrada da
              primero la definición y después la consecuencia, porque la consecuencia es la
              mitad que le dice si este es el campo en el que está a punto de equivocarse.
            </p>
          </div>
        </section>

        <HardwareTerms locale="es" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            ¿Falta algún término?
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Envíenoslo. Si es una palabra que aparece en alguna de nuestras páginas y no está
              aquí, el problema es de esta página y no de la palabra, y preferimos arreglar la
              página. Las otras dos referencias contestan las preguntas que vienen después:
              cómo se construyen nuestros códigos de pedido y qué ha pasado con un número de
              modelo que ya no encuentra página.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/es/finishes/">Códigos de pedido y acabados</ArrowLink>
              <ArrowLink href="/es/model-lookup/">Buscador de números de modelo</ArrowLink>
              <ArrowLink href="/es/contact/">Consultarnos</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
