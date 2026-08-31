import Link from "next/link";
import type { Project } from "@/data/types";
import { getProductByModel } from "@/data/products";
import { ArrowLink } from "./ArrowLink";
import { Button } from "./Button";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ProductCard } from "./ProductCard";

const copy = {
  en: {
    home: "Home",
    projects: "Projects + Applications",
    status: "Representative application",
    note: "This study demonstrates a possible hardware schedule. It is not presented as a named completed client project.",
    brief: "Application brief",
    gallery: "Application + hardware",
    related: "Related products",
    relatedNote:
      "Confirm dimensions, test scope, door preparation and finishes against the current technical documentation before ordering.",
    quote: "Discuss this hardware package",
    all: "All applications",
  },
  es: {
    home: "Inicio",
    projects: "Proyectos + Aplicaciones",
    status: "Aplicación representativa",
    note: "Este estudio muestra una posible combinación de herrajes. No se presenta como un proyecto terminado de un cliente identificado.",
    brief: "Resumen de la aplicación",
    gallery: "Aplicación + herrajes",
    related: "Productos relacionados",
    relatedNote:
      "Confirme dimensiones, alcance de ensayos, preparación de puerta y acabados con la documentación técnica vigente antes de pedir.",
    quote: "Consultar este paquete",
    all: "Todas las aplicaciones",
  },
} as const;

export function ProjectDetail({
  project,
  locale = "en",
}: {
  project: Project;
  locale?: "en" | "es";
}) {
  const spanish = locale === "es";
  const text = copy[locale];
  const name = spanish ? project.nameEs ?? project.name : project.name;
  const buildingType = spanish
    ? project.buildingTypeEs ?? project.buildingType
    : project.buildingType;
  const summary = spanish ? project.summaryEs ?? project.summary : project.summary;
  const body = spanish ? project.bodyEs ?? project.body : project.body;
  const projectsHref = spanish ? "/es/projects/" : "/projects/";
  const contactHref = spanish ? "/es/contact/" : "/contact/";
  const homeHref = spanish ? "/es/" : "/";
  const localiseImageLabel = (label: string, labelEs?: string) =>
    spanish ? labelEs ?? label : label;
  const relatedProducts = project.productModels
    .map(getProductByModel)
    .filter((product) => product !== undefined);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <nav className="col-span-full flex flex-wrap gap-x-8 text-c2 text-ink-secondary">
            <Link href={homeHref} className="short-marker short-marker-compact hover:text-brand-hover">
              {text.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={projectsHref} className="short-marker short-marker-compact hover:text-brand-hover">
              {text.projects}
            </Link>
          </nav>
          <div className="col-span-full mt-24 lg:col-span-7 xl:col-span-14">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
              {text.status}
            </p>
            <h1 className="mt-16 text-h1 text-ink">{name}</h1>
          </div>
          <div className="col-span-full mt-24 lg:col-span-4 lg:col-start-9 xl:col-span-7 xl:col-start-18">
            <p className="text-h3 text-ink">{buildingType}</p>
            <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
              {text.note}
            </p>
          </div>
        </section>

        <section className="col-outset">
          <MediaPlaceholder
            {...project.heroImage}
            label={localiseImageLabel(project.heroImage.label, project.heroImage.labelEs)}
            className="max-h-[76rem]"
            sizes="(min-width: 1600px) 1440px, 100vw"
          />
        </section>

        <section className="col-content grid w-full grid-cols gap-x gap-y-48 border-t border-line pt-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h2 className="text-h2 text-ink">{text.brief}</h2>
          </div>
          <div className="col-span-full space-y-24 lg:col-span-7 lg:col-start-6 xl:col-span-14 xl:col-start-11">
            <p className="text-h3 text-ink">{summary}</p>
            {body.map((paragraph) => (
              <p key={paragraph} className="text-c1 text-ink-secondary">
                {paragraph}
              </p>
            ))}
            <div className="pt-16">
              <Button href={contactHref}>{text.quote}</Button>
            </div>
          </div>
        </section>

        <section className="col-content border-t border-line pt-48">
          <h2 className="text-h2 text-ink">{text.gallery}</h2>
          <div className="mt-48 grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2">
            {project.gallery.map((image) => (
              <MediaPlaceholder
                key={`${image.src}-${image.label}`}
                {...image}
                label={localiseImageLabel(image.label, image.labelEs)}
                sizes="(min-width: 1440px) 680px, (min-width: 744px) 48vw, 96vw"
              />
            ))}
          </div>
        </section>

        <section className="col-content border-t border-line pt-48">
          <div className="grid grid-cols gap-x gap-y-48">
            <div className="col-span-full lg:col-span-4 xl:col-span-7">
              <h2 className="text-h2 text-ink">{text.related}</h2>
              <p className="mt-24 text-c2 text-ink-secondary">{text.relatedNote}</p>
            </div>
            <div className="col-span-full grid grid-cols-1 gap-24 sm:grid-cols-2 lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10 xl:grid-cols-3">
              {relatedProducts.map((product) => (
                <ProductCard key={product.model} product={product} locale={locale} />
              ))}
            </div>
          </div>
          <div className="mt-48">
            <ArrowLink href={projectsHref}>{text.all}</ArrowLink>
          </div>
        </section>
      </div>
    </main>
  );
}
