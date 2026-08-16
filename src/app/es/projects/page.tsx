import type { Metadata } from "next";
import { ProjectListing } from "@/components/site/ProjectListing";

export const metadata: Metadata = {
  title: "Proyectos y aplicaciones | Canton Hyland",
  description: "Paquetes representativos de herrajes para proyectos internacionales.",
};

export default function ProyectosPage() {
  return <ProjectListing locale="es" />;
}
