"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GlobeIcon, MenuIcon, SearchIcon, Wordmark } from "./icons";
import { SiteMenuDrawer } from "./SiteMenuDrawer";

const NAV_LINKS = {
  en: [
    { label: "Products", href: "/products" },
    { label: "Product Finder", href: "/product-finder" },
    { label: "Projects", href: "/projects" },
    { label: "Company", href: "/company" },
    { label: "Service + Downloads", href: "/downloads" },
  ],
  es: [
    { label: "Productos", href: "/products" },
    { label: "Buscador", href: "/product-finder" },
    { label: "Proyectos", href: "/es/projects" },
    { label: "Empresa", href: "/es/company" },
    { label: "Servicio + Descargas", href: "/downloads" },
  ],
} as const;

function languageTarget(pathname: string, isSpanish: boolean): string {
  if (isSpanish) {
    const englishPath = pathname.replace(/^\/es/, "");
    return englishPath || "/";
  }
  if (pathname === "/company" || pathname.startsWith("/company/")) return "/es/company";
  if (pathname === "/contact" || pathname.startsWith("/contact/")) return "/es/contact";
  if (pathname === "/projects" || pathname.startsWith("/projects/")) {
    return pathname.replace(/^\/projects/, "/es/projects");
  }
  return "/es";
}

/**
 * Sticky header — 136px (48px promo bar + 88px nav row).
 *
 * The only scroll behaviour on the page: `position: sticky; top: -48px` lets the promo bar
 * scroll away while the nav row pins. Pure CSS — no scroll listener, and deliberately
 * NO shadow / background / height change between states (rule 3).
 *
 * COLOUR:
 *   Promo bar   background --color-ink (#121212), text --color-surface (#FFFFFF),
 *               the link label --color-brand. A red fill here would out-shout the
 *               main visual, so the bar stays near-black and only the link is red.
 *   Nav items   --color-ink. Only the CURRENT item goes --color-brand (rule 1) —
 *               on `/` nothing is current, so they all render ink.
 *   Icons       --color-ink-tertiary. Icons are never red (rule 2).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const locale = isSpanish ? "es" : "en";
  const homeHref = isSpanish ? "/es" : "/";
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    // The black promo strip was removed on request. With nothing above it, the nav row
    // pins at the very top instead of scrolling a banner away first.
    <div className="sticky top-0 z-10 flex-grow-0 bg-surface">
      <div>
        {/* Nav row */}
        <div className="layout z-30 bg-surface">
          <div className="relative col-content grid w-full grid-cols items-center gap-x gap-y-24 pb-8 pt-32">
            <div className="col-span-full max-xl:hidden sm:col-span-4 md:col-span-6 xl:col-span-12">
              <nav className="flex gap-40 xl:gap-48">
                {NAV_LINKS[locale].map((link) => {
                  const current = isCurrent(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "text-c1 underline-offset-4 hover:underline",
                        // Rule 1: brand red marks the current section only.
                        current ? "text-brand" : "text-ink hover:text-brand-hover",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="col-span-full grid grid-cols-2 content-start justify-between gap-x gap-y-24 xl:col-span-12">
              <Link href={homeHref} className="flex min-w-0 flex-shrink-0 items-center text-ink">
                <Wordmark className="pr-8" />
              </Link>

              {/*
                The language / search / menu panels are overlays on the reference site and
                render `display: none` at rest. This prototype ships the controls as inert
                visual elements — see site-header.spec.md "Known gap".
              */}
              {/*
                Alignment: every control sits in the same 24px-tall flex box and every icon
                is drawn at 20x20, so the language link, search and menu share one optical
                baseline. They previously used 16 / 20 / 16x22 icons, which is why the row
                read as crooked on small screens.
              */}
              <nav className="flex flex-grow items-center justify-end gap-24 sm:gap-32">
                <Link
                  href={languageTarget(pathname, isSpanish)}
                  hrefLang={isSpanish ? "en" : "es"}
                  className="flex h-24 items-center gap-8 text-ink underline-offset-4 transition-colors duration-200 hover:text-brand-hover hover:underline"
                >
                  <GlobeIcon className="h-20 w-20 shrink-0 text-ink-tertiary" />
                  <span className="text-c2 leading-none">EN | ES</span>
                </Link>
                <button
                  type="button"
                  aria-label={isSpanish ? "Buscar" : "Search"}
                  className="flex h-24 w-20 items-center justify-center text-ink-tertiary transition-colors duration-200 hover:text-ink"
                >
                  <SearchIcon className="h-20 w-20" />
                </button>
                <button
                  type="button"
                  aria-label={isSpanish ? "Abrir menú" : "Open menu"}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(true)}
                  className="flex h-24 w-20 items-center justify-center text-ink-tertiary transition-colors duration-200 hover:text-ink"
                >
                  <MenuIcon className="h-20 w-20" />
                </button>
              </nav>
            </div>

            {/* Breadcrumb rail — empty on the home route, hidden below 393px */}
            <div className="col-span-full max-[24.5625em]:hidden">
              <nav className="flex items-center gap-4 text-c2 text-ink-secondary" />
            </div>
          </div>
        </div>
      </div>
      {menuOpen ? (
        <SiteMenuDrawer
          isSpanish={isSpanish}
          currentPath={pathname}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </div>
  );
}
