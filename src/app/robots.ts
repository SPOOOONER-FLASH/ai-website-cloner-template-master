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
        allow: "/",
        // Build artefacts Next emits alongside the HTML. They are not pages and
        // crawling them wastes budget.
        disallow: ["/_next/", "/*.txt$"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
