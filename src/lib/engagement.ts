/**
 * How a visitor reads a page, as events GA4 and GTM can count and Clarity can filter on.
 *
 * Client, 2026-09-23: 「怎么确认客户意图，有的快速全页下滑，有的人逐字逐句看」 — some visitors
 * (Mexico, India) scroll the whole master-key article in seconds, others read it line by line,
 * and nothing we measured could tell them apart. GA4's built-in `scroll` fires once, at 90%,
 * which is exactly the event a skimmer and a reader both trigger.
 *
 * Everything here is pure so it can be tested; EngagementTracker.tsx wires it to the page.
 * No personal data: a path, a depth, a number of seconds, a link's destination type.
 */

/** Scroll depths reported once each per page view. */
export const DEPTHS = [25, 50, 75, 90] as const;

export type PageType = "home" | "article" | "guide-index" | "product" | "category" | "contact" | "configurator" | "other";

/** Page type from a pathname, ignoring the /es or /pt prefix. */
export function pageType(pathname: string): PageType {
  const p = (pathname.replace(/^\/(?:es|pt)(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  if (/^\/(news|guides)\/[^/]+$/.test(p)) return "article";
  if (/^\/(news|guides)$/.test(p)) return "guide-index";
  if (/^\/products\/[^/]+\/[^/]+$/.test(p)) return "product";
  if (/^\/products(\/[^/]+)?$/.test(p)) return "category";
  if (p === "/contact") return "contact";
  if (p === "/configurator") return "configurator";
  return "other";
}

export type ReadStyle = "skim" | "read" | "browse" | "bounce";

/**
 * Classify one page view. Thresholds are deliberately plain so they can be quoted to the
 * client and changed in one place:
 *   skim    reached 75% of the page in under 25 visible seconds
 *   read    at least 60 visible seconds and at least half the page
 *   bounce  under 15 seconds and never past the first quarter
 *   browse  everything else
 */
export function readStyle({ seconds, depth, secondsAt75 }: { seconds: number; depth: number; secondsAt75?: number }): ReadStyle {
  if (secondsAt75 !== undefined && secondsAt75 < 25) return "skim";
  if (seconds >= 60 && depth >= 50) return "read";
  if (seconds < 15 && depth < 25) return "bounce";
  return "browse";
}

/** Depth thresholds newly crossed, given what was already reported. */
export function newDepths(depth: number, reported: ReadonlySet<number>): number[] {
  return DEPTHS.filter((d) => depth >= d && !reported.has(d));
}

export interface LinkEvent {
  name: "select_item" | "contact_click" | "configurator_open";
  params: Record<string, string>;
}

/**
 * What a click on a link means commercially. `select_item` is GA4's recommended event name
 * for choosing a product from a list, so it appears in GA4 ready to use (same reasoning as
 * `generate_lead` in analytics-events.ts).
 */
export function linkIntent(href: string, from: string): LinkEvent | null {
  const source = pageType(from);
  if (/^mailto:/i.test(href)) return { name: "contact_click", params: { method: "email", page_type: source } };
  if (/^tel:/i.test(href)) return { name: "contact_click", params: { method: "phone", page_type: source } };
  if (/(?:wa\.me|whatsapp\.com)/i.test(href)) return { name: "contact_click", params: { method: "whatsapp", page_type: source } };
  if (/alibaba\.com/i.test(href)) return { name: "contact_click", params: { method: "alibaba", page_type: source } };
  let path: string;
  try {
    const url = new URL(href, "https://cantonlock.com");
    if (url.hostname !== "cantonlock.com" && url.hostname !== "www.cantonlock.com") return null;
    path = url.pathname;
  } catch {
    return null;
  }
  const target = pageType(path);
  if (target === "product") {
    const slug = path.replace(/\/+$/, "").split("/").pop() ?? "";
    return { name: "select_item", params: { item_id: slug, item_list_name: source } };
  }
  if (target === "contact") return { name: "contact_click", params: { method: "form", page_type: source } };
  if (target === "configurator") return { name: "configurator_open", params: { page_type: source } };
  return null;
}
