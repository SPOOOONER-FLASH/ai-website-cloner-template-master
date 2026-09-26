import type { MetadataRoute } from "next";
import { siteSitemap } from "@/lib/site-sitemap";

/**
 * /sitemap.xml — every URL of every locale, with reciprocal hreflang, images and videos.
 * The entries live in src/lib/site-sitemap.ts so /<locale>/sitemap.xml can emit the same
 * data one locale at a time (2026-09-25: 7,000 URLs × 11 alternates = 14.9 MB in one file;
 * the per-locale files are what a /de/ URL-prefix property in Search Console can accept).
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteSitemap();
}
