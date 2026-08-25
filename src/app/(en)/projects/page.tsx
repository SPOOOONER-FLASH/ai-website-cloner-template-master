import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProjectListing } from "@/components/site/ProjectListing";

export const metadata: Metadata = pageMetadata({
  enPath: "/projects",
  locale: "en",
  title: "Projects + Applications",
  description:
    "Representative hardware application studies for commercial, hospitality, residential and glass-door schedules.",
});

export default function ProjectsPage() {
  return <ProjectListing />;
}
