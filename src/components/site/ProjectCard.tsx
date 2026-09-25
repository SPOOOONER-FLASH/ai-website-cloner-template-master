import Link from "next/link";
import type { Project } from "@/data/types";
import { MediaPlaceholder } from "./MediaPlaceholder";
import type { Locale } from "@/data/site";
import { t } from "@/lib/i18n";

export function ProjectCard({
  project,
  locale = "en",
}: {
  project: Project;
  locale?: Locale;
}) {
  /*
    Three locales, and the href is as much of the translation as the text is. This card
    built `/projects/<slug>/` for anything that was not Spanish, so every application on
    the Portuguese listing handed the reader to the English tree — and from there the whole
    visit is English. See src/data/locale-route-parity.test.ts.
  */
  const pick = (en: string, es?: string, pt?: string) =>
    (locale === "es" ? es : locale === "pt" ? pt : undefined) ?? en;

  const prefix = locale === "en" ? "" : `/${locale}`;
  const name = t(project, "name", locale);
  const buildingType = pick(
    project.buildingType,
    project.buildingTypeEs,
    project.buildingTypePt,
  );
  const summary = t(project, "summary", locale);
  const href = `${prefix}/projects/${project.slug}/`;
  const imageLabel = pick(project.heroImage.label, project.heroImage.labelEs);
  const eyebrow =
    locale === "es"
      ? "Aplicación representativa"
      : locale === "pt"
        ? "Aplicação representativa"
        : "Representative application";

  return (
    <Link
      href={href}
      className="hard-shadow-card group flex flex-col bg-surface"
    >
      <MediaPlaceholder
        {...project.heroImage}
        label={imageLabel}
        className="aspect-[3/2]"
        sizes="(min-width: 1440px) 453px, (min-width: 744px) 48vw, 96vw"
      />
      <div className="flex flex-1 flex-col border-t border-line p-24">
        <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
          {eyebrow}
        </p>
        <h2 className="title-marker mt-16 text-h3 text-ink">
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
