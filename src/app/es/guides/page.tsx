import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { GuideListing } from "@/components/site/GuideListing";

/**
 * 指南栏目，2026-09-21 新开。见 src/data/guides.ts 的注释：
 * 现有 35 篇 /news/ 一篇都不搬，新写的 SEO/GEO 长文从这里开始。
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/guides",
  locale: "es",
  title: "Guías",
  description: "Páginas de referencia para decisiones de herrajes: tablas de cilindros europeos, referencias cruzadas EN a ANSI/BHMA, tablas de códigos de acabado y qué cubre cada norma.",
});

export default function GuidesPage() {
  return <GuideListing locale="es" />;
}
