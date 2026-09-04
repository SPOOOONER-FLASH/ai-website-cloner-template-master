"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/site/ProductCard";
import { Pagination } from "@/components/site/Pagination";
import { CatalogueReturnRestorer } from "@/components/site/CatalogueNavigation";
import {
  buildFacets,
  countActive,
  filterProducts,
  paginate,
  selectionFromParams,
  selectionToParams,
  sortForDisplay,
  toggleValue,
  FACET_PARAM_NAMES,
  FACET_LABELS,
  FACET_LABELS_ES,
  PRIMARY_FACETS,
  SECONDARY_FACETS,
  type Facet,
  type FacetKey,
  type Selection,
  type FinderProduct,
} from "@/lib/product-finder";

/**
 * Product Finder.
 *
 * All filtering happens in the browser over data already in the bundle, which is why
 * this works on a static export with no server. The catalogue is small enough that this
 * is instant; if it grows past a few hundred products this is the component to revisit.
 *
 * The selection lives in the URL, so a filtered view can be bookmarked and — more to the
 * point for a B2B site — pasted into an email to a specifier.
 */
/**
 * Every string the reader sees, in both locales.
 *
 * Collected here rather than inline because the Spanish mirror of this page is a
 * translation of the SAME component: two copies of the filter UI would drift the moment
 * one of them gained a facet, and the drift would be invisible until a Spanish-speaking
 * buyer hit it.
 *
 * The trade terms follow the glossary the Spanish catalogue already uses — "acabado" for
 * finish, "serie" for series — rather than a literal rendering of the English label.
 */
const COPY = {
  en: {
    clearAll: (n: number) => `Clear all (${n})`,
    search: "Search",
    searchPlaceholder: "Model, name or finish…",
    moreFilters: "More filters",
    moreFiltersHint: "Series, material, finish, door type and certification.",
    clearThese: (n: number) => `Clear these (${n})`,
    product: "product",
    products: "products",
    matching: " matching your filters",
    inCatalogue: " in the catalogue",
    showing: (from: number, to: number) => ` · showing ${from}–${to}`,
    emptyTitle: "Nothing matches this combination.",
    emptyTry: "Try removing a filter, or ",
    emptyAsk: "ask an export engineer",
    emptyTail: " — the catalogue on this site is a subset of what we manufacture.",
    contactHref: "/contact/",
    pages: "Product pages",
    facets: FACET_LABELS,
  },
  es: {
    clearAll: (n: number) => `Borrar todo (${n})`,
    search: "Buscar",
    searchPlaceholder: "Modelo, nombre o acabado…",
    moreFilters: "Más filtros",
    moreFiltersHint: "Serie, material, acabado, tipo de puerta y certificación.",
    clearThese: (n: number) => `Borrar estos (${n})`,
    product: "producto",
    products: "productos",
    matching: " coinciden con sus filtros",
    inCatalogue: " en el catálogo",
    showing: (from: number, to: number) => ` · mostrando ${from}–${to}`,
    emptyTitle: "Nada coincide con esta combinación.",
    emptyTry: "Pruebe a quitar un filtro, o ",
    emptyAsk: "consulte a un ingeniero de exportación",
    emptyTail: " — el catálogo de este sitio es una parte de lo que fabricamos.",
    contactHref: "/es/contact/",
    pages: "Páginas de productos",
    facets: FACET_LABELS_ES,
  },
} as const;

