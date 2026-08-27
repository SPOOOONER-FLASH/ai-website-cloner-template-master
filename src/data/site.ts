/**
 * 社交主页。现在由后台「网站设置」维护 —— 换个账号不该需要改代码。
 * 导出名保持不变，页脚和菜单抽屉的调用处一行都不用动。
 */
import { siteSettings } from "./navigation";

export const socialLinks = siteSettings.social;

/**
 * Single source of truth for site-level SEO values.
 *
 * ⚠ INDEXING IS DELIBERATELY OFF. See `indexable` below — this is a decision, not an
 * oversight. Flipping one boolean turns the whole site indexable when the real domain
 * is ready; nothing else needs editing.
 */

/**
 * Canonical origin. Every canonical URL, sitemap entry and Open Graph URL is built
 * from this, so it must be the address the site should be indexed under — not
 * whichever host happens to be serving it.
 *
 * Currently the staging subdomain. Change to https://www.cantonlock.com at launch.
 */
export const siteUrl = "https://cantonlock.com";

/**
 * Master switch for search indexing.
 *
 * `false` while the site lives on a staging subdomain. Letting Google index
 * `spoonercantonlock.stahlock.com` would be actively harmful: when the real domain
 * launches, the two would compete as duplicate content and the staging URL would
 * already hold whatever authority was earned. Worse, it would attach the Canton Hyland
 * catalogue to the Stahlock domain, which is a different brand.
 *
 * Set to `true` only when:
 *   1. the site is on its final domain (siteUrl updated), AND
 *   2. placeholder copy and unverified certification claims have been signed off.
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
  clarityId: "y8t7weui0k",
};

export const siteName = "Canton Hyland";
export const legalName = siteSettings.legalName;

/** Locale routing. The Spanish site is a PARTIAL mirror — see hasSpanishMirror below. */
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultTitle: Record<Locale, string> = {
  en: "Canton Hyland — Panic Exit Devices & Door Hardware Manufacturer",
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
 * English only:      /products and everything under it, /downloads
 *
 * This matters for SEO correctness. An `hreflang` pointing at a URL that 404s is worse
 * than no `hreflang` at all — Search Console reports it as an error and can discount the
 * whole language cluster. So alternates are only declared for paths that genuinely exist
 * in both languages.
 *
 * When the Spanish product catalogue is built, add its prefix here and the hreflang tags
 * and sitemap entries start appearing automatically.
 */
const SPANISH_MIRROR_PREFIXES = ["/", "/company", "/contact", "/projects"];

/** True when the given ENGLISH path also exists under /es. */
export function hasSpanishMirror(enPath: string): boolean {
  const clean = enPath === "/" ? "/" : `/${enPath.replace(/^\/|\/$/g, "")}`;
  if (clean === "/") return true;
  return SPANISH_MIRROR_PREFIXES.some(
    (prefix) => prefix !== "/" && (clean === prefix || clean.startsWith(`${prefix}/`)),
  );
}

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
