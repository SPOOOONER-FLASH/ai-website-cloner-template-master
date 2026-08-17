"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/site/ProductCard";
import {
  buildFacets,
  countActive,
  filterProducts,
  selectionFromParams,
  selectionToParams,
  toggleValue,
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

  // Mirror state back into the address bar without adding history entries — otherwise
  // every ticked box costs the user another press of the back button.
  useEffect(() => {
    const next = selectionToParams(selection, query).toString();
    window.history.replaceState(
      null,
      "",
      next ? `${window.location.pathname}?${next}` : window.location.pathname,
    );
  }, [selection, query]);

  const results = useMemo(
    () => filterProducts(products, selection, query),
    [products, selection, query],
  );
  const facets = useMemo(
    () => buildFacets(products, selection, query),
    [products, selection, query],
  );

  const activeCount = countActive(selection);
  const label = (key: FacetKey, value: string) =>
    key === "category" || key === "subCategory" ? (categoryNames[value] ?? value) : value;

  return (
    <div className="col-content grid w-full grid-cols gap-x gap-y-48">
      {/* Filter rail */}
      <aside className="col-span-full xl:col-span-6">
        <div className="flex items-baseline justify-between gap-16 border-b border-line pb-16">
          <h2 className="text-h3 text-ink">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelection({});
                setQuery("");
              }}
              className="text-c2 text-brand underline-offset-4 hover:text-brand-hover hover:underline"
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Model, name or finish…"
            className="mt-8 min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink placeholder:text-ink-secondary focus:border-brand focus:outline-none"
          />
        </label>

        {facets.map((facet) => (
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
                      onChange={() =>
                        setSelection((current) => toggleValue(current, facet.key, option.value))
                      }
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
        ))}
      </aside>

      {/* Results */}
      <section className="col-span-full xl:col-span-18">
        <p className="border-b border-line pb-16 text-c1 text-ink-secondary" aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
          {activeCount > 0 || query ? " matching your filters" : " in the catalogue"}
        </p>

        {results.length === 0 ? (
          <div className="mt-48 text-c1 text-ink-secondary">
            <p className="text-ink">Nothing matches this combination.</p>
            <p className="mt-12">
              Try removing a filter, or{" "}
              <a
                href="/contact/"
                className="text-brand underline underline-offset-4 hover:text-brand-hover"
              >
                ask an export engineer
              </a>{" "}
              — the catalogue on this site is a subset of what we manufacture.
            </p>
          </div>
        ) : (
          <div className="mt-24 grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
