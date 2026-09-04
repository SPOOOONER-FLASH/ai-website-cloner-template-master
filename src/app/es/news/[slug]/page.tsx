import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/data/site";
import { defaultOgImage } from "@/lib/seo";
import { NewsDetail } from "@/components/site/NewsDetail";
import { NewsArticleJsonLd } from "@/components/site/JsonLd";
import { getAllNewsParams, getNewsBySlug, getPublishedNews } from "@/data/news";

/**
 * The Spanish mirror of /news/[slug]/.
 *
 * SAME SLUG IN BOTH LOCALES. `/es/news/stainless-steel-grades-304-201-316/` keeps the
 * English slug rather than translating it, which is the convention the whole Spanish
 * mirror already uses for products and categories. Translating the path would break every
 * hreflang pair, orphan the Spanish article from its English twin, and — because these
 * URLs are pasted into emails and tenders — break links that already exist.
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
    Falls back to the English snippet where a translation is missing rather than emitting
    nothing. An empty description makes Google write its own from the page, which on a
    technical article is reliably worse than a human sentence in the wrong language.
  */
  const title = article.seoTitleEs ?? article.seoTitle;
  const description = article.seoDescriptionEs ?? article.seoDescription;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/es/news/${slug}/`,
      /* Reciprocal of the English route. Both halves must exist or neither counts. */
      languages: {
        en: absoluteUrl(`/news/${slug}/`),
        es: absoluteUrl(`/es/news/${slug}/`),
        "x-default": absoluteUrl(`/news/${slug}/`),
      },
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/es/news/${slug}/`),
      title,
      description,
      publishedTime: article.publishedAt,
      locale: "es_ES",
      images: article.heroImage.src
        ? [{ url: absoluteUrl(article.heroImage.src), alt: article.heroImage.label }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE herrajes arquitectónicos" }],
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
      <NewsArticleJsonLd article={article} locale="es" />
      <NewsDetail article={article} locale="es" />
    </>
  );
}
