"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuCategory } from "@/data/categories";
import { siteSettings } from "@/data/navigation";
import { socialLinks } from "@/data/site";
import { CloseIcon, Wordmark } from "./icons";

/**
 * Site menu.
 *
 * ORDER IS THE DESIGN. It used to open with nine navigation links at 24px — Home,
 * Products, Product Finder, Projects, News, Company, Services, Events, Certificates —
 * and put the buying routes in a second grid column, which on a phone means below all
 * nine. The two things this site exists to produce, an email and a click through to
 * Alibaba, were the last things in the menu.
 *
 * Now: buy, then the catalogue, then the background pages. The catalogue is the fifteen
 * real categories rather than one "Products" link, because a visitor who opens a menu on
 * a hardware site is looking for a product type, not a hub page — the same reason
 * Chanel's mobile menu lists Fragrance and Watches instead of "Shop".
 *
 * Sizes follow from that: section labels are 12px, items are 16px. The old 24px links
 * made every item shout equally, which is indistinguishable from none of them shouting.
 */

/* Same three routes and the same words as the desktop "Buy it now" shelf. A menu that
   renames its own destinations between breakpoints teaches the visitor nothing. */
const buyingLinks = {
  en: [
    { label: "Contact", href: "/contact/" },
    { label: "Price list", href: "/request/price-list/" },
    { label: "Downloads", href: "/downloads/" },
  ],
  es: [
    { label: "Contacto", href: "/es/contact/" },
    { label: "Lista de precios", href: "/request/price-list/" },
    { label: "Descargas", href: "/downloads/" },
  ],
} as const;

const catalogueLinks = {
  en: [
    { label: "All products", href: "/products/" },
    { label: "Product Finder", href: "/product-finder/" },
  ],
  es: [
    { label: "Todos los productos", href: "/products/" },
    { label: "Buscador de productos", href: "/product-finder/" },
  ],
} as const;

const companyLinks = {
  en: [
    { label: "Company", href: "/company/" },
    { label: "Applications", href: "/projects/" },
    { label: "Services", href: "/services/" },
    { label: "Certificates", href: "/certifications/" },
    { label: "Events", href: "/events/" },
    { label: "News", href: "/news/" },
  ],
  es: [
    { label: "Empresa", href: "/es/company/" },
    { label: "Aplicaciones", href: "/es/projects/" },
    { label: "Servicios", href: "/services/" },
    { label: "Certificados", href: "/certifications/" },
    { label: "Ferias", href: "/events/" },
    { label: "Noticias", href: "/news/" },
  ],
} as const;

/*
  The two cards in the desktop drawer.

  Product Finder first because it is the only tool on the site that answers "which model
  do I need" rather than "what do you make", and Projects second because it is the
  evidence. Both images are already in the editorial set and carry responsive variants.
*/
const drawerCards = {
  en: [
    {
      href: "/product-finder/",
      image: "/images/editorial/hyde-editorial-exhibition-wall-01.webp",
      alt: "Dense oak sample wall presenting coordinated architectural hardware families",
      title: "Product Finder",
      body: "Filter 435 models by category, material, finish and door type.",
    },
    {
      href: "/projects/",
      image: "/images/editorial/hyde-editorial-exhibition-wall-09.webp",
      alt: "Installed door samples framed by populated architectural hardware displays",
      title: "Projects",
      body: "How the hardware is specified on real buildings.",
    },
  ],
  es: [
    {
      href: "/product-finder/",
      image: "/images/editorial/hyde-editorial-exhibition-wall-01.webp",
      alt: "Expositor denso en roble con familias coordinadas de herrajes arquitectónicos",
      title: "Buscador de productos",
      body: "Filtre 435 modelos por categoría, material, acabado y tipo de puerta.",
    },
    {
      href: "/es/projects/",
      image: "/images/editorial/hyde-editorial-exhibition-wall-09.webp",
      alt: "Puertas de muestra instaladas entre expositores completos de herrajes arquitectónicos",
      title: "Proyectos",
      body: "Cómo se especifican los herrajes en edificios reales.",
    },
  ],
} as const;

/*
  Four facts, all published elsewhere on the site.

  Manufacturing location and year: the company record. ISO 9001: the certificates page.
  Lead time: client-confirmed 2026-09-01, the same figure the category pages and the FAQ
  carry. OEM: the services page. Nothing here is an MOQ, a price or a certification scope,
  because those are either unpublished or model-specific — see the honesty rule in
  JsonLd.tsx, which this follows.
*/
const factoryFacts = {
  en: [
    { label: "Manufacturing", value: "Zhongshan, Guangdong — since 1998" },
    { label: "Quality system", value: "ISO 9001 certified" },
    { label: "Lead time", value: "From 30 days after order confirmation" },
    { label: "Custom work", value: "OEM and private label, own tooling" },
  ],
  es: [
    { label: "Fabricación", value: "Zhongshan, Guangdong — desde 1998" },
    { label: "Sistema de calidad", value: "Certificación ISO 9001" },
    { label: "Plazo de producción", value: "Desde 30 días tras confirmar el pedido" },
    { label: "Personalización", value: "OEM y marca propia, molde propio" },
  ],
} as const;

