import type { PromoCard } from "@/data/types";

/** Select one compact promotion so campaign cards never stack over page imagery. */
/** `/es/contact/` and `/contact` both normalise to `/contact/`. */
function samePage(href: string, pathname: string): boolean {
  const strip = (value: string) =>
    (value.replace(/^\/es(?=\/|$)/, "") || "/").replace(/\/*$/, "/");
  return strip(href) === strip(pathname);
}

/**
 * The next card to show — never one whose call to action is the page already open.
 *
 * MEASURED, NOT GUESSED. Clarity recorded visitors on /contact/ clicking the promo card's
 * "Contact us" button three times in three seconds — 00:40, 00:41, 00:42 — and getting
 * nothing, because the button links to the page they were already on. Clarity classes
 * those as dead clicks, and the repetition is what a person does when they believe
 * something is broken. Several sessions did it.
 *
 * A promotion offering the page you are reading is not merely useless; it is the most
 * prominent control on the screen doing nothing when pressed, which is indistinguishable
 * from a broken site. The card is skipped rather than the whole rail hidden, so the
 * catalogue card still gets its turn on the contact page.
 *
 * `pathname` is optional so existing callers and tests that do not care about location
 * keep working unchanged.
 */
export function selectActivePromoCard(
  cards: PromoCard[],
  dismissedHrefs: string[],
  pathname?: string,
): PromoCard | undefined {
  return cards.find(
    (card) =>
      !dismissedHrefs.includes(card.ctaHref) &&
      !(pathname && samePage(card.ctaHref, pathname)),
  );
}

export function localisePromoCardCopy(card: PromoCard, locale: "en" | "es") {
  const spanish = locale === "es";
  const title = spanish ? card.titleEs ?? card.title : card.title;
  return {
    title,
    titleLight: spanish ? card.titleLightEs ?? card.titleLight : card.titleLight,
    body: spanish ? card.bodyEs ?? card.body : card.body,
    ctaLabel: spanish ? card.ctaLabelEs ?? card.ctaLabel : card.ctaLabel,
    ctaHref: spanish ? card.ctaHrefEs ?? card.ctaHref : card.ctaHref,
    closeLabel: `${spanish ? "Cerrar" : "Close"}: ${title}`,
  };
}

/**
 * Session-scoped dismissal store for the promo rail.
 *
 * The client's standing instruction (content/promo.json, cooldownMinutes: 0) is "no
 * cooldown at all": a dismissed card must come back. So dismissals live in
 * sessionStorage — closing a card silences it for the rest of the browser session, and
 * the next session shows it again. localStorage keeps only the cooldown bookkeeping
 * ({ lastSeen, version }); keeping dismissals there made every dismissal permanent and
 * caused repeated "the popup is gone" incidents.
 */
export const PROMO_DISMISSAL_KEY = "canton-promo-dismissed";

/** The slice of Web Storage the dismissal helpers need (sessionStorage in production). */
export interface PromoDismissalStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readSessionDismissals(store: PromoDismissalStore): string[] {
  try {
    const raw = store.getItem(PROMO_DISMISSAL_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((href): href is string => typeof href === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeSessionDismissals(
  store: PromoDismissalStore,
  hrefs: string[],
): void {
  try {
    store.setItem(PROMO_DISMISSAL_KEY, JSON.stringify([...new Set(hrefs)]));
  } catch {
    /* Private mode throws; the card simply reappears next time. */
  }
}

export function addSessionDismissal(
  store: PromoDismissalStore,
  href: string,
): string[] {
  const next = [...new Set([...readSessionDismissals(store), href])];
  writeSessionDismissals(store, next);
  return next;
}
