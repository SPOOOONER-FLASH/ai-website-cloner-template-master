"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Site search.
 *
 * Runs entirely in the browser against a static index built by
 * scripts/build-search-index.mjs. There is no search server and no third-party service:
 * the corpus is known at build time and is small enough (166KB over 461 entries) that
 * shipping it and matching locally is both faster and cheaper than a query API.
 *
 * The index is fetched on FIRST OPEN, not at page load. Most visitors never search, and
 * 166KB is more than the rest of the page weight combined.
 */

interface IndexEntry {
  type: "product" | "category" | "project" | "news" | "download" | "page";
  title: string;
  subtitle: string;
  href: string;
  /** Pre-lowercased haystack. */
  text: string;
  /** Products only, pre-lowercased. Absent when the model is still provisional. */
  model?: string;
}

const TYPE_LABEL: Record<IndexEntry["type"], string> = {
  product: "Product",
  category: "Category",
  project: "Application",
  news: "News",
  download: "Download",
  page: "Page",
};

const MAX_RESULTS = 24;

/**
 * Scores one entry against the already-lowercased query terms.
 *
 * Every term must appear somewhere, so "stainless lever" does not return all 214
 * stainless products. Beyond that the ranking is deliberately crude — a title match
 * outranks a body match, and an exact model match outranks everything, which covers the
 * two ways people actually search a hardware catalogue: by name, or by model number.
 */
function score(entry: IndexEntry, terms: string[]): number {
  const title = entry.title.toLowerCase();

  let total = 0;
  for (const term of terms) {
    if (!entry.text.includes(term)) return 0;

    /*
      The model boost scores against the model field alone, never the subtitle. The
      subtitle reads "305 · Hyland 300", so scoring the whole string treated "hyland"
      and "panic" as model hits and pushed every product above the category page that
      should have led the results.
    */
    if (entry.model === term) total += 80;
    else if (entry.model?.startsWith(term)) total += 40;

    if (title === term) total += 50;
    else if (title.startsWith(term)) total += 30;
    else if (title.includes(term)) total += 20;
    else total += 5;
  }

  // A category is a better answer than any one product under it.
  if (entry.type === "category") total += 15;
  if (entry.type === "page") total += 10;

  return total;
}

export function SearchDialog({ open, onClose, locale = "en" }: {
  open: boolean;
  onClose: () => void;
  locale?: "en" | "es";
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchStarted = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  const t = locale === "es"
    ? { heading: "Introduce tu búsqueda", label: "Buscar", close: "Cerrar", empty: "Sin resultados", loading: "Cargando…" }
    : { heading: "Enter your search term", label: "Search", close: "Close", empty: "No results", loading: "Loading…" };

  /*
    Loading is derived, not stored. An open dialog with no index yet IS the loading
    state, so keeping a second boolean in sync with it would only create a way for the
    two to disagree — and setting it inside the effect was a synchronous state update
    that cascaded a render before the fetch had even begun.

    The in-flight guard is a ref for the same reason.
  */
  const loading = open && index === null;

  useEffect(() => {
    if (!open || index || fetchStarted.current) return;
    fetchStarted.current = true;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/search-index.json");
        const data: IndexEntry[] = response.ok ? await response.json() : [];
        if (!cancelled) setIndex(data);
      } catch {
        // A failed index leaves the dialog usable but empty rather than throwing into
        // the page. Search is not worth breaking a product page over.
        if (!cancelled) setIndex([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement;
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const close = useCallback(() => {
    onClose();
    if (restoreFocusTo.current instanceof HTMLElement) restoreFocusTo.current.focus();
  }, [onClose]);

  const results = useMemo(() => {
    if (!index) return [];
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];

    return index
      .map((entry) => ({ entry, s: score(entry, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title))
      .slice(0, MAX_RESULTS)
      .map((r) => r.entry);
  }, [index, query]);

  const totalMatches = useMemo(() => {
    if (!index) return 0;
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return 0;
    return index.filter((e) => score(e, terms) > 0).length;
  }, [index, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" role="presentation">
      {/*
        Light grey, not the promo dialog's near-black. That difference is in the
        reference too, and it is the right call: a search panel is a tool the visitor
        asked for, so the page behind it should stay legible. The promo dialog interrupts
        and therefore earns a heavy overlay; this one does not.
      */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-[rgba(246,246,246,0.92)]"
      />

      <div className="relative mt-[12vh] w-full max-w-[720px] px-24">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-heading"
          className="bg-surface p-32 shadow-[0_1px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-start justify-between gap-24">
            <h2 id="search-heading" className="text-h3 text-ink">
              {t.heading}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="flex h-24 w-24 flex-none items-center justify-center text-ink transition-colors duration-200 hover:text-ink-secondary"
            >
              <svg viewBox="0 0 24 24" className="h-24 w-24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M24 23 12.7 11.6 23.3 1l-.7-.7L12 10.9 1.4.3.7 1l10.6 10.6L0 23l.7.7L12 12.3l11.3 11.3.7-.6z"
                />
              </svg>
            </button>
          </div>

          {/*
            A form so Enter behaves, but submit is a no-op: results are already live
            below. Without preventDefault the browser would reload the page and lose them.
          */}
          <form
            className="mt-32"
            onSubmit={(event) => {
              event.preventDefault();
              if (results.length === 1) close();
            }}
          >
            <label htmlFor="site-search" className="block text-c2 text-ink-secondary">
              {t.label}
            </label>
            <div className="mt-8 flex items-center gap-16 border-b border-ink pb-8">
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
                className="w-full appearance-none bg-transparent text-c1 text-ink outline-none placeholder:text-ink-tertiary"
              />
              <button
                type="submit"
                aria-label={t.label}
                className="flex h-24 w-16 flex-none items-center justify-center text-ink"
              >
                <svg viewBox="0 0 6 10" className="h-16 w-auto" aria-hidden="true">
                  <path d="M0.8 0.6 L5.2 5 L0.8 9.4 L0.8 0.6 Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </form>

          <div aria-live="polite" className="mt-24 max-h-[46vh] overflow-y-auto">
            {loading ? <p className="text-c2 text-ink-secondary">{t.loading}</p> : null}

            {!loading && query.trim() && !results.length ? (
              <p className="text-c2 text-ink-secondary">{t.empty}</p>
            ) : null}

            {results.length ? (
              <>
                <p className="text-c2 text-ink-secondary">
                  {totalMatches}
                  {totalMatches > MAX_RESULTS ? ` (showing ${MAX_RESULTS})` : ""}
                </p>
                <ul className="mt-16 divide-y divide-line border-t border-line">
                  {results.map((entry) => (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        onClick={close}
                        className={cn(
                          "group flex items-baseline justify-between gap-16 py-12",
                          "hover:bg-surface-alt",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-c1 text-ink group-hover:underline">
                            {entry.title}
                          </span>
                          <span className="block truncate text-c2 text-ink-secondary">
                            {entry.subtitle}
                          </span>
                        </span>
                        <span className="flex-none text-c2 text-ink-tertiary">
                          {TYPE_LABEL[entry.type]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
