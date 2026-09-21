import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ModelLookup } from "@/components/site/ModelLookup";
import { ModelIndex } from "@/components/site/ModelIndex";
import { modelIndex } from "@/lib/model-index";
import { notShownModels, renamedRecords } from "@/lib/superseded-models";
import { pageMetadata } from "@/lib/seo";

/** The Spanish mirror of /model-lookup. Path stays in English, as every /es route does. */

export const metadata: Metadata = pageMetadata({
  enPath: "/model-lookup",
  locale: "pt",
  title: "Procurar um número de modelo",
  description:
    "O que aconteceu a um número de modelo da Canton Hyland que já não encontra página: fichas renomeadas com o seu redireccionamento permanente, rotas de catálogo retiradas e modelos do catálogo sem fotografia publicada.",
});

export default function ModelLookupPt() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Início", href: "/pt/" }, { label: "Procurar modelo" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Referência
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Um número de modelo antigo continua a significar alguma coisa.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Um orçamento dura mais do que o catálogo que o gerou. Se um número de uma
              lista antiga já não encontra página, aconteceu uma de três coisas com ele, e
              esta página diz qual: {renamedRecords.length} fichas foram renomeadas,{" "}
              {notShownModels.length} estão no catálogo sem fotografia publicada e uma
              ruta de categoría se retiró.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Ninguno de estos casos es un producto descatalogado. Cuando un modelo deje de
              de ser fabricado, diremos aqui, com essa palavra e com a data.
            </p>
          </div>
        </section>

        <ModelIndex locale="pt" entries={modelIndex("pt")} />

        <ModelLookup locale="pt" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Continua sem o encontrar?
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Envie o número exatamente como ele aparece no seu documento, com as letras
              do fim: essas letras carregam o acabamento e a função, e costumam ser a parte
              que identifica qual dos nossos modelos foi cotado. Se o número é de outro
              fornecedor,
              envíelo igualmente — hacemos referencias cruzadas con códigos de la competencia.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/pt/finishes/">Como se leem os nossos códigos</ArrowLink>
              <ArrowLink href="/pt/contact/">Consultar um número de modelo</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
