import Link from "next/link";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ArrowLink } from "./ArrowLink";
import { cn } from "@/lib/utils";
import type { HeroModuleContent } from "@/types/fsb-modules";

/**
 * `data-content-module="hero"` — 5 instances.
 *
 * Two layouts, both wrapped in an `absolute inset-0` link. Homepage callers opt into
 * the shared A + D surface: neutral at rest, then one title marker, thin frame and hard
 * offset plane on pointer hover or keyboard focus.
 *
 * variant "stacked": media spans the 1440px outset band, caption row sits on the 1376px
 *                    content band as 6 + 6 of 24 columns.
 * variant "side":    single 24-col content grid, image col-span-17, text col-span-7 with
 *                    the link pinned to the bottom via `mt-auto`.
 *
 * COLOUR:
 *   Title / body   --color-ink, preserving the editorial text ladder even when the whole
 *                  module is a link.
 *   Interactive frame resolves to the same architectural ink and stays 1px square.
 */
type HeroModuleProps = {
  content: HeroModuleContent;
  homeAccent?: boolean;
};

export function HeroModule({ content, homeAccent = false }: HeroModuleProps) {
  return content.variant === "stacked" ? (
    <HeroStacked {...content} homeAccent={homeAccent} />
  ) : (
    <HeroSide {...content} homeAccent={homeAccent} />
  );
}

function HeroStacked({
  media,
  title,
  body,
  linkLabel,
  href = "#",
  homeAccent = false,
}: HeroModuleContent & { homeAccent?: boolean }) {
  return (
    <div className="layout" data-content-module="hero">
      <div className="col-outset">
        <div className="layout">
          <div
            className={cn(
              "group relative col-outset",
              homeAccent && "home-accent-surface home-accent-module",
            )}
          >
            <div className="layout">
              <div className="col-outset px-outset md:px-0">
                <div className="col-span-full mb-16 md:mb-48">
                  <MediaPlaceholder
                    {...media}
                    sizes="(min-width: 1600px) 1440px, 100vw"
                  />
                </div>
              </div>

              <div className="col-content grid w-full grid-cols gap-x pb-32 md:pb-48">
                <div className="col-span-full grid grid-cols-subgrid gap-x gap-y-16">
                  <div className="col-span-full md:col-span-5 xl:col-span-6">
                    <h3 className={cn("text-h3 text-ink", homeAccent && "home-accent-marker")}>
                      {title}
                    </h3>
                    {body ? <p className="text-c1 text-ink">{body}</p> : null}
                  </div>
                  <div className="col-span-full md:[grid-column:span_3/-1] xl:[grid-column:span_6/-1]">
                    <ArrowLink
                      href={href}
                      groupHover={!homeAccent}
                      className={cn(homeAccent && "home-accent-action")}
                    >
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
              className={cn(
                "outline-offset absolute inset-0 -mb-outset pb-outset",
                !homeAccent &&
                  "hover-hover:group-hover:outline hover-hover:group-hover:outline-1 hover-hover:group-hover:outline-ink",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSide({
  media,
  title,
  body,
  linkLabel,
  href = "#",
  homeAccent = false,
}: HeroModuleContent & { homeAccent?: boolean }) {
  return (
    <div className="layout" data-content-module="hero">
      <div className="col-outset">
        <div className="layout">
          <div
            className={cn(
              "group relative col-content grid grid-cols gap-x",
              homeAccent && "home-accent-surface home-accent-module",
            )}
          >
            <div className="col-span-full mb-16 md:mb-0 md:[grid-column:span_8/-1] xl:col-span-17">
              <MediaPlaceholder
                {...media}
                sizes="(min-width: 1440px) 960px, (min-width: 744px) 66vw, 100vw"
              />
            </div>

            <div className="col-span-full grid grid-cols-subgrid gap-x gap-y-16 md:order-first md:col-span-3 xl:col-span-7">
              <div className="col-span-full md:row-start-1 xl:col-span-6">
                <h3 className={cn("text-h3 text-ink", homeAccent && "home-accent-marker")}>
                  {title}
                </h3>
                {body ? <p className="text-c1 text-ink">{body}</p> : null}
              </div>
              <div className="col-span-full mt-auto md:mb-48">
                <ArrowLink
                  href={href}
                  groupHover={!homeAccent}
                  className={cn(homeAccent && "home-accent-action")}
                >
                  {linkLabel}
                </ArrowLink>
              </div>
            </div>

            <Link
              href={href}
              aria-label={title}
              className={cn(
                "outline-offset absolute inset-0",
                !homeAccent &&
                  "hover-hover:group-hover:outline hover-hover:group-hover:outline-1 hover-hover:group-hover:outline-ink",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
