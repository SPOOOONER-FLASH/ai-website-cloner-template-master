import type { Locale } from "@/data/site";
import { ArrowLink } from "./ArrowLink";
import { CapabilityChain } from "./CapabilityChain";
import { representatives } from "@/data/representatives";
import { publishedProducts } from "@/data/products";
import { MediaPlaceholder } from "./MediaPlaceholder";
import {
  certificates,
  companyEditorialStudies,
  profile,
  profileEs,
  profilePt,
  stats,
  statsEs,
  statsPt,
} from "@/data/company";
import { siteSettings } from "@/data/navigation";
import { EmailLink } from "./EmailLink";
import { dict, tx } from "@/lib/i18n";
const copy = {
  en: {
    eyebrow: "Canton Hyland",
    title: "A door hardware maker in Xiaolan, since 1998.",
    intro: "We make the hardware that goes on a door, and much of it leaves our factory under our customers' names. After twenty-eight years of that, we know who gets the call when a part fails: the one whose name is on it. We build for that person.",
    facts: "At a glance",
    where: "Where we are",
    context: "The factory",
    contextBody:
      "Our plant in Zhongshan, Guangdong: the press shop, the polishing line and the assembly hall. These are photographs of the plant at work, not staged studies.",
    contextImageNote: "Factory photograph",
    gallery: "Inside the factory",
    quality: "What is tested, and in whose name",
    qualityBody:
      "Each document below is listed with the one model it covers. A report on one model does not approve another, so before you specify, ask us which current models a document still covers. Much of what we make is tested in our customers' names, at their cost; testing in our own name is being prepared.",
    scope: "Scope",
    issuer: "Issuer",
    reference: "Reference",
    issued: "Issued",
    cta: "Come and see the factory, or send us a drawing",
    contact: "Talk to the people who make it",
    writeDirect: "Or write to us directly:",
  },
  es: {
    eyebrow: "Canton Hyland",
    title: "Fabricante de herrajes en Xiaolan, desde 1998.",
    intro: "Fabricamos los herrajes que lleva una puerta, y buena parte sale de nuestra fábrica con la marca de nuestros clientes. Después de veintiocho años haciéndolo, sabemos a quién llaman cuando una pieza falla: a quien puso su nombre en ella. Fabricamos para esa persona.",
    facts: "En cifras",
    where: "Dónde estamos",
    context: "La fábrica",
    contextBody:
      "Nuestra planta en Zhongshan, Guangdong: la sección de prensas, la línea de pulido y la nave de montaje. Son fotografías de la planta en plena actividad, no estudios preparados.",
    contextImageNote: "Fotografía de la fábrica",
    gallery: "Dentro de la fábrica",
    quality: "Qué está ensayado, y a nombre de quién",
    qualityBody:
      "Cada documento se muestra con el único modelo que cubre. El informe de un modelo no aprueba otro, así que antes de especificar, pregúntenos qué modelos actuales sigue cubriendo. Buena parte de lo que fabricamos se ensaya a nombre de nuestros clientes y a su cargo; los ensayos a nuestro propio nombre están en preparación.",
    scope: "Alcance",
    issuer: "Emisor",
    reference: "Referencia",
    issued: "Emisión",
    cta: "Visite la fábrica o envíenos un plano",
    contact: "Hable con quien lo fabrica",
    writeDirect: "O escríbanos directamente:",
  },
  pt: {
    eyebrow: "Canton Hyland",
    title: "Fabricante de ferragens em Xiaolan, desde 1998.",
    intro: "Fabricamos as ferragens que uma porta leva, e boa parte sai da nossa fábrica com a marca dos nossos clientes. Depois de vinte e oito anos fazendo isso, sabemos para quem ligam quando uma peça falha: para quem pôs o nome nela. Fabricamos para essa pessoa.",
    facts: "Em números",
    where: "Onde estamos",
    context: "A fábrica",
    contextBody:
      "Nossa fábrica em Zhongshan, Guangdong: o setor de prensas, a linha de polimento e o galpão de montagem. São fotografias da fábrica em funcionamento, não estudos montados.",
    contextImageNote: "Fotografia da fábrica",
    gallery: "Dentro da fábrica",
    quality: "O que foi ensaiado, e em nome de quem",
    qualityBody:
      "Cada documento aparece com o único modelo que cobre. O relatório de um modelo não aprova outro; antes de especificar, pergunte quais modelos atuais ele ainda cobre. Boa parte do que fabricamos é ensaiada em nome dos nossos clientes, por conta deles; os ensaios em nosso próprio nome estão em preparação.",
    scope: "Escopo",
    issuer: "Emissor",
    reference: "Referência",
    issued: "Emissão",
    cta: "Visite a fábrica ou envie um desenho",
    contact: "Fale com quem fabrica",
    writeDirect: "Ou escreva para nós diretamente:",
  },
} as const;

