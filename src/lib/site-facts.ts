import { categories } from "../data/categories.ts";
import { stats } from "../data/company.ts";
import { publishedProducts } from "../data/products.ts";
import type { Locale } from "../data/site.ts";

/**
 * The figures the homepage and the export desk can state, counted rather than typed.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS DERIVED AND NOT A LIST OF STRINGS
 *
 * The homepage is the page an answer engine quotes most often, and it carried exactly one
 * quotable figure — measured by scripts/audit-geo-citability.mjs, which scores a page on
 * how many numbers with units it states. Adding them by hand would have worked once and
 * then quietly gone stale: the day a product is added, a hand-typed "435 models" becomes
 * a wrong claim on the most-cited page on the site.
 *
 * So every count here is computed from the same data the catalogue renders. If the
 * catalogue grows, the homepage says the new number at the next build, and nobody has to
 * remember.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS NOT IN HERE
 *
 * No cycle count, no fire rating, no EN number. Those are per-product claims and belong
 * on the product that holds them — a headline figure like "200,000 cycles" on the
 * homepage would be read as covering the whole range, and it does not. The rule is the
 * same one the structured data follows: state what can be evidenced for the thing being
 * described, and nothing wider.
 */

export interface SiteFact {
  /** The number, on its own, so it can be set larger than its label. */
  value: string;
  label: string;
  /** Where the figure comes from, for anyone who wants to check it. */
  source: string;
}

const COPY = {
  en: {
    models: "verified product records",
    families: "catalogue categories",
    withVideo: "models with a demonstration video",
    founded: "manufacturing since",
    quality: "quality system",
    workforce: "people on site",
  },
  es: {
    models: "fichas de producto verificadas",
    families: "categorías de catálogo",
    withVideo: "modelos con vídeo de demostración",
    founded: "fabricando desde",
    quality: "sistema de calidad",
    workforce: "personas en planta",
  },
} as const;

/** A stat from company.ts, or null — never a placeholder. */
function stat(label: string): string | null {
  return stats.find((s) => s.label === label)?.value ?? null;
}

export function siteFacts(locale: Locale = "en"): SiteFact[] {
  const t = COPY[locale];
  const products = publishedProducts;
  const withVideo = products.filter((p) => (p.videos ?? []).length).length;

  const facts: SiteFact[] = [
    { value: String(products.length), label: t.models, source: "content/products" },
    { value: String(categories.length), label: t.families, source: "content/categories.json" },
  ];

  /*
    The video count only earns a slot once there are enough for the number to mean
    something. At three it reads as an apology; the threshold is deliberately visible
    rather than hidden in a ternary somebody has to decode later.
  */
  if (withVideo >= 10) {
    facts.push({ value: String(withVideo), label: t.withVideo, source: "content/products" });
  }

  const founded = stat("Founded");
  if (founded) facts.push({ value: founded, label: t.founded, source: "src/data/company.ts" });

  const quality = stat("Quality system");
  if (quality) {
    /* "ISO 9001 since 2002" — the standard is the figure, the year is the qualifier. */
    const [name, ...rest] = quality.split(" since ");
    facts.push({
      value: name,
      label: rest.length ? `${t.quality} · ${rest.join(" since ")}` : t.quality,
      source: "src/data/company.ts",
    });
  }

  const workforce = stat("Workforce");
  if (workforce) {
    facts.push({
      value: workforce.replace(/\s*(people|personas)$/i, ""),
      label: t.workforce,
      source: "src/data/company.ts",
    });
  }

  return facts;
}

/** Heading for the strip. Kept here so the page and any future locale read one string. */
export function siteFactsHeading(locale: Locale = "en"): string {
  return locale === "es" ? "La fábrica, en cifras" : "The factory, in figures";
}
