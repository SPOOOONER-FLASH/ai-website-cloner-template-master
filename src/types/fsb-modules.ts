/**
 * Content shapes for the four module types the target page is assembled from.
 * Derived from docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/PAGE_TOPOLOGY.md
 */

export interface MediaSlot {
  /** The ORIGINAL asset's aspect ratio, verbatim — e.g. "2880 / 1391". */
  ratio: string;
  /** Placeholder label describing what belongs in this slot. */
  label: string;
}

export interface HeroModuleContent {
  /** "stacked" = popout media above a caption row; "side" = 17/7 split on the content grid. */
  variant: "stacked" | "side";
  media: MediaSlot;
  title: string;
  body?: string;
  linkLabel: string;
  href?: string;
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
