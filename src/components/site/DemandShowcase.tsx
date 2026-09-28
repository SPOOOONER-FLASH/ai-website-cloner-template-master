import type { Locale } from "@/data/site";
import { demandShowcaseProducts, demandShowcaseText } from "@/data/demand-showcase";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./ArrowLink";
import { HomeSectionHeading } from "./HomeSectionHeading";
import { ProductCard } from "./ProductCard";

/**
 * A rail of the models buyers actually asked for, ranked by the client's own enquiry data.
 *
 * Same idiom as the AR-4 showcase and the columns rail: a native scroll-snap track, no
 * JavaScript and no arrows. A third carousel implementation on one page would cost bundle
 * weight on the page that was cut from 2,241 KB to 669 KB, and would teach the reader a
 * second gesture for the same thing.
 *
 * The cards are the ordinary catalogue card, so each one already carries its own printed
 * dimension (see src/lib/card-figure.ts). That matters more here than anywhere: a rail
 * that says "most requested" and shows nothing but names is a popularity claim, and a
 * popularity claim is the weakest argument on a site whose whole case is evidence.
 *
 * Ordering and selection live in src/data/demand-showcase.ts, including why the enquiry
 * counts themselves are deliberately not printed.
 */
export function DemandShowcase({ locale = "en" }: { locale?: Locale }) {
  const items = demandShowcaseProducts();
  if (items.length < 4) return null;
  const text = demandShowcaseText(locale);
  const contactHref = `${locale === "en" ? "" : `/${locale}`}/contact/`;

  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="demand-showcase-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <HomeSectionHeading
          id="demand-showcase-heading"
          eyebrow={text.eyebrow}
          title={text.title}
          lede={text.body}
        />

        <div
          className={cn(
            "horizontal-snap col-span-full mt-32 flex snap-x snap-mandatory gap-16",
            "overflow-x-auto overscroll-x-contain",
            "sm:grid sm:grid-cols-2 sm:gap-24 sm:overflow-visible lg:grid-cols-4",
          )}
        >
          {items.map((product) => (
            <ProductCard
              key={product.model}
              product={product}
              locale={locale}
              /*
                NOTHING HERE IS HIGH PRIORITY, and that changed on 2026-09-14.

                `priority={index < 2}` was right when this rail sat far down the page and
                its first row was the first product photograph a reader would reach. Then
                the client asked for the rail to lead, it moved up under the facts strip —
                and the two flags stayed.

                Measured on a 375×812 phone after the move: the hero image starts at
                y=171 and these two start at y=2651. Three and a half screens below the
                fold, marked `fetchpriority="high"`, and React hoists a `<link rel=preload>`
                for each one into the head. So every mobile visitor spent part of their
                first round trip fetching two photographs they would not see for three
                scrolls, in the same window as the image the LCP is measured on.

                MediaPlaceholder says it in its own comment: marking everything priority is
                the same as marking nothing. The hero is the LCP; this rail is not.
              */
              priority={false}
              shelf
              className="w-[74%] min-w-[74%] flex-none snap-start sm:w-auto sm:min-w-0"
            />
          ))}
        </div>

        <div className="col-span-full mt-8 flex justify-end">
          <ArrowLink href={contactHref}>{text.cta}</ArrowLink>
        </div>
      </div>
    </section>
  );
}
