import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { NewsListing } from "@/components/site/NewsListing";

/** The Spanish mirror of /news/. Same component, `locale="es"`. */

export const metadata: Metadata = pageMetadata({
  enPath: "/news",
  locale: "es",
  title: "Noticias y notas técnicas",
  description:
    "Comunicados, novedades de certificación y notas técnicas de Canton Hyland, fabricante de dispositivos antipánico y herrajes arquitectónicos de puerta.",
});

export default function NoticiasPage() {
  return <NewsListing locale="es" />;
}
