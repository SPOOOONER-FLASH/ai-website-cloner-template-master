import { getProductByModel } from "../data/products.ts";
import type { Locale } from "../data/site.ts";

/**
 * The two panic exit devices the factory tooled itself — 307 and 311.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE TWO GET A SECTION OF THEIR OWN
 *
 * The client's instruction, 2026-09-08: these are the models they spent over ¥100,000 in
 * tooling on, and they are the products they compete on. That figure is theirs and is NOT
 * published here — a buyer does not care what our mould cost, and a number like that on a
 * public page reads as either a boast or a price signal. What the buyer cares about is
 * the thing the money bought, which is that the mould is in our building.
 *
 * That claim is already made in the capability chain on /company ("the moulds and dies
 * behind the catalogue are ours"). A claim like that is worth exactly as much as the
 * example a reader can check, and these two are the example. So the section shows the
 * parts, not the investment.
 *
 * ---------------------------------------------------------------------------
 * EVERY FIGURE IS READ FROM THE PRODUCT RECORD
 *
 * Nothing here is typed. The bar length, the fire rating, the centre distances and the
 * set contents are pulled from `content/products/307-panic-exit-device.json` and
 * `311-panic-exit-device.json` at build time, so the day the factory corrects a spec the
 * homepage corrects with it. If a spec row disappears, its line disappears — the section
 * never shows a stale figure and never invents a missing one.
 *
 * If either product goes missing from the catalogue the section returns null and the
 * homepage simply does not render it, rather than shipping an empty frame.
 */

/** The models, in the order the client names them. */
const FLAGSHIP_MODELS = ["307", "311"] as const;

/**
 * Spec rows worth surfacing, in priority order, with how to label them on the homepage.
 *
 * A product page shows every row; a homepage section that did the same would be a second
 * product page. These are the rows a specifier decides on: how long the bar is, whether
 * it is fire rated, what centres it drills to, and what is in the box.
 */
const SURFACED: { labels: string[]; en: string; es: string }[] = [
  { labels: ["Fire Rating"], en: "Fire rating", es: "Resistencia al fuego" },
  { labels: ["Bar Length", "Size"], en: "Bar length", es: "Longitud de barra" },
  {
    labels: ["2. Dual center distances", "Dual center distances", "Centre distance"],
    en: "Centre distances",
    es: "Distancias entre ejes",
  },
  { labels: ["Set Includes"], en: "Set includes", es: "El conjunto incluye" },
  { labels: ["Application"], en: "Application", es: "Aplicación" },
];

/** How many rows one card shows before it stops being a summary. */
const MAX_ROWS = 3;

export interface FlagshipCard {
  model: string;
  href: string;
  image: { src: string; ratio: string; label: string; labelEs?: string };
  rows: { label: string; value: string }[];
}

export function flagshipTooling(locale: Locale = "en"): FlagshipCard[] | null {
  const cards: FlagshipCard[] = [];

  for (const model of FLAGSHIP_MODELS) {
    const product = getProductByModel(model);
    /*
      No product, or no photograph, means no card — and one missing card collapses the
      whole section. A "flagship pair" showing one item is not the point being made.
    */
    if (!product?.heroImage?.src) return null;

    const rows: { label: string; value: string }[] = [];
    for (const surfaced of SURFACED) {
      if (rows.length >= MAX_ROWS) break;
      const spec = (product.specs ?? []).find((s) => surfaced.labels.includes(s.label));
      if (!spec?.value) continue;
      rows.push({
        label: locale === "es" ? surfaced.es : surfaced.en,
        /* Some rows carry a trailing clause the client wrote; keep it, trim the padding. */
        value: String(spec.value).trim(),
      });
    }

    if (!rows.length) return null;

    cards.push({
      model: product.model,
      href: `/products/${product.categoryPath.join("/")}/${product.slug}/`,
      image: product.heroImage as FlagshipCard["image"],
      rows,
    });
  }

  return cards.length === FLAGSHIP_MODELS.length ? cards : null;
}

export const flagshipCopy = {
  en: {
    eyebrow: "Tooled here",
    title: "307 and 311",
    intro:
      "Two panic exit devices built on moulds we cut ourselves. That is the difference a specifier feels rather than reads: the bar length, the centres and the fire rating are ours to hold to, and a change to any of them is a production decision made by people who can walk to the press.",
    cta: "See the full panic exit range",
    ctaHref: "/products/panic-exit-devices/",
  },
  es: {
    eyebrow: "Utillaje propio",
    title: "307 y 311",
    intro:
      "Dos dispositivos antipánico fabricados con moldes que cortamos nosotros. Ésa es la diferencia que un prescriptor nota antes de leerla: la longitud de barra, las distancias entre ejes y la resistencia al fuego son nuestras para sostenerlas, y cambiar cualquiera de ellas es una decisión de producción que toman personas que pueden ir andando hasta la prensa.",
    cta: "Ver toda la gama antipánico",
    ctaHref: "/es/products/panic-exit-devices/",
  },
} as const;
