import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { ProjectListing } from "@/components/site/ProjectListing";
import type { Locale } from "@/data/locales";
import { getAllProjectParams, getProjectBySlug } from "@/data/projects";
import { absoluteUrl, siteName } from "@/data/site";
import { OG_LOCALE, t } from "@/lib/i18n";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";
import { localeMetadata, prefixer } from "./shared";

export function projectsIndexMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/projects",
    "Applications + Projects",
    "Representative door hardware packages for international projects: panic exit devices, mortise locks, lever handles and hinges by building type.",
  );
}

export function ProjectsIndexPage({ locale }: { locale: Locale }) {
  return <ProjectListing locale={locale} />;
}

export function projectParams(): { slug: string }[] {
  return getAllProjectParams();
}

export function projectMetadata(locale: Locale, slug: string): Metadata {
  const p = prefixer(locale);
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const seoTitle = t(project, "seoTitle", locale);
  const title = seoTitle !== project.seoTitle ? seoTitle : `${t(project, "name", locale)} | ${siteName}`;
  const seoDescription = t(project, "seoDescription", locale);
  const description = seoDescription !== project.seoDescription ? seoDescription : t(project, "summary", locale);
  const url = absoluteUrl(p(`/projects/${slug}`));
  const image = absoluteUrl(project.heroImage?.src ?? defaultOgImage);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: p(`/projects/${slug}`),
      languages: alternateLanguages(`/projects/${slug}`),
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      locale: OG_LOCALE[locale],
      images: [{ url: image, alt: project.heroImage?.label ?? "HYDE" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} locale={locale} />;
}
