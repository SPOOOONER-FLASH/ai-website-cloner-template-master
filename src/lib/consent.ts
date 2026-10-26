/**
 * Analytics consent — who is asked, what is remembered, what is cleared.
 *
 * 2026-10-23. Until today GA4 and Clarity loaded on every page for every visitor, and the
 * privacy notice argued legitimate interest. For a reader in the EEA, the UK or
 * Switzerland that does not hold: both tools write cookies (`_ga`, `_ga_<id>`, `_clck`,
 * `_clsk`), and storing a non-essential cookie needs prior consent (ePrivacy Art. 5(3),
 * §25 TDDDG in Germany) whatever the GDPR basis for the processing afterwards.
 *
 * So the site asks — but only where it has to. The export is static: there is no server
 * that sees the visitor's country, and Cloudflare cannot change cached HTML per visitor.
 * The browser's time zone is the signal that is available. It over-asks rather than
 * under-asks: every `Europe/*` zone is treated as requiring consent, including Moscow
 * and Istanbul, and so is a browser whose time zone cannot be read. A visitor anywhere
 * else is measured as before and can switch it off from "Cookie settings" in the footer.
 * `CONSENT_SCOPE` in src/data/site.ts changes that to "everywhere" in one word.
 */

export type ConsentChoice = "granted" | "denied";

/** What the page should do on arrival: load the tags, keep them off, or show the banner. */
export type ConsentState = ConsentChoice | "ask";

export type ConsentScope = "europe" | "everywhere";

/**
 * localStorage, not a cookie: remembering the answer is strictly necessary and never
 * leaves the browser. The version suffix lets a change in what we load ask again.
 */
export const CONSENT_KEY = "hyde-analytics-consent";
export const CONSENT_VERSION = 1;

/** Fired on window when the visitor answers, or asks to see the banner again. */
export const CONSENT_EVENT = "hyde:consent";
export const CONSENT_OPEN_EVENT = "hyde:consent-open";

/**
 * EEA, UK and Switzerland zones that are not under `Europe/`: Cyprus, the Canaries,
 * Madeira and the Azores, Iceland, the Faroes, Svalbard, and the EU's outermost regions.
 */
const EXTRA_CONSENT_ZONES = new Set([
  "Asia/Nicosia",
  "Asia/Famagusta",
  "Atlantic/Canary",
  "Atlantic/Madeira",
  "Atlantic/Azores",
  "Atlantic/Reykjavik",
  "Atlantic/Faroe",
  "Arctic/Longyearbyen",
  "America/Guadeloupe",
  "America/Martinique",
  "America/Cayenne",
  "America/St_Barthelemy",
  "America/Marigot",
  "Indian/Reunion",
  "Indian/Mayotte",
]);

export function consentRequired(timeZone: string | undefined, scope: ConsentScope = "europe"): boolean {
  if (scope === "everywhere") return true;
  if (!timeZone) return true;
  return timeZone.startsWith("Europe/") || EXTRA_CONSENT_ZONES.has(timeZone);
}

export function serialiseChoice(choice: ConsentChoice): string {
  return `${CONSENT_VERSION}:${choice}`;
}

/** An answer given under an older version, or anything unreadable, counts as no answer. */
export function parseChoice(raw: string | null | undefined): ConsentChoice | null {
  if (!raw) return null;
  const [version, choice] = raw.split(":");
  if (version !== String(CONSENT_VERSION)) return null;
  return choice === "granted" || choice === "denied" ? choice : null;
}

/**
 * A stored answer always wins, in both directions: a visitor outside Europe who said no
 * stays unmeasured, and one in Europe who said yes is not asked on every page.
 */
export function initialConsent(
  stored: ConsentChoice | null,
  timeZone: string | undefined,
  scope: ConsentScope = "europe",
): ConsentState {
  if (stored) return stored;
  return consentRequired(timeZone, scope) ? "ask" : "granted";
}

/** First-party cookies GA4 and Clarity write; the ones a withdrawal deletes. */
const ANALYTICS_COOKIE = /^(_ga|_ga_[A-Z0-9]+|_gid|_gat(_.*)?|_clck|_clsk)$/;

export function analyticsCookieNames(cookieHeader: string): string[] {
  return cookieHeader
    .split(";")
    .map((part) => part.split("=")[0]?.trim() ?? "")
    .filter((name) => ANALYTICS_COOKIE.test(name));
}
