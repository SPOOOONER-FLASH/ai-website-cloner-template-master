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

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 1.2 H22 M0 8 H22 M0 14.8 H22" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Client-owned Hyland mark paired with a live Archivo wordmark. The long legacy raster
 * company name is deliberately not used: this keeps the header sharp and restrained.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-12 whitespace-nowrap", className)}>
      <Image
        src="/images/brand/hyland-mark.png"
        alt=""
        width={254}
        height={150}
        priority
        className="h-32 w-auto sm:h-40"
      />
      <span className="text-[1.4rem] font-bold uppercase leading-none tracking-[0.05em] sm:text-[1.8rem]">
        Canton Hyland
      </span>
    </span>
  );
}
