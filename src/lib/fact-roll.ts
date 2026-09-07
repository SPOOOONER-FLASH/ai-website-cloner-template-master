/**
 * The count-up arithmetic for the homepage figures strip.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS ITS OWN MODULE
 *
 * Two reasons, and the second is the one that forced it.
 *
 * It depends on nothing. The roll needs a target number and a millisecond count; it does
 * not need the catalogue, the categories or the company record. Keeping it apart from
 * `site-facts.ts` says so, and lets anything with a number roll it later.
 *
 * And `site-facts.ts` cannot be loaded by the test runner. It imports the product and
 * category data, which reaches `content/categories.json` through an import that Node
 * rejects without a `type: "json"` attribute. So a test that imported the roll from there
 * failed before reaching a single assertion — and this is precisely the code that most
 * needs testing, because it is the only part of that strip a built-HTML check can never
 * see. The export always holds the true value (see SiteFacts.tsx); every intermediate
 * frame exists only in a browser.
 */

/** Ease-out cubic — fast first, settling at the end, so the last digits stay readable. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** How long one figure takes to reach its value. */
export const ROLL_MS = 900;

/** Each figure starts this much after the one to its left. */
export const STAGGER_MS = 70;

/** The only thing the roll needs to know about a fact. */
export interface Rollable {
  /**
   * The number to arrive at, or undefined for "do not roll".
   *
   * Undefined is the safe default and it is load-bearing: on the real strip it is what
   * keeps 1998 (a year), "ISO 9001" (not a number) and "101–200" (a range) from counting
   * up from nothing. See the `countTo` comment in site-facts.ts.
   */
  countTo?: number;
}

/**
 * The displayed numbers `elapsed` milliseconds into the roll, and whether it has ended.
 *
 * Facts without `countTo` are absent from the result rather than present at their final
 * value — the component renders their real string when an index is missing, so a range
 * or a year is never rewritten as a number.
 */
export function rollFrame(
  facts: readonly Rollable[],
  elapsed: number,
): { values: Record<number, number>; done: boolean } {
  const values: Record<number, number> = {};
  let done = true;

  facts.forEach((fact, index) => {
    if (fact.countTo === undefined) return;
    const progress = Math.min(1, Math.max(0, (elapsed - index * STAGGER_MS) / ROLL_MS));
    if (progress < 1) done = false;
    values[index] = Math.round(ease(progress) * fact.countTo);
  });

  return { values, done };
}
