import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CylinderCalculator } from "@/components/site/CylinderCalculator";
import { pageMetadata } from "@/lib/seo";

/** The Spanish mirror of /euro-cylinder-calculator. Path stays in English, as every /es route does. */

export const metadata: Metadata = pageMetadata({
  enPath: "/euro-cylinder-calculator",
  locale: "es",
  title: "Calculadora de longitud de cilindro europeo",
  description:
    "Introduzca el espesor de la puerta y la profundidad del escudo de cada lado para obtener las dos semilongitudes, la longitud total del cilindro europeo que debe pedir y cuánto sobresaldrá.",
});

export default function EuroCylinderCalculatorPageEs() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Inicio", href: "/es/" }, { label: "Calculadora de cilindro europeo" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Herramienta</p>
            <h1 className="mt-16 text-h1 text-ink">
              Calculadora de longitud de cilindro europeo. Dos mitades, redondeadas hacia arriba,
              primero el exterior.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Cada mitad se mide desde el centro del tornillo de fijación hasta la cara exterior del
              escudo o la roseta de su lado. Las semilongitudes van de 5 en 5 mm desde un mínimo de
              27,5 mm, así que la cifra calculada siempre se redondea hacia arriba: una mitad algo
              larga se cubre con una roseta; una mitad corta no tiene arreglo en la puerta.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Mida la puerta con un calibre en el canto de la cerradura. Una cinta enganchada en un
              canto con rebaje mide el rebaje, y el error siempre lleva a un cilindro demasiado corto.
            </p>
          </div>
        </section>

        <CylinderCalculator locale="es" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Tres datos para la consulta
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Envíenos el espesor de la puerta, el escudo o la roseta que monta en cada lado y si el
              interior lleva llave o pomo de giro. Con esos tres datos, la longitud y la división
              vuelven como recomendación y no como pregunta. Si los cilindros van amaestrados o con
              la misma llave, dígalo en el mismo mensaje: se fabrican bajo pedido.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/es/guides/door-thickness-to-cylinder-length-2026/">
                El cálculo, con una tabla resuelta
              </ArrowLink>
              <ArrowLink href="/es/guides/euro-cylinder-size-chart-2026/">
                Tabla de medidas de cilindro europeo
              </ArrowLink>
              <ArrowLink href="/es/products/lock-cylinders/">Nuestros cilindros</ArrowLink>
              <ArrowLink href="/es/contact/">Enviar las tres medidas</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
