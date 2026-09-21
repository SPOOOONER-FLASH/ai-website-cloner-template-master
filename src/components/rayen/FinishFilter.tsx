"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { finishKey, finishLabel, finishSwatch } from "@/data/rayen-finishes";
import type { RayenLocale } from "@/data/rayen-i18n";

/**
 * Filter a category by finish.
 *
 * WHY THIS EARNS A PLACE ON THE CATEGORY PAGE
 * 不锈钢拉手 holds 63 models and the grid sorts them by model number, which helps only a buyer
 * who already has the number. The first question a buyer without one asks is the colour —
 * 黄铜的有哪些, 有没有黑的 — and until now that answer was buried in a spec row on each of 63
 * separate pages.
 *
 * WHY THE GRID IS PASSED IN AS `children` RATHER THAN RENDERED HERE
 * This is a "use client" file. ProductCard lives in primitives.tsx, which imports the 4,892
 * entry image-dimension map; rendering cards from inside this component would pull that whole
 * JSON into the browser bundle — the exact thing the note at the top of primitives.tsx warns
 * against. So the server renders every card as it always did, tags each one with the finishes
 * it offers, and this component only hides the ones that do not match. Nothing extra ships.
 *
 * WHAT IT IS HONEST ABOUT
 * Two finishes are nearly universal: 171 of 196 models offer satin stainless and 162 offer
 * matt black. Filtering by those narrows almost nothing, and a control that looks useful and
 * then returns 60 of 63 is worse than no control. So every option carries its own count and
 * the reader can see before clicking that 「哑光黑 58」 is not worth pulling while
 * 「仿古黄铜 7」 is. The counts are computed from the items on THIS page — a number that
 * disagreed with the grid underneath it would defeat the purpose of printing it.
 */

export interface FilterableProduct {
  slug: string;
  finishes?: string[];
}

export function FinishFilter({
  items,
  locale,
  labels,
  children,
}: {
  items: FilterableProduct[];
  locale: RayenLocale;
  labels: { all: string; heading: string; approximate: string; empty: string };
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const item of items) {
      const seen = new Set<string>();
      for (const raw of item.finishes ?? []) {
        const key = finishKey(raw);
        if (seen.has(key)) continue;
        seen.add(key);
        const current = counts.get(key);
        if (current) current.count += 1;
        else counts.set(key, { label: finishLabel(raw, locale), count: 1 });
      }
    }
    return [...counts.entries()]
      .map(([key, value]) => ({ key, ...value, swatch: finishSwatch(key) }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [items, locale]);

  const shown = selected
    ? (options.find((option) => option.key === selected)?.count ?? 0)
    : items.length;

  /*
    Toggling `hidden` on the server-rendered cards, rather than re-rendering a filtered list.

    The cards are somebody else's markup as far as this component is concerned — they arrive
    as children. Walking them once per change is cheap at this size (63 nodes at the largest)
    and keeps the whole grid in the HTML, so a visitor with no JavaScript sees the complete
    category instead of an empty page.
  */
  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    for (const node of root.querySelectorAll<HTMLElement>("[data-finishes]")) {
      const keys = (node.dataset.finishes ?? "").split(" ").filter(Boolean);
      node.hidden = selected !== null && !keys.includes(selected);
    }
  }, [selected]);

  if (options.length < 2) return <>{children}</>;

  return (
    <>
      <section className="mt-8" aria-label={labels.heading}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[13px] text-[var(--color-ink-3)]">{labels.heading}</span>

          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-pressed={selected === null}
            className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${
              selected === null
                ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                : "border-[var(--color-line)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-3)]"
            }`}
          >
            {labels.all} <span className="latin">{items.length}</span>
          </button>

          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelected(selected === option.key ? null : option.key)}
              aria-pressed={selected === option.key}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] transition-colors ${
                selected === option.key
                  ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                  : "border-[var(--color-line)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-3)]"
              }`}
            >
              {option.swatch ? (
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full border border-black/15"
                  style={
                    option.swatch.colors.length > 1
                      ? {
                          backgroundImage: `linear-gradient(135deg, ${option.swatch.colors[0]} 0 50%, ${option.swatch.colors[1]} 50% 100%)`,
                        }
                      : { backgroundColor: option.swatch.colors[0] }
                  }
                />
              ) : null}
              {option.label}
              <span className="latin text-[var(--color-ink-3)]">{option.count}</span>
            </button>
          ))}
        </div>

        <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
          {labels.approximate}
          {selected ? ` · ${labels.empty.replace("{n}", String(shown))}` : ""}
        </p>
      </section>

      <div ref={gridRef}>{children}</div>
    </>
  );
}
