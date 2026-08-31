"use client";

import dynamic from "next/dynamic";
import type { FinderProduct } from "@/lib/product-finder";

/**
 * Browser-only wrapper for the finder.
 *
 * The filter UI reads the address bar and owns interactive state; it has no server
 * rendering to do, and it is not content Google needs — every product already has its
 * own indexable page. Loading it with `ssr: false` removes a whole class of hydration
 * problems rather than working around them: under `output: "export"`, `useSearchParams`
 * inside a Suspense boundary never resolved and the fallback stayed on screen forever.
 */
const ProductFinder = dynamic(
  () => import("./ProductFinder").then((m) => m.ProductFinder),
  {
    ssr: false,
    loading: () => (
      <p className="col-content text-c1 text-ink-secondary">Loading filters…</p>
    ),
  },
);

export function ProductFinderClient(props: {
  products: FinderProduct[];
  categoryNames: Record<string, string>;
}) {
  return <ProductFinder {...props} />;
}
