/**
 * 社交主页。现在由后台「网站设置」维护 —— 换个账号不该需要改代码。
 * 导出名保持不变，页脚和菜单抽屉的调用处一行都不用动。
 */
/*
  The extension is required, not decorative. `node --test` runs these modules directly
  with type stripping and resolves ESM strictly, so an extensionless relative import throws
  ERR_MODULE_NOT_FOUND the moment a test pulls this file in. It did not before 2026-09-16
  because nothing under test imported site.ts; the product finder does now, for `locales`.
*/
import { siteSettings } from "./navigation.ts";
import { hasSpanishMirror } from "../lib/spanish-mirror.ts";

export { hasSpanishMirror };

export const socialLinks = siteSettings.social;

/**
 * Single source of truth for site-level SEO values.
 *
 * Indexing is ON — the site is live on cantonlock.com. `indexable` below is the master
 * switch; flipping it to false takes the whole site out of search in one edit.
 */

/**
 * Canonical origin. Every canonical URL, sitemap entry and Open Graph URL is built
 * from this, so it must be the address the site should be indexed under — not
 * whichever host happens to be serving it.
 *
 * Live on the production domain since 2026-08-26. The apex is canonical; www 301s to it.
 */
export const siteUrl = "https://cantonlock.com";

/**
 * Master switch for search indexing.
 *
 * Kept false for the whole staging period: indexing spoonercantonlock.stahlock.com
 * would have attached this catalogue to a different brand and then competed with the
 * real domain as duplicate content. Turned on when cantonlock.com went live.
 *
 * It also gates analytics (see above) and llms.txt, so a staging clone stays silent
 * on every surface at once rather than needing three separate switches.
 */
export const indexable = true;

/**
 * Analytics property IDs.
 *
 * Only loaded when `indexable` is true — a staging host must not report into the
 * production property. An empty string disables that tool entirely.
 */
export const analytics = {
  /** Google Analytics 4 measurement ID. */
  ga4Id: "G-RBTE7KF82P",
  /** Microsoft Clarity project ID — session replay and heatmaps. */
  clarityId: "y8utyrgvv0",
  /**
   * Google Tag Manager container.
   *
   * GTM is a loader for other tags, not a measurement tool itself. GA4 and Clarity
   * above are still loaded DIRECTLY by Analytics.tsx, so this container is empty of
   * them on purpose.
   *
   * IF YOU ADD A GA4 TAG INSIDE GTM, REMOVE ga4Id ABOVE IN THE SAME CHANGE.
   * Two GA4 loaders on one page double every session, every event and every
   * conversion, and the inflated numbers look exactly like growth. Same for Clarity.
   */
  gtmId: "GTM-MQHHPGJL",
  /**
   * IndexNow key. Bing and Yandex fetch https://cantonlock.com/<key>.txt to prove
   * we own the domain, then accept instant submissions instead of waiting for a crawl.
   */
  indexNowKey: "6bb09b9b67d0e605a292835469627988",
};

export const siteName = "Canton Hyland";
export const legalName = siteSettings.legalName;

/*
  Locale routing. The list itself lives in ./locales.ts, which imports nothing — see the
  note there on why it had to leave this file. Re-exported so every existing
  `from "@/data/site"` keeps working.
*/
import type { Locale } from "./locales.ts";
export { locales, type Locale } from "./locales.ts";

export const defaultTitle: Record<Locale, string> = {
  en: "Canton Hyland — Panic Exit Devices & Door Hardware Factory",
  es: "Canton Hyland — Fabricante de barras antipánico y herrajes",
  pt: "Canton Hyland — Fabricante de barras antipânico e ferragens",
};

export const defaultDescription: Record<Locale, string> = {
  // "architectural ironmongery" is what UK, Irish, Gulf and ANZ project buyers call this trade (client 2026-09-25,
  // docs/collaboration/tasks/2026-09-25-ironmongery-customize-brief.md). Once here, not in every title.
  en: "Door hardware and architectural ironmongery from China: panic exit devices, mortise locks, levers and hinges, tooled to your drawing. ISO 9001.",
  es: "Fabricante chino de barras antipánico, cerraduras de embutir, manijas y herrajes arquitectónicos. Certificado ISO 9001, exportando a más de treinta mercados.",
  pt: "Fabricante chinês de barras antipânico, fechaduras de embutir, maçanetas, dobradiças e ferragens arquitetónicas. Certificado ISO 9001, exportando para mais de trinta mercados.",
};

/** Absolute URL helper — path must start with "/". */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * ⚠ THE SPANISH SITE IS A PARTIAL MIRROR, NOT A FULL ONE.
 *
 * Built in Spanish:  /  /company  /contact  /projects  /projects/[slug]
 *                    /products  /products/[category]  /products/[category]/[slug]
 * English only:      /downloads, /news, /faq and the rest of the support pages
 *
 * This matters for SEO correctness. An `hreflang` pointing at a URL that 404s is worse
 * than no `hreflang` at all — Search Console reports it as an error and can discount the
 * whole language cluster. So alternates are only declared for paths that genuinely exist
 * in both languages.
 *
 * The fifteen canonical product categories and all current product details are mirrored.
 * The list itself lives in src/lib/spanish-mirror.ts so it can be unit-tested without
 * pulling in path aliases.
 */
/**
 * Locale alternates for a given path, used for hreflang.
 * `enPath` is the English path; the Spanish mirror is the same path under /es.
 */
export function localeAlternates(enPath: string) {
  const clean = enPath === "/" ? "" : enPath.replace(/\/$/, "");
  return {
    en: absoluteUrl(`${clean}/` || "/"),
    es: absoluteUrl(`/es${clean}/`),
  };
}
