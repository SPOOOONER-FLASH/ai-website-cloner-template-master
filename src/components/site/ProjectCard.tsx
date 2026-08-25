import Link from "next/link";
import type { Project } from "@/data/types";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function ProjectCard({
  project,
  locale = "en",
}: {
  project: Project;
  locale?: "en" | "es";
}) {
  const spanish = locale === "es";
  const name = spanish ? project.nameEs ?? project.name : project.name;
  const buildingType = spanish
    ? project.buildingTypeEs ?? project.buildingType
    : project.buildingType;
  const summary = spanish ? project.summaryEs ?? project.summary : project.summary;
  const href = spanish ? `/es/projects/${project.slug}/` : `/projects/${project.slug}/`;
  const imageLabel = spanish
    ? project.heroImage.labelEs ?? project.heroImage.label
    : project.heroImage.label;

  return (
    <Link
      href={href}
      className="group flex flex-col border border-line bg-surface hover:border-brand"
    >
      <MediaPlaceholder
        {...project.heroImage}
        label={imageLabel}
        className="aspect-[3/2]"
        sizes="(min-width: 1440px) 453px, (min-width: 744px) 48vw, 96vw"
      />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
          {spanish ? "Aplicación representativa" : "Representative application"}
        </p>
        <h2 className="mt-16 text-h3 text-ink group-hover:text-brand-hover group-hover:underline">
          {name}
        </h2>
        <p className="mt-8 text-c2 text-ink-secondary">{buildingType}</p>
        <p className="mt-24 border-t border-line pt-16 text-c1 text-ink-secondary">
          {summary}
        </p>
      </div>
    </Link>
  );
}
