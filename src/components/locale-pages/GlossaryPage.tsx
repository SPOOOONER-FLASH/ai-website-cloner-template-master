import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HardwareTerms } from "@/components/site/HardwareTerms";
import { HARDWARE_TERMS } from "@/data/hardware-terms";
import type { Locale } from "@/data/locales";
import { modelsWithGlossaryTerm } from "@/lib/hardware-term-usage";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

export function glossaryMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/glossary",
    "Door Hardware Glossary",
    "Backset, center distance, handing, chassis, spindle, deadbolt throw and cross bore — the terms on Canton Hyland specification tables, defined with what ordering each one wrong costs.",
  );
}

export function GlossaryPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: tx(locale, "Home"), href: p("/") }, { label: tx(locale, "Glossary") }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{tx(locale, "Reference")}</p>
            <h1 className="mt-16 text-h1 text-ink">
              {tx(locale, "Door hardware glossary. The words on our specification tables, and what each one costs to get wrong.")}
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              {tx(
                locale,
                "These {count} terms were not chosen from a trade dictionary. They are the specification labels that appear most often on our own published product pages, counted — so every one of them is a field you will meet on this site, and the figure beside each entry is how many models state it.",
              ).replace("{count}", String(HARDWARE_TERMS.length))}
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {tx(
                locale,
                "{count} published models state at least one of them. Each entry gives the definition first and the consequence second, because the consequence is the half that tells you whether this is the field you are about to get wrong.",
              ).replace("{count}", String(modelsWithGlossaryTerm))}
            </p>
          </div>
        </section>
        <HardwareTerms locale={locale} />
        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            {tx(locale, "A term we have not defined?")}
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              {tx(
                locale,
                "Send it. If it is a word on one of our own pages that is not here, that is a gap in this page rather than a question about the word, and we would rather fix the page. The two references beside this one answer the questions that come next: how our order codes are built, and what happened to a model number that no longer resolves.",
              )}
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href={p("/finishes")}>{tx(locale, "Order codes and finishes")}</ArrowLink>
              <ArrowLink href={p("/model-lookup")}>{tx(locale, "Model number lookup")}</ArrowLink>
              <ArrowLink href={p("/contact")}>{tx(locale, "Ask us")}</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
