import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProjectListing } from "@/components/site/ProjectListing";

export const metadata: Metadata = pageMetadata({
  enPath: "/projects",
  locale: "es",
  title: "Proyectos y aplicaciones",
  description:
    "Paquetes representativos de herrajes para proyectos internacionales.",
});

export default function ProyectosPage() {
  return <ProjectListing locale="es" />;
}
