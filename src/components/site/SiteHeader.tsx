"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { headerNav, localisedHref, navLabel, siteSettings } from "@/data/navigation";
import { GlobeIcon, MenuIcon, SearchIcon, Wordmark } from "./icons";
import { SearchDialog } from "./SearchDialog";
import { SiteMenuDrawer } from "./SiteMenuDrawer";

/**
 * 导航现在来自 content/navigation.json，由后台「导航菜单」栏目维护。
 *
 * 这里原本是写死的两份数组（英文一份、西班牙文一份）。搬进内容层之后，
 * 同事在后台改一次即可，不必找人改代码 —— 后台那个栏目才算是真的能用，
 * 而不是摆着好看。
 *
 * 西班牙语路径由 localisedHref 统一处理：只有 /company /contact /projects
 * 有西语版，其余（新闻、下载、产品）指回英文页，而不是指向一个会 404 的 /es 地址。
 */

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

type ShelfName = "company" | "buy";

const companyShelfLinks = {
  en: [
    { label: "Company overview", detail: "Manufacturing since 1998", href: "/company" },
    { label: "Projects", detail: "Representative applications", href: "/projects" },
    { label: "Services", detail: "Selection and specification support", href: "/services" },
    { label: "Events", detail: "Meet HYDE in global markets", href: "/events" },
    { label: "Certificates", detail: "Verified model-scoped reports", href: "/certifications" },
  ],
  es: [
    { label: "La empresa", detail: "Fabricación desde 1998", href: "/company" },
    { label: "Proyectos", detail: "Aplicaciones representativas", href: "/projects" },
    { label: "Servicios", detail: "Selección y apoyo técnico", href: "/services" },
    { label: "Ferias", detail: "Encuentre HYDE en mercados globales", href: "/events" },
    { label: "Certificados", detail: "Informes verificados por modelo", href: "/certifications" },
  ],
} as const;

const buyShelfLinks = {
  en: [
    { label: "Contact", detail: "Talk to an export specialist", href: "/contact" },
    { label: "Downloads", detail: "Catalogue and verified documents", href: "/downloads" },
    { label: "Price list", detail: "Request export pricing", href: "/request/price-list" },
  ],
  es: [
    { label: "Contacto", detail: "Hable con un especialista de exportación", href: "/contact" },
    { label: "Descargas", detail: "Catálogo y documentos verificados", href: "/downloads" },
    { label: "Lista de precios", detail: "Solicite precios de exportación", href: "/request/price-list" },
  ],
} as const;

