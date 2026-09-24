import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CompanyOverview } from "@/components/site/CompanyOverview";

export const metadata: Metadata = pageMetadata({
  enPath: "/company",
  locale: "en",
  title: "Door Hardware Manufacturer in Xiaolan, China, Since 1998",
  description:
    "Door lock and architectural hardware made in Xiaolan since 1998. ISO 9001 certified since 2002, with OEM and private-label production for export.",
});

export default function CompanyPage() {
  return <CompanyOverview />;
}
