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
  const title = `${project.nameEs ?? project.name} | Canton Hyland`;
  // seoDescriptionEs is metadata-only; summaryEs stays as the visible page intro.
  const description = project.seoDescriptionEs ?? project.summaryEs ?? project.summary;
  const enUrl = absoluteUrl(`/projects/${slug}/`);
  const esUrl = absoluteUrl(`/es/projects/${slug}/`);
  const image = absoluteUrl(project.heroImage?.src ?? defaultOgImage);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/es/projects/${slug}/`,
      languages: { en: enUrl, es: esUrl, "x-default": enUrl },
    },
    openGraph: {
      type: "article",
      url: esUrl,
      title,
      description,
      locale: "es",
      alternateLocale: ["en"],
      images: [{ url: image, alt: project.heroImage?.label ?? "Herrajes arquitectónicos HYDE" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProyectoPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} locale="es" />;
}
