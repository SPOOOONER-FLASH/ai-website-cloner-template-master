import type { Metadata } from "next";
import { ServicesView } from "@/components/site/ServicesView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/services",
  locale: "pt",
  // OEM / marca própria primeiro (甲方 2026-09-24：付款的是做自有品牌的买家).
  title: "Ferragens OEM e de marca própria, fábrica na China",
  description:
    "Ferragens para portas OEM e de marca própria feitas em Xiaolan, China: moldes do seu desenho, redesenho por patente, sua marca e embalagem.",
});

/** O texto fica em ServicesView (um objeto por idioma). */
export default function ServicosPage() {
  return <ServicesView locale="pt" />;
}
