import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "en",
  title: "Company — Door Hardware Manufacturer",
  description:
    "Door lock and architectural hardware manufacturing in Guangdong, China since 1998. ISO 9001 certified since 2002, with OEM production for export markets.",
});

export default function CompanyPage() {
  return <CompanyOverview />;
}
