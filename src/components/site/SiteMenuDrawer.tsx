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
    { label: "Projects", href: "/projects/" },
    { label: "Services", href: "/services/" },
    { label: "Certificates", href: "/certifications/" },
    { label: "Events", href: "/events/" },
    { label: "News", href: "/news/" },
  ],
  es: [
    { label: "Empresa", href: "/es/company/" },
    { label: "Proyectos", href: "/es/projects/" },
    { label: "Servicios", href: "/services/" },
    { label: "Certificados", href: "/certifications/" },
    { label: "Ferias", href: "/events/" },
    { label: "Noticias", href: "/news/" },
  ],
} as const;

const COPY = {
  en: {
    buy: "Buy it now",
    catalogue: "Products",
    company: "Company",
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
                className="alibaba-hard-cta mt-16"
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
              The catalogue itself. Fifteen categories is a long list on a phone, and it
              is still the shortest route to the page the visitor came for — two columns
              from 744px so it stops being a scroll on anything wider than a phone.
            */}
            <section className="pt-40">
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
                                href: `${href}?type=${child.slug}`,
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

            <section className="pt-40">
              <p className="drawer-eyebrow">{t.company}</p>
              <ul className="mt-16 sm:grid sm:grid-cols-2 sm:gap-x-32">
                {companyLinks[locale].map((link) => renderLink(link, true))}
              </ul>
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
