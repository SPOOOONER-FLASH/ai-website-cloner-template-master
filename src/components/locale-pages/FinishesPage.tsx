import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { OrderCodeFooter, OrderCodeTables, WorkedOrderCode } from "@/components/site/OrderCodeTables";
import type { Locale } from "@/data/locales";
import { modelsWithReadableFinish, publishedModelCount } from "@/lib/finish-usage";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

export function finishesMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/finishes",
    "Order Codes + Finishes",
    "How to read a Canton Hyland model number: the finish codes (SSS, PB, SN, GM), the lock-function codes (ET, BK, PS) and the single/double door letter, with the models each appears on.",
  );
}

export function FinishesPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: tx(locale, "Home"), href: p("/") }, { label: tx(locale, "Order codes") }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{tx(locale, "Reference")}</p>
            <h1 className="mt-16 text-h1 text-ink">
              {tx(locale, "Finish codes. A model number is three facts, not one name.")}
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              {tx(
                locale,
                "The letters after the number are the finish and the lock function, in that order. Once you can read them, a four-hundred-line price list becomes a short list of products and two suffix tables — and you can specify a variant we have never sent you a photograph of.",
              )}
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {tx(locale, "{readable} of {total} published models carry a finish in the number itself. The rest state it in the specification instead.")
                .replace("{readable}", String(modelsWithReadableFinish))
                .replace("{total}", String(publishedModelCount))}
            </p>
          </div>
          <div className="col-span-full xl:col-span-14">
            <WorkedOrderCode locale={locale} />
          </div>
        </section>
        <OrderCodeTables locale={locale} />
        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            {tx(locale, "A finish code is not a BHMA number.")}
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              {tx(
                locale,
                "North American specifications are written in ANSI/BHMA numbers, and those encode the base metal as well as the appearance — 626 is satin chrome on brass, 652 is the same color on steel, and substituting one for the other is a rejected submittal. So our finish code alone cannot be converted. Each product page carries the BHMA number where the material is stated and a dash where it is not.",
              )}
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href={p("/news/reading-door-hardware-model-numbers")}>{tx(locale, "How to read a model number")}</ArrowLink>
              <ArrowLink href={p("/contact")}>{tx(locale, "Ask about a code")}</ArrowLink>
            </div>
            <div className="mt-32">
              <OrderCodeFooter locale={locale} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
