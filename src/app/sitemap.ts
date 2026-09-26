import type { MetadataRoute } from "next";
import { siteSitemap } from "@/lib/site-sitemap";
import { locales, siteUrl } from "@/data/site";

/**
 * /sitemap.xml — every URL of every locale, with reciprocal hreflang, images and videos.
 * The entries live in src/lib/site-sitemap.ts so /<locale>/sitemap.xml can emit the same
 * data one locale at a time (2026-09-25: 7,000 URLs × 11 alternates = 14.9 MB in one file;
 * the per-locale files are what a /de/ URL-prefix property in Search Console can accept).
 */
export const dynamic = "force-static";

/*
  English URLs only (2026-09-26). Every other locale has its own /<code>/sitemap.xml, listed in
  robots.txt, so nothing is lost. With all ten locales here the file was 14 MB — 7,010 URLs,
  each carrying ten hreflang alternates plus its images and video — and Bing's site scan
  reported five guides "missing from sitemaps" that were in it, the signature of a crawler that
  stopped reading. Each entry still names all its alternates, so the language cluster is intact.
*/
const prefixed = locales.filter((l) => l !== "en").map((l) => `${siteUrl}/${l}/`);

export default function sitemap(): MetadataRoute.Sitemap {
  return siteSitemap().filter((e) => !prefixed.some((p) => e.url.startsWith(p)));
}
