/**
 * The matching and ranking rules behind the site search dialog.
 *
 * Extracted from the dialog so they can be tested. Every rule here was written in
 * response to a specific complaint from the client or a colleague, and each one is easy
 * to undo by accident while tuning something else — a silent regression in this file
 * looks like "search is a bit worse" rather than like a broken build, which is exactly
 * the kind of thing that survives to production. `src/lib/search-matching.test.ts` holds
 * the cases.
 */

export interface SearchIndexEntry {
  type: "product" | "category" | "project" | "news" | "download" | "page";
  title: string;
  subtitle: string;
  href: string;
  /** Pre-lowercased haystack. */
  text: string;
  /** Products only, pre-lowercased. Absent when the model is still provisional. */
  model?: string;
}

/**
 * Below this length a term has to begin a word; at or above it, a plain substring counts.
 *
 * "lv" returned nine products and every one of them was the middle of the word SILVER.
 * That is the failure a shopper reads as "your search is broken": they typed a brand we
 * do not carry and got a page of unrelated locks, which is worse than an honest empty
 * state because it looks like an answer. Two characters land inside ordinary English
 * words constantly — lv, ss, ab, in, on — so at that length the match has to mean
 * something.
 *
 * Three is the cut-off rather than four because "bolt" and "cam" must keep matching
 * mid-word ("deadbolts", "camlock"), and a three-letter run inside an unrelated word is
 * rare enough not to fill a screen.
 */
export const SUBSTRING_MIN_LENGTH = 3;

/** Model numbers are compared without spaces or hyphens: "D101 AB" === "d101-ab". */
export const normaliseModel = (s: string) => s.toLowerCase().replace(/[\s-]/g, "");

/**
 * Splits a raw query into lowercase terms.
 *
 * It lives here rather than being written out at each call site because it was inlined
 * three times and one copy lost the backslash from `\s` while being edited through a
 * shell — `split(/s+/)` splits on the letter S, which quietly turns "stainless" into two
 * terms that match nothing. One definition, imported everywhere, cannot drift.
 */
export const queryTerms = (q: string) =>
  q.toLowerCase().trim().split(/\s+/).filter(Boolean);

/** Does `term` start a word in `haystack`? Digits count as word characters. */
export function startsWord(haystack: string, term: string): boolean {
  let i = haystack.indexOf(term);
  while (i !== -1) {
    if (i === 0 || !/[a-z0-9]/.test(haystack[i - 1])) return true;
    i = haystack.indexOf(term, i + 1);
  }
  return false;
}

/** True when `term`'s characters appear in `s` in order — "lv" is inside "lever". */
export function isSubsequence(term: string, s: string): boolean {
  let i = 0;
  for (const ch of s) {
    if (ch === term[i]) i += 1;
    if (i === term.length) return true;
  }
  return i === term.length;
}

/** `/products/deadbolts/d101-ab-deadbolts/` -> `/products/deadbolts/`. */
export function categoryHrefOf(href: string): string | null {
  const match = /^(\/es)?\/products\/([a-z0-9-]+)\/[^/]+\/$/.exec(href);
  return match ? `${match[1] ?? ""}/products/${match[2]}/` : null;
}

/**
 * Scores one entry against already-lowercased query terms. Zero means "not a match".
 *
 * Every term must be present, so "stainless lever" does not return all 214 stainless
 * products. Beyond that the ranking is deliberately crude — a title match outranks a body
 * match and an exact model match outranks everything, which covers the two ways people
 * search a hardware catalogue: by name, or by model number.
 */
export function score(entry: SearchIndexEntry, terms: string[]): number {
  const title = entry.title.toLowerCase();

  let total = 0;
  for (const term of terms) {
    const present =
      term.length >= SUBSTRING_MIN_LENGTH
        ? entry.text.includes(term)
        : startsWord(entry.text, term);
    if (!present) return 0;

    /*
      The model boost scores against the model field alone, never the subtitle. The
      subtitle reads "305 · Hyland 300", so scoring the whole string treated "hyland" and
      "panic" as model hits and pushed every product above the category page that should
      have led the results.
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

/**
 * Ranges whose NAME the query matches, at the start of a word in it.
 *
 * Requiring the name is not enough on its own: "d" appears mid-word in Sliding Hook
 * Locks, Lock Cylinders and Stainless Steel Handles, which put eleven of fifteen ranges
 * on screen and told the reader nothing. Matching the body text is worse still — it
 * pulled in Grip Handle Sets, whose name contains no "d" at all. As a result row that is
 * merely weak; under a heading that says "matching ranges" it is a false statement about
 * the catalogue.
 */
export function matchRanges(
  index: SearchIndexEntry[],
  terms: string[],
): SearchIndexEntry[] {
  if (!terms.length) return [];
  return index
    .filter((e) => e.type === "category")
    .filter((e) => {
      const words = e.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      return terms.every((t) => words.some((w) => w.startsWith(t)));
    })
    .map((entry) => ({ entry, s: score(entry, terms) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title))
    .map((r) => r.entry);
}

/**
 * Ranges to offer when the query matched nothing at all.
 *
 * First by shortening the term, then — for a term that was never a prefix of anything —
 * by its letters in order. "lv" shortens to "l" and stops, but it IS how somebody
 * abbreviates "lever" while typing fast, and those letters do appear in "Lever Handles"
 * in that order. The subsequence pass is anchored on the first letter starting a word so
 * it stays a suggestion rather than a lottery, and it is allowed to return nothing: the
 * standing category menu sits underneath, and "no results for X" naming what they typed
 * is a real answer.
 */
export function suggestRanges(
  index: SearchIndexEntry[],
  rawQuery: string,
): SearchIndexEntry[] {
  const typed = normaliseModel(rawQuery.trim());
  const categories = index.filter((e) => e.type === "category");

  let stem = typed;
  while (stem.length >= SUBSTRING_MIN_LENGTH) {
    const hits = categories.filter((e) => e.text.includes(stem));
    if (hits.length) return hits.slice(0, 6);
    stem = stem.slice(0, -1);
  }

  if (typed.length >= 2 && typed.length <= 6) {
    const loose = categories.filter((e) => {
      const words = e.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      if (!words.some((w) => w.startsWith(typed[0]))) return false;
      return isSubsequence(typed, e.title.toLowerCase().replace(/[^a-z0-9]/g, ""));
    });
    if (loose.length) return loose.slice(0, 6);
  }

  return [];
}
