import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { NewsListing } from "@/components/site/NewsListing";

/** The Portuguese mirror of /news/. Same component, `locale="pt"`. */

export const metadata: Metadata = pageMetadata({
  enPath: "/news",
  locale: "pt",
  title: "Notícias e notas técnicas",
  description:
    "Comunicados, novidades de certificação e notas técnicas da Canton Hyland, fabricante de barras antipânico e ferragens arquitetónicas de porta.",
});

export default function NoticiasPage() {
  return <NewsListing locale="pt" />;
}
