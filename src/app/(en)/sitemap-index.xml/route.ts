import { sitemapIndexResponse } from "@/lib/locale-sitemap-xml";

/** /sitemap-index.xml — names all ten sitemaps for a single Bing / Search Console submission. */
export const dynamic = "force-static";

export function GET(): Response {
  return sitemapIndexResponse();
}
