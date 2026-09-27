import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CylinderCalculator } from "@/components/site/CylinderCalculator";
import { pageMetadata } from "@/lib/seo";

/** The Portuguese (Brazil) mirror of /euro-cylinder-calculator. Path stays in English. */

export const metadata: Metadata = pageMetadata({
  enPath: "/euro-cylinder-calculator",
  locale: "pt",
  title: "Calculadora de cilindro europeu: medir, arredondar e pedir",
  description:
    "Informe a espessura da porta e a profundidade do espelho de cada lado para obter os dois meios-comprimentos, o comprimento total do cilindro europeu a pedir e quanto ele vai sobressair.",
});

export default function EuroCylinderCalculatorPagePt() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Início", href: "/pt/" }, { label: "Calculadora de cilindro europeu" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Ferramenta</p>
            <h1 className="mt-16 text-h1 text-ink">
              Calculadora de comprimento de cilindro europeu. Duas metades, arredondadas para cima,
              primeiro o lado externo.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Cada metade é medida do centro do parafuso de fixação até a face externa do espelho ou
              da roseta daquele lado. Os meios-comprimentos avançam de 5 em 5 mm a partir de um
              mínimo de 27,5 mm, então o valor calculado é sempre arredondado para cima: uma metade
              um pouco longa se resolve com uma roseta; uma metade curta não tem conserto na porta.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Meça a porta com um paquímetro na borda da fechadura. Uma trena apoiada numa borda com
              rebaixo mede o rebaixo, e o erro sempre leva a um cilindro curto demais.
            </p>
          </div>
        </section>

        <CylinderCalculator locale="pt" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Três dados para a cotação
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Envie a espessura da porta, o espelho ou a roseta de cada lado e se o lado interno leva
              chave ou botão giratório. Com esses três dados, o comprimento e a divisão voltam como
              recomendação, e não como pergunta. Se os cilindros forem com chave igual ou
              mestrados, diga na mesma mensagem: são feitos sob encomenda.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/pt/guides/door-thickness-to-cylinder-length-2026/">
                O cálculo, com uma tabela resolvida
              </ArrowLink>
              <ArrowLink href="/pt/guides/euro-cylinder-size-chart-2026/">
                Tabela de medidas de cilindro europeu
              </ArrowLink>
              <ArrowLink href="/pt/products/lock-cylinders/">Nossos cilindros</ArrowLink>
              <ArrowLink href="/pt/contact/">Enviar as três medidas</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
