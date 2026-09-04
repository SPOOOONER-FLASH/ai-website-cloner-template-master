import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { certificates } from "@/data/company";
import { downloads, formatDownloadSize, getDownloadsByKind } from "@/data/downloads";
import type { DownloadKind } from "@/data/types";

export const metadata: Metadata = pageMetadata({
  enPath: "/downloads",
  locale: "es",
  title: "Servicio y descargas",
  description:
    "Descargue el catálogo Canton Hyland de 46 páginas — cerraduras, manijas, barras antipánico, herrajes para vidrio y cierrapuertas — además de informes de ensayo con alcance por modelo.",
});

/**
 * The Spanish downloads page.
 *
 * ONE THING IS SAID PLAINLY HERE THAT THE ENGLISH PAGE DOES NOT HAVE TO SAY: the
 * catalogue PDF is in English. A Spanish page offering a download without mentioning that
 * sets up a small disappointment at the moment of highest intent, and the buyer finds out
 * after the 4.4 MB has arrived. Saying it costs one line and loses nothing — importers in
 * this trade read English specification documents routinely.
 *
 * Certificate fields stay exactly as printed on the documents. See the note in the
 * Spanish certifications page.
 */

const visibleGroups: Array<{ kind: DownloadKind; title: string; note: string }> = [
  {
    kind: "catalogue",
    title: "Catálogo de producto",
    note: "El catálogo vigente facilitado por Canton Hyland. El documento está en inglés.",
  },
];

export default function ServicioDescargasPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="downloads-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs
              items={[{ label: "Inicio", href: "/es/" }, { label: "Servicio y descargas" }]}
            />
          </div>
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Biblioteca técnica</p>
            <h1 id="downloads-title" className="mt-8 text-h1 text-ink">
              Servicio y descargas
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-13">
            <p className="text-h3 text-ink">
              Catálogos y documentos de respaldo para la revisión de proyecto.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Hay {downloads.length} archivo(s) disponible(s) para descarga directa. Las
              fichas técnicas, guías de instalación y archivos CAD y BIM se emiten contra
              un pliego de proyecto confirmado.
            </p>
          </div>
        </div>
      </section>

      <div className="layout mt-144 lg:mt-192">
        <div className="col-content space-y-144">
          {visibleGroups.map((group) => {
            const files = getDownloadsByKind(group.kind);
            return (
              <section key={group.kind} aria-labelledby={`${group.kind}-title`}>
                <div className="grid grid-cols gap-x gap-y-24">
                  <div className="col-span-full xl:col-span-7">
                    <h2 id={`${group.kind}-title`} className="text-h3 text-ink">
                      {group.title}
                    </h2>
                    <p className="mt-16 text-c1 text-ink-secondary">{group.note}</p>
                  </div>
                  <ul className="col-span-full divide-y divide-line border-t border-line xl:col-span-15 xl:col-start-10">
                    {files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={file.url}
                          download
                          className="group short-marker-surface grid gap-12 py-24 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-24"
                        >
                          <span>
                            <span className="short-marker short-marker-group inline-block text-c1 font-semibold text-ink">
                              {file.title}
                            </span>
                            {file.relatedModels.length ? (
                              <span className="mt-8 block text-c2 text-ink-secondary">
                                Modelo documentado: {file.relatedModels.join(", ")}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-c2 uppercase text-ink-secondary">
                            {file.format} · {formatDownloadSize(file.sizeBytes)} · Descargar
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}

          <section aria-labelledby="certificate-title">
            <div className="grid grid-cols gap-x gap-y-24">
              <div className="col-span-full xl:col-span-7">
                <h2 id="certificate-title" className="text-h3 text-ink">
                  Informes de ensayo y certificados
                </h2>
                <p className="mt-16 text-c1 text-ink-secondary">
                  Hay tres registros HYDE disponibles para verificación. Cada uno conserva
                  su alcance exacto de modelo; no certifica otros productos del catálogo.
                </p>
              </div>
              <ul className="col-span-full divide-y divide-line border-t border-line xl:col-span-15 xl:col-start-10">
                {certificates.map((certificate) => {
                  const request = new URLSearchParams({
                    subject: "certificate-request",
                    reference: certificate.reference,
                    model: certificate.coversModel,
                  });

                  return (
                    <li key={`${certificate.reference}-${certificate.coversModel}`}>
                      <Link
                        href={`/es/contact/?${request.toString()}`}
                        className="group short-marker-surface grid gap-12 py-24 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-24"
                      >
                        <span>
                          <span className="short-marker short-marker-group inline-block text-c1 font-semibold text-ink">
                            {certificate.title}
                          </span>
                          <span className="mt-8 block text-c2 text-ink-secondary">
                            Modelo exacto cubierto: {certificate.coversModel}
                          </span>
                          <span className="mt-4 block text-c2 text-ink-secondary">
                            {certificate.issuer} · Referencia {certificate.reference} ·{" "}
                            {certificate.issued}
                          </span>
                        </span>
                        <span className="text-c2 font-semibold uppercase text-ink">
                          Solicitar copia verificada
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="border-t border-line pt-48" aria-labelledby="request-files-title">
            <div className="grid grid-cols gap-x gap-y-24">
              <div className="col-span-full xl:col-span-7">
                <h2 id="request-files-title" className="text-h3 text-ink">
                  ¿Necesita otro archivo?
                </h2>
              </div>
              <div className="col-span-full xl:col-span-15 xl:col-start-10">
                <p className="max-w-[68rem] text-c1 text-ink">
                  Envíe el modelo, la preparación de puerta y el formato que necesita.
                  Nuestro equipo confirmará si existe ficha técnica, guía de instalación,
                  plano CAD u objeto BIM.
                </p>
                <Link
                  href="/es/contact/?subject=technical-document"
                  className="btn btn-primary mt-32"
                >
                  Solicitar documentación técnica
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
