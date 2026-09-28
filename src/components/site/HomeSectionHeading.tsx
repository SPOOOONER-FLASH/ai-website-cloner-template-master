import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one heading shape for the homepage feature run: most requested, 307/311, AR-4, columns.
 *
 * Until 2026-09-28 each of those four sections drew its own header. AR-4 set its title at
 * text-h1 while the other three used text-h2, two had an eyebrow and two did not, and the
 * lede sat beside the title in two of them and under it in the other two. Read in sequence
 * that is four sections each asking to be the lead, which is what the client's critique
 * said. One shape — rule, eyebrow, title, lede on the right — makes them read as chapters
 * of one argument, and leaves the content under each heading to show what its job is.
 *
 * The top rule is ink, not line: it is the only divider between the sections, so it has to
 * be visible at a glance on a phone.
 */
export function HomeSectionHeading({
  id,
  eyebrow,
  title,
  lede,
  action,
  as: Heading = "h2",
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("col-span-full grid grid-cols gap-x border-t border-ink pt-24", className)}>
      <div className="col-span-full lg:col-span-5 xl:col-span-9">
        <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">{eyebrow}</p>
        <Heading id={id} className="mt-8 text-h2 text-ink">
          {title}
        </Heading>
      </div>
      {lede || action ? (
        <div className="col-span-full mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0 xl:col-span-12 xl:col-start-13">
          {lede ? <p className="max-w-[60ch] text-c1 text-ink-secondary">{lede}</p> : null}
          {action ? <div className={lede ? "mt-16" : undefined}>{action}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
