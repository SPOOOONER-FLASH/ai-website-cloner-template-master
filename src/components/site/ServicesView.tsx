import Link from "next/link";
import type { Locale } from "@/data/site";
import { localisedHref } from "@/data/navigation";
import { MediaPlaceholder } from "./MediaPlaceholder";

/**
 * The OEM / private-label services page, in whichever language has its copy written.
 *
 * Copy lives here, one object per language, so a translation is one edit in one place.
 * Spanish and Portuguese are added by the copy session (Hyde 文案, 2026-09-24); until a
 * language has its object, that language has no /es or /pt route and no hreflang
 * (src/lib/spanish-mirror.ts), and its navigation keeps linking to the English page.
 */
export interface ServicesCopy {
  kicker: string;
  heading: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  imageLabel: string;
  briefAria: string;
  briefKicker: string;
  briefHeading: string;
  briefItems: readonly string[];
  briefCta: string;
  listHeading: string;
  services: readonly { number: string; title: string; body: string; outcome: string }[];
  docsHeading: string;
  docsBody: string;
  docsCta: string;
}

export const SERVICES_COPY: Partial<Record<Locale, ServicesCopy>> & { en: ServicesCopy } = {
  en: {
    kicker: "Services",
    heading: "Bring us a drawing. Leave with a product.",
    intro:
      "Much of what we make leaves Xiaolan under our customers' brands, and it is the work we are best at. We tool new parts to your drawing or sample, rework a design that runs into someone else's patent, and put your name, your instructions and your packaging on the result. Since 1998, for brands and distributors across Europe, the Americas, Turkey and Southeast Asia.",
    primaryCta: "Send your drawing or sample",
    secondaryCta: "Or start from our catalog",
    imageLabel: "Representative architectural entrance combining glass, metal and coordinated door hardware",
    briefAria: "Send a service brief to Canton Hyland",
    briefKicker: "To quote a new part",
    briefHeading: "We need four things from you",
    briefItems: [
      "A drawing, sample or reference photograph",
      "Where you will sell it, and the standard it must meet",
      "Your expected annual quantity",
      "Your branding: logo, labels, instruction language, packaging",
    ],
    briefCta: "Send your brief",
    listHeading: "What we do for a private-label brand",
    services: [
      {
        number: "01",
        title: "New tooling to your design",
        body: "Send a drawing, a sample or a reference model. Our engineers work out the part, we cut the tooling, and you approve samples before a single production piece is made.",
        outcome: "Send the drawing or sample, the target market and your expected annual quantity.",
      },
      {
        number: "02",
        title: "A design you are free to put your name on",
        body: "If the product you want is covered by another maker's patent, our engineers rework the internal parts or the appearance until it no longer conflicts with that patent, and we tell you exactly which features changed so your own patent check has something specific to review.",
        outcome: "Tell us which product it resembles and where you will sell it.",
      },
      {
        number: "03",
        title: "Your brand, on every layer",
        body: "Your logo on the part, your labels, installation instructions in your market's language, and cartons and barcodes to your specification. The hardware arrives ready to sell as yours.",
        outcome: "Send your logo files, label text and the languages you need.",
      },
      {
        number: "04",
        title: "Samples that decide the order",
        body: "Samples of the exact model, function and finish you will order, so the sample you approve is the product that ships, container after container.",
        outcome: "Include the destination, the quantity and what the sample has to prove.",
      },
      {
        number: "05",
        title: "Drawings, datasheets and test reports",
        body: "Drawings, datasheets and installation instructions by model. A test report is only useful if it names the model you are buying and says whose name it was issued in, so that is how we answer every request for one.",
        outcome: "Ask by model number and tell us what the document is for.",
      },
      {
        number: "06",
        title: "Export, from Xiaolan to your port",
        body: "Quotation, packing and shipping arranged around your Incoterm and destination. Our team works in English and Spanish, and we have an office in Germany for buyers who want to meet in Europe.",
        outcome: "Share the Incoterm and destination port when you know them.",
      },
    ],
    docsHeading: "Documents already available",
    docsBody:
      "Catalogs, drawings and technical files for our standard range are ready to download. For a part we develop with you, the drawings are yours as well.",
    docsCta: "Open download center",
  },
};

export function ServicesView({ locale }: { locale: Locale }) {
  const c = SERVICES_COPY[locale] ?? SERVICES_COPY.en;
  const href = (path: string) => localisedHref(path, locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{c.kicker}</p>
            <h1 className="mt-16 text-h1 text-ink">{c.heading}</h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">{c.intro}</p>
            <div className="mt-32 flex flex-wrap gap-x-32 gap-y-16">
              <Link
                href={href("/contact")}
                className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              >
                {c.primaryCta}
              </Link>
              <Link
                href={href("/product-finder")}
                className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              >
                {c.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24">
          <div className="col-span-full lg:col-span-7 xl:col-span-15">
            <MediaPlaceholder
              src="/images/editorial/project-glass-entrance.webp"
              ratio="3 / 2"
              label={c.imageLabel}
              className="h-full min-h-320"
              priority
            />
          </div>
          <Link
            href={href("/contact")}
            aria-label={c.briefAria}
            className="home-accent-surface short-marker-surface group col-span-full flex flex-col justify-between border border-line p-24 text-ink no-underline outline-offset-4 lg:col-span-4 lg:col-start-9 xl:col-span-8 xl:col-start-17"
          >
            <div>
              <p className="text-kicker text-ink-secondary">{c.briefKicker}</p>
              <h2 className="mt-24 text-h2 text-ink">{c.briefHeading}</h2>
            </div>
            <div className="mt-48 border-t border-line pt-16">
              <ul className="space-y-16 text-c1 text-ink-secondary">
                {c.briefItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="short-marker short-marker-arrow mt-32 inline-block text-c1 text-ink">
                {c.briefCta}
              </span>
            </div>
          </Link>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-48 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink">{c.listHeading}</h2>
          {c.services.map((service) => (
            <article
              key={service.number}
              className="col-span-full border-t border-line pt-16 sm:col-span-2 md:col-span-4 xl:col-span-8"
            >
              <div className="flex items-start justify-between gap-16">
                <h3 className="text-h3 text-ink">{service.title}</h3>
                <span className="text-kicker text-ink-secondary">{service.number}</span>
              </div>
              <p className="mt-24 text-c1 text-ink-secondary">{service.body}</p>
              <p className="mt-24 border-t border-line pt-16 text-c2 text-ink">{service.outcome}</p>
            </article>
          ))}
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24 border-t border-line pt-32">
          <div className="col-span-full lg:col-span-5 xl:col-span-8">
            <h2 className="text-h2 text-ink">{c.docsHeading}</h2>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink-secondary">{c.docsBody}</p>
            <Link
              href={href("/downloads")}
              className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
            >
              {c.docsCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
