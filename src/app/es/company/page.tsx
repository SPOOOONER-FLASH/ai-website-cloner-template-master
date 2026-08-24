import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "es",
  title: "Empresa — Fabricante de herrajes",
  description:
    "Fabricación de cerraduras y herrajes arquitectónicos en Guangdong desde 1998.",
});

export default function EmpresaPage() {
  return <CompanyOverview locale="es" />;
}
