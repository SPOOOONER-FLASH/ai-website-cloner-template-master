import type { Locale } from "@/data/site";
import { siteFacts, siteFactsHeading } from "@/lib/site-facts";

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
 * ROLLBACK
 *
 * Remove the one <SiteFacts /> line from the page. Nothing else references it, and the
 * figures are computed, so there is no orphaned copy left behind to go stale.
 */
export function SiteFacts({ locale = "en" }: { locale?: Locale }) {
  const facts = siteFacts(locale);
  if (!facts.length) return null;

  return (
    <section className="layout" aria-labelledby="site-facts-heading">
      <div className="col-span-full">
        <h2 id="site-facts-heading" className="drawer-eyebrow">
          {siteFactsHeading(locale)}
        </h2>
        {/*
          A description list, because that is what it is: each figure is the value of a
          named property. Screen readers announce the pairing, and the markup says the
          same thing the layout does.
        */}
        <dl className="mt-24 grid grid-cols-2 gap-x-24 gap-y-40 border-t border-ink pt-32 sm:grid-cols-3 lg:grid-cols-6">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="block text-h2 tabular-nums text-ink">{fact.value}</span>
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
