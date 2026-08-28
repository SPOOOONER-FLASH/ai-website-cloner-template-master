const SPANISH_MIRROR_PREFIXES = ["/", "/company", "/contact", "/projects"];
const SPANISH_MIRROR_PATHS = new Set(["/products/argentina-ar4"]);

/** True when the given ENGLISH path also exists under /es. */
export function hasSpanishMirror(enPath: string): boolean {
  const clean = enPath === "/" ? "/" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  if (clean === "/") return true;
  if (SPANISH_MIRROR_PATHS.has(clean)) return true;
  return SPANISH_MIRROR_PREFIXES.some(
    (prefix) => prefix !== "/" && (clean === prefix || clean.startsWith(`${prefix}/`)),
  );
}
