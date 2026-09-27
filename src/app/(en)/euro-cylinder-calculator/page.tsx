import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CylinderCalculator } from "@/components/site/CylinderCalculator";
import { pageMetadata } from "@/lib/seo";

/**
 * Euro cylinder length calculator, 2026-09-27.
 *
 * Client instruction: turn the site's own product knowledge into tool pages (the
 * QuickCreator articles on tool pages and Product-Led SEO). A buyer searching "euro
 * cylinder size for 45mm door" is solving an ordering problem before looking for a
 * supplier; this page answers it with the arithmetic our cylinder guide already
 * publishes, then points at the three lines an inquiry needs. See src/lib/cylinder-length.ts.
 */

export const metadata: Metadata = pageMetadata({
  enPath: "/euro-cylinder-calculator",
  locale: "en",
  title: "Euro Cylinder Length Calculator",
  description:
    "Enter the door thickness and the escutcheon depth on each side to get the two half-lengths, the overall euro cylinder length to order, and how far it will stand proud.",
});

export default function EuroCylinderCalculatorPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Euro cylinder calculator" }]} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-9">
            <p className="text-kicker uppercase tracking-[0.14em] text-ink-secondary">Tool</p>
            <h1 className="mt-16 text-h1 text-ink">
              Euro cylinder length calculator. Two halves, rounded up, outside first.
            </h1>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
            <p className="text-c1 text-ink">
              Each half is measured from the center of the fixing screw to the outer face of the
              escutcheon or rose on its side. Half-lengths come in 5mm steps from a minimum of
              27.5mm, so the calculated figure is always rounded up: a half that is a little long
              can be covered with a rose, a half that is short cannot be fixed at the door.
            </p>
            <p className="mt-24 text-c2 text-ink-secondary">
              Measure the door with a caliper at the lock edge. A tape hooked over a rebated edge
              reads the rebate, and the error always runs toward a cylinder that is too short.
            </p>
          </div>
        </section>

        <CylinderCalculator locale="en" />

        <section className="col-content grid grid-cols gap-x gap-y-32 border-t border-line pt-32">
          <h2 className="col-span-full text-h2 text-ink lg:col-span-5 xl:col-span-9">
            Three lines for the inquiry
          </h2>
          <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-9 xl:col-start-16">
            <p className="text-c1 text-ink-secondary">
              Send the door thickness, the escutcheon or rose you are fitting on each side, and
              whether the inside needs a key or a thumbturn. With those three a length and a split
              come back as a recommendation rather than a question. For keyed-alike or
              master-keyed cylinders, say so in the same message: they are made to order.
            </p>
            <div className="mt-24 flex flex-wrap gap-x-32 gap-y-12">
              <ArrowLink href="/guides/door-thickness-to-cylinder-length-2026/">
                The arithmetic, with a worked table
              </ArrowLink>
              <ArrowLink href="/guides/euro-cylinder-size-chart-2026/">Euro cylinder size chart</ArrowLink>
              <ArrowLink href="/products/lock-cylinders/">Our lock cylinders</ArrowLink>
              <ArrowLink href="/contact/">Send the three measurements</ArrowLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
