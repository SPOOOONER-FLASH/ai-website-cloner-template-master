import { ArrowLink } from "./ArrowLink";
import type { TextModuleContent } from "@/types/fsb-modules";

/**
 * `data-content-module="text"` — 3 instances.
 *
 * Two 12-column halves on the content band: heading left (in a 6-col cell of its own
 * subgrid), prose + arrow link right.
 *
 * COLOUR: heading and body are --color-ink (rule 2). The ArrowLink carries the only
 * brand red in this module.
 */
export function TextModule({ content }: { content: TextModuleContent }) {
  return (
    <div className="layout" data-content-module="text">
      <div className="col-content grid w-full grid-cols gap">
        <div className="col-span-full grid grid-cols-subgrid items-start gap gap-y-24 self-start sm:col-span-4 md:col-span-6 xl:col-span-12">
          <div className="col-span-full space-y-24 xl:col-span-6">
            <h2 className="text-h3 text-ink">{content.heading}</h2>
          </div>
        </div>

        <div className="col-span-full grid grid-cols-subgrid gap sm:col-span-4 md:col-span-6 xl:col-span-12">
          <section className="copy col-span-full text-ink">
            <p>{content.body}</p>
            <ArrowLink href={content.href} className="mt-24">
              {content.linkLabel}
            </ArrowLink>
          </section>
        </div>
      </div>
    </div>
  );
}
