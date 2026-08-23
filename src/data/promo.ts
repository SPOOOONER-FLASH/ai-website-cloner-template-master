import type { PromoDialogConfig, PromoSurface } from "./types";
import config from "../../content/promo.json";

/**
 * The promotional dialog's configuration.
 *
 * A plain JSON import rather than a generated barrel: there is exactly one of these, so
 * there is no collection to enumerate.
 */
export const promoDialog = config as unknown as PromoDialogConfig;

/**
 * Which surface a pathname belongs to.
 *
 * Order matters — the product detail route is a longer form of the products route, so it
 * has to be tested first or every product page would report as a listing.
 */
export function promoSurfaceFor(pathname: string): PromoSurface | null {
  const path = pathname.replace(/^\/es(?=\/|$)/, "") || "/";

  if (path === "/") return "home";
  if (/^\/products\/[^/]+\/[^/]+\/?$/.test(path)) return "product-detail";
  if (path === "/products" || path.startsWith("/products/")) return "products";
  if (path === "/projects" || path.startsWith("/projects/")) return "projects";
  if (path === "/news" || path.startsWith("/news/")) return "news";
  return null;
}

/**
 * Whether the campaign is live, ignoring anything about this particular visitor.
 *
 * The window is evaluated against the visitor's own clock. On a static export that is
 * the only clock available, and unlike the news publishing dates it needs no rebuild:
 * the campaign ends on the stated day by itself.
 */
export function promoIsInWindow(
  promo: PromoDialogConfig = promoDialog,
  today = new Date(),
): boolean {
  if (!promo.enabled) return false;

  const todayIso = today.toISOString().slice(0, 10);
  if (promo.startAt && todayIso < promo.startAt) return false;
  if (promo.endAt && todayIso > promo.endAt) return false;

  return true;
}
