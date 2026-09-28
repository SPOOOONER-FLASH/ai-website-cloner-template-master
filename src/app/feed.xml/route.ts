import { articleFeedResponse } from "@/lib/article-feed";

/** /feed.xml — English guides and news. Built in src/lib/article-feed.ts. */
export const dynamic = "force-static";

export function GET(): Response {
  return articleFeedResponse("en");
}
