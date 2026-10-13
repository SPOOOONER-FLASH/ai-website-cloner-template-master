import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "pt",
  title: "Fabricante de ferragens em Xiaolan, China, desde 1998",
  description:
    "Fechaduras e ferragens arquitetônicas feitas em Xiaolan desde 1998. Unidade de estampagem ISO 9001:2015, com produção OEM e de marca própria para exportação.",
});

export default function EmpresaPagePt() {
  return <CompanyOverview locale="pt" />;
}
