import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HardwareTerms } from "@/components/site/HardwareTerms";
import { HARDWARE_TERMS } from "@/data/hardware-terms";
import { modelsWithGlossaryTerm } from "@/lib/hardware-term-usage";
import { pageMetadata } from "@/lib/seo";

/**
 * Door-hardware glossary — the third of the three references the client asked for on
 * 2026-09-13 after MIWA.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS THE TERMS ON OUR OWN SPEC TABLES AND NOTHING ELSE
 *
 * A glossary of general trade words would be the same list every other hardware site
 * carries, and it would be cited by nobody, because it adds nothing to what is already
 * indexed a hundred times.
 *
 * So the entries came from counting instead: every specification label printed on a
 * published product page, ranked by how many records carry it. `Backset` on 145,
 * `Handing` on 134, `Chassis` on 135, `Centre distance` on 31. Those are the words a
 * reader will actually meet on this site, and the number beside each one is what makes
 * the page ours rather than generic.
 *
 * ---------------------------------------------------------------------------
 * A SECOND GLOSSARY ALREADY EXISTS, AND IT IS A DIFFERENT ONE
 *
 * `HardwareGlossary.tsx` on /configurator defines the CATEGORIES — what a rim lock is,
 * what a floor spring is — because the configurator offers them as choices and its
 * definitions were invisible to crawlers under `ssr: false`.
 *
 * This page defines the DIMENSIONS AND MECHANISM — backset, centres, spindle, throw. The
 * two do not overlap, and they answer different readers: one has not chosen a product
 * type yet, the other is filling in a schedule and needs to know what the column means.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/glossary",
  locale: "en",
  title: "Door Hardware Glossary",
  description:
    "Backset, center distance, handing, chassis, spindle, deadbolt throw and cross bore — the terms on Canton Hyland specification tables, defined with what ordering each one wrong costs.",
});

export default function GlossaryPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Glossary" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">
              Reference
            </p>
            <h1 className="mt-16 text-h1 text-ink">
              Door hardware glossary. The words on our specification tables, and what each one costs to get wrong.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              These {HARDWARE_TERMS.length} terms were not chosen from a trade dictionary.
              They are the specification labels that appear most often on our own published
              product pages, counted — so every one of them is a field you will meet on this
              site, and the figure beside each entry is how many models state it.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {modelsWithGlossaryTerm} published models state at least one of them. Each entry
              gives the definition first and the consequence second, because the consequence
              is the half that tells you whether this is the field you are about to get wrong.
            </p>
          </div>
        </section>

        <HardwareTerms locale="en" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            A term we have not defined?
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Send it. If it is a word on one of our own pages that is not here, that is a gap
              in this page rather than a question about the word, and we would rather fix the
              page. The two references beside this one answer the questions that come next:
              how our order codes are built, and what happened to a model number that no
              longer resolves.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/finishes/">Order codes and finishes</ArrowLink>
              <ArrowLink href="/model-lookup/">Model number lookup</ArrowLink>
              <ArrowLink href="/contact/">Ask us</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
