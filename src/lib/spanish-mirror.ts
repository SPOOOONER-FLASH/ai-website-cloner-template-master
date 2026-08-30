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
const SPANISH_MIRROR_PREFIXES = ["/", "/company", "/contact", "/projects", "/products"];

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
