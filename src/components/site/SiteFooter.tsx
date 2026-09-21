"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mirrorHref } from "@/lib/spanish-mirror";
import { englishPathOf, locales, localeFromPath, type Locale } from "@/data/locales";
import { socialLinks } from "@/data/site";
import { footerNav, localisedHref, navLabel, siteSettings } from "@/data/navigation";
import { ArrowLink } from "./ArrowLink";
import { EmailLink } from "./EmailLink";

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
  pt: [
    { label: "Informações legais", href: "/pt/company" },
    { label: "Contato", href: "/pt/contact" },
    { label: "Privacidade", href: "/pt/company" },
  ],
} as const;

/** The endonym each language link carries — a reader scans for their own word for it. */
const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

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
  const locale = localeFromPath(pathname);
  /* Copy in the page's own language, in source order en / es / pt. */
  const say = (en: string, es: string, pt: string) =>
    locale === "es" ? es : locale === "pt" ? pt : en;

  /*
    A FOOTER LINK TO THE PAGE YOU ARE ALREADY ON IS A DEAD CLICK.

    Clarity recorded visitors on /contact/ clicking a "Contact" element three times in
    three seconds — 00:40, 00:41, 00:42 — with nothing happening, across several
    sessions. The cause is here: the footer carries "Contact" twice, and on /contact/
    both point at the current page. Somebody scrolls to the bottom looking for the
    address, sees the word they want, clicks, and the page does not move. So they click
    again. That is what a person does when they think something is broken, and from
    where they are sitting it is.

    Rendered as plain text instead of a link, with aria-current so assistive technology
    is told the same thing the styling says. Nothing to press, nothing to fail.
  */
  /*
    The counterpart of THIS page in every OTHER language, or that language's home when
    this page has no mirror. Never a 404 out of the footer — `mirrorHref` is the same
    function the header panel uses and it reads the same mirror lists as the hreflang tags.
  */
  const englishPath = englishPathOf(pathname);
  const languageLinks = locales
    .filter((code) => code !== locale)
    .map((code) => ({
      code,
      label: LANGUAGE_LABELS[code],
      href: mirrorHref(englishPath, code).href,
    }));

  const isCurrent = (href: string) => {
    const strip = (value: string) => (value.replace(/\/*$/, "") || "/");
    return strip(href) === strip(pathname);
  };

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
                    {isCurrent(link.href) ? (
                      <span aria-current="page" className="text-c1 text-ink-secondary">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="short-marker short-marker-compact text-c1 text-brand no-underline hover:text-brand-hover"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
                {/*
                  THE ONLY RENDERED LINKS BETWEEN THE LANGUAGE TREES.

                  It is here because on 2026-09-09 a full crawl found all 600 Spanish
                  pages unreachable from the English homepage — no path of rendered links
                  reached them at all. The cause was the location-and-language panel that
                  replaced the bare "EN | ES" switch on 2026-09-08: the panel mounts only
                  while it is open, so its <a href="/es/..."> exists in no exported HTML.
                  The header before it carried a plain anchor, and that anchor was the
                  whole Spanish site's inbound path.

                  hreflang tags did not cover the loss. They are <link rel="alternate">
                  in <head>, a hint about equivalence — not an edge in the link graph, and
                  not something a crawler follows to discover a tree it has never seen.

                  So the footer carries one server-rendered anchor PER OTHER LOCALE,
                  pointing at this page's counterpart where `mirrorsOf` says one exists
                  and at that language's home where it does not. Same source of truth as
                  the panel and the hreflang tags, so the three can never disagree.

                  It was a single hard-coded EN↔ES anchor until 2026-09-17, which
                  reproduced the 2026-09-09 defect exactly one tree over: 645 Portuguese
                  pages shipped on 2026-09-16 with no rendered link into them from
                  anywhere on the site, and the anchor on a /pt/ page offered Español.
                  Derived from `locales` now, so a fourth language cannot repeat it.
                */}
                {languageLinks.map((language) => (
                  <li key={language.code} className="col-span-2 md:col-span-3">
                    <Link
                      href={language.href}
                      hrefLang={language.code}
                      lang={language.code}
                      className="short-marker short-marker-compact text-c1 text-brand no-underline hover:text-brand-hover"
                    >
                      {language.label}
                    </Link>
                  </li>
                ))}
                <li className="col-span-2 md:col-span-3">
                  <button
                    type="button"
                    className="short-marker short-marker-compact appearance-none text-c1 text-brand hover:text-brand-hover"
                  >
                    {say("Data preferences", "Preferencias de datos", "Preferências de dados")}
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
                {say("Newsletter", "Boletín", "Newsletter")}
              </h3>
              <p className="text-c1 text-ink">
                {say(
                  "The Canton Hyland newsletter covers new product families, standards updates and export documentation changes.",
                  "El boletín de Canton Hyland presenta nuevas familias de producto, normas y documentación de exportación.",
                  "A newsletter da Canton Hyland traz novas famílias de produto, atualizações de normas e mudanças na documentação de exportação.",
                )}
              </p>
              <div>
                <ArrowLink href={locale === "en" ? "/newsletter" : `/${locale}/contact`}>
                  {say("Sign-up here", "Solicitar información", "Solicitar informações")}
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
                {say("How to buy", "Cómo comprar", "Como comprar")}
              </h3>
              <ul className="space-y-16">
                {footerNav.map((link) => {
                  const href = localisedHref(link.href, locale);
                  return (
                    <li key={link.href}>
                      {isCurrent(href) ? (
                        <span aria-current="page" className="text-c1 text-ink-secondary">
                          {navLabel(link, locale)}
                        </span>
                      ) : (
                        <ArrowLink href={href}>{navLabel(link, locale)}</ArrowLink>
                      )}
                    </li>
                  );
                })}
                {siteSettings.alibaba.storefront ? (
                  <li>
                    <a
                      href={siteSettings.alibaba.storefront}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                    >
                      {say("Buy on Alibaba", "Comprar en Alibaba", "Comprar no Alibaba")}
                    </a>
                  </li>
                ) : null}
                {/*
                  Sits directly under the Alibaba link on purpose. Every enquiry route on
                  this site was previously a form or a hand-off to the storefront, which
                  loses the buyer who wants to write from their own mailbox — and gives an
                  answer engine nothing to quote. Renders only once an address is set in
                  content/site-settings.json.

                  TECHNICAL, NOT SALES. Client instruction, 2026-09-21: he reads tec@
                  himself, so it is the address that should be reachable from every page.
                  It sits under a "How to buy" heading, which reads as a mismatch until you
                  look at what actually arrives: the 2026-09-20 Clarity reading has all 33
                  of our AI citations landing on articles answering a technical question,
                  and none on a price page. The reader who scrolls this far is holding a
                  drawing. The client was told the heading looked wrong and chose this.
                */}
                {siteSettings.contact.technicalEmail ? (
                  <li>
                    <EmailLink
                      address={siteSettings.contact.technicalEmail}
                      className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                    />
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="col-span-2 space-y-24 sm:col-span-4 md:row-start-2 md:[grid-column:span_3/-1] xl:[grid-column:span_7/-1]">
              <h3 className="text-h3 text-ink">
                {say("Social Media", "Redes sociales", "Redes sociais")}
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
