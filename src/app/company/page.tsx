import type { Metadata } from "next";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = {
  title: "Company | Canton Hyland",
  description: "Door lock and architectural hardware manufacturing in Guangdong, China since 1998.",
};

export default function CompanyPage() {
  return <CompanyOverview />;
}
