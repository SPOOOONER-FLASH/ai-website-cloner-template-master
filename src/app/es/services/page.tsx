import type { Metadata } from "next";
import { ServicesView } from "@/components/site/ServicesView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/services",
  locale: "es",
  // OEM / marca propia primero (甲方 2026-09-24：付款的是做自有品牌的买家).
  title: "Herrajes OEM y de marca propia, fábrica en China",
  description:
    "Herrajes para puertas OEM y de marca propia hechos en Xiaolan, China: moldes a su plano, rediseño ante patentes, su marca y su embalaje.",
});

/** El texto vive en ServicesView (un objeto por idioma). */
export default function ServiciosPage() {
  return <ServicesView locale="es" />;
}