export function ProductFinder({
  products,
  categoryNames,
  locale = "en",
}: {
  products: FinderProduct[];
  /** slug -> display name, so facets read "Panic Exit Devices" not "panic-exit-devices". */
  categoryNames: Record<string, string>;
  locale?: "en" | "es";
}) {
  const t = COPY[locale];
  // Seeded lazily from the address bar. This component is loaded with ssr: false, so it
  // only ever renders in the browser — there is no server pass to disagree with, and no
  // setState-in-an-effect needed to catch up afterwards.
  const initial = useMemo(
    () => selectionFromParams(new URLSearchParams(window.location.search)),
    [],
  );

  const [selection, setSelection] = useState<Selection>(initial.selection);
  const [query, setQuery] = useState(initial.query);
  const [page, setPage] = useState(initial.page);
  const [moreOpen, setMoreOpen] = useState(false);

  // Mirror state back into the address bar without adding history entries — otherwise
  // every ticked box costs the user another press of the back button.
  useEffect(() => {
    const next = selectionToParams(selection, query, page);

    // Carry over any parameter this component does not own. It used to rebuild the whole
    // query string, which silently dropped things like `?promo=1` — the flag that lets
    // the client preview the promo dialog past its own cooldown. Anything not a facet,
    // `q` or `page` belongs to somebody else and is none of this component's business.
    const owned = new Set([...next.keys()]);
    for (const [key, value] of new URLSearchParams(window.location.search)) {
      if (!owned.has(key) && !FACET_PARAM_NAMES.has(key)) next.set(key, value);
    }

    const qs = next.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }, [selection, query, page]);

  const results = useMemo(
    () => sortForDisplay(filterProducts(products, selection, query)),
    [products, selection, query],
  );
  const facets = useMemo(
    () => buildFacets(products, selection, query),
    [products, selection, query],
  );

  const current = paginate(results, page);

  /**
   * Any change to the filters invalidates the page number — staying on page 3 of a
   * result set that just shrank to one page shows an empty grid. `paginate` clamps, so
   * this is about the address bar telling the truth rather than about correctness.
   */
  const narrow = (next: (s: Selection) => Selection) => {
    setSelection(next);
    setPage(1);
  };

  const resultsTop = useRef<HTMLDivElement | null>(null);

  const goToPage = (next: number) => {
    setPage(next);
    // Jump back to the top of the results, not the top of the document: the filter rail
    // is long and landing mid-grid after paging reads as nothing having happened.
    resultsTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeCount = countActive(selection);
  const byKey = (keys: FacetKey[]) => facets.filter((f) => keys.includes(f.key));
  const primary = byKey(PRIMARY_FACETS);
  const secondary = byKey(SECONDARY_FACETS);
  const secondaryActive = SECONDARY_FACETS.reduce(
    (n, key) => n + (selection[key]?.length ?? 0),
    0,
  );

  const label = (key: FacetKey, value: string) =>
    key === "category" || key === "subCategory" ? (categoryNames[value] ?? value) : value;

  const renderFacet = (facet: Facet) => (
    <fieldset key={facet.key} className="mt-32 border-0 p-0">
      <legend className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
        {t.facets[facet.key]}
      </legend>
      <div className="mt-12 flex flex-col gap-8">
        {facet.options.map((option) => {
          const checked = selection[facet.key]?.includes(option.value) ?? false;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-12 text-c1 text-ink"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => narrow((s) => toggleValue(s, facet.key, option.value))}
                className="h-16 w-16 flex-none accent-brand"
              />
              <span className={cn("flex-1", checked && "text-brand")}>
                {label(facet.key, option.value)}
              </span>
              <span className="text-c2 text-ink-tertiary">{option.count}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <div className="col-content grid w-full grid-cols gap-x gap-y-48">
      {/* Filter rail */}
      {/*
        The rail scrolls inside itself on desktop.

        With "More filters" open the rail runs to several hundred rows, and because it
        shared the page's scroll the only way to reach the bottom of it was to scroll the
        results grid past twenty cards — you lost sight of what you were filtering while
        choosing the filter. Sticky + its own overflow keeps the two independent: the rail
        holds its position and scrolls on its own, the grid scrolls normally.

        Only from `xl`, where the two sit side by side. Below that they are stacked, a
        fixed-height scrolling box would trap the page scroll on touch, and the rail is
        short anyway because it collapses.
      */}
      <aside className="col-span-full xl:sticky xl:col-span-6 xl:self-start xl:top-96 xl:max-h-[calc(100vh-12rem)] xl:overflow-y-auto xl:overscroll-contain xl:pr-16 xl:[scrollbar-width:thin]">
        <div className="flex items-baseline justify-between gap-16 border-b border-line pb-16">
          <h2 className="text-h3 text-ink">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelection({});
                setQuery("");
                setPage(1);
              }}
              className="short-marker short-marker-compact text-c2 text-brand hover:text-brand-hover"
            >
              {t.clearAll(activeCount)}
            </button>
          )}
        </div>

        <label className="mt-24 block">
          <span className="text-c2 text-ink-secondary">{t.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={t.searchPlaceholder}
            className="mt-8 min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink placeholder:text-ink-secondary focus:border-brand focus:outline-none"
          />
        </label>

        {primary.map(renderFacet)}

        {/*
          Series, material, finish, door type and certification live behind this.
          Inline they ran to hundreds of rows — 41 materials, 78 finishes, 87 door types
          — and buried Category and Type, which is where nearly everyone starts.
        */}
        {secondary.length > 0 && (
          <div className="mt-32 border-t border-line pt-24">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-controls="finder-more-filters"
              className="flex w-full items-center justify-between gap-12 text-c1 text-ink hover:text-brand"
            >
              <span className="flex items-center gap-8">
                {t.moreFilters}
                {secondaryActive > 0 && (
                  <span className="inline-flex h-20 min-w-20 items-center justify-center rounded-full bg-brand px-6 text-c2 text-surface">
                    {secondaryActive}
                  </span>
                )}
              </span>
              <span aria-hidden="true" className="text-ink-secondary">
                {moreOpen ? "–" : "+"}
              </span>
            </button>

            <p className="mt-8 text-c2 text-ink-secondary">
              {t.moreFiltersHint}
            </p>

            {moreOpen && (
              <div id="finder-more-filters">
                {secondary.map(renderFacet)}
                {secondaryActive > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      narrow((s) => {
                        const next = { ...s };
                        for (const key of SECONDARY_FACETS) delete next[key];
                        return next;
                      })
                    }
                    className="short-marker short-marker-compact mt-24 text-c2 text-brand hover:text-brand-hover"
                  >
                    {t.clearThese(secondaryActive)}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Results */}
      <section className="col-span-full xl:col-span-18">
        <div ref={resultsTop} className="scroll-mt-96" />
        <p className="border-b border-line pb-16 text-c1 text-ink-secondary" aria-live="polite">
          {current.total} {current.total === 1 ? t.product : t.products}
          {activeCount > 0 || query ? t.matching : t.inCatalogue}
          {current.pageCount > 1 && (
            <span className="text-ink-tertiary">
              {" "}
              {t.showing(current.from, current.to)}
            </span>
          )}
        </p>

        {current.total === 0 ? (
          <div className="mt-48 text-c1 text-ink-secondary">
            <p className="text-ink">{t.emptyTitle}</p>
            <p className="mt-12">
              {t.emptyTry}
              <a
                href={t.contactHref}
                className="inline-marker text-brand hover:text-brand-hover"
              >
                {t.emptyAsk}
              </a>
              {t.emptyTail}
            </p>
          </div>
        ) : (
          <>
            <div
              key={`finder-page-${current.page}`}
              className="catalogue-page-enter mt-24 grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-3"
            >
              {current.items.map((product, i) => (
                <ProductCard key={product.slug} product={product} priority={i < 3} />
              ))}
            </div>

            <Pagination
              page={current.page}
              pageCount={current.pageCount}
              onChange={goToPage}
              label={t.pages}
            />
            <CatalogueReturnRestorer readyKey={`finder:${current.page}:${current.from}`} />
          </>
        )}
      </section>
    </div>
  );
}
