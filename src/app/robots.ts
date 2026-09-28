import { locales } from "@/data/locales";
import type { MetadataRoute } from "next";
import { absoluteUrl, analytics, indexable } from "@/data/site";
import { buildRobotsRules } from "@/lib/seo-policy";

/**
 * Emits /robots.txt at build time (works under `output: "export"`).
 *
 * While `indexable` is false this returns a hard site-wide disallow. That is deliberate —
 * see the reasoning on `indexable` in src/data/site.ts. Flip that one flag at launch and
 * this file starts allowing crawlers with no further edits.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const rules = buildRobotsRules(indexable, analytics.indexNowKey);

  if (!indexable) return { rules };

  // No `host:` directive. Bing Webmaster Tools' robots.txt tester flags it as an error —
  // it is a Yandex extension that Google ignores, and the canonical tags on all 471 pages
  // already state the preferred host.
  return {
    rules,
    /* The full map first, then one per non-English locale for their Search Console properties. */
    /* The RSS feed is listed too: Google accepts RSS as a sitemap, and it carries the newest articles first (09-28). */
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      ...locales.filter((l) => l !== "en").map((l) => absoluteUrl(`/${l}/sitemap.xml`)),
      /* Ten feeds since 2026-09-28: a per-market Search Console property only accepts a
         sitemap under its own prefix, and Discover reads the feed of the language it serves. */
      absoluteUrl("/feed.xml"),
      ...locales.filter((l) => l !== "en").map((l) => absoluteUrl(`/${l}/feed.xml`)),
    ],
  };
}
