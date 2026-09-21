import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/data/site";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";
import { NewsDetail } from "@/components/site/NewsDetail";
import { ArticleFaqJsonLd, NewsArticleJsonLd } from "@/components/site/JsonLd";
import { getAllNewsParams, getNewsBySlug, getPublishedNews } from "@/data/news";

/**
 * The Portuguese mirror of /news/[slug]/.
 *
 * SAME SLUG IN ALL THREE LOCALES, for the reason the Spanish route records: translating
 * the path would break every hreflang pair, orphan the article from its twins, and break
 * URLs that are already pasted into emails and tenders.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS ROUTE EXISTS SEPARATELY FROM THE TRANSLATIONS
 *
 * It shipped on 2026-09-17 with most article bodies still in English, and that is
 * deliberate rather than premature. The Portuguese tree had no newsroom at all: 35
 * technical articles, the pages this site is actually cited for, reachable in two
 * languages and not in the third. A Brazilian specifier following the Bing citation that
 * brought them here landed on an English page with no Portuguese counterpart to offer.
 *
 * `NewsDetail` renders a translated body only when it is COMPLETE, paragraph for
 * paragraph, and the English body otherwise — so an article that has not been translated
 * yet reads as English on a Portuguese page rather than as half of each. That is visibly
 * incomplete, which is the state that gets fixed; a mixed page looks finished and is not.
 */

type NewsPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNewsParams();
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};

  /*
    Falls back to English rather than to the Spanish snippet. A Portuguese reader served a
    Spanish description is being told this page is not for them, which is worse than
    English — see the fallback rule in src/lib/localised.ts.
  */
  const title = article.seoTitlePt ?? article.seoTitle;
  const description = article.seoDescriptionPt ?? article.seoDescription;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/pt/news/${slug}/`,
      /* Reciprocal in all three directions. Every half must exist or none of them counts. */
      languages: alternateLanguages(`/news/${slug}`),
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/pt/news/${slug}/`),
      title,
      description,
      publishedTime: article.publishedAt,
      locale: "pt_BR",
      images: article.heroImage.src
        ? [{ url: absoluteUrl(article.heroImage.src), alt: article.heroImage.label }]
        : [
            {
              url: absoluteUrl(defaultOgImage),
              width: 1200,
              height: 630,
              alt: "HYDE ferragens arquitetónicas",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(article.heroImage.src ?? defaultOgImage)],
    },
  };
}

export default async function NoticiaPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article || !getPublishedNews().some((a) => a.slug === slug)) notFound();

  return (
    <>
      <NewsArticleJsonLd article={article} locale="pt" />
      <ArticleFaqJsonLd article={article} locale="pt" />
      <NewsDetail article={article} locale="pt" />
    </>
  );
}
