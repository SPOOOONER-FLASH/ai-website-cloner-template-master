/**
 * What the contact form is pre-filled with: the query string first, then the fragment.
 *
 * Quote links moved from `/contact/?model=…` to `/contact/#model=…` on 2026-10-12. Every
 * product page linked to its own query URL, so ~870 parameter URLs pointed at one page and
 * the links carried `nofollow` to spare the crawl budget — which Ahrefs then reported on
 * 3,843 pages as "nofollow outgoing internal links". A fragment is never sent to the
 * server, so all those links are one URL to a crawler and need no `nofollow`. Old
 * `?model=` links (emails, bookmarks) keep working because the query still wins.
 */
export type InquiryPrefill = { product: string; model: string; from: string; note: string };

const clean = (value: string | null, max = 200) => (value ?? "").trim().slice(0, max);

export function inquiryPrefill(search: string, hash: string): InquiryPrefill {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const pick = (key: string, max?: number) => clean(query.get(key), max) || clean(fragment.get(key), max);
  /* `note` pre-fills the requirements box: the euro cylinder calculator sends the buyer's
     measurements and result in it (2026-10-16). Longer cap, because it is several lines. */
  return { product: pick("product"), model: pick("model"), from: pick("from"), note: pick("note", 800) };
}

/** `/contact/#model=…&from=…` — empty values are left out, and an empty set yields `/contact/`. */
export function contactHref(base: string, params: Record<string, string | undefined>): string {
  const fragment = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) fragment.set(key, value);
  const tail = fragment.toString();
  return `${base}/contact/${tail ? `#${tail}` : ""}`;
}
