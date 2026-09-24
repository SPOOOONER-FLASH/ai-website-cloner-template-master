import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HardwareTerms } from "@/components/site/HardwareTerms";
import { HARDWARE_TERMS } from "@/data/hardware-terms";
import { modelsWithGlossaryTerm } from "@/lib/hardware-term-usage";
import { pageMetadata } from "@/lib/seo";

/** The Portuguese mirror of /glossary. Path stays in English, as every /pt route does. */

export const metadata: Metadata = pageMetadata({
  enPath: "/glossary",
  locale: "pt",
  title: "Glossário de ferragens de porta",
  description:
    "Backset, distância entre eixos, mão da porta, chassi, eixo quadrado, curso da trava e furo passante — os termos das nossas fichas técnicas, definidos e com o que custa errar em cada um.",
});

export default function GlossaryPt() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Início", href: "/pt/" }, { label: "Glossário" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Referência
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Glossário de ferragens. As palavras das nossas fichas técnicas, e o que custa errar em cada uma.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Estes {HARDWARE_TERMS.length} termos não saíram de um dicionário do setor. São os
              rótulos de especificação que mais aparecem nas nossas próprias fichas
              publicadas, contados — ou seja, todos são campos que você vai encontrar neste
              site, e o número ao lado de cada entrada é quantos modelos o declaram.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {modelsWithGlossaryTerm} modelos publicados declaram pelo menos um. Cada entrada
              traz primeiro a definição e depois a consequência, porque a consequência é a
              metade que diz se este é o campo em que você está prestes a errar.
            </p>
          </div>
        </section>

        <HardwareTerms locale="pt" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Falta algum termo?
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Mande para nós. Se é uma palavra que aparece em alguma das nossas páginas e não
              está aqui, o problema é desta página e não da palavra, e preferimos consertar a
              página. As outras duas referências respondem às perguntas que vêm depois: como
              os nossos códigos de pedido são montados e o que aconteceu com um número de
              modelo que já não encontra página.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/pt/finishes/">Códigos de pedido e acabamentos</ArrowLink>
              <ArrowLink href="/pt/model-lookup/">Procurar um número de modelo</ArrowLink>
              <ArrowLink href="/pt/contact/">Fale conosco</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
