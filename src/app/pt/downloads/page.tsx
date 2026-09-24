import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { certificates } from "@/data/company";
import { downloads, formatDownloadSize, getDownloadsByKind } from "@/data/downloads";
import type { DownloadKind } from "@/data/types";
import { ModelLibrary } from "@/components/site/ProductModel";

export const metadata: Metadata = pageMetadata({
  enPath: "/downloads",
  locale: "pt",
  title: "Serviço e downloads",
  description:
    "Baixe o catálogo Canton Hyland de 46 páginas — fechaduras, maçanetas, barras antipânico, ferragens para vidro e molas aéreas — além de relatórios de ensaio com escopo por modelo.",
});

/**
 * The Portuguese downloads page.
 *
 * ONE THING IS SAID PLAINLY HERE THAT THE ENGLISH PAGE DOES NOT HAVE TO SAY: the
 * catalogue PDF is in English. A Portuguese page offering a download without mentioning
 * that sets up a small disappointment at the moment of highest intent, and the buyer finds
 * out after the 4.4 MB has arrived. Saying it costs one line and loses nothing — importers
 * in this trade read English specification documents routinely.
 *
 * Certificate fields stay exactly as printed on the documents. See the note in the
 * Spanish certifications page.
 */

const visibleGroups: Array<{ kind: DownloadKind; title: string; note: string }> = [
  {
    kind: "catalogue",
    title: "Catálogo de produtos",
    note: "O catálogo vigente fornecido pela Canton Hyland. O documento está em inglês.",
  },
  /* Same grouping as the English page: a planning sheet is returned, not read. */
  {
    kind: "planning",
    title: "Planilhas de planejamento",
    note: "Preencha e devolva. Cada uma traz um exemplo preenchido — siga esse padrão em vez de inventar um formato. As planilhas estão em inglês.",
  },
];

export default function ServicoDownloadsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <section className="layout" aria-labelledby="downloads-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full mb-24">
            <Breadcrumbs
              items={[{ label: "Início", href: "/pt/" }, { label: "Serviço e downloads" }]}
            />
          </div>
          <div className="col-span-full xl:col-span-10">
            <p className="text-c1 text-ink-secondary">Biblioteca técnica</p>
            <h1 id="downloads-title" className="mt-8 text-h1 text-ink">
              Catálogo e downloads técnicos
            </h1>
          </div>
          <div className="col-span-full xl:col-span-10 xl:col-start-13">
            <p className="text-h3 text-ink">
              O que você pode baixar agora, e o que enviamos sob pedido.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Aqui há {downloads.length} arquivos para baixar agora. Fichas técnicas, guias de instalação e arquivos CAD ou BIM são enviados para um modelo específico de uma obra real, para que possamos conferi-los antes com a produção atual.
            </p>
          </div>
        </div>
      </section>

      <div className="layout mt-144 lg:mt-192">
        <div className="col-content space-y-144">
          <ModelLibrary locale="pt" />
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
                            {file.format} · {formatDownloadSize(file.sizeBytes)} · Baixar
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
                  O que foi ensaiado, e em nome de quem
                </h2>
                <p className="mt-16 text-c1 text-ink-secondary">
                  {certificates.length} registros, cada um com o único modelo que cobre. O relatório de um modelo não cobre outro. Peça uma cópia e enviamos o documento completo, como exige o emissor.
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
                        href={`/pt/contact/?${request.toString()}`}
                        className="group short-marker-surface grid gap-12 py-24 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-24"
                      >
                        <span>
                          <span className="short-marker short-marker-group inline-block text-c1 font-semibold text-ink">
                            {certificate.title}
                          </span>
                          <span className="mt-8 block text-c2 text-ink-secondary">
                            Modelo exato coberto: {certificate.coversModel}
                          </span>
                          <span className="mt-4 block text-c2 text-ink-secondary">
                            {certificate.issuer} · Referência {certificate.reference} ·{" "}
                            {certificate.issued}
                          </span>
                        </span>
                        <span className="text-c2 font-semibold uppercase text-ink">
                          Solicitar cópia verificada
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
                  Precisa de outro arquivo?
                </h2>
              </div>
              <div className="col-span-full xl:col-span-15 xl:col-start-10">
                <p className="max-w-[68rem] text-c1 text-ink">
                  Envie o modelo, a preparação da porta e o formato de que precisa. Diremos se existe ficha técnica, guia de instalação, desenho CAD ou objeto BIM para esse modelo e, se não existir, diremos isso com clareza.
                </p>
                <Link
                  href="/pt/contact/?subject=technical-document"
                  className="btn btn-primary mt-32"
                >
                  Solicitar documentação técnica
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
