import { FactRoll } from "./FactRoll";
import type { SiteFact } from "@/lib/site-facts";

/**
 * The factory in figures — a row of counted facts, on the page that gets quoted.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS A STRIP AND NOT A PARAGRAPH
 *
 * The homepage carried one quotable figure. Everything else was prose, and prose is what
 * an answer engine has to paraphrase instead of cite. Numbers set apart from their labels
 * are the form that gets lifted whole into an answer, and they are also the form a
 * cautious buyer reads first — which is the same thing the client's principal asked for:
 * professional rather than decorated, because metal cannot be adjusted after it arrives.
 *
 * Deliberately NOT big-number tiles with borders and shadows. Rules and space do the
 * separating; a card around each figure would say "marketing block" and this is meant to
 * read as a specification. One hairline above, one below, nothing else.
 *
 * ---------------------------------------------------------------------------
 * THE ANIMATION, AND THE ONE RULE IT MUST NOT BREAK
 *
 * The true value is ALWAYS what the server renders. A strip that ships `0` in its HTML
 * and reaches 361 only after JavaScript runs would be a strip whose whole purpose —
 * being the quotable numbers on the most-quoted page — is destroyed by its own
 * decoration: an answer engine reading the static export would quote zero. So the count
 * is something that happens to a number already on screen, never a way of revealing it.
 *
 * Three consequences fall out of that:
 *
 *   · The roll only runs when the strip ENTERS the viewport from outside. If it is
 *     already on screen at mount, it just stands there at its real value — because
 *     restarting it from zero would be a visible 361 → 0 → 361 flicker, which is worse
 *     than no animation and briefly displays a false figure.
 *
 *   · Only the facts that carry `countTo` roll. See the field's comment in
 *     src/lib/site-facts.ts: 1998 is a year, ISO 9001 is not a number, and 101–200 is a
 *     range. Those three never count.
 *
 *   · NOTHING FADES OR SLIDES IN. There is no entrance animation, and that is a
 *     correction rather than a preference. The first version of this had the figures at
 *     `opacity-0` until an IntersectionObserver revealed them, and measuring it found
 *     opacity stuck at 0 with the strip fully scrolled into view — an observer does not
 *     deliver callbacks in a hidden document, and there are several other ways for it not
 *     to run. The failure mode of a reveal is INVISIBLE CONTENT, and the content here is
 *     the six numbers this site most wants quoted. A roll degrades to a static correct
 *     number; a reveal degrades to nothing at all. Only the first is acceptable on this
 *     strip, so the reveal is gone.
 *
 * `prefers-reduced-motion` skips the roll.
 *
 * ---------------------------------------------------------------------------
 * ROLLBACK
 *
 * Remove the one <SiteFacts /> line from the page. Nothing else references it, and the
 * figures are computed, so there is no orphaned copy left behind to go stale.
 */

/**
 * The figures arrive as a prop, and that is a performance decision rather than a style one.
 *
 * siteFacts() imports publishedProducts; when this was a client component that calling it
 * directly pulled the WHOLE CATALOGUE (a 1,548 KB chunk) into the homepage bundle. The
 * parent computes the figures on the server and passes them in.
 *
 * SERVER COMPONENT since 2026-09-28. The heading, labels and every figure are static HTML;
 * only a figure that carries `countTo` is wrapped in the small `FactRoll` island, which
 * animates the number already rendered here.
 */
export function SiteFacts({
  facts,
  heading,
}: {
  facts: SiteFact[];
  heading: string;
}) {
  if (!facts.length) return null;

  return (
    <section className="layout" aria-labelledby="site-facts-heading">
      {/*
        `col-content`, NOT `col-span-full`.

        `.layout > *` already places a child in the content column, but `col-span-full` is
        Tailwind for `grid-column: 1 / -1` and overrides it — which pushed this strip out
        to the full bleed and clipped the first and last figures at the viewport edges on
        the live homepage. Naming the column explicitly says which one is intended, and
        cannot be undone by a utility that happens to sort later.
      */}
      <div className="col-content">
        <h2 id="site-facts-heading" className="drawer-eyebrow">
          {heading}
        </h2>
        {/*
          A description list, because that is what it is: each figure is the value of a
          named property. Screen readers announce the pairing, and the markup says the
          same thing the layout does.
        */}
        <dl className="mt-24 grid grid-cols-2 gap-x-24 gap-y-40 border-t border-ink pt-32 sm:grid-cols-3 lg:grid-cols-6">
          {facts.map((fact, index) => (
            <div key={fact.label}>
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                {/*
                  `aria-live` is deliberately absent. A screen reader does not need to be
                  told a number six times on its way to its real value; it needs the real
                  value, which is what is in the DOM before and after the roll.
                */}
                <span className="block text-h2 tabular-nums text-ink">
                  {fact.countTo === undefined ? (
                    fact.value
                  ) : (
                    <FactRoll value={fact.value} countTo={fact.countTo} index={index} />
                  )}
                </span>
                <span className="mt-8 block max-w-[18ch] text-c2 text-ink-secondary">
                  {fact.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
