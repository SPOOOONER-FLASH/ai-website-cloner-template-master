import type { Metadata } from "next";
import { absoluteUrl } from "@/data/site";
import { defaultOgImage } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { getAllProjectParams, getProjectBySlug } from "@/data/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjectParams();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: { absolute: project.seoTitle },
    description: project.seoDescription,
    alternates: {
      canonical: `/projects/${slug}/`,
      languages: {
        en: absoluteUrl(`/projects/${slug}/`),
        es: absoluteUrl(`/es/projects/${slug}/`),
        "x-default": absoluteUrl(`/projects/${slug}/`),
      },
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/projects/${slug}/`),
      title: project.seoTitle,
      description: project.seoDescription,
      // These three pages were the last ones shipping without a card image.
      images: project.heroImage?.src
        ? [{ url: absoluteUrl(project.heroImage.src), alt: project.heroImage.label }]
        : [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "HYDE architectural door hardware" }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle,
      description: project.seoDescription,
      images: [absoluteUrl(project.heroImage?.src ?? defaultOgImage)],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
