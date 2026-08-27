import Link from "next/link";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ArrowLink } from "./ArrowLink";
import { cn } from "@/lib/utils";
import type { HeroModuleContent } from "@/types/fsb-modules";

/**
 * `data-content-module="hero"` — 5 instances.
 *
 * Two layouts, both wrapped in an `absolute inset-0` link. Homepage editorial callers
 * opt into restrained image motion plus the shared CTA marker. True cards use the
 * stronger A + D framed surface elsewhere; these large narrative blocks stay flat.
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
  homeEditorial?: boolean;
};

export function HeroModule({
  content,
  homeAccent = false,
  homeEditorial = false,
}: HeroModuleProps) {
  return content.variant === "stacked" ? (
    <HeroStacked
      {...content}
      homeAccent={homeAccent}
      homeEditorial={homeEditorial}
    />
  ) : (
    <HeroSide
      {...content}
      homeAccent={homeAccent}
      homeEditorial={homeEditorial}
    />
  );
}

function HeroStacked({
  media,
  title,
  body,
  linkLabel,
  href = "#",
  homeAccent = false,
  homeEditorial = false,
}: HeroModuleContent & { homeAccent?: boolean; homeEditorial?: boolean }) {
  return (
    <div className="layout" data-content-module="hero">
      <div className="col-outset">
        <div className="layout">
          <div
            className={cn(
              "group relative col-outset",
              homeAccent && "home-accent-surface home-accent-module",
              homeEditorial && "home-editorial-surface",
              homeEditorial && "short-marker-surface",
            )}
          >
            <div className="layout">
              <div className="col-outset px-outset md:px-0">
                <div
                  className={cn(
                    "col-span-full mb-16 md:mb-48",
                    homeEditorial && "home-editorial-media",
                  )}
                >
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
                      groupHover={!homeAccent || homeEditorial}
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
                !homeAccent && !homeEditorial &&
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
  homeEditorial = false,
}: HeroModuleContent & { homeAccent?: boolean; homeEditorial?: boolean }) {
  return (
    <div className="layout" data-content-module="hero">
      <div className="col-outset">
        <div className="layout">
          <div
            className={cn(
              "group relative col-content grid grid-cols gap-x",
              homeAccent && "home-accent-surface home-accent-module",
              homeEditorial && "home-editorial-surface",
              homeEditorial && "short-marker-surface",
            )}
          >
            <div
              className={cn(
                "col-span-full mb-16 md:mb-0 md:[grid-column:span_8/-1] xl:col-span-17",
                homeEditorial && "home-editorial-media",
              )}
            >
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
                  groupHover={!homeAccent || homeEditorial}
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
                !homeAccent && !homeEditorial &&
                  "hover-hover:group-hover:outline hover-hover:group-hover:outline-1 hover-hover:group-hover:outline-ink",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
