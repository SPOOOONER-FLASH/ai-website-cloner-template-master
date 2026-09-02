"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  suggestedCategories,
  suggestedProducts,
  suggestionHref,
  suggestionLabel,
} from "@/data/search-suggestions";
import {
  categoryHrefOf,
  matchRanges,
  normaliseModel,
  queryTerms,
  score,
  suggestRanges,
  type SearchIndexEntry,
} from "@/lib/search-matching";

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

/**
 * The matching rules live in src/lib/search-matching.ts so they can be tested against
 * the real index. Every one of them exists because somebody typed something into this
 * box and told us what went wrong; see search-matching.test.ts for the cases.
 */
type IndexEntry = SearchIndexEntry;

const TYPE_LABEL: Record<IndexEntry["type"], string> = {
  product: "Product",
  category: "Category",
  project: "Application",
  news: "News",
  download: "Download",
  page: "Page",
};

const MAX_RESULTS = 24;

export function SearchDialog({ open, onClose, locale = "en" }: {
  open: boolean;
  onClose: () => void;
  locale?: "en" | "es";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchStarted = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  const t = locale === "es"
    ? {
        heading: "Introduce tu búsqueda",
        label: "Buscar",
        close: "Cerrar",
        empty: (q: string) =>
          `Sin resultados para «${q}». Pruebe otro término o explore las categorías.`,
        emptyNear: "Sin coincidencia exacta. Los modelos más cercanos que publicamos:",
        emptyCategories: "Estas gamas son lo más cercano a lo que busca:",
        matchedRanges: "Gamas que coinciden",
        enterExact: "Pulse Intro para abrirlo",
        enterBroad: (name: string) => `Pulse Intro para ver la gama ${name}`,
        seeRange: (name: string) => `Ver toda la gama ${name}`,
        loading: "Cargando…",
        placeholder: "Modelo, categoría o tipo de puerta",
        browse: "Categorías principales",
        popular: "Modelos más consultados",
      }
    : {
        heading: "Enter your search term",
        label: "Search",
        close: "Close",
        empty: (q: string) =>
          `No results for “${q}”. Try another term, or explore the categories below.`,
        emptyNear: "No exact match. The closest models we publish:",
        emptyCategories: "These ranges are the closest to what you asked for:",
        matchedRanges: "Matching ranges",
        enterExact: "Press Enter to open it",
        enterBroad: (name: string) => `Press Enter for the ${name} range`,
        seeRange: (name: string) => `See the whole ${name} range`,
        loading: "Loading…",
        placeholder: "Model, category or door type",
        browse: "Main categories",
        popular: "Most-requested models",
      };

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
    const terms = queryTerms(query);
    if (!terms.length) return [];

    return index
      .map((entry) => ({ entry, s: score(entry, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title))
      .slice(0, MAX_RESULTS)
      .map((r) => r.entry);
  }, [index, query]);

  /**
   * What to offer when nothing matches.
   *
   * A buyer typed "D103" and got "No results". That was strictly correct — we publish
   * D101 and D102 and no D103 — and completely useless: the catalogue has six deadbolts
   * whose model numbers differ from what they typed by one character, and the dialog
   * showed none of them.
   *
   * So on an empty result set, retry on the leading run of letters-and-digits with the
   * last character dropped, repeatedly, until something matches or the stem gets too
   * short to mean anything. "D103" -> "D10" finds D101 and D102; "LC8531" -> "LC853"
   * finds the LC85 series. Three characters is the floor, below which a stem matches half
   * the catalogue and the suggestions stop being suggestions.
   */
  const nearMatches = useMemo(() => {
    if (!index || results.length) return [];
    const raw = query.trim().toLowerCase();
    if (!/^[a-z]*\d/.test(raw.replace(/[\s-]/g, ""))) return [];

    let stem = raw.replace(/[\s-]/g, "");
    while (stem.length > 3) {
      stem = stem.slice(0, -1);
      const hits = index
        .map((entry) => ({ entry, s: score(entry, [stem]) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 6)
        .map((r) => r.entry);
      if (hits.length) return hits;
    }
    return [];
  }, [index, query, results.length]);

  /**
   * Every category the term matches, computed over the WHOLE index rather than the
   * capped result list.
   *
   * This is the "which family?" answer. Typing "d" matches 464 entries; the twenty-four
   * that fit on screen are all products, because a product scores its model AND its
   * title while a category scores only its title. So the ranges themselves — the thing
   * the reader is most likely to want from a one-letter query — were ranked off the
   * bottom of their own result list. Pulled out and shown as chips above the results,
   * they turn a wall of SKUs into a choice between Deadbolts, Door Closers and Door
   * Stoppers.
   */
  const matchedCategories = useMemo(
    () => (index ? matchRanges(index, queryTerms(query)) : []),
    [index, query],
  );

  /**
   * Categories to offer when the term matches nothing — the "explore the categories"
   * answer rather than a dead end.
   *
   * Same shortening as above but restricted to category entries, so a misspelling that
   * is close to a range name still lands on the range. Three characters is the floor
   * again: below that a stem matches whatever happens to contain the letter.
   */
  const nearCategories = useMemo(
    () => (index && !results.length ? suggestRanges(index, query) : []),
    [index, query, results.length],
  );

  /**
   * WHERE ENTER GOES — and, more importantly, when it refuses to pick a product.
   *
   * The first version opened `results[0]` unconditionally. Typing a single "d" matched
   * 464 entries and Enter opened D101 AB: out of four hundred candidates it committed to
   * one SKU, on the strength of a one-character query. That is not a search result, it is
   * a guess wearing the costume of one, and the buyer who lands on a random deadbolt
   * concludes the catalogue is tiny.
   *
   * So Enter only opens a product when the query IDENTIFIES a product — the typed string
   * is a model number, or exactly one thing matched. Otherwise it BROADENS: to the
   * category that matched by name, or, when the only things we can offer are products,
   * to the range they all sit in. "D103" does not exist, but all six near misses are
   * deadbolts, so Enter goes to the deadbolt range rather than to whichever variant
   * happened to sort first.
   *
   * When even that is not determinable, Enter does nothing and the standing category
   * menu below stays on screen. Going nowhere is a better answer than going somewhere
   * arbitrary.
   */
  const enterTarget = useMemo((): { entry: IndexEntry; broad: boolean } | null => {
    if (!index) return null;
    const typed = normaliseModel(query.trim());
    if (!typed) return null;

    // 1. The query names a model.
    const exact = results.find((e) => e.model && normaliseModel(e.model) === typed);
    if (exact) return { entry: exact, broad: false };

    // 2. One thing matched, so there is nothing to be ambiguous about.
    if (results.length === 1) return { entry: results[0], broad: false };

    /*
      3. Exactly ONE range matches the name. "deadbolt" is unambiguous, so Enter opens
         the deadbolt range. "d" matches Deadbolts, Door Closers and Door Stoppers — three
         families, no single answer — so Enter must not pick one; those are offered as
         chips above the results instead, and the reader chooses.
    */
    const named = matchedCategories.length ? matchedCategories : nearCategories;
    if (named.length === 1) return { entry: named[0], broad: true };

    /*
      4. No range matched by name, but everything we can offer sits in one. "D103" does
         not exist and matches no category, yet all six near misses are deadbolts — so
         the range is the honest answer, not whichever variant happened to sort first.
    */
    const pool = results.length ? results : nearMatches;
    if (pool.length) {
      const hrefs = new Set(pool.map((e) => categoryHrefOf(e.href)).filter(Boolean));
      if (hrefs.size === 1) {
        const [href] = [...hrefs];
        const found = index.find((e) => e.type === "category" && e.href === href);
        if (found) return { entry: found, broad: true };
      }
    }

    return null;
  }, [index, query, results, nearMatches, nearCategories, matchedCategories]);

  const totalMatches = useMemo(() => {
    if (!index) return 0;
    const terms = queryTerms(query);
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

      {/*
        The panel scrolls, the page behind it does not (body overflow is locked while the
        dialog is open). Before the suggestions existed the panel was always short enough
        to fit; now it is not, and on a 812px phone everything below the second suggested
        model was simply unreachable — no scroll container, no way down.

        4vh on a phone rather than 12vh for the same reason: vertical room is the scarce
        thing there, and the panel is the only thing on screen.
      */}
      <div className="relative mt-[4vh] w-full max-w-[720px] px-16 sm:mt-[12vh] sm:px-24">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-heading"
          className="hard-shadow-panel max-h-[92vh] overflow-y-auto bg-surface p-24 sm:max-h-[76vh] sm:p-32"
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
            ENTER OPENS THE TOP RESULT.

            Submit used to preventDefault and then do nothing unless exactly one result
            was showing, which from the visitor's side was indistinguishable from a broken
            box: they typed a model, pressed Enter, and the page did not move. Every
            search field they have ever used goes somewhere on Enter.

            There is no /search?q= page to send them to — the index is client-side and the
            site is a static export — so the destination is the best match we already
            computed. Failing that, the closest model; failing that, nothing, because
            navigating somewhere arbitrary is worse than staying put.
          */}
          <form
            className="mt-32"
            onSubmit={(event) => {
              event.preventDefault();
              if (!enterTarget) return;
              close();
              router.push(enterTarget.entry.href);
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
                placeholder={t.placeholder}
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

          {/* One scroll container, not two. The panel above scrolls now, and a nested
              46vh box inside it meant a drag near the results either moved the wrong list
              or hit the end of the inner one and stopped. */}
          <div aria-live="polite" className="mt-24">
            {loading ? <p className="text-c2 text-ink-secondary">{t.loading}</p> : null}

            {!loading && query.trim() && !results.length ? (
              <>
                {/*
                  Three answers to "nothing matched", in descending order of usefulness:
                  the models whose numbers are one character away, the ranges whose names
                  are close, and — when neither exists, which is the "LV on a lock site"
                  case — a sentence naming what was typed and pointing at the standing
                  category menu below. What must never happen again is the bare
                  "No results" that sent the reader looking for a bug in the box.
                */}
                {nearMatches.length ? (
                  <>
                    <p className="text-c2 text-ink-secondary">{t.emptyNear}</p>
                    <ul className="mt-16 divide-y divide-line border-y border-line">
                      {nearMatches.map((entry) => (
                        <li key={entry.href}>
                          <Link href={entry.href} onClick={close} className="drawer-link">
                            <span>
                              {entry.subtitle ? `${entry.subtitle} — ` : ""}
                              {entry.title}
                            </span>
                            <span aria-hidden="true" className="drawer-chevron">
                              ›
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-c2 text-ink-secondary">{t.empty(query.trim())}</p>
                )}

                {/*
                  The range Enter would open, as something clickable. A keyboard hint is
                  no use to a thumb, and this is the one screen where the reader has
                  nothing else to click: the near misses are variants they did not ask
                  for, and the standing menu below does not contain the range their
                  model number belongs to.
                */}
                {enterTarget?.broad ? (
                  <Link
                    href={enterTarget.entry.href}
                    onClick={close}
                    className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
                  >
                    {t.seeRange(enterTarget.entry.title)}
                  </Link>
                ) : null}

                {/*
                  Minus whatever the link above already offers. On "lv" the suggestion,
                  the link and the standing menu all said Lever Handles — the same
                  destination three times in one screen, which reads as padding rather
                  than as help.
                */}
                {nearCategories.filter((e) => e.href !== enterTarget?.entry.href).length ? (
                  <>
                    <p className="mt-24 text-c2 text-ink-secondary">{t.emptyCategories}</p>
                    <ul className="mt-16 flex flex-wrap gap-8">
                      {nearCategories
                        .filter((e) => e.href !== enterTarget?.entry.href)
                        .map((entry) => (
                        <li key={entry.href}>
                          <Link href={entry.href} onClick={close} className="search-chip">
                            {entry.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </>
            ) : null}

            {/*
              The families first, the individual models after. A buyer who types "d" or
              "lever" is almost never asking for one SKU; they are asking which ranges we
              make. Answering that with twenty-four product rows and no visible range is
              how the box came to look like it had guessed.
            */}
            {results.length && matchedCategories.length > 1 ? (
              <div className="mb-24">
                <p className="drawer-eyebrow">{t.matchedRanges}</p>
                <ul className="mt-8 flex flex-wrap gap-8">
                  {matchedCategories.map((entry) => (
                    <li key={entry.href}>
                      <Link href={entry.href} onClick={close} className="search-chip">
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {results.length ? (
              <>
                <p className="text-c2 text-ink-secondary">
                  {totalMatches}
                  {totalMatches > MAX_RESULTS ? ` (showing ${MAX_RESULTS})` : ""}
                  {/* The hint says where Enter actually goes, because where it goes
                      depends on how specific the query was. */}
                  {enterTarget ? (
                    <span className="ml-8 text-ink-tertiary">
                      ·{" "}
                      {enterTarget.broad
                        ? t.enterBroad(enterTarget.entry.title)
                        : t.enterExact}
                    </span>
                  ) : null}
                </p>
                <ul className="mt-16 divide-y divide-line border-t border-line">
                  {results.map((entry) => (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        onClick={close}
                        className={cn(
                          "group short-marker-surface flex items-baseline justify-between gap-16 py-12",
                          "hover:bg-surface-alt",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="short-marker short-marker-group inline-block max-w-full text-c1 text-ink">
                            <span className="block truncate">{entry.title}</span>
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

          {/*
            Before anyone types. An empty box asked the visitor to already know a model
            number or a category name — most arrivals know neither, they know "the push
            bar for a fire door". Also shown when a query returns nothing, because that is
            exactly the moment a visitor needs somewhere else to go.

            IT RENDERS AFTER THE RESULTS, NOT BEFORE. When it was first, a query that
            found nothing pushed the near-miss suggestions below six category chips and
            six popular models — off the bottom of a phone screen. The visitor who typed
            D103 saw "MAIN CATEGORIES" and concluded the box was broken, which is the
            correct conclusion to draw from what was visible. The answer to what you typed
            belongs above the standing menu.

            Rendered outside the aria-live region: it is standing content, not a response
            to what was typed, and announcing it on open would talk over the input label.
          */}
          {!query.trim() || (!loading && !results.length) ? (
            <div className="mt-32 border-t border-line pt-24">
              <p className="drawer-eyebrow">{t.browse}</p>
              <ul className="mt-16 flex flex-wrap gap-8">
                {suggestedCategories.map((suggestion) => (
                  <li key={suggestion.href}>
                    <Link
                      href={suggestionHref(suggestion, locale)}
                      onClick={close}
                      className="search-chip"
                    >
                      {suggestionLabel(suggestion, locale)}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="drawer-eyebrow mt-32">{t.popular}</p>
              <ul className="mt-8 divide-y divide-line border-t border-line">
                {suggestedProducts.map((suggestion) => (
                  <li key={suggestion.href}>
                    <Link
                      href={suggestionHref(suggestion, locale)}
                      onClick={close}
                      className="drawer-link"
                    >
                      <span>{suggestionLabel(suggestion, locale)}</span>
                      <span aria-hidden="true" className="drawer-chevron">
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
