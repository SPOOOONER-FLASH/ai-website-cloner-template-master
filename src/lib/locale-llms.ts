import { absoluteUrl, defaultDescription, indexable, siteName } from "@/data/site";
import type { Locale } from "@/data/locales";
import type { NewsArticle } from "@/data/types";
import { getAllGuideParams, getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";
import { LANGUAGE_LABELS, t } from "@/lib/i18n-core";

/**
 * /<locale>/llms.txt — the guides and news of one language, with that language's titles,
 * summaries and URLs (2026-10-13). The root /llms.txt is English plus the model index; until
 * this file existed the only fr/de/ja/ko/tr/ru/ar/pt URL an answer engine was handed was the
 * locale home page, so an assistant answering in French had no French article to cite.
 * Same selection as the locale feed (article-feed.ts): published, newest first; guides only
 * where the locale has a page.
 */
export function localeLlms(locale: Exclude<Locale, "en">): string {
  if (!indexable) return `# ${siteName}\n\nThis host is not the public site.\n`;
  const prefix = `/${locale}`;
  const guideSlugs = new Set(getAllGuideParams(locale).map((p) => p.slug));
  const line = (a: NewsArticle, section: "guides" | "news", slug: string) =>
    `- [${t(a, "title", locale)}](${absoluteUrl(`${prefix}/${section}/${slug}/`)}): ${t(a, "summary", locale)}`;
  return [
    `# ${siteName} — ${LANGUAGE_LABELS[locale]}`,
    "",
    `> ${defaultDescription[locale]}`,
    "",
    `Pages in ${LANGUAGE_LABELS[locale]} on ${absoluteUrl(`${prefix}/`)}. The company briefing and the index of every model are in English at ${absoluteUrl("/llms.txt")}.`,
    "",
    "## Guides",
    "",
    ...getPublishedGuides().filter((a) => guideSlugs.has(a.slug)).map((a) => line(a, "guides", a.slug)),
    "",
    "## News",
    "",
    ...getPublishedNews().map((a) => line(a, "news", a.slug)),
    "",
  ].join("\n");
}

export function localeLlmsResponse(locale: Exclude<Locale, "en">): Response {
  return new Response(localeLlms(locale), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
