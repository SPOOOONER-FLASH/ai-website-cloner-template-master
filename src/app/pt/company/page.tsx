import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "pt",
  title: "Empresa — Fabricante de ferragens",
  description:
    "Fabricação de fechaduras e ferragens arquitetónicas em Guangdong desde 1998. ISO 9001 desde 2002, com produção OEM para mercados de exportação.",
});

export default function EmpresaPagePt() {
  return <CompanyOverview locale="pt" />;
}
