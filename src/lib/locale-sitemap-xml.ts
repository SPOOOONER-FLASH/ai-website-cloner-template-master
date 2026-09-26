import type { MetadataRoute } from "next";
import type { Locale } from "../data/locales.ts";
import { siteUrl } from "../data/site.ts";
import { siteSitemap } from "./site-sitemap.ts";

/**
 * One locale's slice of the sitemap as XML, for /<locale>/sitemap.xml.
 *
 * Why it exists: a Search Console "URL-prefix" property for https://cantonlock.com/de/
 * only accepts sitemaps that live under /de/, and /sitemap.xml (all ten locales, 14.9 MB)
 * is also more than a per-market property needs. The entries are the same objects
 * /sitemap.xml is built from, filtered by path prefix, so the two cannot disagree; the
 * serialisation mirrors Next's own (urlset + xhtml:link + image + video namespaces).
 */
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Entry = MetadataRoute.Sitemap[number];

function belongs(url: string, locale: Locale): boolean {
  const path = url.startsWith(siteUrl) ? url.slice(siteUrl.length) : url;
  return path === `/${locale}/` || path.startsWith(`/${locale}/`);
}

function serialise(e: Entry): string {
  const lines = [`<loc>${esc(e.url)}</loc>`];
  for (const [lang, href] of Object.entries(e.alternates?.languages ?? {})) lines.push(`<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(String(href))}" />`);
  if (e.lastModified) lines.push(`<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`);
  if (e.changeFrequency) lines.push(`<changefreq>${e.changeFrequency}</changefreq>`);
  if (e.priority !== undefined) lines.push(`<priority>${e.priority}</priority>`);
  for (const image of e.images ?? []) lines.push(`<image:image><image:loc>${esc(image)}</image:loc></image:image>`);
  for (const v of e.videos ?? []) {
    const parts = [
      `<video:title>${esc(v.title)}</video:title>`,
      `<video:thumbnail_loc>${esc(v.thumbnail_loc)}</video:thumbnail_loc>`,
      `<video:description>${esc(v.description)}</video:description>`,
      v.content_loc ? `<video:content_loc>${esc(v.content_loc)}</video:content_loc>` : "",
      v.player_loc ? `<video:player_loc>${esc(v.player_loc)}</video:player_loc>` : "",
      v.duration !== undefined ? `<video:duration>${v.duration}</video:duration>` : "",
    ].filter(Boolean);
    lines.push(`<video:video>${parts.join("")}</video:video>`);
  }
  return ["<url>", ...lines, "</url>"].join("\n");
}

export function localeSitemapXml(locale: Locale): string {
  const entries = siteSitemap().filter((e) => belongs(e.url, locale));
  const head = '<?xml version="1.0" encoding="UTF-8"?>';
  const open = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
  return [head, open, ...entries.map(serialise), "</urlset>", ""].join("\n");
}

/** The route handler body every /<locale>/sitemap.xml/route.ts uses. */
export function localeSitemapResponse(locale: Locale): Response {
  return new Response(localeSitemapXml(locale), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
