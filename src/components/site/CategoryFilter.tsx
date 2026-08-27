"use client";

import { useMemo, useRef, useState } from "react";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { paginate, sortForDisplay } from "@/lib/product-finder";
import { ProductCard } from "./ProductCard";
import { Pagination } from "./Pagination";

interface FilterOption {
  slug: string;
  name: string;
}

interface CategoryFilterProps {
  products: Product[];
  options: FilterOption[];
}

/**
 * The product grid on a category page.
 *
 * Paginated at 20 and ordered photographs-first, matching the Product Finder — the
 * largest category holds 67 products, and rendering all of them meant one view asking
 * for 67 images at once. Both listings share `sortForDisplay` and `paginate` rather than
 * each having their own idea of what a page is.
 */
export function CategoryFilter({ products, options }: CategoryFilterProps) {
  const [active, setActive] = useState("all");
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement | null>(null);

  const visibleProducts = useMemo(
    () =>
      sortForDisplay(
        active === "all"
          ? products
          : products.filter((product) => product.categoryPath.slice(1).includes(active)),
      ),
    [active, products],
  );

  const current = paginate(visibleProducts, page);

  const choose = (slug: string) => {
    setActive(slug);
    setPage(1); // a narrower filter can have fewer pages than the one being left
  };

  const goToPage = (next: number) => {
    setPage(next);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="col-span-full grid grid-cols gap-x gap-y-64">
      {/* Same independent scroll as the Product Finder rail — see the note there. */}
      <aside
        className="col-span-full xl:sticky xl:top-96 xl:col-span-6 xl:max-h-[calc(100vh-12rem)] xl:self-start xl:overflow-y-auto xl:overscroll-contain xl:pr-16 xl:[scrollbar-width:thin]"
        aria-label="Product filters"
      >
        <p className="border-b border-line pb-16 text-c2 text-ink-secondary">Filter by type</p>
        <div className="flex flex-wrap gap-x-24 gap-y-12 pt-16 xl:flex-col xl:items-start">
          {[{ slug: "all", name: "All products" }, ...options].map((option) => {
            const selected = active === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => choose(option.slug)}
                className={cn(
                  "short-marker short-marker-compact text-left text-c1 hover:text-brand-hover",
                  selected ? "font-semibold text-brand" : "text-ink",
                )}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="col-span-full xl:col-span-18">
        <div ref={top} className="scroll-mt-96" />
        <div className="flex items-end justify-between gap-24 border-b border-line pb-16">
          <p className="text-c2 text-ink-secondary" aria-live="polite">
            {current.total} product{current.total === 1 ? "" : "s"}
            {current.pageCount > 1 && (
              <span className="text-ink-tertiary">
                {" "}
                · showing {current.from}–{current.to}
              </span>
            )}
          </p>
          <p className="text-c2 text-ink-secondary">Catalogue order</p>
        </div>

        {current.total ? (
          <>
            <div
              key={`${active}-page-${current.page}`}
              className="catalogue-page-enter mt-24 grid grid-cols-1 gap-24 sm:grid-cols-2 xl:grid-cols-3 xl:gap-42"
            >
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
        ) : (
          <p className="mt-24 border-t border-line pt-24 text-c1 text-ink-secondary">
            Verified product records for this filter are still being prepared. Contact the export
            team for the current catalogue.
          </p>
        )}
      </div>
    </div>
  );
}
