import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { GuideListing } from "@/components/site/GuideListing";

/**
 * 指南栏目，2026-09-21 新开。见 src/data/guides.ts 的注释：
 * 现有 35 篇 /news/ 一篇都不搬，新写的 SEO/GEO 长文从这里开始。
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/guides",
  locale: "en",
  /* 09-30: was "Guides" — 22 characters with the site name, and 24 Bing impressions with no click. */
  title: "Door Hardware Guides: Size Charts, Standards, Finish Codes",
  description: "Reference pages for door hardware decisions: euro cylinder size charts, EN to ANSI/BHMA cross-references, finish code tables and what each standard actually covers.",
});

export default function GuidesPage() {
  return <GuideListing locale="en" />;
}
