import Link from "next/link";
import type { Locale } from "@/data/site";
import {
  featureColumns,
  featureColumnsCta,
  featureColumnsHeading,
  featureColumnsLede,
} from "@/data/feature-columns";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { localised } from "@/lib/localised";

/**
 * A rail of columns, sitting directly under the flagship pair.
 *
 * The section above says what we tooled. This one says what we can explain, because the
 * two questions are different and only one of them is answered by a product page. A
 * specifier does not arrive looking for "DC02"; they arrive with a pair of fire doors.
 *
 * ---------------------------------------------------------------------------
 * THE TRACK IS THE SAME IDIOM AS THE AR-4 SHOWCASE, DELIBERATELY
 *
 * Native scroll-snap, no JavaScript, no arrows. A third component inventing its own
 * carousel would cost bundle weight on the page that was cut from 2,241 KB to 669 KB and
 * would teach the reader a second gesture for the same thing. Cards sit at 82% on a phone
 * so the next one is visibly cut off at the right edge — that clipped edge is what tells
 * a thumb to swipe, which is why it is not 100%. From `sm` the track becomes a grid and
 * nothing scrolls.
 *
 * Every figure on a card is counted from the catalogue at build time; see
 * src/data/feature-columns.ts. A card whose count cannot be derived shows no figure
 * rather than a rounded one.
 */
export function FeatureColumns({ locale = "en" }: { locale?: Locale }) {
  const columns = featureColumns();
  if (!columns.length) return null;

  return (
    <section className="layout mt-64 lg:mt-96" aria-labelledby="feature-columns-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-4 xl:col-span-7">
          <h2 id="feature-columns-heading" className="text-h2 text-ink">
            {featureColumnsHeading(locale)}
          </h2>
          <p className="mt-16 text-c1 text-ink-secondary">{featureColumnsLede(locale)}</p>
        </div>

        <div
          className={cn(
            "horizontal-snap col-span-full mt-32 flex snap-x snap-mandatory gap-16",
            "overflow-x-auto overscroll-x-contain",
            "sm:grid sm:grid-cols-2 sm:gap-24 sm:overflow-visible lg:grid-cols-3",
          )}
        >
          {columns.map((column) => (
            <Link
              key={column.id}
              href={localised(column.href, locale)}
              className="hard-shadow-card short-marker-surface group flex w-[82%] min-w-[82%] flex-none snap-start flex-col bg-surface sm:w-auto sm:min-w-0"
            >
              <MediaPlaceholder
                src={column.image.src}
                ratio="3 / 2"
                label={locale === "es" ? column.image.labelEs : column.image.label}
                sizes="(min-width: 1440px) 620px, (min-width: 744px) 46vw, 82vw"
              />
              <div className="flex flex-1 flex-col border-t border-line p-24">
                <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
                  {localised(column.eyebrow, locale)}
                </p>
                <h3 className="title-marker mt-12 text-h3 text-ink">{localised(column.title, locale)}</h3>
                <p className="mt-16 text-c1 text-ink-secondary">{localised(column.body, locale)}</p>
                {/*
                  The take-away file, under the reading rather than above it. A form
                  offered before the explanation reads as a lead-capture form; offered
                  after it, it is the next step the article just described.
                  Directly under the body since 2026-09-24: below the call to action it
                  pushed that one card's arrow upwards, and the row stopped lining up.
                */}
                {column.extra ? (
                  <p className="mt-12 text-c2 text-ink-secondary">{localised(column.extra, locale)}</p>
                ) : null}
                {/*
                  Figure and call to action travel together at the foot of the card, so the
                  figure rule and the arrow sit on the same lines in every card of the row,
                  whatever the length of the copy above them.
                */}
                <div className="mt-auto pt-24">
                  {/*
                    The counted fact sits on the border above the call to action, where a
                    spec table would put it — a number is the reason to read the column, not
                    decoration on top of it.
                  */}
                  {column.figure ? (
                    <p className="border-t border-line pb-24 pt-16 text-c2 tabular-nums text-ink">
                      {localised(column.figure, locale)}
                    </p>
                  ) : null}
                  <p>
                    {/* The entire card is one link. A second anchor here caused invalid
                        nesting and a hydration mismatch on every homepage load. */}
                    <span className="short-marker-group short-marker-arrow relative inline-block pl-12 text-c1 text-brand py-10 sm:py-0">
                      <ArrowRightIcon className="absolute left-0 top-[.3rem] h-auto w-8" aria-hidden="true" />
                      <span>{featureColumnsCta(locale)}</span>
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
