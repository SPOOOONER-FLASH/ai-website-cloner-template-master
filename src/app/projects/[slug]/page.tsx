import type { Metadata } from "next";
import { absoluteUrl } from "@/data/site";
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
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