export function CompanyOverview({ locale = "en" }: { locale?: Locale }) {
  const text = dict(copy, locale);
  /*
    Three two-way switches, generalised on 2026-09-16 when /pt/company shipped.

    Each was `locale === "es" ? … : …`, so a Portuguese page took the ENGLISH branch of
    every one — profile text, the figures, the contact link and every image caption. The
    page rendered perfectly and was in the wrong language, which is the failure mode a
    boolean has when a third option arrives.

    The image caption keeps English as its fallback rather than Spanish, for the reason in
    src/lib/localised.ts: an English caption reads as unfinished, a Spanish one reads as
    finished and wrong.
  */
  const paragraphs = dict({ en: profile, es: profileEs, pt: profilePt }, locale);
  const companyStats = dict({ en: stats, es: statsEs, pt: statsPt }, locale);
  const contactHref = locale === "en" ? "/contact" : `/${locale}/contact`;
  const localiseImageLabel = (label: string, labelEs?: string, labelPt?: string) =>
    locale === "es" ? (labelEs ?? label) : locale === "pt" ? (labelPt ?? label) : label;

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
          <div className="col-span-full lg:hidden">
            <MediaPlaceholder
              {...companyEditorialStudies[0]}
              label={localiseImageLabel(
                companyEditorialStudies[0].label,
                companyEditorialStudies[0].labelEs,
                companyEditorialStudies[0].labelPt,
              )}
              sizes="96vw"
            />
            <p className="mt-8 text-c2 text-ink-secondary">{text.contextImageNote}</p>
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
                <dd className="mt-8 text-lead tabular-nums text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/*
          The chain goes directly under the figures, because the figures are what it
          produces. A buyer who has just read "101–200 people" and "3,000–5,000 m²" is
          holding two numbers and no picture of what happens between them; seven steps
          answer that before the question turns into an email.
        */}
        <CapabilityChain locale={locale} models={publishedProducts.length} />

        {/*
          Where the company actually is.

          The factory address lives on /contact/ because that is where someone raising a
          quotation looks for it, but "where are you" is a company question and this is
          the company page — a buyer researching a supplier before enquiring never opens
          the contact form. The overseas entries are representative contacts, not
          offices; see the note in src/data/representatives.ts for why that wording is
          load-bearing rather than modest.
        */}
        <section className="col-content border-t border-line pt-48">
          <h2 className="text-h2 text-ink">{text.where}</h2>
          <div className="mt-48 grid grid-cols-1 gap-x gap-y-32 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-t border-line pt-16">
              <p className="text-c2 text-ink-secondary">
                {locale === "es" ? "Fábrica" : locale === "pt" ? "Fábrica" : "Factory"}
              </p>
              <address className="mt-8 not-italic text-c2 text-ink-secondary">
                {siteSettings.contact.factoryAddress ?? siteSettings.contact.address}
                <br />
                {siteSettings.contact.city}, {siteSettings.contact.province},{" "}
                {siteSettings.contact.country}
              </address>
            </div>

            <div className="border-t border-line pt-16">
              <p className="text-c2 text-ink-secondary">
                {locale === "es" ? "Oficina" : locale === "pt" ? "Escritório" : "Office"}
              </p>
              <address className="mt-8 not-italic text-c2 text-ink-secondary">
                {siteSettings.contact.address}
                <br />
                {siteSettings.contact.city}, {siteSettings.contact.province},{" "}
                {siteSettings.contact.country}
              </address>
            </div>
            {representatives.map((rep) => (
              <div key={`${rep.region}-${rep.city}`} className="border-t border-line pt-16">
                <p className="text-c2 text-ink-secondary">
                  {tx(locale, rep.region, { es: rep.regionEs, pt: rep.regionPt })}
                </p>
                <p className="mt-8 text-c1 text-ink">{rep.city}</p>
                <address className="mt-4 not-italic text-c2 text-ink-secondary">
                  {rep.address}
                </address>
                {rep.phone ? (
                  <a
                    href={`tel:${rep.phone.replace(/\s/g, "")}`}
                    className="short-marker short-marker-compact mt-8 inline-block text-c2 text-brand hover:text-brand-hover"
                  >
                    {rep.phone}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-24 max-w-[62ch] text-c2 text-ink-secondary">
            {locale === "es"
              ? "Fabricamos en Zhongshan. Fuera de China trabajamos con representantes: son puntos de contacto, no filiales."
              : locale === "pt"
                ? "A fabricação fica em Zhongshan. Fora da China trabalhamos com representantes: são pontos de contato, e não filiais."
                : "Manufacturing is in Zhongshan. Outside China we work through representatives — these are contact points, not subsidiaries."}
          </p>
        </section>

        <section className="col-content grid w-full grid-cols gap-x gap-y-48 border-t border-line pt-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h2 className="text-h2 text-ink">{text.context}</h2>
            <p className="mt-24 text-c1 text-ink-secondary">{text.contextBody}</p>
          </div>
          <div className="hidden lg:col-span-7 lg:col-start-6 lg:block xl:col-span-15 xl:col-start-10">
            <MediaPlaceholder
              {...companyEditorialStudies[0]}
              label={localiseImageLabel(
                companyEditorialStudies[0].label,
                companyEditorialStudies[0].labelEs,
                companyEditorialStudies[0].labelPt,
              )}
              sizes="(min-width: 1440px) 860px, 62vw"
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
                label={localiseImageLabel(image.label, image.labelEs, image.labelPt)}
                sizes="(min-width: 1440px) 680px, (min-width: 744px) 48vw, 96vw"
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
                  {/*
                    The scan renders only when the issuer's written permission is on file.
                    See the `publish` note in src/data/company.ts — the report facts below
                    are ours to state, the documents are not ours to redistribute.
                  */}
                  {certificate.publish && certificate.image ? (
                    <MediaPlaceholder
                      {...certificate.image}
                      label={localiseImageLabel(
                        certificate.image.label,
                        certificate.image.labelEs,
                      )}
                      className="bg-surface-alt object-contain"
                    />
                  ) : null}
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
          {/*
            The brand mailbox belongs on the company page rather than on a product page:
            this is where someone is asking about the company, not about a model. Sales
            and technical enquiries have their own addresses in the footer and beside the
            quote button, so the three do not compete.
          */}
          {siteSettings.contact.brandEmail ? (
            <p className="mt-24 text-c1 text-ink-secondary">
              {text.writeDirect}{" "}
              <EmailLink
                address={siteSettings.contact.brandEmail}
                className="text-brand hover:text-brand-hover"
              />
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
