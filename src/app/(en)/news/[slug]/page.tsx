import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/data/site";
import { defaultOgImage } from "@/lib/seo";
import { NewsDetail } from "@/components/site/NewsDetail";
import { NewsArticleJsonLd } from "@/components/site/JsonLd";
import { getAllNewsParams, getNewsBySlug, getPublishedNews } from "@/data/news";

type NewsPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNewsParams();
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};
  return {
    title: { absolute: article.seoTitle },
    description: article.seoDescription,
    /*
      hreflang, without which the two locales are duplicates rather than translations.
    
      The export audit catches a missing pair as `hreflang-pair-missing`, and it caught
      exactly this when the Spanish mirror shipped: sixteen article pages, eight in each
      language, each declaring a canonical and neither pointing at the other. Written out
      here rather than taken from pageMetadata because these routes build their metadata
      by hand for the article-specific Open Graph fields.
    */
    alternates: {
      canonical: `/news/${slug}/`,
      languages: {
        en: absoluteUrl(`/news/${slug}/`),
        es: absoluteUrl(`/es/news/${slug}/`),
        "x-default": absoluteUrl(`/news/${slug}/`),
      },
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/news/${slug}/`),
      title: article.seoTitle,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
      // An article shared without a card image is a grey box in chat and on LinkedIn,
      // which is exactly where a specification guide gets passed around.
      images: article.heroImage.src
        ? [{ url: absoluteUrl(article.heroImage.src), alt: article.heroImage.label }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE architectural door hardware" }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.seoDescription,
      images: [absoluteUrl(article.heroImage.src ?? defaultOgImage)],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  // generateStaticParams only emits published slugs, so this also covers the case of a
  // draft or post-dated article being reached directly.
  if (!article || !getPublishedNews().some((a) => a.slug === slug)) notFound();

  return (
    <>
      {/*
        FSB ships no Article schema on its press pages and lists only one of its nine
        releases in sitemap.xml. Both are free to get right, and a release without
        NewsArticle markup is invisible to Google News and to the AI answer engines that
        now cite dated company announcements.
      */}
      <NewsArticleJsonLd article={article} />
      <NewsDetail article={article} />
    </>
  );
}
