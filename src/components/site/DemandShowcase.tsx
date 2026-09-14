import type { Locale } from "@/data/site";
import { demandShowcaseProducts, demandShowcaseText } from "@/data/demand-showcase";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./ArrowLink";
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
  const contactHref = locale === "es" ? "/es/contact/" : "/contact/";

  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="demand-showcase-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-4 xl:col-span-7">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
            {text.eyebrow}
          </p>
          <h2 id="demand-showcase-heading" className="mt-8 text-h2 text-ink">
            {text.title}
          </h2>
        </div>
        <div className="col-span-full mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0 xl:col-span-14 xl:col-start-10">
          <p className="text-c1 text-ink-secondary">{text.body}</p>
        </div>

        <div
          className={cn(
            "horizontal-snap col-span-full mt-32 flex snap-x snap-mandatory gap-16",
            "overflow-x-auto overscroll-x-contain",
            "sm:grid sm:grid-cols-2 sm:gap-24 sm:overflow-visible lg:grid-cols-4",
          )}
        >
          {items.map((product, index) => (
            <ProductCard
              key={product.model}
              product={product}
              locale={locale}
              /* First row only — the rest are below the fold on every breakpoint. */
              priority={index < 2}
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
