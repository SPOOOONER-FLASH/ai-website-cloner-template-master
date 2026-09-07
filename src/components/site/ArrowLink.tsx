import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";

interface ArrowLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  /** Disable speculative route loading for low-intent or automatically changing links. */
  prefetch?: boolean;
  /** Also react when an explicit `.short-marker-surface` is hovered — used inside hero modules. */
  groupHover?: boolean;
}

/**
 * The site's single link affordance: an 8px chevron pinned at `left: 0 / top: .3rem`
 * with the label offset by `padding-left: 12px`.
 *
 * COLOUR: the link and its currentColor chevron both resolve to architectural ink.
 * Hover and keyboard focus reveal the shared 64px short marker from the label edge.
 *
 * Geometry is unchanged: inline-block, height 24px, label 18px/24px w400 ls .36px.
 */
export function ArrowLink({
  href = "#",
  children,
  className,
  prefetch,
  groupHover,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        "short-marker short-marker-arrow relative inline-block pl-12 text-c1 text-brand",
        /*
          TOUCH HEIGHT.

          Measured on the homepage at 375px: every one of these rendered 25px tall — and
          these are the primary calls to action, "Explore exit devices", "Talk to export",
          "Contact us". Apple and WCAG 2.5.8 both put the minimum at 44px, so the most
          important links on the page were the hardest to hit on the device most visitors
          use.

          Padding on the link rather than margin on the row, so the whole strip is
          tappable and not just the glyph height. Removed from `sm` up, where this is a
          mouse target and the extra leading would loosen every editorial block that uses
          one of these.
        */
        "py-10 sm:py-0",
        "hover:text-brand-hover active:text-brand-active",
        groupHover && "short-marker-group",
        className,
      )}
    >
      <ArrowRightIcon className="absolute left-0 top-[.3rem] h-auto w-8" />
      <span>{children}</span>
    </Link>
  );
}
