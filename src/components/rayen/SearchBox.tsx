"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { LOCALE_PUBLIC_PREFIX, LOCALE_SEGMENT, type RayenLocale } from "@/data/rayen-i18n";
import { queryTerms, score, type SearchIndexEntry } from "@/lib/search-matching";

/**
 * Search for the RAYEN 雷茵 site.
 *
 * WHAT IT BORROWS FROM THE HYDE SIDE, AND WHAT IT DOES NOT
 * The scoring is HYDE's, imported from src/lib/search-matching.ts rather than copied. Every
 * rule in there exists because somebody typed something into the cantonlock box and told us
 * what went wrong, and src/lib/search-matching.test.ts pins them; a second copy would drift
 * away from those tests within a month.
 *
 * The index is NOT shared. HYDE's has 573 entries and none of the 196 models RAYEN sells on
 * its own; serving it here would offer a buyer products this company does not make, at URLs
 * that do not exist on this host. RAYEN gets its own file per language, built by the same
 * script — see the RAYEN section of scripts/build-search-index.mjs.
 *
 * The chrome is lighter than HYDE's dialog on purpose. A visitor here is looking up a model
 * number off a drawing or a quotation, so what earns its place is: type, see the match, press
 * Enter. No recent searches, no suggestion tiles, no filters.
 *
 * WHY THE QUERY IS FINE IN CHINESE WITHOUT A SEGMENTER
 * queryTerms() splits on whitespace, which does nothing to 「玻璃门拉手」 — it stays one term.
 * That is the right behaviour here rather than a limitation: terms of three characters or
 * more are matched as substrings, and for Chinese a substring IS the word boundary. 「拉手」 is
 * two characters and falls to startsWord(), which asks only that the preceding character is
 * not a latin letter or digit — always true mid-Chinese. So both shapes match, and nobody has
 * to ship a 200KB dictionary to the browser to find 拉手.
 */

const MAX_RESULTS = 20;

const COPY: Record<RayenLocale, {
  open: string;
  placeholder: string;
  empty: string;
  hint: string;
  close: string;
  counted: (n: number) => string;
}> = {
  zh: {
    open: "搜索型号或产品",
    placeholder: "输入型号或产品名，如 T1050、玻璃门拉手",
    empty: "没有找到相关型号。试试只输入型号的前几位，或者换成产品名。",
    hint: "↑↓ 选择 · Enter 打开 · Esc 关闭",
    close: "关闭搜索",
    counted: (n) => `${n} 条结果`,
  },
  en: {
    open: "Search models or products",
    placeholder: "Model number or product name, e.g. T1050, glass door handle",
    empty: "No match. Try the first few characters of the model number, or a product name.",
    hint: "↑↓ to move · Enter to open · Esc to close",
    close: "Close search",
    counted: (n) => `${n} result${n === 1 ? "" : "s"}`,
  },
};

/**
 * Turn an index path into a URL that works from wherever this page is actually being served.
 *
 * The index stores bare paths. Inside the Next app the RAYEN site lives under /zh/ and
 * /zh-en/; on the deployed host build-rayen-site.mjs has lifted those to / and /en/ and
 * rewritten the prefix out of the HTML — but not out of the JavaScript, which is copied
 * afterwards. A prefix baked in at build time would therefore be wrong in one of the two
 * places, and the one it would be wrong in is whichever we happened not to test.
 *
 * Reading it off location.pathname costs nothing and is right in both.
 */
function useHrefPrefix(locale: RayenLocale): string {
  /*
    useSyncExternalStore rather than an effect that calls setState: the pathname cannot change
    under us without a full navigation, so there is nothing to subscribe to, and reading it
    this way gives the server a defined snapshot ("" — the deployed shape) instead of
    rendering once with the wrong prefix and then re-rendering.
  */
  const pathname = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => "",
  );
  return useMemo(() => {
    const segment = LOCALE_SEGMENT[locale];
    const inNextApp = pathname === segment || pathname.startsWith(`${segment}/`);
    return inNextApp ? segment : LOCALE_PUBLIC_PREFIX[locale];
  }, [pathname, locale]);
}