const COPY = {
  en: {
    buy: "Buy it now",
    catalogue: "Products",
    company: "Company",
    factory: "The factory",
    follow: "Follow us",
    close: "Close menu",
    dismiss: "Dismiss site menu",
    menu: "Site menu",
    strap: "Manufacturing door hardware since 1998.",
  },
  es: {
    buy: "Comprar ahora",
    catalogue: "Productos",
    company: "Empresa",
    factory: "La fábrica",
    follow: "Síganos",
    close: "Cerrar menú",
    dismiss: "Cerrar el menú",
    menu: "Menú del sitio",
    strap: "Fabricando herrajes para puertas desde 1998.",
  },
} as const;

interface SiteMenuDrawerProps {
  isSpanish: boolean;
  currentPath: string;
  categories: MenuCategory[];
  onClose: () => void;
}

function isCurrent(currentPath: string, href: string): boolean {
  const target = href.replace(/\/$/, "") || "/";
  return currentPath === target || (target !== "/" && currentPath.startsWith(`${target}/`));
}

export function SiteMenuDrawer({
  isSpanish,
  currentPath,
  categories,
  onClose,
}: SiteMenuDrawerProps) {
  const locale = isSpanish ? "es" : "en";
  const t = COPY[locale];
  /* One open branch at a time. Fifteen categories with several expanded at once is the
     scrolling wall this menu was rebuilt to get rid of. */
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const productHref = (slug: string) => (isSpanish ? `/es/products/${slug}/` : `/products/${slug}/`);

  const renderLink = (
    { label, href, count }: { label: string; href: string; count?: number },
    secondary = false,
  ) => {
    const current = isCurrent(currentPath, href);
    return (
      <li key={href}>
        <Link
          href={href}
          onClick={onClose}
          aria-current={current ? "page" : undefined}
          className={[
            "drawer-link",
            secondary ? "drawer-link-secondary" : "",
            current ? "current-nav" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{label}</span>
          <span className="drawer-link-trail">
            {/* The count is the useful half of the row: it is the difference between
                "Deadbolts" and "Deadbolts, of which we have seven". */}
            {typeof count === "number" ? (
              <span className="drawer-count">{count}</span>
            ) : null}
            <span aria-hidden="true" className="drawer-chevron">
              ›
            </span>
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.menu}>
      <button
        type="button"
        aria-label={t.dismiss}
        onClick={onClose}
        className="absolute inset-0 bg-ink/20"
      />
      <div className="hard-shadow-drawer absolute inset-y-0 right-0 w-[calc(100%-1.2rem)] overflow-y-auto bg-surface sm:w-[60vw] xl:w-[46vw]">
        <div className="layout min-h-full py-24 sm:py-32">
          <div className="col-content flex min-h-full flex-col">
            <div className="flex items-center justify-between border-b border-line pb-20">
              <Link href={isSpanish ? "/es/" : "/"} onClick={onClose}>
                <Wordmark />
              </Link>
              <button
                type="button"
                aria-label={t.close}
                onClick={onClose}
                className="p-8 text-ink-tertiary hover:text-ink"
              >
                <CloseIcon className="h-24 w-24" />
              </button>
            </div>

            {/*
              First block, above the fold on every phone. The storefront gets the hard
              plane treatment it has elsewhere on the site; the three routes under it are
              the ones that end in an email instead.
            */}
            <section className="pt-24">
              <p className="drawer-eyebrow">{t.buy}</p>
              <a
                href={siteSettings.alibaba.storefront}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="alibaba-hard-cta alibaba-hard-cta-compact mt-16"
              >
                <span>{siteSettings.alibaba.label}</span>
                <span aria-hidden="true">›</span>
              </a>
              <ul className="mt-24 divide-y divide-line border-y border-line">
                {buyingLinks[locale].map((link) => renderLink(link))}
              </ul>
              {siteSettings.contact.email ? (
                <a
                  href={`mailto:${siteSettings.contact.email}`}
                  className="short-marker short-marker-compact mt-20 inline-block text-c1 text-brand hover:text-brand-hover"
                >
                  {siteSettings.contact.email}
                </a>
              ) : null}
            </section>

            {/*
              The catalogue, on phones and tablets only.

              Below 1376px the header collapses to a wordmark and a hamburger, so this is
              the only way to reach a category — it has to be here. At 1376px and above
              the header opens a products shelf that already lists all fifteen families
              and their sub-types, and repeating them in the drawer made it a long scroll
              saying nothing the page behind it was not already showing. FSB's desktop
              menu is short for the same reason: the nav carries the catalogue, the menu
              carries everything else.
            */}
            <section className="pt-40 xl:hidden">
              <p className="drawer-eyebrow">{t.catalogue}</p>
              <ul className="mt-16 divide-y divide-line border-y border-line">
                {catalogueLinks[locale].map((link) => renderLink(link))}
              </ul>
              {/*
                Two levels, the way Chanel's mobile menu drills from Skincare into
                Serums. Four of the fifteen categories have sub-categories; those get a
                disclosure rather than a link, so the visitor can reach "Fire Door
                Devices" without first landing on 42 panic devices and hunting the filter
                rail. The other eleven are flat and link straight through — an expander
                that opens onto nothing is worse than no expander.
              */}
              <ul className="mt-8">
                {categories.map((category) => {
                  const href = productHref(category.slug);
                  const label = isSpanish ? category.labelEs : category.label;
                  if (!category.children.length) {
                    return renderLink({ label, href, count: category.count });
                  }

                  const expanded = openCategory === category.slug;
                  return (
                    <li key={category.slug}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`drawer-sub-${category.slug}`}
                        onClick={() => setOpenCategory(expanded ? null : category.slug)}
                        className="drawer-link w-full bg-transparent text-left"
                      >
                        <span>{label}</span>
                        <span className="drawer-link-trail">
                          <span className="drawer-count">{category.count}</span>
                          <span
                            aria-hidden="true"
                            className={`drawer-chevron drawer-chevron-toggle${
                              expanded ? " drawer-chevron-open" : ""
                            }`}
                          >
                            ›
                          </span>
                        </span>
                      </button>
                      {expanded ? (
                        <ul id={`drawer-sub-${category.slug}`} className="drawer-sublist">
                          {/* The whole range first: a filter is a narrowing, so the
                              unnarrowed list has to stay one tap away. */}
                          {renderLink(
                            {
                              label: isSpanish ? `Todo: ${label}` : `All ${label}`,
                              href,
                              count: category.count,
                            },
                            true,
                          )}
                          {category.children.map((child) =>
                            renderLink(
                              {
                                label: isSpanish ? child.labelEs : child.label,
                                /*
                                  The static collection page, not the filter query.

                                  ?type= renders the same list but canonicalises to the
                                  category, so a menu full of them passed no link equity
                                  to anything and left 19 real pages unreachable except
                                  from the sitemap — which is how pages end up in
                                  "discovered, not indexed". Spanish keeps the filter
                                  because /collections/ is English-only for now.
                                */
                                href: isSpanish
                                  ? `${href}?type=${child.slug}`
                                  : `/collections/${category.slug}-${child.slug}/`,
                                count: child.count,
                              },
                              true,
                            ),
                          )}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/*
              Two picture cards, desktop only.

              Taking the fifteen categories out above left the drawer nearly empty at
              1376px and wider, and an empty panel reads as unfinished rather than as
              restraint. FSB fills the same space with two images that each lead
              somewhere — not decoration, but the two destinations a visitor who opened
              the menu instead of using the nav is most likely to want.

              Hidden below xl because on a phone this space belongs to the catalogue,
              and two 4:3 images there would push Company and the mailbox off the screen.
            */}
            <section className="hidden pt-40 xl:block">
              <ul className="grid grid-cols-2 gap-x-24">
                {drawerCards[locale].map((card) => (
                  <li key={card.href}>
                    <Link href={card.href} onClick={onClose} className="drawer-card">
                      {/* Plain img for the same reason as MediaPlaceholder: static export
                          with images.unoptimized, so next/image adds markup without
                          optimising anything. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.image}
                        alt={card.alt}
                        loading="lazy"
                        decoding="async"
                        className="drawer-card-image"
                      />
                      <p className="drawer-card-title">{card.title}</p>
                      <p className="drawer-card-body">{card.body}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-40">
              <p className="drawer-eyebrow">{t.company}</p>
              <ul className="mt-16 sm:grid sm:grid-cols-2 sm:gap-x-32">
                {companyLinks[locale].map((link) => renderLink(link, true))}
              </ul>
            </section>

            {/*
              Factory facts, desktop only. Option B, chosen by the client 2026-09-01.

              On 2026-09-01 a customer building a quotation could not find an address
              anywhere on the site. The drawer is the one panel reachable from all 941
              pages, so putting "who we are, where, how fast, can you customise" here
              gives those four questions a site-wide answer position rather than one page
              they have to find.

              These four are also, exactly, what an answer engine gets asked about a
              manufacturer and what it can quote — every value is published elsewhere on
              the site and none of it is a claim we cannot evidence.
            */}
            <section className="hidden pt-40 xl:block">
              <p className="drawer-eyebrow">{t.factory}</p>
              <dl className="mt-16 border-t border-line">
                {factoryFacts[locale].map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-2 gap-16 border-b border-line py-12 text-c2"
                  >
                    <dt className="text-ink-secondary">{fact.label}</dt>
                    <dd className="text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <address className="mt-16 not-italic text-c2 text-ink-secondary">
                {siteSettings.contact.factoryAddress ?? siteSettings.contact.address},{" "}
                {siteSettings.contact.city}, {siteSettings.contact.province}
              </address>
            </section>

            <section className="mt-auto border-t border-line pt-24">
              <p className="drawer-eyebrow">{t.follow}</p>
              <ul className="mt-16 flex flex-wrap gap-x-32 gap-y-12">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-24 text-c2 text-ink-secondary">
                Canton Hyland Hardware (Group) Co., Ltd. — {t.strap}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
