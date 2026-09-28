import type { Locale } from "@/data/site";
import { ArrowLink } from "./ArrowLink";
import { HomeSectionHeading } from "./HomeSectionHeading";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { flagshipCopy, flagshipTooling } from "@/lib/flagship-tooling";
import { dict } from "@/lib/i18n";

/**
 * 307 and 311 — the two exit devices built on the factory's own moulds.
 *
 * ---------------------------------------------------------------------------
 * WHY IT LOOKS LIKE A SPEC SHEET AND NOT A PROMOTION
 *
 * The client asked for a column featuring the two products they invested most heavily in
 * tooling. The tempting shape is a promotional banner — a badge, a superlative, the
 * investment figure. All three would work against the thing being sold. A buyer who is
 * about to commit to a container is not persuaded that a supplier is proud of a mould;
 * they are persuaded that the bar is 1000mm, that it is rated 2.5 hours, and that both
 * numbers will still be true on the next order.
 *
 * So the section is two photographs and six rows of specification, and the argument sits
 * in the heading: these were tooled here. See src/lib/flagship-tooling.ts for why the
 * ¥100,000 the client mentioned is deliberately not on the page.
 *
 * ---------------------------------------------------------------------------
 * IT DISAPPEARS RATHER THAN DEGRADES
 *
 * `flagshipTooling` returns null unless both products exist, both have photographs, and
 * both yield at least one surfaced spec row. A half-rendered flagship pair makes a worse
 * impression than no section, and an empty frame on a homepage is the kind of defect
 * nobody notices until a buyer does.
 */
export function FlagshipTooling({ locale = "en" }: { locale?: Locale }) {
  const cards = flagshipTooling(locale);
  if (!cards) return null;

  const text = dict(flagshipCopy, locale);

  return (
    <section className="layout" aria-labelledby="flagship-tooling-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <HomeSectionHeading
          id="flagship-tooling-heading"
          eyebrow={text.eyebrow}
          title={text.title}
          lede={text.intro}
          action={<ArrowLink href={text.ctaHref}>{text.cta}</ArrowLink>}
        />

        {/*
          Each device reads as one spec sheet: photograph beside its rows. Stacked under
          the lede column, as they were, the pair left half the section empty and pushed
          the rows a full photograph below the model number.
        */}
        <div className="col-span-full mt-32 grid grid-cols-1 gap-x gap-y-48 lg:grid-cols-2">
          {cards.map((card) => (
            <article key={card.model} className="grid grid-cols-1 gap-x-24 sm:grid-cols-2">
              <a href={card.href} className="block">
                <MediaPlaceholder
                  {...card.image}
                  label={locale === "es" ? (card.image.labelEs ?? card.image.label) : card.image.label}
                  sizes="(min-width: 1440px) 330px, (min-width: 1032px) 23vw, (min-width: 640px) 48vw, 96vw"
                />
              </a>
              <div>
                <h3 className="mt-16 text-h3 text-ink sm:mt-0">
                  <a href={card.href} className="short-marker short-marker-compact">
                    {card.model}
                  </a>
                </h3>
                {/*
                  A description list, because each row is the value of a named property —
                  the same markup the product page uses for the same facts, so a screen
                  reader hears the pairing rather than two loose strings.
                */}
                <dl className="mt-16 space-y-8 text-c2">
                  {card.rows.map((row) => (
                    <div key={row.label} className="border-t border-line pt-8">
                      <dt className="text-ink-secondary">{row.label}</dt>
                      <dd className="mt-4 text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
