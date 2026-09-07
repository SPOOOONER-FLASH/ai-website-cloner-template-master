import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface BaseProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AnchorProps = BaseProps & {
  href: string;
  /**
   * Passed through to the anchor. Added for `nofollow` on the quote CTA.
   *
   * Every product page links to `/contact/?product=…&model=…`, so 870 pages generate 870
   * distinct crawlable URLs for one page. Search Console reports all 69 it has found as
   * "alternate page with proper canonical" — Google is handling them correctly, and that
   * is exactly the problem: it is spending crawl budget confirming 870 times that they
   * are the contact page, on a site where 415 real pages are still "discovered, not
   * indexed". `nofollow` keeps the link working for a person and stops the crawl.
   */
  rel?: string;
};

/**
 * Canton Hyland button.
 *
 * COLOUR (rules 1, 3, 4):
 *   primary    fill --color-brand,        text --color-surface
 *              hover --color-brand-hover, active --color-brand-active
 *   secondary  transparent, 1px --color-ink border, --color-ink text
 *              hover fills --color-ink with --color-surface text
 *
 * The primary-button fill is solid ink in the monochrome A + D direction.
 * Radius is --radius-card (2px, rule 4). No shadow, no gradient (rule 3).
 *
 * NOTE: the cloned reference page contains no primary/secondary button instances —
 * its only call-to-action pattern is the chevron ArrowLink. This component exists so
 * the button half of the brand system is available; it is not yet mounted on `/`.
 * Injecting buttons into the page would change the layout being evaluated.
 */
export function Button(props: ButtonProps | AnchorProps) {
  const classes = cn(
    "btn",
    (props.variant ?? "primary") === "primary" ? "btn-primary" : "btn-secondary",
    props.className,
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} rel={props.rel} className={classes}>
        {props.children}
      </Link>
    );
  }

  const { variant, children, className, href, ...buttonAttrs } = props;
  void variant;
  void className;
  void href;
  return (
    <button type="button" className={classes} {...buttonAttrs}>
      {children}
    </button>
  );
}
