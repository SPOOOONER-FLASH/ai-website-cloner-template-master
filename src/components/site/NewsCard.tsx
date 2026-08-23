import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { NEWS_KIND_LABEL, formatNewsDate } from "@/data/news";
import { MediaPlaceholder } from "./MediaPlaceholder";

/**
 * Listing card. Image on top, text below — the arrangement FSB uses on /en/press.
 *
 * Unlike FSB, the date is shown. FSB omits it from the press listing entirely, which
 * makes the newsroom impossible to scan for recency; a trade editor deciding whether
 * this company is active cannot tell without opening each item. Dates are cheap and
 * the whole point of a dateline.
 */
export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}/`}
      className="group flex flex-col border border-line bg-surface hover:border-brand"
    >
      <MediaPlaceholder {...article.heroImage} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <div className="flex flex-wrap items-baseline gap-x-16 gap-y-4">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
            {NEWS_KIND_LABEL[article.kind]}
          </p>
          <time dateTime={article.publishedAt} className="text-c2 text-ink-tertiary">
            {formatNewsDate(article.publishedAt)}
          </time>
        </div>
        <h2 className="mt-16 text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
          {article.title}
        </h2>
        <p className="mt-24 border-t border-line pt-16 text-c1 text-ink-secondary">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}
