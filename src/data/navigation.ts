import navigation from "../../content/navigation.json";
import settings from "../../content/site-settings.json";

/**
 * Navigation and site settings, editable from the CMS.
 *
 * These used to be literals inside SiteHeader and SiteFooter. Moving them into content/
 * is what makes the "导航菜单" and "网站设置" screens in the admin real rather than
 * decorative — a colleague reordering the menu or fixing a phone number should not need
 * a developer, and that was the whole point of the exercise.
 *
 * They stay JSON imports rather than a generated barrel because there is exactly one of
 * each; the barrel generator exists to enumerate folders, and there is no folder here.
 */

export interface NavLink {
  label: string;
  labelEs?: string;
  href: string;
}

export interface SiteSettings {
  /** The brand, shown as the logo. */
  brandName: string;
  /** The company behind the brand, for the footer and structured data. */
  legalName: string;
  copyright: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postcode: string;
    country: string;
  };
  social: NavLink[];
  /**
   * Third-party ids. Empty means the tag is not emitted at all — an empty GA id must
   * never render a script tag with a blank measurement id, because that is a request to
   * Google on every page load that measures nothing.
   */
  analytics: {
    googleAnalyticsId: string;
    googleSiteVerification: string;
    facebookPixelId: string;
    tiktokPixelId: string;
  };
}

export const headerNav = navigation.header as NavLink[];
export const footerNav = navigation.footer as NavLink[];
export const siteSettings = settings as SiteSettings;

/**
 * Spanish label with an English fallback.
 *
 * Falling back rather than hiding is deliberate: a menu that silently loses an item
 * because nobody translated it is worse than one that shows the English word.
 */
export function navLabel(link: NavLink, locale: "en" | "es"): string {
  return locale === "es" ? (link.labelEs ?? link.label) : link.label;
}

/**
 * Spanish routes exist for only part of the site. Where they do, prefix; where they do
 * not, send Spanish visitors to the English page rather than to a 404.
 */
const SPANISH_ROUTES = new Set(["/company", "/contact", "/projects"]);

export function localisedHref(href: string, locale: "en" | "es"): string {
  if (locale === "en") return href;
  return SPANISH_ROUTES.has(href) ? `/es${href}` : href;
}
