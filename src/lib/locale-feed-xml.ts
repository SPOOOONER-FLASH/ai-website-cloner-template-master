import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "../data/locales.ts";
import { absoluteUrl, defaultDescription, siteName } from "../data/site.ts";
import { getPublishedGuides } from "../data/guides.ts";
import { getPublishedNews } from "../data/news.ts";
import { articleShareImage } from "./article-share-image.ts";
import { localisedHref } from "./spanish-mirror.ts";
import { LOCALE_TAG, t } from "./i18n-core.ts";

/**
 * One locale's guides and news as an RSS 2.0 feed, for /<locale>/feed.xml.
 *
 * ---------------------------------------------------------------------------
 * WHY EVERY LOCALE GETS ONE
 *
 * The English feed shipped on 2026-09-28 for Google Discover, which needs a feed to notice
 * a new article quickly. The other nine locales are not a lesser case: all ten carry the
 * same 82 articles, and the seven overlay locales have a full translation of every title
 * and summary in content/i18n/<code>/. A Spanish or Japanese reader in Discover should be
 * offered the page in their own language, which only happens if a feed points at
 * /es/guides/… rather than /guides/….
 *
 * The client was told on 2026-09-28 to submit /es/feed.xml and /pt/feed.xml to Search
 * Console. They did not exist yet — only /feed.xml did. This is what makes that true, for
 * all ten rather than three.
 *
 * ---------------------------------------------------------------------------
 * THE TEXT IS THE LOCALE'S, NOT ENGLISH WEARING A LOCALE URL
 *
 * Titles and descriptions come through `t(article, field, locale)`, the same overlay reader
 * the article pages themselves use, so a feed can never disagree with the page it links to.
 * Where a translation is missing `t` falls back to English visibly, which is the documented
 * behaviour and better than an empty item.
 *
 * `localisedHref` builds the link, so the feed and the footer and the language panel all
 * answer "where does this page live in that language" the same way. A feed that invented
 * its own path would be the Portuguese outage of 2026-09-16 again, in a file nobody opens.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** What the channel calls itself, in the language the channel is written in. */
const CHANNEL_TITLE: Record<Locale, string> = {
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

export function localeFeedResponse(locale: Locale): Response {
  const items = [
    ...getPublishedGuides().map((a) => ({ a, section: "guides" as const })),
    ...getPublishedNews().map((a) => ({ a, section: "news" as const })),
  ].sort((x, y) => y.a.publishedAt.localeCompare(x.a.publishedAt));

  const entries = items
    .map(({ a, section }) => {
      const url = absoluteUrl(localisedHref(`/${section}/${a.slug}/`, locale));
      /*
        The share image is one 1200×675 file per article, not one per locale: it is a
        photograph, and Discover's large card wants the picture rather than a translated
        caption. `length` is the real byte count because RSS readers reject a wrong one.
      */
      const share = articleShareImage(section, a.slug);
      const file = share ? join(process.cwd(), "public", share) : null;
      const enclosure =
        share && file && existsSync(file)
          ? `\n      <enclosure url="${esc(absoluteUrl(share))}" type="image/jpeg" length="${statSync(file).size}"/>`
          : "";
      const title = t(a, "title", locale);
      const description = t(a, "seoDescription", locale) || t(a, "summary", locale);
      return `    <item>
      <title>${esc(title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(`${a.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(description)}</description>${a.author?.name ? `\n      <author>tec@cantonlock.com (${esc(a.author.name)})</author>` : ""}${enclosure}
    </item>`;
    })
    .join("\n");

  /*
    Built directly, NOT through `localisedHref`. That function maps paths the site actually
    routes, and /feed.xml is not one of them, so it hands back "/feed.xml" unchanged for
    every locale — every feed would have claimed to be the English one in its own rel="self",
    which is how a reader or Search Console decides which feed it is looking at.
  */
  const self = absoluteUrl(locale === "en" ? "/feed.xml" : `/${locale}/feed.xml`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteName)} — ${esc(CHANNEL_TITLE[locale])}</title>
    <link>${esc(absoluteUrl(localisedHref("/", locale)))}</link>
    <atom:link href="${esc(self)}" rel="self" type="application/rss+xml"/>
    <description>${esc(defaultDescription[locale])}</description>
    <language>${LOCALE_TAG[locale]}</language>
${entries}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
