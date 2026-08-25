import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";

interface ArrowLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  /** Disable speculative route loading for low-intent or automatically changing links. */
  prefetch?: boolean;
  /** Also react when an ancestor `.group` is hovered — used inside hero modules. */
  groupHover?: boolean;
}

/**
 * The site's single link affordance: an 8px chevron pinned at `left: 0 / top: .3rem`
 * with the label offset by `padding-left: 12px`.
 *
 * COLOUR (rule 1): this is a link, so it carries brand red — `--color-brand`, going to
 * `--color-brand-hover` on hover. The chevron is `currentColor` and therefore tracks the
 * label; that is intentional. It reads as part of the link, not as a decorative icon,
 * so rule 2's "icons are never red" does not apply to it.
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
        "relative inline-block pl-12 text-c1 text-brand underline-offset-4",
        "hover:text-brand-hover hover:underline active:text-brand-active",
        groupHover && "group-hover:text-brand-hover group-hover:underline",
        className,
      )}
    >
      <ArrowRightIcon className="absolute left-0 top-[.3rem] h-auto w-8" />
      <span>{children}</span>
    </Link>
  );
}
