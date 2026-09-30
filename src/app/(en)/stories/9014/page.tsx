import type { Metadata } from "next";
import { HandleStory } from "@/components/site/HandleStory";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/stories/9014",
    locale: "en",
    title: "9014 Stainless Steel Lever Handle",
    description:
      "The HYDE 9014 lever: a 19 mm stainless steel bar, 135 mm long, 60 mm projection, on a 53 × 9 mm rose. Satin US32D, for 35–50 mm doors.",
    image: "/images/stories/9014/one-take-poster.webp",
    imageAlt: "HYDE 9014 stainless steel lever handle",
  }),
  /*
    Draft. English only, outside every mirror prefix (src/lib/spanish-mirror.ts), so no
    hreflang points at a locale that does not have it; out of the sitemap; noindex with the
    reason stated, which is what scripts/lib/seo-audit.mjs accepts as deliberate.
    Remove both when the owner approves the page and the macro photographs replace the renders.
  */
  robots: { index: false, follow: true },
  other: { "canton-withheld": "draft-awaiting-owner-review" },
};

export default function Story9014Page() {
  return <HandleStory />;
}
