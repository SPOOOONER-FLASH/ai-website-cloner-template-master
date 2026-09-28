import { articleFeedResponse } from "@/lib/article-feed";

/** /pt/feed.xml — Portuguese guides and news, linking the /pt/ pages. Built in src/lib/article-feed.ts. */
export const dynamic = "force-static";

export function GET(): Response {
  return articleFeedResponse("pt");
}
