import Link from "next/link";
import { ArrowLink } from "./ArrowLink";

/**
 * Imprint and Privacy Notice have no route in the plan yet — they are legal pages,
 * not part of P2's six. They point at /company until someone writes them.
 */
const LEGAL_LINKS = [
  { label: "Imprint", href: "/company" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Notice", href: "/company" },
];

/** External profiles. Real URLs land in P11 with the rest of the real content. */
const SOCIAL_LINKS = ["Instagram", "LinkedIn", "Facebook", "YouTube"];

/**
 * Footer — 313px, `py-48`, full-bleed top rule.
 *
 * COLOUR:
 *   Top rule    --color-line (rule 2: dividers are never red; was a 1px black rule).
 *   Links       --color-brand (rule 1). The `.underscore` bar uses currentColor, so it
 *               tracks the link colour automatically.
 *   Headings    --color-ink.
 *   "Data preferences" stays a text button styled as a link, matching the reference —
 *   it is not a .btn. See Button.tsx for the button system.
 *
 * Hierarchy here comes from whitespace and the single --color-line rule (rule 4).
 * No shadow, no card, no radius.
 */
export function SiteFooter() {
  return (
    <div className="mt-48 flex-grow-0 sm:mt-96">
      {/* Full-bleed rule: the border spans the viewport, the inner .layout bands the content. */}
      <div className="border-t border-line py-48">
        <div className="layout">
          <div className="grid grid-cols grid-rows gap-x gap-y-48 md:gap-y-96">
            <nav className="col-span-full grid grid-cols-subgrid md:col-span-7 md:block lg:col-span-8 xl:col-span-12">
              <ul className="col-span-full grid grid-cols-subgrid items-start gap-x gap-y-20 md:flex md:flex-wrap md:gap-x-64">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label} className="col-span-2 md:col-span-3">
                    <Link
                      href={link.href}
                      className="underscore inline-block text-c1 text-brand hover:text-brand-hover"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="col-span-2 md:col-span-3">
                  <button
                    type="button"
                    className="underscore inline-block appearance-none text-c1 text-brand hover:text-brand-hover"
                  >
                    Data preferences
                  </button>
                </li>
              </ul>
            </nav>

            <div className="col-span-2 flex flex-col items-start gap-y-24 sm:col-span-4 md:col-span-7 md:row-start-2 lg:col-span-8 lg:grid lg:grid-cols-2 lg:gap-x xl:col-span-12">
              <h3 className="text-h3 text-ink md:hidden">Newsletter</h3>
              <p className="text-c1 text-ink">
                The Canton Hyland newsletter covers new product families, standards updates and
                export documentation changes.
              </p>
              <div>
                <ArrowLink href="/contact">Sign-up here</ArrowLink>
              </div>
            </div>

            <div className="col-span-2 space-y-24 sm:col-span-4 md:row-span-2 md:[grid-column-end:-1] lg:[grid-column:span_3/-1] xl:[grid-column:span_4/-1]">
              <h3 className="text-h3 text-ink">Social Media</h3>
              <ul className="space-y-24">
                {SOCIAL_LINKS.map((label) => (
                  <li key={label}>
                    <ArrowLink>{label}</ArrowLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
