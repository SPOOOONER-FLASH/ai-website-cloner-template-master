import Image from "next/image";
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
 * The HYDE mark: two rounded uprights with a crossbar set below centre.
 *
 * ⚠ REDRAWN FROM A REFERENCE IMAGE, NOT THE OFFICIAL ARTWORK. The geometry was measured
 * off a raster supplied by the client, so stroke weight and the crossbar height are
 * close but not authoritative. Replace this with the brand's own vector before launch —
 * a logo that is nearly right is a brand problem, not a rounding error.
 *
 * Drawn as strokes rather than filled paths so weight scales with the box, and rendered
 * in `currentColor` so one component serves both the black-on-white and white-on-black
 * lockups the client uses.
 */
export function HydeMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        <line x1="10.5" y1="10.5" x2="10.5" y2="89.5" />
        <line x1="77.5" y1="10.5" x2="77.5" y2="89.5" />
        <line x1="10.5" y1="58" x2="77.5" y2="58" />
      </g>
    </svg>
  );
}

/**
 * The full HYDE lockup — mark plus wordmark.
 *
 * The wordmark is live text with wide tracking rather than traced outlines: it stays
 * selectable and searchable, it restyles with one token, and tracing letterforms off a
 * raster would bake in whatever the screenshot's compression did to the curves.
 */
export function HydeLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-16 whitespace-nowrap", className)}>
      <HydeMark className="h-32 w-auto flex-none" aria-hidden="true" />
      <span className="text-[2.2rem] font-light uppercase leading-none tracking-[0.28em]">
        Hyde
      </span>
    </span>
  );
}

/**
 * Client-owned Hyland mark paired with a live Archivo wordmark. The long legacy raster
 * company name is deliberately not used: this keeps the header sharp and restrained.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-10 whitespace-nowrap", className)}>
      <Image
        src="/images/brand/hyland-mark.png"
        alt=""
        width={254}
        height={150}
        priority
        className="h-28 w-auto flex-none object-contain sm:h-36"
      />
      <span className="text-[1.2rem] font-bold uppercase leading-none tracking-[0.05em] sm:text-[1.6rem]">
        Canton Hyland
      </span>
    </span>
  );
}
