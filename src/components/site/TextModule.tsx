import { ArrowLink } from "./ArrowLink";
import { cn } from "@/lib/utils";
import type { TextModuleContent } from "@/types/fsb-modules";

/**
 * `data-content-module="text"` — 3 instances.
 *
 * Two 12-column halves on the content band: heading left (in a 6-col cell of its own
 * subgrid), prose + arrow link right.
 *
 * COLOUR: heading and body are --color-ink (rule 2). The ArrowLink carries the only
 * monochrome action colour in this module.
 */
export function TextModule({
  content,
  homeAccent = false,
}: {
  content: TextModuleContent;
  homeAccent?: boolean;
}) {
  return (
    <div className="layout" data-content-module="text">
      <div
        className={cn(
          "col-content grid w-full grid-cols gap",
          homeAccent && "home-accent-surface home-accent-module",
        )}
      >
        <div className="col-span-full grid grid-cols-subgrid items-start gap gap-y-24 self-start sm:col-span-4 md:col-span-6 xl:col-span-12">
          <div className="col-span-full space-y-24 xl:col-span-6">
            <h2 className={cn("text-h3 text-ink", homeAccent && "home-accent-marker")}>
              {content.heading}
            </h2>
          </div>
        </div>

        <div className="col-span-full grid grid-cols-subgrid gap sm:col-span-4 md:col-span-6 xl:col-span-12">
          <section className="copy col-span-full text-ink">
            <p>{content.body}</p>
            <ArrowLink
              href={content.href}
              className={cn("mt-24", homeAccent && "home-accent-action")}
            >
              {content.linkLabel}
            </ArrowLink>
          </section>
        </div>
      </div>
    </div>
  );
}
