import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { newsKindLabels, formatNewsDate } from "@/data/news";
import { NewsVisual } from "./NewsVisual";
import type { Locale } from "@/data/site";

/**
 * Listing card. Image on top, text below — the arrangement FSB uses on /en/press.
 *
 * Unlike FSB, the date is shown. FSB omits it from the press listing entirely, which
 * makes the newsroom impossible to scan for recency; a trade editor deciding whether
 * this company is active cannot tell without opening each item. Dates are cheap and
 * the whole point of a dateline.
 */
export function NewsCard({
  article,
  locale = "en",
}: {
  article: NewsArticle;
  locale?: Locale;
}) {
  const base = locale === "en" ? "" : `/${locale}`;
  /*
    The card was rendering article.title and article.summary untranslated on every
    locale until 2026-09-17 — so the Spanish newsroom listed English headlines and then
    opened Spanish articles. It was invisible to anyone not reading the listing in
    Spanish, which is the same class of miss as the language picker on the same day.
    English is the fallback, never the other translation: see src/lib/localised.ts.
  */
  const title = (locale === "es" && article.titleEs) || (locale === "pt" && article.titlePt) || article.title;
  const summary =
    (locale === "es" && article.summaryEs) || (locale === "pt" && article.summaryPt) || article.summary;
  return (
    <Link
      href={`${base}/news/${article.slug}/`}
      className="hard-shadow-card group flex flex-col bg-surface"
    >
      <NewsVisual article={article} locale={locale} />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <div className="flex flex-wrap items-baseline gap-x-16 gap-y-4">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
            {newsKindLabels(locale)[article.kind]}
          </p>
          <time dateTime={article.publishedAt} className="text-c2 text-ink-tertiary">
            {formatNewsDate(article.publishedAt, locale)}
          </time>
        </div>
        <h2 className="title-marker mt-16 text-h3 text-ink">
          {title}
        </h2>
        <p className="mt-24 border-t border-line pt-16 text-c1 text-ink-secondary">
          {summary}
        </p>
      </div>
    </Link>
  );
}
