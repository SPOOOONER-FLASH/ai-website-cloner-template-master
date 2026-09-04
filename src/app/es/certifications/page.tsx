import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { certificates } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/certifications",
  locale: "es",
  title: "Certificación y evidencia de ensayo",
  description:
    "Informes de ensayo HYDE con alcance por modelo: organismo emisor, referencia del documento y el modelo exacto que cubren. Informes Intertek y conformidad CE para barras antipánico.",
});

/**
 * The Spanish certification register.
 *
 * WHAT IS NOT TRANSLATED, AND WHY. The certificate fields — title, issuer, reference,
 * issue date, model scope — are transcribed from the documents themselves and stay
 * exactly as printed. A translated issuer name or a localised reference number would not
 * match the paper a buyer receives, and matching the paper is the entire purpose of this
 * page. Only the labels around them are Spanish.
 *
 * The standard designations (EN 1125, CE) are international and stay as they are; that is
 * how they appear in a Spanish specification too.
 */

const fields = [
  ["Modelo exacto cubierto", "coversModel"],
  ["Organismo emisor", "issuer"],
  ["Referencia del documento", "reference"],
  ["Fecha de emisión", "issued"],
] as const;

export default function CertificacionesPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Inicio", href: "/es/" }, { label: "Certificación" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Evidencia de calidad
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              La evidencia pertenece a un modelo, no a una afirmación comercial.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Estos tres registros son de Canton Hyland y se publican con el alcance exacto
              de modelo que figura impreso en el documento de respaldo. El informe de un
              modelo no se presenta como aprobación de otro producto ni de toda una familia
              del catálogo.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Las copias completas de los informes se facilitan a través del equipo de
              exportación únicamente cuando se ha confirmado el permiso de redistribución
              del documento y la correspondencia con el modelo solicitado.
            </p>
          </div>
        </section>

        <section
          className="col-content border-t border-line"
          aria-labelledby="certificate-register"
        >
          <h2 id="certificate-register" className="sr-only">
            Registro de certificados
          </h2>
          {certificates.map((certificate, index) => (
            <article
              key={certificate.reference}
              className="grid grid-cols gap-x gap-y-24 border-b border-line py-32 lg:py-48"
            >
              <div className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-3">
                <p className="text-kicker text-ink-secondary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-16 text-c2 font-semibold uppercase tracking-[0.08em] text-ink">
                  Registro verificado
                </p>
              </div>
              <div className="col-span-full sm:col-span-3 md:col-span-5 xl:col-span-10">
                <h2 className="text-h2 text-ink">{certificate.title}</h2>
                <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">
                  Los datos de registro son públicos; el documento completo se obtiene
                  mediante una solicitud controlada de documentación técnica.
                </p>
              </div>
              <dl className="col-span-full grid grid-cols-1 gap-16 md:col-span-5 md:col-start-8 xl:col-span-9 xl:col-start-16">
                {fields.map(([label, key]) => (
                  <div key={key} className="border-t border-line pt-12">
                    <dt className="text-c2 text-ink-secondary">{label}</dt>
                    <dd className="mt-4 text-c1 text-ink">{certificate[key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Compruebe el informe antes de especificar el herraje.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Indíquenos la norma exigida, el número de modelo y el mercado de destino. El
              equipo de exportación confirmará si el documento nombra ese modelo exacto
              antes de facilitar una copia.
            </p>
            <div className="mt-24">
              <ArrowLink href="/es/contact/">Solicitar documentación técnica</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
