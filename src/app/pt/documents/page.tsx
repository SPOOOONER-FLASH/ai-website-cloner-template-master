import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { DocumentInventory } from "@/components/site/DocumentInventory";
import { pageMetadata } from "@/lib/seo";

/**
 * 「我们能给你什么文件」——- 见 src/lib/document-inventory.ts 的长注释。
 *
 * 内容来自 /news/what-documents-you-can-actually-get/，一个字没有新编。
 * 变的是位置：一篇文章回答一个问题，一个站点区块回答「你是谁、能给我什么」。
 * 2026-09-21 的 Clarity 里 Documentation 那一题我们是 0%，而同类的中国工厂
 * snrida.com 靠的正是把交付物逐项命名成一个区块。
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/documents",
  locale: "pt",
  title: "Documentos que podemos fornecer",
  description: "Desenhos cotados, tabelas de especificação, o catálogo e relatórios de ensaio: o que está publicado hoje, o que enviamos mediante pedido e as duas coisas que não temos.",
});

export default function DocumentsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-64">
      <div className="layout space-y-48 lg:space-y-64">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Início", href: "/pt/" }, { label: "Documentos" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <h1 className="mt-16 text-h1 text-ink">Documentos técnicos de ferragens. O que podemos enviar, e o que não podemos.</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">Chega aqui quem procura um arquivo mais do que um produto: uma ficha de uma fechadura, um DWG, um objeto BIM, uma ficha técnica. Esta página é o inventário honesto, na ordem de quanto existe de cada coisa.</p>
            <p className="mt-24 text-c2 text-ink-secondary">Dizer o que é o quê é mais útil do que uma página de downloads que promete tudo. Quando algo não existe, quem diz é esta página e não uma resposta três dias depois.</p>
          </div>
        </section>

        <DocumentInventory locale="pt" />
      </div>
    </main>
  );
}
