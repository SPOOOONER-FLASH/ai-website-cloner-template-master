/**
 * The locale list, on its own, with no imports.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT IN site.ts
 *
 * It was, until 2026-09-16. Then `product-finder.ts` needed `locales` as a VALUE — to
 * build one card figure per locale instead of a hand-written en/es pair — and importing it
 * from `site.ts` dragged that module's whole dependency chain into a unit test:
 * site.ts → navigation.ts → content/navigation.json, which `node --test` refuses to load
 * without an import attribute.
 *
 * The test had been pure for a reason. So the primitive moved to a leaf with no imports of
 * its own, and `site.ts` re-exports it — nothing that already said `from "@/data/site"`
 * had to change, and a unit test can now ask what the locales are without loading the
 * site's configuration.
 *
 * ---------------------------------------------------------------------------
 * ⚠ ADDING A LOCALE HERE IS NOT FREE
 *
 * `Locale` is used as the key type of a dozen copy dictionaries, so adding a member turns
 * every one of them into a compile error until it has that language. That is the intended
 * behaviour — see src/lib/localised.ts for what happens to the fields the compiler cannot
 * reach — and it is why the list is short and deliberate rather than a config value.
 */
export const locales = ["en", "es", "pt"] as const;

export type Locale = (typeof locales)[number];

/**
 * Which language a rendered path is in.
 *
 * ---------------------------------------------------------------------------
 * ⚠ WHY THIS IS A FUNCTION AND NOT `pathname.startsWith("/es")` AT EACH CALL SITE
 *
 * It was the inline version until 2026-09-17, written once in SiteHeader and once in
 * SiteFooter as `const isSpanish = pathname === "/es" || pathname.startsWith("/es/")`.
 * Both were correct and both were blind: when 645 Portuguese pages shipped on 2026-09-16
 * every one of them computed `locale = "en"`, so the header rendered English labels and —
 * worse — linked "Products" at `/products/`, walking a Portuguese reader straight out of
 * the Portuguese site. The footer's one cross-language anchor, which is the ONLY
 * server-rendered link between the trees, said "Español" on those pages.
 *
 * Nothing failed. The pages built, the tests passed, hreflang was reciprocal. The defect
 * was visible only by reading the exported HTML of /pt/index.html.
 *
 * So the derivation lives here, beside the list it derives from, and a fourth locale gets
 * picked up by every caller at once instead of by whoever remembers.
 */
export function localeFromPath(pathname: string): Locale {
  const prefix = pathname.split("/")[1];
  return (locales as readonly string[]).includes(prefix) && prefix !== "en"
    ? (prefix as Locale)
    : "en";
}

/** The path with its locale prefix removed — i.e. the English route it mirrors. */
export function englishPathOf(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (locale === "en") return pathname || "/";
  return pathname.replace(new RegExp(`^/${locale}`), "") || "/";
}
