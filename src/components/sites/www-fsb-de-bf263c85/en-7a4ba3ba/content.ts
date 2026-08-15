import type {
  HeroModuleContent,
  PageTeaserContent,
  SpacerHeights,
  TextModuleContent,
} from "@/types/fsb-modules";

/**
 * [SUB] Placeholder copy for the Canton Hyland prototype.
 *
 * None of this is taken from the target site. Character counts and line counts are held
 * close to the original so every module renders at the height measured during extraction
 * and the page's vertical rhythm is unchanged.
 *
 * Theme: Canton Hyland — Chinese door lock and architectural hardware manufacturer,
 * ANSI Grade 3 / ISO 9001, supplying overseas architects and project buyers.
 */

export const hero1: HeroModuleContent = {
  variant: "stacked",
  media: { ratio: "2880 / 1391", src: "/images/hero-architectural-door-handle.jpg", label: "Stainless steel lever handle and lock on a panelled door" },
  title: "Canton Hyland CH-1138 Lever Relaunch",
  body: "The mortise range is back.",
  linkLabel: "Learn more",
};

export const teaser1: PageTeaserContent = {
  heading: "Two ways to source our products",
  cards: [
    {
      media: { ratio: "1 / 1", src: "/images/card-distributors-lever.jpg", label: "Brushed steel lever handle on a white door panel" },
      title: "For distributors",
      subtitle: "Order from the Canton Hyland export catalogue",
    },
    {
      media: { ratio: "1 / 1", src: "/images/card-specifiers-lever.jpg", label: "Silver lever handle on a timber door in a contemporary interior" },
      title: "For specifiers",
      subtitle: "Configure and schedule hardware in the CH Project Planner",
    },
  ],
};

export const hero2: HeroModuleContent = {
  variant: "stacked",
  media: { ratio: "2880 / 1481", src: "/images/hero-product-collection.jpg", label: "Grey door with a slimline metal lever and Euro cylinder keyhole" },
  title: "The Canton Hyland Product Collection Overview",
  // 4 lines at the 332px caption column, matching the target
  body: "More than a parts list: this is how we expect hardware to be specified, checked and signed off.",
  linkLabel: "Learn more",
};

export const text1: TextModuleContent = {
  heading: "Projects – Where Canton Hyland Takes Shape",
  body: "These projects show how our products perform in office towers, hotels, private residences, restaurants, academic buildings, government facilities and transport hubs across more than thirty export markets.",
  linkLabel: "Overview",
};

export const teaser2: PageTeaserContent = {
  cards: [
    {
      media: { ratio: "1 / 1", src: "/images/project-office-corridor.jpg", label: "Minimalist office corridor with flush doors and timber flooring" },
      title: "Riverside Tower, Guangzhou",
      subtitle: "Ambit Architects",
    },
    {
      media: { ratio: "1 / 1", src: "/images/project-civic-entrance.jpg", label: "Entrance lobby with a matt black door and minimal detailing" },
      title: "Nanhai Civic Library, Foshan",
      subtitle: "Studio Kepler Partners",
    },
  ],
};

export const hero3: HeroModuleContent = {
  variant: "side",
  // Source intrinsic ratio is 1940/1293; the target renders it in a 970x646 box (it floors
  // the half-pixel). Using the rendered box keeps the module height exact — the two ratios
  // differ by 0.08% and are visually identical.
  media: { ratio: "970 / 646", src: "/images/hero-designed-for.jpg", label: "Close-up of a lever handle and lock case on a timber door" },
  title: "Designed For",
  body: "Four certified product families",
  linkLabel: "Download here",
};

export const hero4: HeroModuleContent = {
  variant: "stacked",
  media: { ratio: "2880 / 1920", src: "/images/hero-company-corridor.jpg", label: "Corridor of a modern building lined with glazed black doors" },
  title: "About Us",
  // 8 lines at the 332px caption column, matching the target
  body: "For more than three decades Canton Hyland has manufactured door locks and architectural hardware in Guangdong, China. Mortise locks, levers, closers and exit devices, tested to ANSI/BHMA Grade 3 under an ISO 9001 system, shipped to specifiers in over thirty markets.",
  linkLabel: "Learn more",
};

export const text2: TextModuleContent = {
  heading: "Service + Downloads",
  // 2 lines at the 680px copy column, matching the target
  body: "Whether it is technical guidance, submittal support or a tailored finish: the team supplies BIM files, schedules and test documentation.",
  linkLabel: "Our Services at a Glance",
};

export const teaser3: PageTeaserContent = {
  cards: [
    {
      media: { ratio: "1 / 1", src: "/images/card-contact-glass-doors.jpg", label: "Frameless glass double doors with full-height pull handles" },
      title: "Get in Touch!",
      subtitle: "We'll match you with the right export engineer",
    },
    {
      media: { ratio: "1 / 1", src: "/images/card-faq-white-corridor.jpg", label: "Bright corridor with white doors and matching lever hardware" },
      title: "Frequently Asked Questions",
      subtitle: "Quick answers on grades, standards and lead times",
    },
  ],
};

export const text3: TextModuleContent = {
  heading: "Insights",
  body: "Our notes cover product development, finish selection and the standards work behind architectural hardware specification.",
  linkLabel: "Inspiring Insights",
};

export const hero5: HeroModuleContent = {
  variant: "stacked",
  media: { ratio: "2880 / 1757", src: "/images/hero-insights-hallway.jpg", label: "Daylit hallway in a modern apartment with flush timber doors" },
  title: "Specifying Hardware for Export Projects",
  linkLabel: "Learn more",
};

/** Spacer heights in px, matched to the measured values at each breakpoint. */
export const spacers: Record<string, SpacerHeights> = {
  s96: { default: 96 },
  s48: { default: 48 },
  s384: { default: 96, md: 136, lg: 384 },
  s288lg: { default: 96, md: 136, lg: 288 },
  s288xl: { default: 96, md: 192, xl: 288 },
};
