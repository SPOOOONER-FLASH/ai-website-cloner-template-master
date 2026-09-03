/**
 * Which English paths have a Spanish twin.
 *
 * An `hreflang` pointing at a URL that 404s is worse than no `hreflang` at all — Search
 * Console reports it and can discount the whole language cluster — so this list must
 * stay in step with the routes that actually exist under src/app/es/.
 *
 * `/products` joined the prefixes on 2026-08-30 when the Spanish catalogue shipped:
 * the index, the fifteen canonical category pages and all current product details. That made the
 * `/products/argentina-ar4` exact-path exception redundant, since the prefix now covers
 * it — the market collection keeps its own route, but no longer needs its own entry.
 */
const SPANISH_MIRROR_PREFIXES = [
  "/",
  "/company",
  "/contact",
  "/projects",
  "/products",
  // 2026-09-03: the comparison tables mirror. SpecMatrix already rendered in Spanish;
  // only the page was missing, so an English buyer had fifteen comparison pages and a
  // Spanish one had none.
  "/compare",
  // Same day: the sub-category collections. These needed Spanish names for the 21
  // children first — see scripts/add-subcategory-es-names.mjs.
  "/collections",
  // The guided configurator, bilingual from the day it shipped.
  "/configurator",
];

/** Exact paths that mirror without their whole prefix doing so. Empty today. */
const SPANISH_MIRROR_PATHS = new Set<string>();

/** True when the given ENGLISH path also exists under /es. */
export function hasSpanishMirror(enPath: string): boolean {
  const clean = enPath === "/" ? "/" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  if (clean === "/") return true;
  if (SPANISH_MIRROR_PATHS.has(clean)) return true;
  return SPANISH_MIRROR_PREFIXES.some(
    (prefix) => prefix !== "/" && (clean === prefix || clean.startsWith(`${prefix}/`)),
  );
}

/**
 * The Spanish href for a navigation target.
 *
 * Lives here, next to `hasSpanishMirror`, because it is the same fact asked a different
 * way. It used to live in src/data/navigation.ts with its own hard-coded
 * Set(["/company","/contact","/projects"]), and when the Spanish catalogue shipped that
 * copy was not updated: hreflang advertised a Spanish alternate on all 459 Spanish pages
 * while the menu on those pages linked back into the English tree. Nothing errored. One
 * module, one list.
 *
 * Where no Spanish route exists the English href is returned unchanged — a Spanish
 * reader gets the English page rather than a 404.
 */
export function localisedHref(href: string, locale: "en" | "es"): string {
  if (locale === "en") return href;
  return hasSpanishMirror(href) ? `/es${href}` : href;
}
