import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideListing } from "@/components/site/GuideListing";
import { ArticleFaqJsonLd, NewsArticleJsonLd } from "@/components/site/JsonLd";
import { NewsDetail } from "@/components/site/NewsDetail";
import { NewsListing } from "@/components/site/NewsListing";
import { getAllGuideParams, getGuideBySlug } from "@/data/guides";
import type { Locale } from "@/data/locales";
import { getAllNewsParams, getNewsBySlug, getPublishedNews } from "@/data/news";
import { absoluteUrl } from "@/data/site";
import type { NewsArticle } from "@/data/types";
import { OG_LOCALE, t } from "@/lib/i18n";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";
import { localeMetadata, prefixer } from "./shared";

/* ---- Listings ---------------------------------------------------------------- */

export function newsIndexMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/news",
    "News + Insights",
    "Press releases, certification updates and technical notes from Canton Hyland, manufacturer of panic exit devices and architectural door hardware.",
  );
}

export function NewsIndexPage({ locale }: { locale: Locale }) {
  return <NewsListing locale={locale} />;
}

export function guidesIndexMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/guides",
    "Guides",
    "Reference pages for hardware decisions: euro cylinder charts, EN to ANSI/BHMA cross-references, finish code tables and what each standard covers.",
  );
}

export function GuidesIndexPage({ locale }: { locale: Locale }) {
  return <GuideListing locale={locale} />;
}

/* ---- Details ----------------------------------------------------------------- */

function articleMetadata(locale: Locale, article: NewsArticle, section: "news" | "guides", slug: string): Metadata {
  const p = prefixer(locale);
  const title = t(article, "seoTitle", locale);
  const description = t(article, "seoDescription", locale);
  const path = p(`/${section}/${slug}`);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: alternateLanguages(`/${section}/${slug}`),
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(path),
      title,
      description,
      publishedTime: article.publishedAt,
      locale: OG_LOCALE[locale],
      images: article.heroImage.src
        ? [{ url: absoluteUrl(article.heroImage.src), alt: t(article.heroImage, "label", locale) }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(article.heroImage.src ?? defaultOgImage)],
    },
  };
}

export function newsParams(): { slug: string }[] {
  return getAllNewsParams();
}

export function newsArticleMetadata(locale: Locale, slug: string): Metadata {
  const article = getNewsBySlug(slug);
  return article ? articleMetadata(locale, article, "news", slug) : {};
}

export function NewsArticlePage({ locale, slug }: { locale: Locale; slug: string }) {
  const article = getNewsBySlug(slug);
  if (!article || !getPublishedNews().some((a) => a.slug === slug)) notFound();
  return (
    <>
      <NewsArticleJsonLd article={article} locale={locale} />
      <ArticleFaqJsonLd article={article} locale={locale} />
      <NewsDetail article={article} locale={locale} />
    </>
  );
}

export function guideParams(locale: Locale): { slug: string }[] {
  return getAllGuideParams(locale);
}

export function guideArticleMetadata(locale: Locale, slug: string): Metadata {
  const article = getGuideBySlug(slug);
  return article ? articleMetadata(locale, article, "guides", slug) : {};
}

export function GuideArticlePage({ locale, slug }: { locale: Locale; slug: string }) {
  const article = getGuideBySlug(slug);
  if (!article || !getAllGuideParams(locale).some((a) => a.slug === slug)) notFound();
  return (
    <>
      <NewsArticleJsonLd article={article} locale={locale} section="guides" />
      <ArticleFaqJsonLd article={article} locale={locale} />
      <NewsDetail article={article} locale={locale} section="guides" />
    </>
  );
}
