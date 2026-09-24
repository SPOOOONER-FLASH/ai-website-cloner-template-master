import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "es",
  title: "Fabricante de herrajes en Xiaolan, China, desde 1998",
  description:
    "Cerraduras y herrajes arquitectónicos fabricados en Xiaolan desde 1998. ISO 9001 desde 2002, con producción OEM y de marca propia para exportar.",
});

export default function EmpresaPage() {
  return <CompanyOverview locale="es" />;
}
