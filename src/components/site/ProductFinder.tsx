"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/site/ProductCard";
import { Pagination } from "@/components/site/Pagination";
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
  PRIMARY_FACETS,
  SECONDARY_FACETS,
  type Facet,
  type FacetKey,
  type Selection,
} from "@/lib/product-finder";
import type { Product } from "@/data/types";

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
export function ProductFinder({
  products,
  categoryNames,
}: {
  products: Product[];
  /** slug -> display name, so facets read "Panic Exit Devices" not "panic-exit-devices". */
  categoryNames: Record<string, string>;
}) {
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
        {facet.label}
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
              Clear all ({activeCount})
            </button>
          )}
        </div>

        <label className="mt-24 block">
          <span className="text-c2 text-ink-secondary">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Model, name or finish…"
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
                More filters
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
              Series, material, finish, door type and certification.
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
                    Clear these ({secondaryActive})
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
          {current.total} {current.total === 1 ? "product" : "products"}
          {activeCount > 0 || query ? " matching your filters" : " in the catalogue"}
          {current.pageCount > 1 && (
            <span className="text-ink-tertiary">
              {" "}
              · showing {current.from}–{current.to}
            </span>
          )}
        </p>

        {current.total === 0 ? (
          <div className="mt-48 text-c1 text-ink-secondary">
            <p className="text-ink">Nothing matches this combination.</p>
            <p className="mt-12">
              Try removing a filter, or{" "}
              <a
                href="/contact/"
                className="inline-marker text-brand hover:text-brand-hover"
              >
                ask an export engineer
              </a>{" "}
              — the catalogue on this site is a subset of what we manufacture.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-24 grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-3">
              {current.items.map((product, i) => (
                <ProductCard key={product.slug} product={product} priority={i < 3} />
              ))}
            </div>

            <Pagination
              page={current.page}
              pageCount={current.pageCount}
              onChange={goToPage}
              label="Product pages"
            />
          </>
        )}
      </section>
    </div>
  );
}
