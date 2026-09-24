import type {
  HeroCarouselContent,
  HeroModuleContent,
  PageTeaserContent,
  SpacerHeights,
  TextModuleContent,
} from "@/types/fsb-modules";

/**
 * Homepage content — Canton Hyland.
 *
 * Copy and imagery are the client's own material, delivered 2026-08-15:
 *   - banner headlines from 大图文案.docx, verbatim
 *   - company copy from 公司英文简介.docx
 *   - product names from the client's asset pack
 *   - product and manufacturing imagery is first-party; editorial imagery is representative
 *     generated work (see IMAGE_CREDITS.md)
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
 * that renders in link previews. The other two rotate behind it.
 */
export const heroCarousel: HeroCarouselContent = {
  ariaLabel: "Featured door hardware",
  slides: [
    {
      variant: "stacked",
      media: {
        ratio: "2400 / 943",
        src: "/images/editorial/home-panic-exit-bars.webp",
        label: "Representative commercial fire-exit doors with clearly visible panic push bars",
      },
      title: "Panic Exit Devices",
      body: "One push, and the door opens. Push bars, outside trims and lock cases for escape and fire doors, specified as a set.",
      linkLabel: "Explore exit devices",
      href: "/products/panic-exit-devices",
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

export const hero2: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 1159",
    src: "/images/editorial/home-commercial-egress.webp",
    label: "Commercial escape-route architecture with paired doors and a quiet corridor",
  },
  title: "Panic Exit Devices",
  // 4 lines at the 332px caption column, matching the measured module height
  body: "Our flagship range, and the one we know best: push bars for escape and fire doors, from single-point rim devices to multi-point sets for double doors.",
  linkLabel: "See the exit devices",
  href: "/products/panic-exit-devices",
};

export const text1: TextModuleContent = {
  heading: "Where our hardware is fitted",
  body: "Our panic devices, lock cases and lever sets are fitted in commercial, institutional and residential buildings in the markets we export to, often under our customers' own names, with master-key and construction-key systems planned for each building.",
  linkLabel: "Overview",
  href: "/projects",
};

export const teaser2: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/project-commercial-egress.webp",
        label: "Representative commercial egress application study with paired fire-exit doors",
      },
      title: "Commercial Fire Egress",
      subtitle: "Representative hardware application study for code-conscious circulation",
      href: "/projects/commercial-fire-egress-hardware",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/project-hospitality-residential.webp",
        label: "Representative hospitality and residential door-hardware application study",
      },
      title: "Hospitality + Residential",
      subtitle: "Warm entry and corridor studies for coordinated door packages",
      href: "/projects/hospitality-residential-door-package",
    },
  ],
};

export const hero3: HeroModuleContent = {
  variant: "side",
  media: {
    ratio: "3 / 2",
    src: "/images/editorial/hyde-real-product-atlas.webp",
    label: "Real catalog photographs presenting selected door hardware",
  },
  title: "Designed for",
  body: "Selected hardware, one coordinated schedule",
  linkLabel: "Browse the catalog",
  href: "/products",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "1 / 1",
    src: "/images/editorial/hyde-client-lc04-selection.webp",
    label: "Four-bolt mortise lock case with strike plate and strike box",
  },
  title: "Materials + Engineering",
  body: "Finishes matched across a whole door schedule, master-key systems planned before the first cylinder is cut, and export documents ready when the container is.",
  linkLabel: "How we work",
  href: "/company",
};

export const text2: TextModuleContent = {
  heading: "Service + Downloads",
  // 2 lines at the 680px copy column, matching the measured module height
  body: "New tooling to your drawing or sample, and your name on the part. If a design you bring us is covered by someone else's patent, our engineers rework the parts or the appearance until it no longer conflicts with that patent.",
  linkLabel: "See what we develop",
  href: "/downloads",
};

export const teaser3: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-hero-lockcase.webp",
        label: "Original catalog photograph of door-control hardware",
      },
      title: "Send us your hardware requirements",
      subtitle: "We'll match your project with the right export engineer",
      href: "/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/hyde-client-black-hinge.webp",
        label: "Black door hinge with staggered fixing holes on a light background",
      },
      title: "Specify with confidence",
      subtitle: "Answers on installation, finishes, standards and lead times",
      href: "/faq",
    },
  ],
};

export const text3: TextModuleContent = {
  heading: "Engineering for Export",
  body: "Finish selection, master-key systems and specification detail for each market.",
  linkLabel: "Contact us",
  href: "/contact",
};

export const hero5: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "2400 / 1464",
    src: "/images/editorial/home-editorial-insight.webp",
    label: "Abstract architectural light study with glass and metal surfaces",
  },
  title: "Hardware Specification",
  linkLabel: "Talk to export",
  href: "/contact",
};

/** Spacer heights in px, matched to the measured values at each breakpoint. */
export const spacers: Record<string, SpacerHeights> = {
  s96: { default: 96 },
  s48: { default: 48 },
  s384: { default: 96, md: 136, lg: 384 },
  s288lg: { default: 96, md: 136, lg: 288 },
  s288xl: { default: 96, md: 192, xl: 288 },
};
