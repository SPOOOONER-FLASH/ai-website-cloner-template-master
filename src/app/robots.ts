import type { MetadataRoute } from "next";
import { absoluteUrl, indexable } from "@/data/site";

/**
 * Emits /robots.txt at build time (works under `output: "export"`).
 *
 * While `indexable` is false this returns a hard site-wide disallow. That is deliberate —
 * see the reasoning on `indexable` in src/data/site.ts. Flip that one flag at launch and
 * this file starts allowing crawlers with no further edits.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        // /llms.txt has to be listed explicitly: the blanket "*.txt" rule below would
        // otherwise block the one .txt file on this site that is meant to be read. The
        // more specific Allow wins for Google and Bing alike.
        allow: ["/", "/llms.txt"],
        // Build artefacts Next emits alongside the HTML, plus the CMS. None are pages;
        // crawling them wastes budget and /admin should never surface in results.
        disallow: ["/_next/", "/admin/", "/*.txt$"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
