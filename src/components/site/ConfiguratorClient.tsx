"use client";

import dynamic from "next/dynamic";
import type { FinderProduct } from "@/lib/product-finder";

/**
 * Browser-only wrapper for the configurator.
 *
 * ---------------------------------------------------------------------------
 * THE BUG THIS FIXES, AND WHY IT WAS INVISIBLE
 *
 * Until 2026-09-04 both `/configurator/` and `/es/configurator/` shipped a page whose
 * entire main content was, in production, 293 characters:
 *
 *   "Find the right model … Every option shown leads somewhere — you cannot reach an
 *    empty result. Already know what you need? Filter the catalogue directly. Loading
 *    the catalogue…"
 *
 * The tool never appeared. The page was rendered inside a plain `<Suspense>`, and under
 * `output: "export"` a `useSearchParams()` call inside a Suspense boundary has nothing to
 * resolve against — there is no server to stream the boundary from, so the fallback is
 * the final state and stays on screen forever.
 *
 * It went unnoticed because every automated check passed. The build succeeded, the route
 * existed, the link worked, the dead-link audit found the page, and the page had a
 * heading and a paragraph — so nothing that looks for a MISSING page could see a page
 * that was present and empty. The GEO audit did measure it: `/configurator/` scored 35
 * with 0.0 quotable figures, the worst on the site. That number was read as thin copy on
 * a new page. It was actually a page whose content had never rendered once.
 *
 * The lesson is the one from the Enter key in the search dialog: "does it build" and "is
 * it dead to use" are different questions, and only one of them was being asked.
 *
 * ---------------------------------------------------------------------------
 * THE FIX
 *
 * The same one ProductFinderClient already used, applied to the component that needed it
 * just as much. `ssr: false` removes the boundary rather than working around it: the
 * component is fetched and mounted in the browser, where `useSearchParams` has an address
 * bar to read, and the `loading` state below is a real transient rather than a permanent
 * one.
 *
 * Nothing is lost to search. The configurator's job is narrowing, and every product it
 * can reach already has its own indexable page — the categories are declared to crawlers
 * through the ItemList on the page itself.
 */

const Configurator = dynamic(() => import("./Configurator").then((m) => m.Configurator), {
  ssr: false,
  loading: () => (
    <p className="text-c1 text-ink-secondary" role="status">
      Loading the catalogue…
    </p>
  ),
});

export function ConfiguratorClient({
  products,
  locale = "en",
}: {
  products: FinderProduct[];
  locale?: "en" | "es";
}) {
  return <Configurator products={products} locale={locale} />;
}
