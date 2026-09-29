import type { Metadata } from "next";
import { ConfiguratorStudio, type StudioData } from "@/components/site/ConfiguratorStudio";
import { findCategoryByPath } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { finishCode, functionCode } from "@/lib/order-code";
import { variantFamilies } from "@/lib/product-variants";
import { pageMetadata } from "@/lib/seo";

/**
 * The configurator studio — FSB's product-finder layout, applied to what we actually have.
 *
 * FSB configures one handle on a large stage: the part in the middle, the choices in a
 * column beside it, the article number assembling at the top as each choice lands. The
 * client asked for that page (2026-09-29): 「切换有动画效果专属的一页，主要是动画效果和设计
 * layout ui ux」.
 *
 * FSB renders every combination from CAD. We have no CAD and never draw an imagined metal
 * part, so the stage here only ever shows a photograph of the exact SKU selected: each
 * finish and function is a real record (src/lib/product-variants.ts), and switching one
 * cross-fades to that record's own photograph. The families are those whose order codes
 * parse cleanly; the rest of the catalogue stays in the guided configurator and the finder.
 *
 * NOINDEX while the client reviews it, English-only (PARTIAL_ROUTES in spanish-mirror.ts)
 * and not in the navigation. When approved: drop `robots` and `canton-withheld`, add it to
 * site-sitemap, scaffold the locales and remove the PARTIAL_ROUTES entry.
 */

export const metadata: Metadata = {
  ...pageMetadata({
    enPath: "/configurator/studio",
    locale: "en",
    title: "Configurator Studio — Finish and Function",
    description:
      "Choose a lock or handle range, then switch finish and function and watch the order code assemble. Every image is a photograph of the exact model.",
  }),
  robots: { index: false, follow: true },
  // Declares the noindex deliberate (see scripts/lib/seo-audit.mjs, WITHHELD PAGES), so an
  // accidental noindex elsewhere still fails the gate.
  other: { "canton-withheld": "awaiting-client-review" },
};

export default function ConfiguratorStudioPage() {
  const families = variantFamilies(publishedProducts);

  const codes = new Set<string>();
  const fns = new Set<string>();
  for (const family of families) {
    for (const member of family.members) {
      member.finish.split("+").filter(Boolean).forEach((code) => codes.add(code));
      if (member.fn) fns.add(member.fn);
    }
  }

  const data: StudioData = {
    ranges: [...new Set(families.map((f) => f.categoryPath[0]))].map((slug) => ({
      slug,
      name: findCategoryByPath([slug])?.name ?? slug,
    })),
    families: families.map((f) => ({
      ...f,
      subName: f.categoryPath.length > 1 ? findCategoryByPath(f.categoryPath)?.name ?? null : null,
    })),
    finishNames: Object.fromEntries([...codes].map((c) => [c, finishCode(c)?.name ?? c])),
    functionNames: Object.fromEntries([...fns].map((c) => [c, functionCode(c)?.name ?? c])),
  };

  return (
    <main className="isolate flex-grow">
      <h1 className="sr-only">Configurator studio</h1>
      <ConfiguratorStudio data={data} />
    </main>
  );
}