/**
 * Sticky header — 136px (48px promo bar + 88px nav row).
 *
 * The only scroll behaviour on the page: `position: sticky; top: -48px` lets the promo bar
 * scroll away while the nav row pins. Pure CSS — no scroll listener, and deliberately
 * NO shadow / background / height change between states (rule 3).
 *
 * COLOUR:
 *   Nav items use architectural ink. The CURRENT item is semibold; the short
 *   A-style black underline is revealed only on hover or keyboard focus.
 *   Utility icons remain tertiary grey and darken to ink on interaction.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openShelf, setOpenShelf] = useState<ShelfName | null>(null);
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const locale = isSpanish ? "es" : "en";
  const homeHref = isSpanish ? "/es" : "/";
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const companyCurrent = companyShelfLinks[locale].some((link) =>
    isCurrent(localisedHref(link.href, locale)),
  );
  const buyCurrent = buyShelfLinks[locale].some((link) =>
    isCurrent(localisedHref(link.href, locale)),
  );

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

  useEffect(() => {
    if (!openShelf) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenShelf(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenShelf(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openShelf]);

  return (
    // The black promo strip was removed on request. With nothing above it, the nav row
    // pins at the very top instead of scrolling a banner away first.
    <div
      ref={headerRef}
      className="relative sticky top-0 z-10 flex-grow-0 bg-surface"
      onMouseLeave={() => setOpenShelf(null)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenShelf(null);
      }}
    >
      <div>
        {/* Nav row */}
        <div className="layout z-30 bg-surface">
          <div className="relative col-content grid w-full grid-cols items-center gap-x gap-y-24 pb-8 pt-32">
            <div className="col-span-full max-xl:hidden sm:col-span-4 md:col-span-6 xl:col-span-12">
              {/*
                `whitespace-nowrap` is load-bearing. Unwrapped, the five labels need
                523px and the gaps at xl were 4 × 48px, for 715px inside a 680px column,
                so flex shrank the two longest ("Product Finder", "Service + Downloads")
                onto a second line. Since flex stretches every item to the tallest, the
                single-line labels then sat top-aligned in a 48px box while the wrapped
                ones filled it, and the row read as misaligned.

                Six labels now measure 486px unwrapped. At the xl edge the column is
                649px, so 5 × 24px gaps leave ~44px of slack; the 32px gaps this used to
                have left only 4px there, which is inside the noise of font rendering.
                nowrap also makes a future label edit fail visibly — as it did when News
                was added — rather than silently re-wrapping one item back into the same
                misalignment.
              */}
              <nav className="flex gap-24 whitespace-nowrap">
                {headerNav.map((link) => {
                  const href = localisedHref(link.href, locale);
                  const current = isCurrent(href);

                  if (link.href === "/company") {
                    return (
                      <button
                        key={link.href}
                        type="button"
                        aria-controls="company-shelf"
                        aria-expanded={openShelf === "company"}
                        aria-haspopup="true"
                        aria-current={companyCurrent ? "page" : undefined}
                        onClick={() => setOpenShelf("company")}
                        onFocus={() => setOpenShelf("company")}
                        onMouseEnter={() => setOpenShelf("company")}
                        className={cn(
                          "nav-marker bg-transparent text-c1 text-ink",
                          companyCurrent && "current-nav",
                        )}
                      >
                        {navLabel(link, locale)}
                      </button>
                    );
                  }

                  if (link.href === "/downloads") {
                    return (
                      <button
                        key={link.href}
                        type="button"
                        aria-controls="buy-shelf"
                        aria-expanded={openShelf === "buy"}
                        aria-haspopup="true"
                        aria-current={buyCurrent ? "page" : undefined}
                        onClick={() => setOpenShelf("buy")}
                        onFocus={() => setOpenShelf("buy")}
                        onMouseEnter={() => setOpenShelf("buy")}
                        className={cn(
                          "nav-marker bg-transparent text-c1 text-ink",
                          buyCurrent && "current-nav",
                        )}
                      >
                        {isSpanish ? "Comprar ahora" : "Buy it now"}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.href}
                      href={href}
                      aria-current={current ? "page" : undefined}
                      onFocus={() => setOpenShelf(null)}
                      onMouseEnter={() => setOpenShelf(null)}
                      className={cn(
                        "nav-marker text-c1 text-ink no-underline",
                        current && "current-nav",
                      )}
                    >
                      {navLabel(link, locale)}
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
                Alignment: every control sits in the same 24px-tall flex box and every icon
                is drawn at 20x20, so the language link, search and menu share one optical
                baseline. They previously used 16 / 20 / 16x22 icons, which is why the row
                read as crooked on small screens.
              */}
              <nav className="flex flex-grow items-center justify-end gap-24 sm:gap-32">
                <Link
                  href={languageTarget(pathname, isSpanish)}
                  hrefLang={isSpanish ? "en" : "es"}
                  className="nav-marker flex h-24 items-center gap-8 text-ink no-underline transition-colors duration-200 hover:text-brand-hover"
                >
                  <GlobeIcon className="h-20 w-20 shrink-0 text-ink-tertiary" />
                  <span className="text-c2 leading-none">EN | ES</span>
                </Link>
                <button
                  type="button"
                  aria-label={isSpanish ? "Buscar" : "Search"}
                  aria-expanded={searchOpen}
                  onClick={() => {
                    setOpenShelf(null);
                    setSearchOpen(true);
                  }}
                  className="flex h-24 w-20 items-center justify-center text-ink-tertiary transition-colors duration-200 hover:text-ink"
                >
                  <SearchIcon className="h-20 w-20" />
                </button>
                <button
                  type="button"
                  aria-label={isSpanish ? "Abrir menú" : "Open menu"}
                  aria-expanded={menuOpen}
                  onClick={() => {
                    setOpenShelf(null);
                    setMenuOpen(true);
                  }}
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

      <section
        id="company-shelf"
        aria-label={isSpanish ? "Empresa" : "Company"}
        aria-hidden={openShelf !== "company"}
        className={cn("header-shelf", openShelf === "company" && "header-shelf-open")}
      >
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {isSpanish ? "Empresa" : "Company"}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {isSpanish
                    ? "La fábrica, sus mercados y el apoyo técnico detrás de HYDE."
                    : "The factory, markets and technical support behind HYDE."}
                </p>
              </div>
              <nav className="grid gap-x-24 gap-y-24 sm:grid-cols-2 xl:grid-cols-5">
                {companyShelfLinks[locale].map((link) => {
                  const href = localisedHref(link.href, locale);
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      onClick={() => setOpenShelf(null)}
                      aria-current={isCurrent(href) ? "page" : undefined}
                      className="header-shelf-link border-t border-line pt-16 text-ink no-underline"
                    >
                      <span className="short-marker text-c1">{link.label}</span>
                      <span className="mt-8 block text-c2 text-ink-secondary">{link.detail}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section
        id="buy-shelf"
        aria-label={isSpanish ? "Comprar ahora" : "Buy it now"}
        aria-hidden={openShelf !== "buy"}
        className={cn("header-shelf", openShelf === "buy" && "header-shelf-open")}
      >
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-24 xl:grid-cols-4">
              {buyShelfLinks[locale].map((link) => {
                const href = localisedHref(link.href, locale);
                return (
                  <Link
                    key={link.href}
                    href={href}
                    onClick={() => setOpenShelf(null)}
                    aria-current={isCurrent(href) ? "page" : undefined}
                    className="header-shelf-link flex min-h-96 flex-col justify-between border-t border-line py-16 text-ink no-underline"
                  >
                    <span className="flex items-center justify-between gap-16 text-h3">
                      <span className="short-marker">{link.label}</span>
                      <span aria-hidden="true">›</span>
                    </span>
                    <span className="mt-16 text-c2 text-ink-secondary">{link.detail}</span>
                  </Link>
                );
              })}
              <a
                href={siteSettings.alibaba.storefront}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpenShelf(null)}
                className="alibaba-hard-cta"
              >
                <span>{siteSettings.alibaba.label}</span>
                <span aria-hidden="true">›</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {menuOpen ? (
        <SiteMenuDrawer
          isSpanish={isSpanish}
          currentPath={pathname}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
    </div>
  );
}
