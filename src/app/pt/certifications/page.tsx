import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { certificates } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/certifications",
  locale: "pt",
  title: "Certificação e evidência de ensaio",
  description:
    "Relatórios de ensaio HYDE com âmbito por modelo: organismo emissor, referência do documento e o modelo exacto que cobrem. Relatórios Intertek e conformidade CE para barras antipânico.",
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
  ["Modelo exacto coberto", "coversModel"],
  ["Organismo emissor", "issuer"],
  ["Referência do documento", "reference"],
  ["Data de emissão", "issued"],
] as const;

export default function CertificacoesPagePt() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Início", href: "/pt/" }, { label: "Certificação" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Evidência de qualidade
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Certificados e relatórios de ensaio. O que foi ensaiado, e em nome de quem.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Os registros abaixo são publicados com o escopo de modelo exato que está impresso em cada documento, e o relatório de um modelo nunca é apresentado como aprovação de outro. Boa parte do que fabricamos para clientes de marca própria é certificada em nome desses clientes, a pedido e às custas deles, então cabe a eles compartilhar esses certificados. Estamos preparando os ensaios CE e ANSI em nome da Canton Hyland para as nossas linhas principais; cada relatório novo vai aparecer aqui, com o seu escopo, à medida que for emitido.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Os emissores restringem a cópia dos seus relatórios, por isso enviamos uma cópia completa sob pedido, para um modelo específico, em vez de publicar trechos.
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
                  Os dados são públicos. O relatório completo é enviado sob pedido, na íntegra, como exige o emissor.
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
            Confira o relatório antes de especificar a peça.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Envie a norma de que precisa, o número do modelo e o mercado de destino. Diremos se algum relatório cita esse modelo exato antes de enviá-lo e, se nenhum citar, também diremos.
            </p>
            <div className="mt-24">
              <ArrowLink href="/pt/contact/">Pedir documentação técnica</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
