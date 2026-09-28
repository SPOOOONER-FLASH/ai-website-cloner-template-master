import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { absoluteUrl, siteName } from "@/data/site";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";
import { articleShareImage } from "@/lib/article-share-image";
import { t } from "@/lib/i18n-core";

/**
 * RSS 2.0 of the guides and news, newest first (client 2026-09-28, Google Discover notes:
 * 「必须启用 rss，以便 Google 可以自动抓取更新」). One feed per locale whose articles are fully
 * translated: /feed.xml, /es/feed.xml, /pt/feed.xml. Each item carries its 1200×675 share
 * image as an enclosure, the size Discover's large cards need, and is written in the same
 * language as the page it links to — a Spanish feed pointing readers at Spanish pages with
 * English titles would be the markup-disagrees-with-page failure again.
 */
export type FeedLocale = "en" | "es" | "pt";

const CHANNEL: Record<FeedLocale, { title: string; description: string; language: string }> = {
  en: {
    title: `${siteName} — Guides and News`,
    description: "Door hardware specification guides and factory news from Canton Hyland, Guangdong.",
    language: "en",
  },
  es: {
    title: `${siteName} — Guías y noticias`,
    description: "Guías de especificación de herrajes para puertas y noticias de fábrica de Canton Hyland, Guangdong.",
    language: "es",
  },
  pt: {
    title: `${siteName} — Guias e notícias`,
    description: "Guias de especificação de ferragens para portas e notícias de fábrica da Canton Hyland, Guangdong.",
    language: "pt-BR",
  },
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function feedPath(locale: FeedLocale): string {
  return locale === "en" ? "/feed.xml" : `/${locale}/feed.xml`;
}

export function articleFeedXml(locale: FeedLocale): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const items = [
    ...getPublishedGuides().map((a) => ({ a, section: "guides" as const })),
    ...getPublishedNews().map((a) => ({ a, section: "news" as const })),
  ].sort((x, y) => y.a.publishedAt.localeCompare(x.a.publishedAt));

  const entries = items
    .map(({ a, section }) => {
      const url = absoluteUrl(`${prefix}/${section}/${a.slug}/`);
      const share = articleShareImage(section, a.slug);
      const file = share ? join(process.cwd(), "public", share) : null;
      const enclosure =
        share && file && existsSync(file)
          ? `\n      <enclosure url="${esc(absoluteUrl(share))}" type="image/jpeg" length="${statSync(file).size}"/>`
          : "";
      const description = t(a, "seoDescription", locale) ?? t(a, "summary", locale);
      return `    <item>
      <title>${esc(t(a, "title", locale))}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(`${a.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(description)}</description>${a.author?.name ? `\n      <author>tec@cantonlock.com (${esc(a.author.name)})</author>` : ""}${enclosure}
    </item>`;
    })
    .join("\n");

  const channel = CHANNEL[locale];
  const home = absoluteUrl(locale === "en" ? "/" : `${prefix}/`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(channel.title)}</title>
    <link>${home}</link>
    <atom:link href="${absoluteUrl(feedPath(locale))}" rel="self" type="application/rss+xml"/>
    <description>${esc(channel.description)}</description>
    <language>${channel.language}</language>
${entries}
  </channel>
</rss>
`;
}

export function articleFeedResponse(locale: FeedLocale): Response {
  return new Response(articleFeedXml(locale), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
