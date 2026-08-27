"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { headerNav, localisedHref, navLabel } from "@/data/navigation";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      aria-current={current ? "page" : undefined}
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
                  className="nav-marker flex h-24 items-center gap-8 text-ink no-underline transition-colors duration-200 hover:text-brand-hover"
                >
                  <GlobeIcon className="h-20 w-20 shrink-0 text-ink-tertiary" />
                  <span className="text-c2 leading-none">EN | ES</span>
                </Link>
                <button
                  type="button"
                  aria-label={isSpanish ? "Buscar" : "Search"}
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen(true)}
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
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
    </div>
  );
}
