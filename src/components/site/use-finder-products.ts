"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/site";
import type { FinderProduct } from "@/lib/product-finder";

/**
 * The finder and configurator product list, fetched from /data/<locale>/finder.json
 * instead of riding in the page's HTML (see src/app/data/[locale]/finder.json/route.ts).
 * One request per locale per page view; the module-level cache lets the two tools share
 * it when a visitor moves from one to the other.
 */
const cache = new Map<Locale, Promise<FinderProduct[]>>();

function load(locale: Locale): Promise<FinderProduct[]> {
  let pending = cache.get(locale);
  if (!pending) {
    pending = fetch(`/data/${locale}/finder.json`).then((response) => {
      if (!response.ok) throw new Error(`finder data ${response.status}`);
      return response.json() as Promise<FinderProduct[]>;
    });
    /* A failed request must not poison the cache for the rest of the visit. */
    pending.catch(() => cache.delete(locale));
    cache.set(locale, pending);
  }
  return pending;
}

export type FinderProductsState =
  | { status: "loading" }
  | { status: "ready"; products: FinderProduct[] }
  | { status: "error" };

export function useFinderProducts(locale: Locale): FinderProductsState {
  const [state, setState] = useState<FinderProductsState>({ status: "loading" });
  useEffect(() => {
    let live = true;
    load(locale).then(
      (products) => live && setState({ status: "ready", products }),
      () => live && setState({ status: "error" }),
    );
    return () => {
      live = false;
    };
  }, [locale]);
  return state;
}
