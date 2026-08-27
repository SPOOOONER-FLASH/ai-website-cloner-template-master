"use client";

import { cn } from "@/lib/utils";

/**
 * Page numbers to render, with gaps.
 *
 * A filtered view can produce any count, so the middle collapses rather than letting the
 * control wrap into three lines. The first and last page are always shown, so both ends
 * of the result set stay one click away.
 */
export function pageNumbers(page: number, count: number): (number | null)[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out: (number | null)[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(count - 1, page + 1);
  if (from > 2) out.push(null);
  for (let n = from; n <= to; n++) out.push(n);
  if (to < count - 1) out.push(null);
  out.push(count);
  return out;
}

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
        "mt-64 flex flex-wrap items-center justify-between gap-16 border-t border-line pt-24",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="short-marker short-marker-compact text-c1 text-brand disabled:cursor-default disabled:text-ink-tertiary"
      >
        ← Previous
      </button>

      <ol className="flex flex-wrap items-center gap-8">
        {pageNumbers(page, pageCount).map((n, i) =>
          n === null ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-4 text-ink-tertiary">
              …
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`Page ${n}`}
                className={cn(
                  "min-w-32 px-8 py-4 text-c1",
                  n === page ? "bg-ink text-surface" : "text-ink hover:text-brand",
                )}
              >
                {n}
              </button>
            </li>
          ),
        )}
      </ol>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        className="short-marker short-marker-compact text-c1 text-brand disabled:cursor-default disabled:text-ink-tertiary"
      >
        Next →
      </button>
    </nav>
  );
}
