"use client";

import dynamic from "next/dynamic";

/**
 * Browser-only wrapper for the promotional rail.
 *
 * PromoDialog sits in the root layout of all three locales, so imported statically its
 * code (plus the promo data and dismissal bookkeeping) was hydrated on every page of the
 * site — yet it renders nothing until its delay fires, and most sessions dismiss or ignore
 * it. `ssr: false` moves that cost to after the page is up: a closed promo rail has no
 * server HTML to lose, so nothing changes visually and nothing is lost to search.
 *
 * The wrapper exists because `ssr: false` is rejected inside a Server Component, and the
 * layouts are Server Components — the same reason ConfiguratorClient exists.
 */

const PromoDialog = dynamic(() =>
  import("./PromoDialog").then((module) => module.PromoDialog),
  { ssr: false },
);

export function LazyPromoDialog() {
  return <PromoDialog />;
}
