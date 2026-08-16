import type { Metadata } from "next";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = {
  title: "Empresa | Canton Hyland",
  description: "Fabricación de cerraduras y herrajes arquitectónicos en Guangdong desde 1998.",
};

export default function EmpresaPage() {
  return <CompanyOverview locale="es" />;
}
