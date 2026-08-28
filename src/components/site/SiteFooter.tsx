"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { socialLinks } from "@/data/site";
import { footerNav, localisedHref, navLabel, siteSettings } from "@/data/navigation";
import { ArrowLink } from "./ArrowLink";

/**
 * Imprint and Privacy Notice have no route in the plan yet — they are legal pages,
 * not part of P2's six. They point at /company until someone writes them.
 */
const LEGAL_LINKS = {
  en: [
    { label: "Imprint", href: "/company" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Notice", href: "/company" },
  ],
  es: [
    { label: "Aviso legal", href: "/es/company" },
    { label: "Contacto", href: "/es/contact" },
    { label: "Privacidad", href: "/es/company" },
  ],
} as const;

/**
 * Footer — 313px, `py-48`, full-bleed top rule.
 *
 * COLOUR:
 *   Top rule    --color-line.
 *   Links       resolve to ink. The shared short marker uses currentColor, so it tracks
 *               normal and inverted labels without another accent colour.
 *   Headings    --color-ink.
 *   "Data preferences" stays a text button styled as a link, matching the reference —
 *   it is not a .btn. See Button.tsx for the button system.
 *
 * Hierarchy here comes from whitespace and the single --color-line rule (rule 4).
 * No shadow, no card, no radius.
 */
export function SiteFooter() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const locale = isSpanish ? "es" : "en";

  return (
    <div className="mt-48 flex-grow-0 sm:mt-96">
      {/* Full-bleed rule: the border spans the viewport, the inner .layout bands the content. */}
      <div className="border-t border-line py-48">
        <div className="layout">
          <div className="grid grid-cols grid-rows gap-x gap-y-48 md:gap-y-96">
            <nav className="col-span-full grid grid-cols-subgrid md:col-span-7 md:block lg:col-span-8 xl:col-span-12">
              <ul className="col-span-full grid grid-cols-subgrid items-start gap-x gap-y-20 md:flex md:flex-wrap md:gap-x-64">
                {LEGAL_LINKS[locale].map((link) => (
                  <li key={link.label} className="col-span-2 md:col-span-3">
                    <Link
                      href={link.href}
                      className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="col-span-2 md:col-span-3">
                  <button
                    type="button"
                    className="short-marker short-marker-compact appearance-none text-c1 text-brand hover:text-brand-hover"
                  >
                    {isSpanish ? "Preferencias de datos" : "Data preferences"}
                  </button>
                </li>
              </ul>
            </nav>

            {/*
              The three blocks below share one grid row, so their column spans have to
              add up to the column count at every breakpoint — 12 from md, 24 from xl.
              They previously summed to 14 / 16 / 28, which left no room for Social Media
              and auto-placement pushed it onto a row of its own, 411px below the other
              two headings. Keep these three in sync when changing any one of them.
            */}
            <div className="col-span-2 flex flex-col items-start gap-y-24 sm:col-span-4 md:col-span-5 md:row-start-2 lg:grid lg:grid-cols-2 lg:gap-x xl:col-span-10">
              <h3 className="text-h3 text-ink md:hidden">
                {isSpanish ? "Boletín" : "Newsletter"}
              </h3>
              <p className="text-c1 text-ink">
                {isSpanish
                  ? "El boletín de Canton Hyland presenta nuevas familias de producto, normas y documentación de exportación."
                  : "The Canton Hyland newsletter covers new product families, standards updates and export documentation changes."}
              </p>
              <div>
                <ArrowLink href={isSpanish ? "/es/contact" : "/newsletter"}>
                  {isSpanish ? "Solicitar información" : "Sign-up here"}
                </ArrowLink>
              </div>
            </div>

            {/*
              The two routes a buyer actually uses. Email is the one this site is built
              to produce; Alibaba is where anyone who already sources that way expects to
              find us, and until now the site did not link there at all.
            */}
            <div className="col-span-2 space-y-24 sm:col-span-4 md:col-span-4 md:row-start-2 xl:col-span-7">
              <h3 className="text-h3 text-ink">
                {isSpanish ? "Cómo comprar" : "How to buy"}
              </h3>
              <ul className="space-y-16">
                {footerNav.map((link) => (
                  <li key={link.href}>
                    <ArrowLink href={localisedHref(link.href, locale)}>
                      {navLabel(link, locale)}
                    </ArrowLink>
                  </li>
                ))}
                {siteSettings.alibaba.storefront ? (
                  <li>
                    <a
                      href={siteSettings.alibaba.storefront}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                    >
                      {siteSettings.alibaba.label}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="col-span-2 space-y-24 sm:col-span-4 md:row-start-2 md:[grid-column:span_3/-1] xl:[grid-column:span_7/-1]">
              <h3 className="text-h3 text-ink">
                {isSpanish ? "Redes sociales" : "Social Media"}
              </h3>
              <ul className="space-y-24">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-marker short-marker-arrow relative pl-12 text-c1 text-brand hover:text-brand-hover"
                    >
                      <span aria-hidden="true" className="absolute left-0 top-0">›</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/*
            The copyright line is now content, not a literal — and fixing that surfaced a
            real inconsistency: this line said "Canton Hyland Hardware & Locks Co.,Ltd."
            while src/data/site.ts said "Canton Hyland Hardware (Group) Co., Ltd." Two
            company names on one site. The (Group) form matches the client's own English
            profile, so that is the one kept, and there is now a single place to edit it.
          */}
          <p className="mt-48 border-t border-line pt-16 text-c2 text-ink-secondary">
            {siteSettings.copyright}
          </p>
        </div>
      </div>
    </div>
  );
}
