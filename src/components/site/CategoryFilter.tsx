"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

interface FilterOption {
  slug: string;
  name: string;
}

interface CategoryFilterProps {
  products: Product[];
  options: FilterOption[];
}

export function CategoryFilter({ products, options }: CategoryFilterProps) {
  const [active, setActive] = useState("all");
  const visibleProducts = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter((product) => product.categoryPath.slice(1).includes(active)),
    [active, products],
  );

  return (
    <div className="col-span-full grid grid-cols gap-x-42 gap-y-64">
      <aside className="col-span-full xl:col-span-6" aria-label="Product filters">
        <p className="border-b border-line pb-16 text-c2 text-ink-secondary">Filter by type</p>
        <div className="flex flex-wrap gap-x-24 gap-y-12 pt-16 xl:flex-col xl:items-start">
          {[{ slug: "all", name: "All products" }, ...options].map((option) => {
            const selected = active === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(option.slug)}
                className={cn(
                  "text-left text-c1 underline-offset-4 hover:text-brand-hover hover:underline",
                  selected ? "text-brand" : "text-ink",
                )}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="col-span-full xl:col-span-18">
        <div className="flex items-end justify-between gap-24 border-b border-line pb-16">
          <p className="text-c2 text-ink-secondary">
            {visibleProducts.length} product{visibleProducts.length === 1 ? "" : "s"}
          </p>
          <p className="text-c2 text-ink-secondary">Catalogue order</p>
        </div>

        {visibleProducts.length ? (
          <div className="mt-24 grid grid-cols-1 gap-24 sm:grid-cols-2 xl:grid-cols-3 xl:gap-42">
            {visibleProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
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

