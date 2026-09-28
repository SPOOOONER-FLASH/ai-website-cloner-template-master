import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { absoluteUrl, defaultDescription, siteName } from "@/data/site";
import { locales, type Locale } from "@/data/locales";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";
import { articleShareImage } from "@/lib/article-share-image";
import { LOCALE_TAG, t } from "@/lib/i18n-core";

/**
 * RSS 2.0 of the guides and news, newest first (client 2026-09-28, Google Discover notes:
 * 「必须启用 rss，以便 Google 可以自动抓取更新」). One feed per locale whose articles are fully
 * translated: /feed.xml, /es/feed.xml, /pt/feed.xml. Each item carries its 1200×675 share
 * image as an enclosure, the size Discover's large cards need, and is written in the same
 * language as the page it links to — a Spanish feed pointing readers at Spanish pages with
 * English titles would be the markup-disagrees-with-page failure again.
 */
/*
 * All ten, since 2026-09-28. This was en/es/pt on the morning it was written, because
 * those are the three whose translations sit on the records themselves. The other seven
 * are just as complete: 82 of 82 titles and summaries translated in content/i18n/<code>/,
 * and `t()` reads that overlay exactly as it reads the record fields. A French reader in
 * Discover should be offered /fr/guides/…, and only a French feed makes that happen.
 */
export type FeedLocale = Locale;

/*
 * The three below carry a description written for the feed itself. The seven added later
 * take `defaultDescription[locale]`, the site's own reviewed sentence in that language,
 * rather than seven fresh translations of a marketing line that nobody has read. Copy is
 * the copy session's lane; a feed is not the place to invent it.
 */
const NEWS_AND_GUIDES: Readonly<Record<Locale, string>> = {
  en: "Guides and News",
  es: "Guías y noticias",
  pt: "Guias e notícias",
  fr: "Guides et actualités",
  de: "Ratgeber und Neuigkeiten",
  ja: "ガイドとニュース",
  ko: "가이드 및 소식",
  tr: "Kılavuzlar ve haberler",
  ru: "Руководства и новости",
  ar: "الأدلة والأخبار",
};

const CHANNEL: Record<FeedLocale, { title: string; description: string; language: string }> = {
  /* The seven overlay locales first, so the three hand-written entries below override them. */
  ...(Object.fromEntries(
    locales
      .filter((l) => l !== "en" && l !== "es" && l !== "pt")
      .map((l) => [
        l,
        { title: `${siteName} — ${NEWS_AND_GUIDES[l]}`, description: defaultDescription[l], language: LOCALE_TAG[l] },
      ]),
  ) as Record<Locale, { title: string; description: string; language: string }>),
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
