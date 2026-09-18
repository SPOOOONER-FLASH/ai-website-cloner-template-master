import { collectionSpecRanges, specRangeHeading, statedOn } from "@/lib/collection-spec-range";
import type { Locale } from "@/data/site";
import type { Product } from "@/data/types";

/**
 * What a set of products spans, as stated figures.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A COMPONENT AND NOT A SECOND COPY OF THE COLLECTION BLOCK
 *
 * The block existed inline on the three collection pages, because that is where the
 * problem was first measured: collections scored 38 on `npm run seo:citability` against
 * 68 for the comparison tables, and the difference was that one printed numbers and the
 * other printed names.
 *
 * The 2026-09-18 AI citation export then showed the comparison pages have the same defect
 * one level down. `/compare/lock-cylinders/` scores **30 — zero concrete facts in seven
 * sentences** — and it is the page type an answer engine should like most: a reader asking
 * "what backsets do their lock cases come in" is asking exactly what a comparison page is
 * for. The table under it holds every figure, and a table is not a sentence: what the page
 * SAYS, in prose an engine can lift, is "the specifications that differ between the 45
 * models in this range, in one table" — which states nothing.
 *
 * So the same block goes on both, and it goes in one file rather than six.
 *
 * ---------------------------------------------------------------------------
 * NOTHING HERE IS WRITTEN, ALL OF IT IS COUNTED
 *
 * `collectionSpecRanges` derives every line from the records: a range appears only when at
 * least three products state that field, and the count of how many state it is printed
 * beside it. A field stated inconsistently across a family comes out wide, which is true,
 * rather than tidy. See that module's own header for the rules.
 */
export function SpecRangeList({
  products,
  locale = "en",
  headingId = "spec-range-heading",
  className = "layout mt-64 lg:mt-96",
}: {
  products: Product[];
  locale?: Locale;
  headingId?: string;
  className?: string;
}) {
  const ranges = collectionSpecRanges(products, locale);
  if (!ranges.length) return null;

  return (
    <section className={className} aria-labelledby={headingId}>
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full">
          <h2 id={headingId} className="drawer-eyebrow">
            {specRangeHeading(locale)}
          </h2>
          <dl className="mt-16 border-t border-ink pt-16">
            {ranges.map((range) => (
              <div
                key={range.label}
                className="grid grid-cols-1 gap-4 border-b border-line py-12 sm:grid-cols-[14rem_1fr_auto] sm:gap-24"
              >
                <dt className="text-c2 text-ink-secondary">{range.label}</dt>
                <dd className="text-c1 tabular-nums text-ink">{range.value}</dd>
                <dd className="text-c2 text-ink-tertiary">
                  {statedOn(range.stated, products.length, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
