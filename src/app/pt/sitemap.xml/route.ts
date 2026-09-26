import { localeSitemapResponse } from "@/lib/locale-sitemap-xml";

/** /pt/sitemap.xml — this locale's slice of /sitemap.xml, for its Search Console property. */
export const dynamic = "force-static";

export function GET(): Response {
  return localeSitemapResponse("pt");
}
