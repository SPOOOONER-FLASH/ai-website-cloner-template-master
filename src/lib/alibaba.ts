import { siteSettings } from "@/data/navigation";
import type { Product } from "@/data/types";

/**
 * Where a product on this site hands the visitor over to the Alibaba storefront.
 *
 * ---------------------------------------------------------------------------
 * The problem this solves
 *
 * The site's whole job is to produce enquiries and to send buyers to Alibaba. Until now
 * the only Alibaba link on the entire site was one in the footer, pointing at the
 * storefront's front page. So a buyer who had just read the spec table for model 305 was
 * dropped onto a shop homepage and had to find it again by searching — which is exactly
 * where a warm visitor goes cold.
 *
 * ---------------------------------------------------------------------------
 * Two levels,手填优先
 *
 *   1. `product.alibabaUrl` — the real listing, pasted in by the client from their
 *      seller back office. Always used when present.
 *   2. A storefront search seeded with the model number. Not as good as the listing, but
 *      it lands on a result set for "305" rather than on a homepage, and it needs no
 *      per-product data entry for 431 products.
 *
 * The search template lives in content/site-settings.json so it can be corrected without
 * a code change — Alibaba's URL shape is theirs to change, not ours, and this site
 * cannot verify it automatically (the storefront serves a captcha to anything that is
 * not a human browser, so no crawl can confirm the format).
 */

/** Falls back to the documented storefront search path when settings omit one. */
const DEFAULT_SEARCH_TEMPLATE = "search/product?SearchText={q}";

export interface AlibabaLink {
  href: string;
  /** `listing` when the client supplied the real product URL. */
  kind: "listing" | "search";
}

function storefrontBase(): string | null {
  const raw = siteSettings.alibaba?.storefront?.trim();
  if (!raw) return null;
  return raw.endsWith("/") ? raw : `${raw}/`;
}

/**
 * Best available Alibaba destination for one product, or null when the client has not
 * configured a storefront at all — in which case nothing should render rather than a
 * dead link.
 */
export function alibabaLinkFor(product: Product): AlibabaLink | null {
  const direct = product.alibabaUrl?.trim();
  if (direct) return { href: direct, kind: "listing" };

  const base = storefrontBase();
  if (!base) return null;

  // The model is the term a buyer would type; the name alone matches dozens of listings.
  const query = [product.model, product.name].filter(Boolean).join(" ").trim();
  if (!query) return { href: base, kind: "search" };

  const template = siteSettings.alibaba?.searchTemplate?.trim() || DEFAULT_SEARCH_TEMPLATE;
  return {
    href: base + template.replace("{q}", encodeURIComponent(query)),
    kind: "search",
  };
}

/** Storefront front page, for the footer and any non-product context. */
export function alibabaStorefront(): string | null {
  return storefrontBase();
}
