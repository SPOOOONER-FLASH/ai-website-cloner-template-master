"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { MenuCategory } from "@/data/categories";
import { siteSettings } from "@/data/navigation";
import { socialLinks } from "@/data/site";
import { CloseIcon, Wordmark } from "./icons";
import { EmailLink } from "./EmailLink";
import { getMenuExperience, MENU_VARIANT } from "./menu-experience";
import { ArrowUpRight } from "lucide-react";
import { EditorialAtlas } from "./EditorialAtlas";
import styles from "./EditorialCatalogue.module.css";

const buyingLinks = {
  en: [
    { label: "Contact", href: "/contact/" },
    { label: "Price list", href: "/request/price-list/" },
  ],
  es: [
    { label: "Contacto", href: "/es/contact/" },
    { label: "Lista de precios", href: "/request/price-list/" },
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
    return <li key={href}><Link href={href} onClick={onClose} aria-current={current ? "page" : undefined}
      className={styles.menuLink}>{label}{typeof count === "number" ? ` · ${count}` : ""}</Link></li>;
  };

  const contact = <div className={styles.contact}>
    <p className={styles.promise}>{experience.exportPromise}</p>
    {siteSettings.contact.email ? <EmailLink address={siteSettings.contact.email}
      className="short-marker inline-block break-all text-c1 text-ink" /> : null}
  </div>;

  return <div className="fixed inset-0 z-50">
    <div id="site-menu-dialog" ref={panelRef} role="dialog" aria-modal="true"
      aria-labelledby="site-menu-title" onKeyDown={handleKeyDown} className={styles.menu}>
      <div className={styles.menuInner}>
        <div className={styles.menuHeader}>
          <Link href={isSpanish ? "/es/" : "/"} onClick={onClose} aria-label="HYDE home"><Wordmark /></Link>
          <button ref={closeButtonRef} type="button" aria-label={isSpanish ? "Cerrar menú" : "Close menu"}
            onClick={onClose} className="p-12 text-ink-tertiary hover:text-ink"><CloseIcon className="h-24 w-24" /></button>
        </div>
        {experience.kind === "rfq-concierge" ? (
          <section className={styles.concierge}>
            <div>
              <h2 id="site-menu-title" className={styles.menuTitle}>{experience.title}</h2>
              <nav aria-label={isSpanish ? "Ayuda para especificar" : "Specification routes"} className={styles.primary}>
                {experience.primary.map((link) => <Link key={link.href} href={link.href} onClick={onClose} className="group">
                  <span className="flex-1">
                    <span className={styles.primaryLabel}>{link.label}</span>
                    <span className={styles.detail}>{link.detail}</span>
                  </span>
                  <ArrowUpRight size={20} strokeWidth={1.25} aria-hidden="true" />
                </Link>)}
              </nav>
            </div>
            <div className={styles.rail}>
              <div className={styles.groups}>
                {experience.groups.map((group) => <nav key={group.title} aria-label={group.title}>
                  <p className={styles.groupTitle}>{group.title}</p>
                  <ul>{group.links.map((link) => renderLink(link))}</ul>
                </nav>)}
              </div>
              {contact}
            </div>
          </section>
        ) : (
          <section className={styles.backup}>
            <h2 id="site-menu-title" className="sr-only">{experience.title}</h2>
            <div className={styles.backupCards}>
              {experience.cards.map((card, index) => <div key={card.href}>
                {index === 0 ? <EditorialAtlas locale={locale} /> :
                  <Link href={card.href} onClick={onClose}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt={card.alt} loading="lazy" decoding="async" />
                  </Link>}
                <Link href={card.href} onClick={onClose}><span className={styles.caption}>{card.label}</span></Link>
                <p className={styles.detail}>{card.detail}</p>
              </div>)}
            </div>
            <div className={styles.rail}>
              <div className={styles.groups}>
                {experience.groups.map((group) => <nav key={group.title} aria-label={group.title}>
                  <p className={styles.groupTitle}>{group.title}</p>
                  <ul>{group.links.map((link) => renderLink(link))}</ul>
                </nav>)}
              </div>
              {contact}
            </div>
          </section>
        )}
          <section className={styles.mobileFamilies}>
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


        <footer className={styles.menuFooter}>
          <a href={siteSettings.alibaba.storefront} target="_blank" rel="noopener noreferrer" onClick={onClose}
            className="short-marker font-semibold text-ink">{siteSettings.alibaba.label}</a>
          {buyingLinks[locale].map((link) => <Link key={link.href} href={link.href} onClick={onClose}>{link.label}</Link>)}
          <ul className={styles.social}>
            {socialLinks.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}
          </ul>
        </footer>
      </div>
    </div>
  </div>;
}
