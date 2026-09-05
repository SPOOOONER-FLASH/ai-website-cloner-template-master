"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { MenuCategory } from "@/data/categories";
import { siteSettings } from "@/data/navigation";
import { socialLinks } from "@/data/site";
import { CloseIcon, Wordmark } from "./icons";
import { EmailLink } from "./EmailLink";
import { getMenuExperience, MENU_VARIANT } from "./menu-experience";

const buyingLinks = {
  en: [
    { label: "Contact", href: "/contact/" },
    { label: "Price list", href: "/request/price-list/" },
    { label: "Downloads", href: "/downloads/" },
  ],
  es: [
    { label: "Contacto", href: "/es/contact/" },
    { label: "Lista de precios", href: "/request/price-list/" },
    { label: "Descargas", href: "/es/downloads/" },
  ],
} as const;

interface SiteMenuDrawerProps {
  isSpanish: boolean;
  currentPath: string;
  categories: MenuCategory[];
  onClose: () => void;
}

export function SiteMenuDrawer({ isSpanish, currentPath, categories, onClose }: SiteMenuDrawerProps) {
  const locale = isSpanish ? "es" : "en";
  const experience = getMenuExperience(locale, MENU_VARIANT);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { closeButtonRef.current?.focus(); }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
    if (event.key === "Tab") {
      const elements = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, [tabindex="0"]',
      ) ?? []).filter((element) => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  const renderLink = ({ label, href, count }: { label: string; href: string; count?: number }) => {
    const target = href.replace(/\/$/, "");
    const current = currentPath === target || currentPath.startsWith(`${target}/`);
    return (
      <li key={href}>
        <Link href={href} onClick={onClose} aria-current={current ? "page" : undefined}
          className={["drawer-link", current ? "current-nav" : ""].join(" ")}>
          <span>{label}</span>
          <span className="drawer-link-trail">
            {typeof count === "number" ? <span className="drawer-count">{count}</span> : null}
            <span aria-hidden="true" className="drawer-chevron">›</span>
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" tabIndex={-1} aria-label={isSpanish ? "Cerrar el menú" : "Dismiss site menu"}
        onClick={onClose} className="absolute inset-0 bg-ink/20" />
      <div id="site-menu-dialog" ref={panelRef} role="dialog" aria-modal="true"
        aria-labelledby="site-menu-title" onKeyDown={handleKeyDown}
        className="hard-shadow-drawer absolute inset-y-0 right-0 w-[calc(100%-1.2rem)] overflow-y-auto bg-surface sm:w-[90vw] xl:w-[82vw]">
        <div className="px-24 py-24 sm:px-48 lg:px-64 lg:py-40">
          <div className="flex items-center justify-between">
            <Link href={isSpanish ? "/es/" : "/"} onClick={onClose} aria-label="HYDE home"><Wordmark /></Link>
            <button ref={closeButtonRef} type="button" aria-label={isSpanish ? "Cerrar menú" : "Close menu"}
              onClick={onClose} className="p-12 text-ink-tertiary hover:text-ink">
              <CloseIcon className="h-24 w-24" />
            </button>
          </div>

          <section className="mt-48 lg:mt-64">
            <h2 id="site-menu-title" className="max-w-[22ch] text-h1 text-ink">{experience.title}</h2>
            {experience.kind === "rfq-concierge" ? (
              <div className="mt-40 grid gap-48 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-64">
                <nav aria-label={isSpanish ? "Ayuda para especificar" : "Specification routes"}>
                  {experience.primary.map((link) => (
                    <Link key={link.href} href={link.href} onClick={onClose}
                      className="group flex items-start gap-20 border-t border-line py-24 no-underline">
                      <span className="flex-1">
                        <span className="short-marker text-h3 text-ink">{link.label}</span>
                        <span className="mt-8 block text-c2 text-ink-secondary">{link.detail}</span>
                      </span>
                      <span aria-hidden="true" className="text-h3 text-ink">↗</span>
                    </Link>
                  ))}
                </nav>
                <div className="grid grid-cols-2 gap-32">
                  {experience.groups.map((group) => (
                    <nav key={group.title} aria-label={group.title}>
                      <p className="drawer-eyebrow mb-16">{group.title}</p>
                      <ul>{group.links.map((link) => renderLink(link))}</ul>
                    </nav>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-40 grid gap-48 xl:grid-cols-2">
                <div className="hidden grid-cols-2 gap-20 xl:grid">
                  {experience.cards.map((card) => (
                    <Link key={card.href} href={card.href} onClick={onClose} className="drawer-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.image} alt={card.alt} loading="lazy" decoding="async" className="drawer-card-image" />
                      <p className="drawer-card-title">{card.label}</p>
                      <p className="drawer-card-body">{card.detail}</p>
                    </Link>
                  ))}
                </div>
                <div className="grid gap-32 sm:grid-cols-3">
                  {experience.groups.map((group) => (
                    <nav key={group.title} aria-label={group.title}>
                      <p className="drawer-eyebrow mb-16">{group.title}</p>
                      <ul>{group.links.map((link) => renderLink(link))}</ul>
                    </nav>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-40 grid gap-16 border-t border-line pt-24 sm:grid-cols-2">
              <div>
                <p className="drawer-eyebrow">{experience.exportDesk}</p>
                {siteSettings.contact.email ? <EmailLink address={siteSettings.contact.email}
                  className="short-marker mt-12 inline-block break-all text-h3 text-ink" /> : null}
              </div>
              <p className="max-w-[38ch] text-c2 text-ink-secondary sm:justify-self-end">{experience.exportPromise}</p>
            </div>
          </section>

          <section className="mt-40 xl:hidden">
            <details>
              <summary className="cursor-pointer border-y border-line py-20 text-c1 text-ink">
                {isSpanish ? "Todas las familias de productos" : "All product families"}
              </summary>
              <ul className="mt-12">
                {categories.map((category) => {
                  const href = `${isSpanish ? "/es" : ""}/products/${category.slug}/`;
                  const label = isSpanish ? category.labelEs : category.label;
                  if (!category.children.length) return renderLink({ label, href, count: category.count });
                  const expanded = openCategory === category.slug;
                  return (
                    <li key={category.slug}>
                      <button type="button" aria-expanded={expanded} aria-controls={`drawer-sub-${category.slug}`}
                        onClick={() => setOpenCategory(expanded ? null : category.slug)}
                        className="drawer-link w-full bg-transparent text-left">
                        <span>{label}</span><span className="drawer-count">{category.count} {expanded ? "−" : "+"}</span>
                      </button>
                      {expanded ? (
                        <ul id={`drawer-sub-${category.slug}`} className="drawer-sublist">
                          {renderLink({ label: isSpanish ? `Todo: ${label}` : `All ${label}`, href, count: category.count })}
                          {category.children.map((child) => renderLink({
                            label: isSpanish ? child.labelEs : child.label,
                            href: `${isSpanish ? "/es" : ""}/collections/${category.slug}-${child.slug}/`,
                            count: child.count,
                          }))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </details>
          </section>

          <section className="mt-40 grid gap-24 border-t border-line pt-24 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="drawer-eyebrow">{isSpanish ? "Comprar ahora" : "Buy it now"}</p>
              <a href={siteSettings.alibaba.storefront} target="_blank" rel="noopener noreferrer" onClick={onClose}
                className="alibaba-hard-cta alibaba-hard-cta-compact mt-16">
                <span>{siteSettings.alibaba.label}</span><span aria-hidden="true">›</span>
              </a>
            </div>
            <ul>{buyingLinks[locale].map((link) => renderLink(link))}</ul>
            <div>
              <p className="drawer-eyebrow">{isSpanish ? "Síganos" : "Follow us"}</p>
              <ul className="mt-16 flex flex-wrap gap-x-24 gap-y-12">
                {socialLinks.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer"
                  className="short-marker text-c2 text-ink-secondary">{link.label}</a></li>)}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
