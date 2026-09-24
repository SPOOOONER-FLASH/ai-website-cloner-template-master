import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  OrderCodeFooter,
  OrderCodeTables,
  WorkedOrderCode,
} from "@/components/site/OrderCodeTables";
import { modelsWithReadableFinish, publishedModelCount } from "@/lib/finish-usage";
import { pageMetadata } from "@/lib/seo";

/**
 * The Spanish mirror of /finishes.
 *
 * The path stays in English, as every other route under /es does. Translating it would
 * break the hreflang pair and every link already sent to a customer — the same decision
 * recorded for the article slugs in src/lib/spanish-mirror.ts.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/finishes",
  locale: "es",
  title: "Códigos de pedido y acabados",
  description:
    "Cómo se lee un número de modelo de Canton Hyland: los códigos de acabado (SSS, PB, SN, GM), los de función (ET, BK, PS) y la letra de una o dos hojas, con los modelos en los que aparece cada uno.",
});

export default function AcabadosPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Inicio", href: "/es/" }, { label: "Códigos de pedido" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Referencia
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Códigos de acabado. Un número de modelo son tres datos, no un nombre.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Las letras que siguen al número son el acabado y la función, en ese orden. En
              cuanto se saben leer, una lista de precios de cuatrocientas líneas se convierte
              en unos pocos productos y dos tablas de sufijos — y se puede pedir una variante
              de la que nunca le hemos enviado una fotografía.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {modelsWithReadableFinish} de {publishedModelCount} modelos publicados llevan el
              acabado en el propio número. El resto lo indica en la ficha técnica.
            </p>
          </div>
          <div className="col-span-full xl:col-span-14">
            <WorkedOrderCode locale="es" />
          </div>
        </section>

        <OrderCodeTables locale="es" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Un código de acabado no es un número BHMA.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Las especificaciones norteamericanas se escriben en números ANSI/BHMA, y esos
              números codifican también el metal base: 626 es cromo satinado sobre latón y
              652 es el mismo color sobre acero. Sustituir uno por otro es un rechazo en
              obra. Por eso el código de acabado por sí solo no se puede convertir. Cada
              ficha de producto lleva el número BHMA cuando el material está declarado, y un
              guion cuando no lo está.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/es/news/reading-door-hardware-model-numbers/">
                Cómo se lee un número de modelo
              </ArrowLink>
              <ArrowLink href="/es/contact/">Consultar un código</ArrowLink>
            </div>
            <div className="mt-32">
              <OrderCodeFooter locale="es" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
