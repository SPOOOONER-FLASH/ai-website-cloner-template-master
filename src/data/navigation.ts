import navigation from "../../content/navigation.json";
import settings from "../../content/site-settings.json";
import { localisedHref } from "../lib/spanish-mirror";

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
  /**
   * The Alibaba storefront.
   *
   * This site's job is to produce enquiries by email and to hand buyers who already work
   * through Alibaba a direct route there — those are the two ways a customer actually
   * reaches this company. An empty storefront hides the link rather than rendering a
   * dead one.
   */
  alibaba: {
    storefront: string;
    label: string;
    /**
     * Storefront search path, with {q} for the query. Lives in content so it can be
     * corrected without a deploy — the storefront serves a captcha to non-browsers, so
     * nothing here can verify Alibaba's URL shape automatically.
     */
    searchTemplate?: string;
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
 * Re-exported so components keep asking one module about navigation. The implementation
 * sits in src/lib/spanish-mirror.ts next to `hasSpanishMirror`, which it has to agree
 * with — it used to keep a second copy of that list here, and they drifted. See the note
 * there.
 */
export { localisedHref };
