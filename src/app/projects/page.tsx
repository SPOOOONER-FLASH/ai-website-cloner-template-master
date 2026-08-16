import type { Metadata } from "next";
import { ProjectListing } from "@/components/site/ProjectListing";

export const metadata: Metadata = {
  title: "Projects + Applications | Canton Hyland",
  description: "Representative hardware application studies for commercial, hospitality, residential and glass-door schedules.",
};

export default function ProjectsPage() {
  return <ProjectListing />;
}
