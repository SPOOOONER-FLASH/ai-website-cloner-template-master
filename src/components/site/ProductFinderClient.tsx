"use client";
import type { Locale } from "@/data/site";

import dynamic from "next/dynamic";
import { tx } from "@/lib/i18n-client";
import { useFinderProducts } from "./use-finder-products";

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
    /*
      The loading line is the one string this wrapper renders itself, so it carries both
      locales rather than showing English for the half-second before the Spanish filters
      arrive — the moment a reader is most likely to conclude the page is not translated.
    */
    loading: () => (
      <p className="col-content text-c1 text-ink-secondary">Loading filters…</p>
    ),
  },
);

export function ProductFinderClient({
  categoryNames,
  locale = "en",
}: {
  categoryNames: Record<string, string>;
  locale?: Locale;
}) {
  const data = useFinderProducts(locale);
  if (data.status !== "ready") {
    return (
      <p className="col-content text-c1 text-ink-secondary" role="status">
        {data.status === "error"
          ? tx(locale, "The catalog could not be loaded. Please reload the page.", {
              es: "No se pudo cargar el catálogo. Vuelva a cargar la página.",
              pt: "Não foi possível carregar o catálogo. Recarregue a página.",
            })
          : tx(locale, "Loading the catalog…", { es: "Cargando el catálogo…", pt: "Carregando o catálogo…" })}
      </p>
    );
  }
  return <ProductFinder products={data.products} categoryNames={categoryNames} locale={locale} />;
}
