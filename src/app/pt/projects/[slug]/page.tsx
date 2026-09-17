import type { Metadata } from "next";
import { absoluteUrl } from "@/data/site";
import { alternateLanguages, defaultOgImage } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { getAllProjectParams, getProjectBySlug } from "@/data/projects";

/**
 * The Portuguese mirror of /projects/[slug]/.
 *
 * Added 2026-09-17, with the other five Portuguese routes, because a nav item that has no
 * mirror does not degrade — it EJECTS. "Aplicações" in the Portuguese header pointed at
 * /projects/, and from that English page every subsequent link was English too, so one
 * missing route cost the reader the language for the rest of the visit. The client
 * reported it in exactly those terms: 点选葡萄牙语，选择产品配置器和首页又变成了英文.
 */

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjectParams();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.namePt ?? project.name} | Canton Hyland`;
  /* seoDescriptionPt is metadata-only; summaryPt stays as the visible page intro. */
  const description = project.seoDescriptionPt ?? project.summaryPt ?? project.summary;
  const url = absoluteUrl(`/pt/projects/${slug}/`);
  const image = absoluteUrl(project.heroImage?.src ?? defaultOgImage);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/pt/projects/${slug}/`,
      languages: alternateLanguages(`/projects/${slug}`),
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      locale: "pt_BR",
      alternateLocale: ["en", "es"],
      images: [{ url: image, alt: project.heroImage?.label ?? "Ferragens arquitetónicas HYDE" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function AplicacaoPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} locale="pt" />;
}
