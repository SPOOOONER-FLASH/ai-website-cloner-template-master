import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/data/site";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";
import { NewsDetail } from "@/components/site/NewsDetail";
import { ArticleFaqJsonLd, NewsArticleJsonLd } from "@/components/site/JsonLd";
import { getAllGuideParams, getGuideBySlug } from "@/data/guides";

/**
 * 指南栏目，2026-09-21 新开。见 src/data/guides.ts 的注释：
 * 现有 35 篇 /news/ 一篇都不搬，新写的 SEO/GEO 长文从这里开始。
 */

type GuidePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuideParams("es");
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) return {};
  const title = article.seoTitleEs ?? article.seoTitle;
  const description = article.seoDescriptionEs ?? article.seoDescription;
  return {
    title: { absolute: title },
    description,
    /*
      hreflang。缺一半的话两个语种是重复页而不是互译，导出审计会报
      hreflang-pair-missing —— 西语镜像刚上线那次就是这么被抓到的。
    */
    alternates: {
      canonical: `/es/guides/${slug}/`,
      languages: alternateLanguages(`/guides/${slug}`),
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/es/guides/${slug}/`),
      title,
      description,
      publishedTime: article.publishedAt,
      images: article.heroImage.src
        ? [{ url: absoluteUrl(article.heroImage.src), alt: article.heroImage.label }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE architectural door hardware" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(article.heroImage.src ?? defaultOgImage)],
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  // generateStaticParams 只产出已发布的 slug，这一行同时挡住草稿和未来日期。
  // 未译的指南在这个语种没有页面（见 getAllGuideParams）。
  if (!article || !getAllGuideParams("es").some((a) => a.slug === slug)) notFound();

  return (
    <>
      <NewsArticleJsonLd article={article} locale="es" section="guides" />
      <ArticleFaqJsonLd article={article} locale="es" />
      <NewsDetail article={article} locale="es" section="guides" />
    </>
  );
}
