"use client";

import { cn } from "@/lib/utils";
import { visiblePageNumbers } from "@/lib/product-finder";

/**
 * Shared pager for the catalogue listings.
 *
 * Both the Product Finder and the category pages cap a page at 20 cards, and each card
 * carries a photograph — so this control is what bounds how many images one view asks
 * for. It exists as a component rather than twice inline because the two listings have
 * already drifted apart once.
 *
 * Renders nothing for a single page: a pager under 12 results is noise.
 */
export function Pagination({
  page,
  pageCount,
  onChange,
  label = "Pages",
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (next: number) => void;
  label?: string;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={label}
      className={cn(
        "catalogue-pager mt-64 border-t border-line pt-24",
        className,
      )}
    >
      <div className="catalogue-pager-side catalogue-pager-side-start">
        <button
          type="button"
          onClick={() => onChange(1)}
          disabled={page === 1}
          className="short-marker short-marker-compact text-c1 text-ink disabled:cursor-default disabled:text-ink-tertiary"
        >
          First
        </button>
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="short-marker short-marker-compact text-c1 text-ink disabled:cursor-default disabled:text-ink-tertiary"
        >
          ← Previous
        </button>
      </div>

      <ol className="catalogue-pager-pages flex items-center gap-8">
        {visiblePageNumbers(page, pageCount).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className="catalogue-pager-page min-w-38 px-10 py-6 text-c1"
              >
                {item}
              </button>
            </li>
          ) : (
            <li
              key={item}
              className="catalogue-pager-ellipsis min-w-20 text-center text-c1 text-ink-tertiary"
            >
              <span aria-hidden="true">…</span>
              <span className="sr-only">More pages</span>
            </li>
          ),
        )}
      </ol>

      <div className="catalogue-pager-side catalogue-pager-side-end">
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
          className="short-marker short-marker-compact text-c1 text-ink disabled:cursor-default disabled:text-ink-tertiary"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={() => onChange(pageCount)}
          disabled={page === pageCount}
          className="short-marker short-marker-compact text-c1 text-ink disabled:cursor-default disabled:text-ink-tertiary"
        >
          Last
        </button>
      </div>
    </nav>
  );
}
