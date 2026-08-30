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
  title: "Modern Tubular Door Lock",
  body: "A restrained matt-black lever set for contemporary residential interiors.",
  linkLabel: "View Modern Tubular Door Lock",
  href: "/products/lever-handles/black-tubular-lever-lock-set",
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
      body: "Fast-release hardware engineered for dependable emergency egress in commercial buildings.",
      linkLabel: "Explore exit devices",
      href: "/products/panic-exit-devices/305-fire-door-panic-exit-device",
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
      body: "Lock bodies in multiple backset, centre-distance and bolt configurations for commercial door schedules.",
      linkLabel: "View lock cases",
      href: "/products/lock-cases",
    },
  ],
};

export const teaser1: PageTeaserContent = {
  heading: "Two ways to source our products",
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/material-brushed-steel.webp",
        label: "Brushed stainless steel material study with directional grain",
      },
      title: "For distributors",
      subtitle: "Order from the Canton Hyland export catalogue",
      href: "/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/material-metal-stone-detail.webp",
        label: "Representative metal, stone, timber, and glass junction study",
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
  body: "Our flagship safety-hardware range for fast release on commercial and emergency escape doors.",
  linkLabel: "Explore the flagship range",
  href: "/products/panic-exit-devices",
};

export const text1: TextModuleContent = {
  heading: "Projects – Where Canton Hyland Takes Shape",
  body: "Our panic devices, lock cases, lever sets and floor springs are specified in commercial, institutional and residential buildings across more than thirty export markets, backed by master key and construction key systems.",
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
    src: "/images/editorial/home-design-context.webp",
    label: "Architectural door rhythm with timber, stone, and metal junctions",
  },
  title: "Designed For",
  body: "Nine product families",
  linkLabel: "Browse the catalogue",
  href: "/products",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: {
    ratio: "3 / 2",
    src: "/images/editorial/home-material-library.webp",
    label: "Representative material-library study in limestone, brushed metal, bronze and oak",
  },
  title: "Materials + Engineering",
  body: "Finish coordination, master-key planning and export documentation support commercial and residential hardware schedules across international markets.",
  linkLabel: "How we work",
  href: "/company",
};

export const text2: TextModuleContent = {
  heading: "Service + Downloads",
  // 2 lines at the 680px copy column, matching the measured module height
  body: "We welcome OEM partnerships and develop custom solutions to specific client requirements, with technical support from our own engineering team.",
  linkLabel: "Our Services at a Glance",
  href: "/downloads",
};

export const teaser3: PageTeaserContent = {
  cards: [
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/material-bronze-patina.webp",
        label: "Bronze surface with natural patina and tonal variation",
      },
      title: "Get in Touch!",
      subtitle: "We'll match you with the right export engineer",
      href: "/contact",
    },
    {
      media: {
        ratio: "1 / 1",
        src: "/images/editorial/industrial-precision-parts.webp",
        label: "Representative editorial study of precision-machined components",
      },
      title: "Frequently Asked Questions",
      subtitle: "Quick answers on grades, standards and lead times",
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
