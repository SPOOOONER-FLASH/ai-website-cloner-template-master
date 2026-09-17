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
