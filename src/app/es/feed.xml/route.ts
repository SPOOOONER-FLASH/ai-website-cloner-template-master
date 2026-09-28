import { articleFeedResponse } from "@/lib/article-feed";

/** /es/feed.xml — Spanish guides and news, linking the /es/ pages. Built in src/lib/article-feed.ts. */
export const dynamic = "force-static";

export function GET(): Response {
  return articleFeedResponse("es");
}