export function SearchBox({ locale }: { locale: RayenLocale }) {
  const copy = COPY[locale];
  const prefix = useHrefPrefix(locale);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  /*
    The highlighted row is stored WITH the query it belongs to, so that typing resets it
    without an effect. `useEffect(() => setActive(0), [query])` renders the old highlight
    against the new results for one frame, which is visible as a flicker on the wrong row —
    and is the kind of state-in-effect that the lint rule is pointing at.
  */
  const [highlight, setHighlight] = useState({ query: "", index: 0 });
  const listRef = useRef<HTMLUListElement>(null);

  /* Fetched on first open, not at page load: most visitors never search, and the index is
     larger than the rest of the page put together. */
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    fetch(`/search-index-rayen-${locale}.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setIndex(data as SearchIndexEntry[]);
      })
      .catch(() => {
        if (!cancelled) setIndex([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index, locale]);

  /* Closing clears the box here rather than in an effect watching `open`. */
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlight({ query: "", index: 0 });
  }, []);

  /* Cmd/Ctrl-K from anywhere, Esc to leave. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const results = useMemo(() => {
    const terms = queryTerms(query);
    if (!terms.length || !index) return [];
    return index
      .map((item) => ({ item, points: score(item, terms) }))
      .filter((row) => row.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, MAX_RESULTS)
      .map((row) => row.item);
  }, [query, index]);

  /* Derived, not stored: a highlight recorded against an older query means "row 0". */
  const active = highlight.query === query ? highlight.index : 0;
  const setActive = useCallback(
    (next: number) => setHighlight({ query, index: next }),
    [query],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(active + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(active - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      /*
        A full navigation, NOT router.push().

        eslint's no-location-assign-relative-destination says to use the Next router for an
        internal page, and on an ordinary Next site it would be right. This site is not one:
        scripts/build-rayen-site.mjs lifts the pages out of /zh/ and /zh-en/ to / and /en/
        AFTER the build, so the client router's route table still describes the old paths and
        router.push("/products/…") matches nothing. It fails silently — no error, no
        navigation, the dialog just sits there. Found by pressing Enter on the built site;
        clicking a result always worked, because that is a plain anchor.
      */
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`${prefix}${results[active].href}`);
    }
  };

  /* Keep the highlighted row in view when the arrows walk past the fold. */
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={copy.open}
        className="flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-[13px] text-[var(--color-ink-3)] transition-colors hover:border-[var(--color-ink-3)] hover:text-[var(--color-ink)] md:px-4"
      >
        <SearchIcon />
        <span className="hidden lg:inline">{copy.open}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={copy.open}
            className="w-full max-w-[640px] overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-4">
              <SearchIcon />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder={copy.placeholder}
                className="h-14 flex-grow bg-transparent text-[15px] outline-none placeholder:text-[var(--color-ink-3)]"
              />
              <button
                type="button"
                onClick={close}
                aria-label={copy.close}
                className="shrink-0 p-2 text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
              >
                ✕
              </button>
            </div>

            {query ? (
              results.length ? (
                <>
                  <ul ref={listRef} className="max-h-[52vh] overflow-y-auto">
                    {results.map((entry, i) => (
                      <li key={entry.href}>
                        <a
                          href={`${prefix}${entry.href}`}
                          onMouseEnter={() => setActive(i)}
                          className={`flex flex-col gap-0.5 px-4 py-3 ${
                            i === active ? "bg-[var(--color-surface-alt)]" : ""
                          }`}
                        >
                          <span className="text-[14px] text-[var(--color-ink)]">{entry.title}</span>
                          <span className="latin text-[12px] text-[var(--color-ink-3)]">
                            {entry.subtitle}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-[var(--color-line)] px-4 py-2 text-[12px] text-[var(--color-ink-3)]">
                    {copy.counted(results.length)} · {copy.hint}
                  </p>
                </>
              ) : (
                <p className="px-4 py-8 text-[14px] text-[var(--color-ink-2)]">{copy.empty}</p>
              )
            ) : (
              <p className="px-4 py-8 text-[13px] text-[var(--color-ink-3)]">{copy.hint}</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
