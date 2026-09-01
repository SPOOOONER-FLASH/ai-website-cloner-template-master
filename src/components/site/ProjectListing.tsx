import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

/*
  Applications, not projects.

  The old page was headed "Projects + Applications" and footnoted "approved client
  references have not yet been supplied", which reads as a company waiting for permission
  to prove itself. The real reason is better than the excuse: this factory manufactures
  under other companies' brands. An OEM supplier does not own its customers' project
  names and cannot publish them — that is a term of the work, not a gap in it.

  So the page stops implying a case-study library it will never have, and does the thing
  a buyer actually needs instead: which combination of hardware a building type takes,
  and where each part goes on the door. That is knowledge we genuinely have, it needs
  nobody's permission, and it is what somebody specifying a door schedule is looking for.
*/
const copy = {
  en: {
    title: "Applications",
    intro:
      "What a door schedule actually contains, by building type — which lock, which handle, which closer, and where each part sits on the leaf.",
    note: "We manufacture under our customers' own brands, so the buildings our hardware is installed in are not ours to name. These pages show the combinations rather than the clients: every model listed is one we make and publish, so you can price the whole schedule from them.",
  },
  es: {
    title: "Aplicaciones",
    intro:
      "Qué contiene realmente un cuadro de puertas, por tipo de edificio — qué cerradura, qué manija, qué cierrapuertas, y dónde va cada pieza en la hoja.",
    note: "Fabricamos bajo la marca de nuestros clientes, así que los edificios donde se instalan nuestros herrajes no son nuestros para nombrarlos. Estas páginas muestran las combinaciones, no los clientes: cada modelo que aparece es nuestro y está publicado, de modo que puede cotizar el cuadro completo a partir de ellos.",
  },
} as const;

export function ProjectListing({ locale = "en" }: { locale?: "en" | "es" }) {
  const text = copy[locale];
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <h1 className="col-span-full text-h1 text-ink lg:col-span-5 xl:col-span-11">{text.title}</h1>
          <div className="col-span-full lg:col-span-6 lg:col-start-7 xl:col-span-11 xl:col-start-14">
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
