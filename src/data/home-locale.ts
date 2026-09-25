import * as en from "./home";
import * as es from "./home-es";
import * as pt from "./home-pt";
import type { Locale } from "./locales.ts";
import { dict } from "../lib/i18n.ts";

/**
 * The home page copy of any locale.
 *
 * English, Spanish and Portuguese are three hand-written modules. The seven overlay
 * locales are the English module read through `dict()`: every string through the
 * locale's ui.json (content/i18n/<code>/ui.json, keyed by the English sentence), every
 * `href` through `localisedHref` so "/products/lock-cases" becomes
 * "/de/products/lock-cases". Image paths are not strings anyone translates, and a
 * `src` key is not an href, so they pass through untouched.
 */
type HomeContent = typeof en;

export function homeContent(locale: Locale): HomeContent {
  if (locale === "en") return en;
  if (locale === "es") return es as unknown as HomeContent;
  if (locale === "pt") return pt as unknown as HomeContent;
  return dict({ en }, locale);
}
