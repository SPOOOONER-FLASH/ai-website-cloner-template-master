import type {
  HeroCarouselContent,
  HeroModuleContent,
  PageTeaserContent,
  SpacerHeights,
} from "@/types/fsb-modules";

/**
 * Homepage content — Canton Hyland.
 *
 * Copy and imagery are the client's own material, delivered 2026-08-15:
 *   - banner headlines from 大图文案.docx, verbatim
 *   - company copy from 公司英文简介.docx
 *   - product names from the client's asset pack
 *   - product and manufacturing imagery comes from the client; the first carousel
 *     combines the complete 306-D gallery frame with selected B architecture
 *     (see IMAGE_CREDITS.md)
 *
 * Line counts are still tuned to the measured module heights, so the page geometry
 * that was verified at 1512px is preserved.
 */

export const hero1: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 943",
    src: "/images/editorial/hero-warm-residential-entry.webp",
    label: "Warm timber and limestone residential threshold opening to a planted courtyard",
  },
  title: "Lever Handles",
  body: "Tubular and mortise lever sets in stainless steel, brass and matte black, for homes and light commercial doors.",
  linkLabel: "View lever handles",
  href: "/products/lever-handles",
};

/**
 * Slide order is a commercial decision, not a design one: panic exit devices are the
 * flagship line, so they hold the first frame — the one every visitor sees and the one
 * that renders in link previews. The two Argentina market collections follow it (client,
 * 2026-10-12); their wide images are placeholders until the editorial pair arrives.
 */
export const heroCarousel: HeroCarouselContent = {
  ariaLabel: "Featured door hardware",
  slides: [
    {
      variant: "stacked",
      media: {
        ratio: "1800 / 900",
        src: "/images/editorial/home-panic-exit-double-door.webp",
        label: "306-D double-door exit hardware: push bars on both leaves and surface vertical rods on the closed leaf, opening onto an outdoor courtyard",
      },
      title: "Panic Exit Devices",
      body: "One push, and the door opens. Push bars, outside trims and lock cases for escape and fire doors, specified as a set.",
      linkLabel: "Explore exit devices",
      href: "/products/panic-exit-devices",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1672 / 941",
        src: "/images/editorial/argentina-ar4-entry.webp",
        label: "Contemporary architectural threshold in Buenos Aires",
      },
      title: "HYDE Argentina AR-4",
      body: "Compact mortise lock bodies selected for Argentine distributors, private-label programs and OEM orders.",
      linkLabel: "Explore the AR-4 collection",
      href: "/products/argentina-ar4",
    },
    {
      variant: "stacked",
      media: {
        ratio: "1800 / 900",
        src: "/images/editorial/home-argentina-collection.webp",
        label: "AR5-115 mortise lock with its separate long faceplate, nickel-plated, on a white field",
      },
      title: "HYDE Argentina Collection",
      body: "Mortise locks, deadlocks and narrow-stile locks made on HYDE molds for Argentine distributors, with faceplate and case dimensions for every model.",
      linkLabel: "Explore the Argentina collection",
      href: "/products/argentina",
    },
    hero1,
    {
      variant: "stacked",
      media: {
        ratio: "2400 / 943",
        src: "/images/editorial/hero-civic-corridor.webp",
        label: "Public-building corridor with glazed partitions and fire-egress doors",
      },
      title: "Mortise Lock Cases",
      body: "Lock cases by backset, center distance and bolt, written down to the millimeter so the lever, cylinder and strike you order around them fit the first time.",
      linkLabel: "View lock cases",
      href: "/products/lock-cases",
    },
  ],
};

export const teaser1: PageTeaserContent = {
  heading: "Source by range or by project",
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-real-lever-set-dark.webp",
        label:
          "A complete tubular lever lockset laid out on a dark ground: two levers on roses with the spindle and mechanism visible, the tubular latch, the strike box, the strike plate and three fixing screws — every part in one finish",
      },
      title: "For distributors",
      subtitle: "Order from the Canton Hyland export catalog",
      href: "/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-real-cylinder-dark.webp",
        label:
          "A euro-profile cylinder with a thumbturn photographed on a dark ground beside its fixing screw and three keys — the screw passes through the cam, the point a cylinder's two halves are measured from",
      },
      title: "For specifiers",
      subtitle: "Build a hardware schedule with our export engineers",
      href: "/products",
    },
  ],
};

export const spacers: Record<string, SpacerHeights> = {
  s96: { default: 96 },
  s48: { default: 48 },
  s384: { default: 96, md: 136, lg: 384 },
  s288lg: { default: 96, md: 136, lg: 288 },
  s288xl: { default: 96, md: 192, xl: 288 },
};
