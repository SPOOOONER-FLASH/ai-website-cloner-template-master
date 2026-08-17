import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "en",
  title: "Company",
  description:
    "Door lock and architectural hardware manufacturing in Guangdong, China since 1998.",
});

export default function CompanyPage() {
  return <CompanyOverview />;
}
