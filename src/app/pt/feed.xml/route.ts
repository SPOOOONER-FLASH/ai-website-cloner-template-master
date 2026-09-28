import { localeFeedResponse } from "@/lib/locale-feed-xml";

/** /pt/feed.xml — this locale's guides and news, for Google Discover and its Search Console property. */
export const dynamic = "force-static";

export function GET(): Response {
  return localeFeedResponse("pt");
}
