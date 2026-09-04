import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { representatives } from "@/data/representatives";
import { siteSettings } from "@/data/navigation";
import { EmailLink } from "@/components/site/EmailLink";

export const metadata: Metadata = pageMetadata({
  enPath: "/contact",
  locale: "es",
  title: "Contacto — Equipo de exportación",
  description:
    "Consulte a nuestro equipo de exportación sobre producto, muestras, OEM o proyectos. Indique tipo de puerta, acabado, norma y cantidad.",
});

export default function ContactoPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h1 className="text-h1 text-ink">Contacto</h1>
            <p className="mt-24 text-c1 text-ink">
              Hable con nuestro equipo de exportación sobre selección de producto, muestras,
              trabajo OEM o una cotización de proyecto.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Indique el tipo de puerta, acabado, norma aplicable, cantidad y mercado de destino.
            </p>
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Catálogo actual</h2>
              <a
                className="short-marker short-marker-compact mt-16 text-c1 text-brand hover:text-brand-hover"
                href="/downloads/canton-hyland-product-catalogue-2026.pdf"
                download
              >
                Descargar catálogo (PDF, 4,4 MB)
              </a>
            </div>

            {/*
              THE ADDRESSES WERE MISSING FROM THIS PAGE ENTIRELY.

              The English contact page has carried them since the office/factory split;
              the Spanish one never did, so a Spanish-speaking buyer asking where the
              company actually is got a form and nothing else. That is the harder question
              for an importer than anything on the form.

              Street names stay in their original form on purpose — they are what a
              freight forwarder types into a manifest, and a translated street does not
              exist. Only the labels are Spanish.
            */}
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Dirección</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                Fabricación, y donde se reciben las visitas de inspección.
              </p>

              {/* La oficina de Lehe Road no se publica — ver la nota en la página inglesa. */}
              {siteSettings.contact.factoryAddress ? (
                <div className="mt-24">
                  <p className="text-c2 text-ink-secondary">Fábrica</p>
                  <address className="mt-4 not-italic text-c1 text-ink">
                    {siteSettings.contact.factoryAddress}
                    <br />
                    Zhongshan, Guangdong, China
                  </address>
                </div>
              ) : null}
            </div>

            {/* Los buzones, separados por asunto — ver la nota en la página inglesa. */}
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Escríbanos directamente</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                Atendidos desde Zhongshan y Alemania. Elija el que corresponda a su
                consulta y llegará al escritorio correcto a la primera.
              </p>
              <dl className="mt-24">
                {[
                  {
                    email: siteSettings.contact.email,
                    label: "Pedidos, precios y muestras",
                  },
                  {
                    email: siteSettings.contact.technicalEmail,
                    label: "Planos, especificación e informes de ensayo",
                  },
                  {
                    email: siteSettings.contact.brandEmail,
                    label: "OEM, marca propia y todo lo demás",
                  },
                ]
                  /*
                    A type predicate, not a bare truthiness filter. The rows are built
                    from optional settings fields, and the compiler cannot see that this
                    line removes the undefined ones — it used to not matter because a
                    template literal swallows undefined, and it started mattering the
                    moment the address became a typed prop. Saying what the filter
                    guarantees is better than asserting it away at the call site.
                  */
                  .filter((row): row is { label: string; email: string } => Boolean(row.email))
                  .map((row) => (
                    <div
                      key={row.email}
                      className="flex flex-wrap items-baseline justify-between gap-x-24 gap-y-4 border-b border-line py-12"
                    >
                      <dt className="text-c2 text-ink-secondary">{row.label}</dt>
                      <dd>
                        <EmailLink address={row.email} className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover" />
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Contactos de representación</h2>
              <p className="mt-8 text-c2 text-ink-secondary">
                La fabricación está en Zhongshan. Estas son las personas de contacto en
                cada mercado.
              </p>
              <ul className="mt-24 space-y-24">
                {representatives.map((rep) => (
                  <li key={`${rep.region}-${rep.city}`}>
                    <p className="text-c2 uppercase tracking-wide text-ink-tertiary">
                      {rep.regionEs}
                    </p>
                    <p className="mt-4 text-c1 text-ink">{rep.city}</p>
                    <address className="mt-4 not-italic text-c1 text-ink-secondary">
                      {rep.address}
                    </address>
                    {rep.phone ? (
                      <a
                        href={`tel:${rep.phone.replace(/\s/g, "")}`}
                        className="short-marker short-marker-compact mt-8 inline-block text-c1 text-brand hover:text-brand-hover"
                      >
                        {rep.phone}
                      </a>
                    ) : null}
                    <EmailLink address={rep.email} className="short-marker short-marker-compact mt-4 block text-c1 text-brand hover:text-brand-hover" />
                    {rep.noteEs ? (
                      <p className="mt-8 max-w-[46ch] text-c2 text-ink-secondary">
                        {rep.noteEs}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
            <Suspense fallback={<p className="text-c1 text-ink-secondary">Preparando formulario…</p>}>
              <InquiryForm locale="es" />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
