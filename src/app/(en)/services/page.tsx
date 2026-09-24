import type { Metadata } from "next";
import { ServicesView } from "@/components/site/ServicesView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/services",
  locale: "en",
  // OEM / private label leads (client steer 2026-09-24: the buyers who pay are private-label brands).
  title: "OEM & Private-Label Door Hardware Manufacturer in China",
  description:
    "OEM and private-label door hardware from Xiaolan, China: new tooling to your drawing, patent-conscious redesign, your brand and packaging.",
});

/** Copy lives in ServicesView (one object per language). */
export default function ServicesPage() {
  return <ServicesView locale="en" />;
}
