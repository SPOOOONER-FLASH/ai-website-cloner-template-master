import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProjectListing } from "@/components/site/ProjectListing";

/** The Portuguese mirror of /projects/. Same component, `locale="pt"`. */

export const metadata: Metadata = pageMetadata({
  enPath: "/projects",
  locale: "pt",
  title: "Aplicações e obras",
  description:
    "Conjuntos representativos de ferragens para obras internacionais: barras antipânico, fechaduras de embutir, maçanetas e dobradiças por tipo de edifício.",
});

export default function AplicacoesPage() {
  return <ProjectListing locale="pt" />;
}
