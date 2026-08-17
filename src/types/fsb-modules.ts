/**
 * Content shapes for the four module types the homepage is assembled from.
 * Derived from docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/PAGE_TOPOLOGY.md
 */

import type { ImageRef } from "@/data/types";

/**
 * The homepage uses the same image contract as the rest of the site, so there is
 * exactly one shape to reason about: set `src` and the photo renders, omit it and
 * the slot falls back to a labelled placeholder block.
 */
export type MediaSlot = ImageRef;

export interface HeroModuleContent {
  /** "stacked" = popout media above a caption row; "side" = 17/7 split on the content grid. */
  variant: "stacked" | "side";
  media: MediaSlot;
  title: string;
  body?: string;
  linkLabel: string;
  href?: string;
}

export interface HeroCarouselContent {
  ariaLabel: string;
  slides: HeroModuleContent[];
}

export interface TeaserCardContent {
  media: MediaSlot;
  title: string;
  subtitle: string;
  href?: string;
}

export interface PageTeaserContent {
  heading?: string;
  cards: TeaserCardContent[];
}

export interface TextModuleContent {
  heading: string;
  body: string;
  linkLabel: string;
  href?: string;
}

/** Spacer heights in px, keyed by breakpoint; unset steps inherit the previous one. */
export interface SpacerHeights {
  default: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}
