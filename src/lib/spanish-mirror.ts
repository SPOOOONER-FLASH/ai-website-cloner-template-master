import type { Locale } from "../data/locales.ts";
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
  /*
    The faceted catalogue. Added 2026-09-04 alongside the Catalogue/Configurator switch:
    the switch offers the other mode from either page, and offering a Spanish reader a
    link to a route that only exists in English is a dead link dressed as a feature.
  */
  "/product-finder",
  "/product-studies",
  /*
    The newsroom and its eight technical articles, translated 2026-09-04. These are the
    pages an answer engine is most likely to cite — they are reference material rather
    than catalogue — so a Spanish reader arriving on one matters more here than on most
    routes. Article slugs stay in English in both locales: translating the path would
    break every hreflang pair and every link already sent to a customer.
  */
  "/news",
  // The FAQ. The page a buyer needs before they can do business at all — minimum order,
  // lead time, samples, payment terms, OEM.
  "/faq",
  // The technical library and the certificate register. Both are what a specifier asks
  // for before naming a product in a tender.
  "/downloads",
  "/certifications",
  /*
    The order-code reference, bilingual from the day it shipped. A Spanish-speaking
    specifier is exactly the reader it is for: our largest non-English market writes
    its enquiries in Spanish and its finish codes in ours.
  */
  "/finishes",
  /*
    The model-number lookup. A buyer holding an old Spanish-language quotation is the same
    buyer as the English one, and the answer is the same three tables.
  */
  "/model-lookup",
  // The specification glossary. Half the point of writing it was the Spanish reader:
  // "backset" has no settled Spanish translation, and the page says which word we use.
  "/glossary",
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
export function localisedHref(href: string, locale: Locale): string {
  if (locale === "en") return href;
  if (locale === "pt") return hasPortugueseMirror(href) ? `/pt${href}` : href;
  return hasSpanishMirror(href) ? `/es${href}` : href;
}

/**
 * Which English paths have a Portuguese twin.
 *
 * ---------------------------------------------------------------------------
 * A SEPARATE LIST, NOT A SHARED ONE
 *
 * The obvious move when Portuguese arrived was to rename this module and have one list of
 * "mirrored paths" for both locales. That would be wrong for exactly the reason the
 * Spanish list exists: an hreflang pointing at a 404 is worse than no hreflang, Search
 * Console reports it, and it can discount the whole language cluster. Spanish and
 * Portuguese are at different stages and will be for a while, so they need to be able to
 * disagree about which routes exist.
 *
 * Portuguese started on 2026-09-16 from a Brazilian enquiry (SAGA Portas, São Paulo). The
 * order below is the buying path, not the sitemap: a buyer arrives on the catalogue, wants
 * to know what we can document, and then asks about quantities and lead time.
 */
const PORTUGUESE_MIRROR_PREFIXES = [
  "/",
  /* The catalogue. This is where the 96% translated product data actually shows. */
  "/products",
  /* What a compliance-driven buyer reads before naming us in a tender. */
  "/certifications",
  /* Minimum order, lead time, samples, payment, OEM — the page that lets business start. */
  "/faq",
  "/company",
  "/contact",
  /* The comparison tables and the sub-category collections: both render from product data,
     which is already Portuguese, so the marginal cost was one route each. */
  "/compare",
  "/collections",
  /* The order-code reference. A Brazilian specifier writes finish codes in ours. */
  "/finishes",
  "/model-lookup",
  "/glossary",
  /*
    The newsroom, added 2026-09-17.

    These 35 technical articles are the pages this site is actually cited for — Bing's
    generative-citation report attributes 25 citations to the push-bar article alone, and
    17 to the Spanish handing article. They existed in English and Spanish and not in
    Portuguese, so a Brazilian specifier who followed one of those citations landed on a
    page with no counterpart in their language.

    The route ships before the translations are finished, on purpose. `NewsDetail` renders
    a translated body only when it is complete paragraph for paragraph, and the English one
    otherwise — so an untranslated article reads as English on a Portuguese page rather
    than as half of each. Visibly incomplete gets fixed; a mixed page looks finished.
  */
  "/news",
  /*
    Added 2026-09-17, after the client reported the defect these prefixes exist to prevent:
    「点选葡萄牙语，选择产品配置器和首页又变成了英文」.

    A nav item with no mirror does not degrade — it EJECTS. "Localizador" pointed at
    /product-finder/, and from that English page every subsequent link was English too, so
    one missing route cost the reader the language for the rest of the visit. These five
    are the routes the Spanish mirror had and the Portuguese one did not.

    /products/argentina-ar4 stays out: it is a market collection for Argentina, and the
    exception above records why.
  */
  "/product-finder",
  "/configurator",
  "/downloads",
  "/projects",
  "/product-studies",
];

