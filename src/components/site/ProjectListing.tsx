import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

const copy = {
  en: {
    title: "Projects + Applications",
    intro:
      "Hardware packages for commercial, institutional, hospitality, residential and glass-door applications.",
    note: "These are representative application studies, not named completed projects. Approved client references, locations and installation photography have not yet been supplied.",
  },
  es: {
    title: "Proyectos + Aplicaciones",
    intro:
      "Paquetes de herrajes para aplicaciones comerciales, institucionales, hoteleras, residenciales y puertas de vidrio.",
    note: "Estos son estudios de aplicación representativos, no proyectos terminados con nombre propio. Aún no se han facilitado referencias, ubicaciones ni fotografías de instalación autorizadas.",
  },
} as const;

export function ProjectListing({ locale = "en" }: { locale?: "en" | "es" }) {
  const text = copy[locale];
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <h1 className="col-span-full text-h1 text-ink lg:col-span-11">{text.title}</h1>
          <div className="col-span-full lg:col-span-11 lg:col-start-14">
            <p className="text-c1 text-ink">{text.intro}</p>
            <p className="mt-24 border-t border-line pt-16 text-c2 text-ink-secondary">
              {text.note}
            </p>
          </div>
        </section>
        <section className="col-content grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </section>
      </div>
    </main>
  );
}
