/**
 * 社交主页。现在由后台「网站设置」维护 —— 换个账号不该需要改代码。
 * 导出名保持不变，页脚和菜单抽屉的调用处一行都不用动。
 */
import { siteSettings } from "./navigation";
import { hasSpanishMirror } from "../lib/spanish-mirror";

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
   * IndexNow key. Bing and Yandex fetch https://cantonlock.com/<key>.txt to prove
   * we own the domain, then accept instant submissions instead of waiting for a crawl.
   */
  indexNowKey: "6bb09b9b67d0e605a292835469627988",
};

export const siteName = "Canton Hyland";
export const legalName = siteSettings.legalName;

/** Locale routing. The Spanish site is a PARTIAL mirror — see hasSpanishMirror below. */
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultTitle: Record<Locale, string> = {
  en: "Canton Hyland — Panic Exit Devices & Door Hardware Factory",
  es: "Canton Hyland — Fabricante de barras antipánico y herrajes",
};

export const defaultDescription: Record<Locale, string> = {
  en: "Chinese manufacturer of panic exit devices, mortise locks, lever handles, hinges and architectural door hardware. ISO 9001 certified, exporting to 30+ markets.",
  es: "Fabricante chino de barras antipánico, cerraduras de embutir, manillas y herrajes arquitectónicos. Certificado ISO 9001, exportando a más de treinta mercados.",
};

/** Absolute URL helper — path must start with "/". */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * ⚠ THE SPANISH SITE IS A PARTIAL MIRROR, NOT A FULL ONE.
 *
 * Built in Spanish:  /  /company  /contact  /projects  /projects/[slug]
 *                    /products/argentina-ar4 (a market-specific collection)
 * English only:      the general /products catalogue and product details, /downloads
 *
 * This matters for SEO correctness. An `hreflang` pointing at a URL that 404s is worse
 * than no `hreflang` at all — Search Console reports it as an error and can discount the
 * whole language cluster. So alternates are only declared for paths that genuinely exist
 * in both languages.
 *
 * Exact-path mirrors belong in SPANISH_MIRROR_PATHS. When the full Spanish product
 * catalogue exists, add the /products prefix and remove the exact-path exception.
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