/**
 * Paths that a prefix above would otherwise claim, and which have no Portuguese route.
 *
 * `/products` covers the catalogue, and `/products/argentina-ar4` is not part of it — it is
 * a market collection for Argentina with its own route, built in English and Spanish only.
 * The prefix match said otherwise, so every product page advertised a Portuguese alternate
 * at a URL that does not exist. `audit-seo` caught it as `hreflang-target-missing`, which
 * is exactly the error hreflang is punished for.
 */
const PORTUGUESE_MIRROR_EXCEPTIONS = new Set(["/products/argentina-ar4"]);

/** True when the given ENGLISH path also exists under /pt. */
export function hasPortugueseMirror(enPath: string): boolean {
  const clean = enPath === "/" ? "/" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  if (clean === "/") return true;
  if (PORTUGUESE_MIRROR_EXCEPTIONS.has(clean)) return false;
  return PORTUGUESE_MIRROR_PREFIXES.some(
    (prefix) => prefix !== "/" && (clean === prefix || clean.startsWith(`${prefix}/`)),
  );
}

/**
 * Routes that exist in ONE language and have no English original.
 *
 * ---------------------------------------------------------------------------
 * WHY A PAGE WOULD BE WRITTEN THIS WAY, AND WHY IT BREAKS THE MIRROR MODEL
 *
 * /pt/ferragens-porta-corta-fogo/ is a Brazilian fire-door page written for a market that
 * reads ABNT rather than EN 1125. It is not a translation of anything; there is no English
 * page it corresponds to. Every other localised route on this site is `/{locale}` + an
 * English path, which is the assumption the whole module is built on — strip the prefix,
 * ask whether the mirror exists.
 *
 * Strip the prefix here and you get `/ferragens-porta-corta-fogo/`, which is not a route.
 * On 2026-09-17 the footer offered exactly that as its "English" link and the dead-link
 * audit caught it: one broken target, on the one page that most needed to work, since it
 * is the landing page the SAGA Portas enquiry came in through.
 *
 * Listed by their PREFIX-STRIPPED path so the lookup matches the rest of this module.
 */
const LOCALE_ONLY_ROUTES = new Map<string, Locale>([["/ferragens-porta-corta-fogo", "pt"]]);

/** The single language a route exists in, or null when it is a normal mirrored path. */
export function soleLocaleOf(enPath: string): Locale | null {
  const clean = enPath === "/" ? "/" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  return LOCALE_ONLY_ROUTES.get(clean) ?? null;
}

/** Every locale whose mirror of this English path exists. Always includes "en". */
export function mirrorsOf(enPath: string): Locale[] {
  const sole = soleLocaleOf(enPath);
  if (sole) return [sole];
  const locales: Locale[] = ["en"];
  if (hasSpanishMirror(enPath)) locales.push("es");
  if (hasPortugueseMirror(enPath)) locales.push("pt");
  return locales;
}

/**
 * Where a language switch on this page should point, and whether it is really this page.
 *
 * One function for the footer anchors and the panel's language column, because they have
 * to agree — a reader who sees Português in the panel and Português in the footer is
 * entitled to land in the same place, and the two lists drifted apart once already.
 *
 * `samePage: false` is the honest branch: no link out of a language switch may 404, so a
 * page with no counterpart sends the reader to that language's home and the UI says so.
 */
export function mirrorHref(
  enPath: string,
  code: Locale,
): { href: string; samePage: boolean } {
  const home = code === "en" ? "/" : `/${code}`;
  if (!mirrorsOf(enPath).includes(code)) return { href: home, samePage: false };
  if (code === "en") return { href: enPath || "/", samePage: true };
  return { href: `/${code}${enPath === "/" ? "" : enPath}`, samePage: true };
}
