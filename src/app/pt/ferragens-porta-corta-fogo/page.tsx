import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { EmailLink } from "@/components/site/EmailLink";
import { ptLanding } from "@/data/pt-landing";
import { absoluteUrl } from "@/data/site";
import { defaultOgImage } from "@/lib/seo";

/*
  Metadata is still written out rather than taken from `pageMetadata`.

  The helper is three-locale aware now, but it builds alternates for a path that exists in
  more than one language. This page has no English or Spanish twin at all — it is a single
  Portuguese document, written for a market that reads ABNT rather than EN 1125 — so there
  is nothing for it to pair with and a hand-written block says so plainly.

  It moved under src/app/pt/ on 2026-09-16 when the Portuguese tree was built, so it now
  inherits `lang="pt-BR"`, the header and the footer from that layout instead of carrying
  its own language attribute inside the English one.
*/
const path = "/pt/ferragens-porta-corta-fogo/";
const description =
  "Fabricante chinês de ferragens para porta corta-fogo: barras antipânico de 650 a 1110 mm, maçanetas externas com chave, fechaduras e cilindros. Documentos com emissor, referência e modelo coberto — e o que não temos.";

export const metadata: Metadata = {
  title: "Ferragens para Porta Corta-Fogo — Fabricante",
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    title: "Ferragens para Porta Corta-Fogo — Fabricante | Canton Hyland",
    description,
    locale: "pt_BR",
    /*
      og:image and the Twitter card are spelled out because this page does not go through
      `pageMetadata`, which supplies both. The SEO audit caught all three as missing on the
      first build — og-image-missing, twitter-title-mismatch, twitter-description-mismatch
      — which is the guard doing its job on a hand-written metadata block.
    */
    images: [
      {
        url: absoluteUrl(defaultOgImage),
        width: 1200,
        height: 630,
        alt: "HYDE architectural door hardware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferragens para Porta Corta-Fogo — Fabricante | Canton Hyland",
    description,
    images: [absoluteUrl(defaultOgImage)],
  },
};

export default function FerragensPortaCortaFogoPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Ferragens para porta corta-fogo" }]}
            />
          </div>

          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              {ptLanding.kicker}
            </p>
            <h1 className="mt-16 text-h1 text-ink">{ptLanding.title}</h1>
          </div>

          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">{ptLanding.intro}</p>
          </div>
        </section>

        {ptLanding.sections.map((section) => (
          <section key={section.heading} className="col-content grid grid-cols gap-x gap-y-24">
            <h2 className="col-span-full text-h3 text-ink lg:col-span-4 xl:col-span-8">
              {section.heading}
            </h2>
            <div className="col-span-full space-y-24 lg:col-span-6 lg:col-start-6 xl:col-span-14 xl:col-start-12">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-c2 text-ink-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section className="col-content grid grid-cols gap-x gap-y-24">
          <h2 className="col-span-full text-h3 text-ink lg:col-span-4 xl:col-span-8">
            {ptLanding.contact.heading}
          </h2>
          <div className="col-span-full space-y-16 lg:col-span-6 lg:col-start-6 xl:col-span-14 xl:col-start-12">
            <p className="text-c2 text-ink-secondary">{ptLanding.contact.body}</p>
            {/*
              EmailLink rather than a bare <a mailto:>. Cloudflare's email obfuscation
              rewrites plain mailto links at the edge, which both 404s for crawlers and
              removes the address from the page for anything that does not run JavaScript —
              and an address a Brazilian buyer cannot see is the whole point of this page
              lost. See the note on the component.
            */}
            <p className="text-c1 text-ink">
              <EmailLink
                address={ptLanding.contact.email}
                subject="Ferragens para porta corta-fogo — consulta"
              />
            </p>
            {ptLanding.contact.technicalEmail !== ptLanding.contact.email ? (
              <p className="text-c2 text-ink-secondary">
              Perguntas técnicas, desenhos e dimensões:{" "}
              <EmailLink address={ptLanding.contact.technicalEmail} />
            </p>
            ) : null}
            <div className="pt-8">
              <ArrowLink href="/pt/contact/">Formulário de contato</ArrowLink>
            </div>
          </div>
        </section>

        <section className="col-content grid grid-cols gap-x gap-y-24">
          <h2 className="col-span-full text-h3 text-ink lg:col-span-4 xl:col-span-8">
            Continuar no catálogo
          </h2>
          <div className="col-span-full lg:col-span-6 lg:col-start-6 xl:col-span-14 xl:col-start-12">
            {/*
              The catalogue is in English and this page says so rather than pretending
              otherwise. A buyer who reads a Portuguese page and lands on an English product
              table has been told what to expect; one who is not told assumes the site is
              broken.
            */}
            <p className="text-c2 text-ink-secondary">
              As páginas de produto, as fichas técnicas e os artigos abaixo estão em inglês.
            </p>
            <ul className="mt-24 space-y-16">
              {ptLanding.links.map((link) => (
                <li key={link.href}>
                  <ArrowLink href={link.href}>{link.label}</ArrowLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
