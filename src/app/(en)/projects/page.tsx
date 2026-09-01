import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProjectListing } from "@/components/site/ProjectListing";

export const metadata: Metadata = pageMetadata({
  enPath: "/projects",
  locale: "en",
  title: "Door Hardware Applications by Building Type",
  description:
    "Which hardware a commercial, hospitality, residential or glass-door schedule actually takes, and where each part sits on the door. Every model listed is one we manufacture.",
});

export default function ProjectsPage() {
  return <ProjectListing />;
}
