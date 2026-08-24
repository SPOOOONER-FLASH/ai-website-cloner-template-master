import { ArrowLink } from "./ArrowLink";
import { MediaPlaceholder } from "./MediaPlaceholder";
import {
  certificates,
  companyEditorialStudies,
  profile,
  profileEs,
  stats,
  statsEs,
} from "@/data/company";

type Locale = "en" | "es";

const copy = {
  en: {
    eyebrow: "Canton Hyland",
    title: "Hardware manufacturing since 1998",
    intro: "Door security, architectural hardware and OEM production for global building projects.",
    facts: "Company at a glance",
    context: "Materials + technical context",
    contextBody:
      "These representative studies express architectural and finish context through metal, limestone, timber and glass. They are editorial concepts, not photographs of Canton Hyland facilities or completed client projects.",
    gallery: "Architectural + material studies",
    quality: "Quality and test evidence",
    qualityBody:
      "The documents below are shown with their exact model scope. A test report for one model is not presented as approval for another; current-SKU coverage must be confirmed before specification.",
    scope: "Scope",
    issuer: "Issuer",
    reference: "Reference",
    issued: "Issued",
    cta: "Discuss a project or arrange a factory visit",
    contact: "Contact our export team",
  },
  es: {
    eyebrow: "Canton Hyland",
    title: "Fabricación de herrajes desde 1998",
    intro: "Seguridad para puertas, herrajes arquitectónicos y producción OEM para proyectos internacionales.",
    facts: "La empresa en cifras",
    context: "Materiales + contexto técnico",
    contextBody:
      "Estos estudios representativos expresan el contexto arquitectónico y de acabados mediante metal, piedra caliza, madera y vidrio. Son conceptos editoriales, no fotografías de las instalaciones de Canton Hyland ni de proyectos terminados de clientes.",
    gallery: "Estudios arquitectónicos + materiales",
    quality: "Calidad y ensayos",
    qualityBody:
      "Cada documento se muestra con el alcance exacto indicado en el informe. Un ensayo de un modelo no se presenta como aprobación de otro; confirme la cobertura del SKU antes de especificarlo.",
    scope: "Alcance",
    issuer: "Emisor",
    reference: "Referencia",
    issued: "Emisión",
    cta: "Hablemos de su proyecto o de una visita a fábrica",
    contact: "Contactar con exportación",
  },
} as const;

export function CompanyOverview({ locale = "en" }: { locale?: Locale }) {
  const text = copy[locale];
  const paragraphs = locale === "es" ? profileEs : profile;
  const companyStats = locale === "es" ? statsEs : stats;
  const contactHref = locale === "es" ? "/es/contact" : "/contact";
  const localiseImageLabel = (label: string, labelEs?: string) =>
    locale === "es" ? labelEs ?? label : label;

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-8">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
              {text.eyebrow}
            </p>
            <h1 className="mt-16 text-h1 text-ink">{text.title}</h1>
            <p className="mt-24 text-c1 text-ink">{text.intro}</p>
          </div>
          <div className="col-span-full space-y-24 lg:col-span-7 lg:col-start-6 xl:col-span-14 xl:col-start-11">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-c1 text-ink">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="col-content border-t border-line pt-48">
          <h2 className="text-h2 text-ink">{text.facts}</h2>
          <dl className="mt-48 grid grid-cols-1 gap-x gap-y-32 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat) => (
              <div key={stat.label} className="border-t border-line pt-16">
                <dt className="text-c2 text-ink-secondary">{stat.label}</dt>
                <dd className="mt-8 text-h3 text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="col-content grid w-full grid-cols gap-x gap-y-48 border-t border-line pt-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h2 className="text-h2 text-ink">{text.context}</h2>
            <p className="mt-24 text-c1 text-ink-secondary">{text.contextBody}</p>
          </div>
          <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
            <MediaPlaceholder
              {...companyEditorialStudies[0]}
              label={localiseImageLabel(
                companyEditorialStudies[0].label,
                companyEditorialStudies[0].labelEs,
              )}
            />
          </div>
        </section>

        <section className="col-content border-t border-line pt-48">
          <h2 className="text-h2 text-ink">{text.gallery}</h2>
          <div className="mt-48 grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2">
            {companyEditorialStudies.slice(1).map((image) => (
              <MediaPlaceholder
                key={image.src}
                {...image}
                label={localiseImageLabel(image.label, image.labelEs)}
              />
            ))}
          </div>
        </section>

        <section className="col-content border-t border-line pt-48">
          <div className="grid grid-cols gap-x gap-y-48">
            <div className="col-span-full lg:col-span-4 xl:col-span-7">
              <h2 className="text-h2 text-ink">{text.quality}</h2>
              <p className="mt-24 text-c1 text-ink-secondary">{text.qualityBody}</p>
            </div>
            <div className="col-span-full grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
              {certificates.map((certificate) => (
                <article key={certificate.reference} className="border-t border-line pt-16">
                  <MediaPlaceholder
                    {...certificate.image}
                    label={localiseImageLabel(
                      certificate.image.label,
                      certificate.image.labelEs,
                    )}
                    className="bg-surface-alt object-contain"
                  />
                  <h3 className="mt-16 text-h3 text-ink">{certificate.title}</h3>
                  <dl className="mt-16 space-y-8 text-c2 text-ink-secondary">
                    {[
                      [text.scope, certificate.coversModel],
                      [text.issuer, certificate.issuer],
                      [text.reference, certificate.reference],
                      [text.issued, certificate.issued],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="inline font-semibold text-ink">{label}: </dt>
                        <dd className="inline">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="col-content border-t border-line pt-48">
          <h2 className="max-w-[68rem] text-h2 text-ink">{text.cta}</h2>
          <div className="mt-24">
            <ArrowLink href={contactHref}>{text.contact}</ArrowLink>
          </div>
        </section>
      </div>
    </main>
  );
}
