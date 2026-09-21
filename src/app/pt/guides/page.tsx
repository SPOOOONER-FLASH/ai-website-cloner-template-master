import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { GuideListing } from "@/components/site/GuideListing";

/**
 * 指南栏目，2026-09-21 新开。见 src/data/guides.ts 的注释：
 * 现有 35 篇 /news/ 一篇都不搬，新写的 SEO/GEO 长文从这里开始。
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/guides",
  locale: "pt",
  title: "Guias",
  description: "Páginas de referência para decisões de ferragens: tabelas de cilindros europeus, referências cruzadas EN para ANSI/BHMA, tabelas de códigos de acabamento e o que cada norma cobre.",
});

export default function GuidesPage() {
  return <GuideListing locale="pt" />;
}
