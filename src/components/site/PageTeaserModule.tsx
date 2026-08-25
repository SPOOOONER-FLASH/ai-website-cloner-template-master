import Link from "next/link";
import { MediaPlaceholder } from "./MediaPlaceholder";
import type { PageTeaserContent, TeaserCardContent } from "@/types/fsb-modules";

/**
 * `data-content-module="page-teaser"` — 3 instances.
 *
 * A native CSS scroll-snap track on the outset band. No JS, no autoplay, no arrows.
 * Under `@media (pointer: fine)` the track wraps and cards drop to half-width, so on a
 * mouse device the two cards simply sit side by side at 680px and nothing scrolls.
 *
 * COLOUR:
 *   Heading        --color-ink.
 *   Card title     --color-ink; card subtitle --color-ink-secondary (the text ladder).
 *   Hover outline  --color-brand — a hover affordance on a link (rule 1).
 *   The card has no shadow and no radius; separation comes from whitespace (rules 3–4).
 */
export function PageTeaserModule({ content }: { content: PageTeaserContent }) {
  return (
    <div className="layout" data-content-module="page-teaser">
      {content.heading ? (
        <h2 className="col-content mb-24 text-h3 text-ink md:mb-48">{content.heading}</h2>
      ) : null}

      <div className="col-outset">
        <div className="horizontal-snap flex snap-x snap-mandatory gap-16 overflow-auto overscroll-x-contain px-outset scroll-px-outset pointer-fine:flex-wrap">
          {content.cards.map((card) => (
            <TeaserCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeaserCard({ media, title, subtitle, href = "#" }: TeaserCardContent) {
  return (
    // Fractional track widths use arbitrary values rather than hand-written classes:
    // a variant like `pointer-fine:` only applies to a Tailwind-generated utility.
    // 3/4 width by default, 1/2 (= 680px at the 1376px track) on mouse devices.
    <Link
      href={href}
      className="w-[calc(100%*3/4-1/4*var(--grid-gap))] min-w-[calc(100%*3/4-1/4*var(--grid-gap))] snap-start -outline-offset-1 pointer-fine:w-[calc(100%*1/2-1/2*var(--grid-gap))] pointer-fine:min-w-[calc(100%*1/2-1/2*var(--grid-gap))] hover-hover:hover:outline hover-hover:hover:outline-1 hover-hover:hover:outline-ink"
    >
      <MediaPlaceholder
        {...media}
        className="aspect-square"
        sizes="(min-width: 1440px) 680px, (min-width: 744px) 48vw, 75vw"
      />
      {/* `hover-hover:` here is a device-capability query, not a hover state. */}
      <p className="pt-16 text-c1 hover-hover:p-16 md:pt-24 md:hover-hover:p-24">
        <strong className="text-ink">{title}</strong>
        <br />
        <span className="line-clamp-3 text-ink-secondary">{subtitle}</span>
      </p>
    </Link>
  );
}
