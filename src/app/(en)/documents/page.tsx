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
  locale: "en",
  title: "Documents We Can Supply",
  description: "Dimensioned drawings, specification tables, the catalog and test documents — what is published today, what we send on request, and the two things we do not have.",
});

export default function DocumentsPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-64">
      <div className="layout space-y-48 lg:space-y-64">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Documents" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <h1 className="mt-16 text-h1 text-ink">Door hardware documents. What we can send you, and what we cannot.</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">People arrive here looking for a file rather than a product: a cutsheet for a lock, a DWG, a BIM object, a ficha técnica. This page is the honest inventory, in the order of how much of it exists.</p>
            <p className="mt-24 text-c2 text-ink-secondary">Saying which is which is more useful than a download page that promises everything. Where something does not exist, it says so on this page rather than in a reply three days later.</p>
          </div>
        </section>

        <DocumentInventory locale="en" />
      </div>
    </main>
  );
}
