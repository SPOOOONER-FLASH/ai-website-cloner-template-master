import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { absoluteUrl, siteName } from "@/data/site";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";
import { articleShareImage } from "@/lib/article-share-image";

/**
 * /feed.xml — RSS 2.0 of the English guides and news, newest first (client 2026-09-28,
 * Google Discover notes: 「必须启用 rss，以便 Google 可以自动抓取更新」). Each item carries its
 * 1200×675 share image as an enclosure, the size Discover's large cards need. Declared in
 * the <head> of every English page and in robots.txt.
 */
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET(): Response {
  const items = [
    ...getPublishedGuides().map((a) => ({ a, section: "guides" as const })),
    ...getPublishedNews().map((a) => ({ a, section: "news" as const })),
  ].sort((x, y) => y.a.publishedAt.localeCompare(x.a.publishedAt));

  const entries = items
    .map(({ a, section }) => {
      const url = absoluteUrl(`/${section}/${a.slug}/`);
      const share = articleShareImage(section, a.slug);
      const file = share ? join(process.cwd(), "public", share) : null;
      const enclosure =
        share && file && existsSync(file)
          ? `\n      <enclosure url="${esc(absoluteUrl(share))}" type="image/jpeg" length="${statSync(file).size}"/>`
          : "";
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(`${a.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.seoDescription ?? a.summary)}</description>${a.author?.name ? `\n      <author>tec@cantonlock.com (${esc(a.author.name)})</author>` : ""}${enclosure}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteName)} — Guides and News</title>
    <link>${absoluteUrl("/")}</link>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
    <description>Door hardware specification guides and factory news from Canton Hyland, Guangdong.</description>
    <language>en</language>
${entries}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
