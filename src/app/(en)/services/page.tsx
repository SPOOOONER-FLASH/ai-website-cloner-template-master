import type { Metadata } from "next";
import { ServicesView } from "@/components/site/ServicesView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  enPath: "/services",
  locale: "en",
  // OEM / private label leads (client steer 2026-09-24: the buyers who pay are private-label brands).
  // 2026-09-25: custom tooling is the specialty the client wants found (开模定制); "bespoke ironmongery" is
  // the Commonwealth project buyer's phrase for it. Private label stays in the description.
  title: "OEM & Custom Door Hardware, Bespoke Ironmongery from China",
  description:
    "OEM, private-label and custom door hardware from Xiaolan, China: new tooling to your drawing or sample, patent-conscious redesign, your brand.",
});

/** Copy lives in ServicesView (one object per language). */
export default function ServicesPage() {
  return <ServicesView locale="en" />;
}
