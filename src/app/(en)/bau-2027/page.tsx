import type { Metadata } from "next";
import { BauColumn } from "@/components/site/BauColumn";
import { bauCopy } from "@/data/bau-2027";
import { pageMetadata } from "@/lib/seo";

/** Hand-written, English and German only (PARTIAL_ROUTES in src/lib/spanish-mirror.ts). */
const copy = bauCopy("en");

export const metadata: Metadata = {
  ...pageMetadata({ enPath: "/bau-2027", locale: "en", title: copy.seoTitle, description: copy.seoDescription }),
  /* The SEO title already names the company; the layout's "| HYDE" suffix would repeat it. */
  title: { absolute: copy.seoTitle },
};

export default function Page() {
  return <BauColumn locale="en" />;
}
