/* eslint-disable @next/next/no-img-element --
   本文件里的 <img> 全部指向 SVG。next/image 的位图优化对矢量没有意义，
   而且 output:"export" 下图片优化本来就是关闭的；用 next/image 载入 SVG
   还需要开启 dangerouslyAllowSVG，那是为了这条 lint 规则而放宽一项安全设置。*/
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Generic line icons for the Canton Hyland prototype.
 *
 * These are redrawn from scratch, not traced from the target site. The target's
 * wordmark is a registered trademark and is deliberately not reproduced — see
 * `Wordmark` below.
 */

/** Chevron used by every arrow link. Matches the target's 6x10 viewBox and 8px render width. */
export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0.8 0.6 L5.2 5 L0.8 9.4 L0.8 0.6 Z" fill="currentColor" />
    </svg>
  );
}

/** Accordion chevron. 18x10 viewBox, rendered 16px wide. */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 1 L9 9 L17 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="8" cy="8" rx="2.9" ry="6.6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.7 5.9 H14.3 M1.7 10.1 H14.3" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8.6" cy="8.6" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.2 13.2 L18.4 18.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Square 20x20 viewBox so it can share the header's icon rail with GlobeIcon and
 * SearchIcon without distorting. It was 22x16, which stretched at a square size.
 */
export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 4.2 H19 M1 10 H19 M1 15.8 H19" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 2 L22 22 M22 2 L2 22" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * The HYDE lockup — the brand's own master artwork, not a redrawing.
 *
 * Files come from the v1.1 brand kit (2026-08-23) and are used as supplied. Everything
 * below follows its stated rules rather than taste:
 *
 *   · The horizontal lockup is the approved primary for web.
 *   · Minimum 120px wide on screen. The 4:1 artwork means height drives that, so no
 *     class here may take it below 30px tall. `h-32` leaves a small margin.
 *   · Clearspace is one stem width — 34 of the 240-unit height, so ~14% of rendered
 *     height on every side. Callers add it; the artwork itself has none baked in.
 *   · Reverse (white) artwork is a separate file, not a CSS filter on the black one.
 *
 * The kit ships outline geometry with no live fonts, so an `<img>` is enough and the
 * wordmark cannot break on a machine missing a typeface. It is intentionally not an
 * inline SVG: the file is the brand's deliverable, and keeping it byte-identical means
 * a future kit update is a file swap rather than a re-transcription.
 */
export function HydeLockup({
  className,
  variant = "black",
}: {
  className?: string;
  /** "white" is the approved reverse artwork for dark grounds. */
  variant?: "black" | "white" | "graphite";
}) {
  return (
    <img
      src={`/images/brand/hyde/hyde-logo-horizontal-${variant}.svg`}
      alt="HYDE"
      width={960}
      height={240}
      className={cn("h-32 w-auto flex-none", className)}
    />
  );
}

/** The H icon alone. Approved for avatars, nameplates and other small placements. */
export function HydeIcon({
  className,
  variant = "black",
}: {
  className?: string;
  variant?: "black" | "white";
}) {
  return (
    <img
      src={`/images/brand/hyde/hyde-logo-icon-${variant}.svg`}
      alt=""
      aria-hidden="true"
      className={cn("h-24 w-auto flex-none", className)}
    />
  );
}

/**
 * The header lockup.
 *
 * ⚠ The logo now reads HYDE while the site's copy, page titles and legal name still read
 * "Canton Hyland". That mismatch is deliberate for now — replacing the logo was the
 * instruction — but it is a live inconsistency a visitor can see, and it needs a
 * decision: is HYDE the brand and Canton Hyland the company behind it, or is the copy
 * being renamed too? Until that is settled the wordmark below carries no company name,
 * which is at least not contradictory.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center whitespace-nowrap", className)}>
      {/*
        Height is not responsive on purpose. The artwork is 4:1, so `h-28` rendered it
        112px wide on a 393px viewport — under the kit's 120px screen minimum. 32px gives
        128px at every size, which clears the minimum with a margin and still leaves room
        for the icon rail on the narrowest supported width.
      */}
      <HydeLockup className="h-32" />
    </span>
  );
}
