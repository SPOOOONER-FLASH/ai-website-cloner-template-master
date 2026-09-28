import { localeFeedResponse } from "@/lib/locale-feed-xml";

/**
 * /feed.xml — RSS 2.0 of the English guides and news, newest first (client 2026-09-28,
 * Google Discover notes: 「必须启用 rss，以便 Google 可以自动抓取更新」). Each item carries its
 * 1200×675 share image as an enclosure, the size Discover's large cards need. Declared in
 * the <head> of every English page and in robots.txt.
 *
 * The body moved to src/lib/locale-feed-xml.ts on 2026-09-28 when the other nine locales
 * got feeds of their own. One builder, so a Spanish feed cannot drift from this one.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return localeFeedResponse("en");
}
