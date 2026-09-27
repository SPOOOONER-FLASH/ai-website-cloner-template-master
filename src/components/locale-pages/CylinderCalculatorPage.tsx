import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CylinderCalculator } from "@/components/site/CylinderCalculator";
import type { Locale } from "@/data/locales";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

/**
 * The overlay-locale twin of /euro-cylinder-calculator (2026-09-27). Page copy goes through
 * `tx`, so it renders English until the multilingual session translates it; the calculator's
 * own labels live in CylinderCalculator.tsx, which carries EN/ES/PT and falls back to English.
 */

export function cylinderCalculatorMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/euro-cylinder-calculator",
    "Euro Cylinder Calculator: Measure, Round Up, Order",
    "Enter the door thickness and the escutcheon depth on each side to get the two half-lengths, the overall euro cylinder length to order, and how far it will stand proud.",
  );
}

export function CylinderCalculatorPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[{ label: tx(locale, "Home"), href: p("/") }, { label: tx(locale, "Euro cylinder calculator") }]}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">{tx(locale, "Tool")}</p>
            <h1 className="mt-16 text-h1 text-ink">
              {tx(locale, "Euro cylinder length calculator. Two halves, rounded up, outside first.")}
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              {tx(
                locale,
                "Each half is measured from the center of the fixing screw to the outer face of the escutcheon or rose on its side. Half-lengths come in 5mm steps from a minimum of 27.5mm, so the calculated figure is always rounded up: a half that is a little long can be covered with a rose, a half that is short cannot be fixed at the door.",
              )}
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              {tx(
                locale,
                "Measure the door with a caliper at the lock edge. A tape hooked over a rebated edge reads the rebate, and the error always runs toward a cylinder that is too short.",
              )}
            </p>
          </div>
        </section>
        <CylinderCalculator locale={locale} />
        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            {tx(locale, "Three lines for the inquiry")}
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              {tx(
                locale,
                "Send the door thickness, the escutcheon or rose you are fitting on each side, and whether the inside needs a key or a thumbturn. With those three a length and a split come back as a recommendation rather than a question. For keyed-alike or master-keyed cylinders, say so in the same message: they are made to order.",
              )}
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href={p("/guides/door-thickness-to-cylinder-length-2026/")}>
                {tx(locale, "The arithmetic, with a worked table")}
              </ArrowLink>
              <ArrowLink href={p("/guides/euro-cylinder-size-chart-2026/")}>{tx(locale, "Euro cylinder size chart")}</ArrowLink>
              <ArrowLink href={p("/products/lock-cylinders/")}>{tx(locale, "Our lock cylinders")}</ArrowLink>
              <ArrowLink href={p("/contact/")}>{tx(locale, "Send the three measurements")}</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
