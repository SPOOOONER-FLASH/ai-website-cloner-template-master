import Link from "next/link";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ArrowLink } from "./ArrowLink";
import type { HeroModuleContent } from "@/types/fsb-modules";

/**
 * `data-content-module="hero"` — 5 instances.
 *
 * Two layouts, both wrapped in an `absolute inset-0` link that carries the whole-module
 * hover outline (`@media (hover: hover)` only, instant, no transition).
 *
 * variant "stacked": media spans the 1440px outset band, caption row sits on the 1376px
 *                    content band as 6 + 6 of 24 columns.
 * variant "side":    single 24-col content grid, image col-span-17, text col-span-7 with
 *                    the link pinned to the bottom via `mt-auto`.
 *
 * COLOUR:
 *   Title / body   --color-ink. Never red (rule 2), even though the whole module is a link —
 *                  turning a heading and a paragraph red would break the text ladder.
 *   Hover outline  --color-brand. This is a hover affordance on a clickable element
 *                  (rule 1, "link hover"), not a static divider, so red is correct here.
 *                  1px, no shadow, no radius (rules 3–4).
 */
export function HeroModule({ content }: { content: HeroModuleContent }) {
  return content.variant === "stacked" ? <HeroStacked {...content} /> : <HeroSide {...content} />;
}

function HeroStacked({ media, title, body, linkLabel, href = "#" }: HeroModuleContent) {
  return (
    <div className="layout" data-content-module="hero">
      <div className="col-outset">
        <div className="layout">
          <div className="group relative col-outset">
            <div className="layout">
              <div className="col-outset px-outset md:px-0">
                <div className="col-span-full mb-16 md:mb-48">
                  <MediaPlaceholder {...media} />
                </div>
              </div>

              <div className="col-content grid w-full grid-cols gap-x pb-32 md:pb-48">
                <div className="col-span-full grid grid-cols-subgrid gap-x gap-y-16">
                  <div className="col-span-full md:col-span-5 xl:col-span-6">
                    <h3 className="text-h3 text-ink">{title}</h3>
                    {body ? <p className="text-c1 text-ink">{body}</p> : null}
                  </div>
                  <div className="col-span-full md:[grid-column:span_3/-1] xl:[grid-column:span_6/-1]">
                    <ArrowLink href={href} groupHover>
                      {linkLabel}
                    </ArrowLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Whole-module hit area. `-mb-outset pb-outset` extends the outline into the gap below. */}
            <Link
              href={href}
              aria-label={title}
              className="outline-offset absolute inset-0 -mb-outset pb-outset hover-hover:group-hover:outline hover-hover:group-hover:outline-1 hover-hover:group-hover:outline-brand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSide({ media, title, body, linkLabel, href = "#" }: HeroModuleContent) {
  return (
    <div className="layout" data-content-module="hero">
      <div className="col-outset">
        <div className="layout">
          <div className="group relative col-content grid grid-cols gap-x">
            <div className="col-span-full mb-16 md:mb-0 md:[grid-column:span_8/-1] xl:col-span-17">
              <MediaPlaceholder {...media} />
            </div>

            <div className="col-span-full grid grid-cols-subgrid gap-x gap-y-16 md:order-first md:col-span-3 xl:col-span-7">
              <div className="col-span-full md:row-start-1 xl:col-span-6">
                <h3 className="text-h3 text-ink">{title}</h3>
                {body ? <p className="text-c1 text-ink">{body}</p> : null}
              </div>
              <div className="col-span-full mt-auto md:mb-48">
                <ArrowLink href={href} groupHover>
                  {linkLabel}
                </ArrowLink>
              </div>
            </div>

            <Link
              href={href}
              aria-label={title}
              className="outline-offset-outset absolute inset-0 hover-hover:group-hover:outline hover-hover:group-hover:outline-1 hover-hover:group-hover:outline-brand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
