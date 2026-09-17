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
  locale: "pt",
  title: "Códigos de pedido e acabamentos",
  description:
    "Como se lê um número de modelo da Canton Hyland: os códigos de acabamento (SSS, PB, SN, GM), os de função (ET, BK, PS) e a letra de uma ou duas folhas, com os modelos em que cada um aparece.",
});

export default function AcabadosPagePt() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Início", href: "/pt/" }, { label: "Códigos de pedido" }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Referência
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Um número de modelo são três dados, não um nome.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              As letras depois do número são o acabamento e a função, nessa ordem. Quando
              se sabe lê-las, uma lista de quatrocentas linhas vira meia dúzia de produtos e
              duas tabelas de sufixos — e dá para pedir uma variante da qual nunca lhe
              enviamos uma fotografia.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {modelsWithReadableFinish} de {publishedModelCount} modelos publicados trazem
              o acabamento no próprio número. O resto o indica na ficha técnica.
            </p>
          </div>
          <div className="col-span-full xl:col-span-14">
            <WorkedOrderCode locale="pt" />
          </div>
        </section>

        <OrderCodeTables locale="pt" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Um código de acabamento não é um número BHMA.
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              As especificações norte-americanas são escritas em números ANSI/BHMA, e esses
              números codificam também o metal base: 626 é cromo acetinado sobre latão e 652
              é a mesma cor sobre aço. Trocar um pelo outro é uma aprovação recusada em
              obra. É por isso que o código de acabamento sozinho não pode ser convertido.
              Cada ficha de produto traz o número BHMA quando o material está declarado, e um
              travessão quando não está.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/pt/news/reading-door-hardware-model-numbers/">
                Como se lê um número de modelo
              </ArrowLink>
              <ArrowLink href="/pt/contact/">Consultar um código</ArrowLink>
            </div>
            <div className="mt-32">
              <OrderCodeFooter locale="pt" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
