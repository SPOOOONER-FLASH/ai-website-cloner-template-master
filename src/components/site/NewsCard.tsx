import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { newsKindLabels, formatNewsDate } from "@/data/news";
import { NewsVisual } from "./NewsVisual";
import type { Locale } from "@/data/site";
import { GuideCover } from "./GuideCover";
import { t } from "@/lib/i18n";

/**
 * Listing card. Image on top, text below — the arrangement FSB uses on /en/press.
 *
 * Unlike FSB, the date is shown. FSB omits it from the press listing entirely, which
 * makes the newsroom impossible to scan for recency; a trade editor deciding whether
 * this company is active cannot tell without opening each item. Dates are cheap and
 * the whole point of a dateline.
 */
/*
  section 决定这张卡/这一页属于哪个栏目，默认 news。

  2026-09-21 新开 /guides/ 时加的。甲方的决定是现有 35 篇一篇都不搬 ——
  它们的 URL 正在被引用（那天的 Clarity 读数里 33 条引用全部落在 /news/ 下的
  八个页面上）。所以两个栏目共用这些组件，只有路径不同。

  没有为 guides 复制一套组件：形状完全相同，复制一份只会让下一次改版式的人
  改两处，而其中一处一定会被忘掉。
*/
export function NewsCard({
  article,
  locale = "en",
  section = "news",
}: {
  article: NewsArticle;
  locale?: Locale;
  section?: "news" | "guides";
}) {
  const base = locale === "en" ? "" : `/${locale}`;
  /*
    The card was rendering article.title and article.summary untranslated on every
    locale until 2026-09-17 — so the Spanish newsroom listed English headlines and then
    opened Spanish articles. It was invisible to anyone not reading the listing in
    Spanish, which is the same class of miss as the language picker on the same day.
    English is the fallback, never the other translation: see src/lib/localised.ts.
  */
  const title = t(article, "title", locale);
  const summary =
    t(article, "summary", locale);
  return (
    <Link
      href={`${base}/${section}/${article.slug}/`}
      className={section === "guides" ? "group flex flex-col border-b border-line bg-surface" : "hard-shadow-card group flex flex-col bg-surface"}
    >
      {section === "guides" ? <GuideCover article={article} locale={locale} compact /> : <NewsVisual article={article} locale={locale} />}
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <div className="flex flex-wrap items-baseline gap-x-16 gap-y-4">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
            {newsKindLabels(locale)[article.kind]}
          </p>
          <time dateTime={article.publishedAt} className="text-c2 text-ink-secondary">
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
