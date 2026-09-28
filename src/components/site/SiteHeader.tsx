"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOverlayPresence } from "@/hooks/useOverlayPresence";
import { LocalePicker } from "./LocalePicker";
import type { MenuCategory } from "@/data/categories";
import { localeFromPath } from "@/data/locales";
import { headerNav, localisedHref, navLabel, siteSettings } from "@/data/navigation";
import { MenuIcon, SearchIcon, Wordmark } from "./icons";
/*
  Both overlays load on demand. The header sits in the root layout, so anything it
  imports statically is hydrated on every page of the site — including plain articles
  that never open a menu or a search box. The dialog alone drags in the whole
  search-matching library. `ssr: false` is safe here because a closed overlay renders
  nothing, so there is no server HTML to lose; the chunk arrives on first open instead.
*/
const SearchDialog = dynamic(() =>
  import("./SearchDialog").then((module) => module.SearchDialog),
  { ssr: false },
);
const SiteMenuDrawer = dynamic(() =>
  import("./SiteMenuDrawer").then((module) => module.SiteMenuDrawer),
  { ssr: false },
);
import navigationStyles from "./HeaderNavigation.module.css";
import { dict, tx } from "@/lib/i18n-client";

/**
 * 导航现在来自 content/navigation.json，由后台「导航菜单」栏目维护。
 *
 * 这里原本是写死的两份数组（英文一份、西班牙文一份）。搬进内容层之后，
 * 同事在后台改一次即可，不必找人改代码 —— 后台那个栏目才算是真的能用，
 * 而不是摆着好看。
 *
 * 西班牙语路径由 localisedHref 统一处理，指向真实存在的西语页；没有西语版的
 * 指回英文页，而不是指向一个会 404 的 /es 地址。
 *
 * ⚠ 这里原本写着「只有 /company /contact /projects 有西语版」。那句话在西语镜像
 * 扩到产品、对比、集合、配置器、检索与新闻之后就不成立了，但没人回来改它，
 * 于是它变成了一条会误导下一个人的注释 —— 唯一的真相来源是
 * src/lib/spanish-mirror.ts 的 SPANISH_MIRROR_PREFIXES。
 */

/*
  The language switch moved to src/lib/locale-picker.ts on 2026-09-08, as `languageChoices`,
  when the bare EN | ES link became the location-and-language panel.

  Its rule is unchanged and its explanation travelled with it: the switch goes to the SAME
  page in the other language when one exists, and to the Spanish home only when it does
  not, decided by `hasSpanishMirror` so the switch and the hreflang tags can never
  disagree. The new module adds one thing this file could not — it tells the reader which
  of those two is about to happen, before they lose their place.
*/

type ShelfName = "products" | "company" | "buy" | "resources";

const companyShelfLinks = {
  en: [
    { label: "Company overview", detail: "Manufacturing since 1998", href: "/company" },
    { label: "Services", detail: "OEM tooling, private label, export", href: "/services" },
    { label: "Events", detail: "Meet HYDE in global markets", href: "/events" },
    { label: "Certificates", detail: "Verified model-scoped reports", href: "/certifications" },
  ],
  es: [
    { label: "La empresa", detail: "Fabricación desde 1998", href: "/company" },
    { label: "Servicios", detail: "Moldes OEM, marca propia, exportación", href: "/services" },
    { label: "Ferias", detail: "Encuentre HYDE en mercados globales", href: "/events" },
    { label: "Certificados", detail: "Informes verificados por modelo", href: "/certifications" },
  ],
  pt: [
    { label: "A empresa", detail: "Fabricação desde 1998", href: "/company" },
    { label: "Serviços", detail: "Moldes OEM, marca própria, exportação", href: "/services" },
    { label: "Feiras", detail: "Encontre a HYDE nos mercados globais", href: "/events" },
    { label: "Certificados", detail: "Relatórios verificados por modelo", href: "/certifications" },
  ],
} as const;

/*
  Resources: Applications, Guides and News under one desktop item (client, 2026-09-27:
  「把这三个合并到一个栏目下面，鼠标挪到那自动向下弹出」). Seven top-level items became
  five, which also shortens every locale's row (fr needed 859px of a 680px column).
  Only the desktop row merges. The phone and compact rails keep the three as separate
  links: there is no hover there, and a scroll rail costs nothing per item.
  The first href present in headerNav is where the merged item sits.
*/
const RESOURCE_HREFS = ["/projects", "/guides", "/news"];
const resourceDetails = {
  en: {
    "/projects": "What each building type takes",
    "/guides": "Size charts, standards and selection references",
    "/news": "Short answers to what buyers ask",
  },
  es: {
    "/projects": "Aplicaciones representativas",
    "/guides": "Tablas de medidas, normas y guías de selección",
    "/news": "Respuestas breves a lo que preguntan los compradores",
  },
  pt: {
    "/projects": "O que cada tipo de obra exige",
    "/guides": "Tabelas de medidas, normas e guias de seleção",
    "/news": "Respostas curtas ao que os compradores perguntam",
  },
} as const;

/*
  The buying shelf.

  FAQ sits here, not only in the footer. The five questions a buyer asks before anything
  else — minimum order, lead time, samples, payment terms, OEM — are all answered on
  /faq/, and burying that page in the footer meant the work was done and nobody read it.
  A visitor who opens "Buy it now" is asking exactly those questions; the answers belong
  one row away from the storefront button, not at the bottom of the page.
*/
const buyShelfLinks = {
  en: [
    { label: "Contact", detail: "Quotes, pricing and export specialists", href: "/contact" },
    { label: "FAQ", detail: "Minimum order, lead time, samples, payment, OEM", href: "/faq" },
    { label: "Downloads", detail: "Catalog and verified documents", href: "/downloads" },
  ],
  es: [
    { label: "Contacto", detail: "Cotizaciones, precios y especialistas de exportación", href: "/contact" },
    { label: "Preguntas frecuentes", detail: "Pedido mínimo, plazos, muestras, pago, OEM", href: "/faq" },
    { label: "Descargas", detail: "Catálogo y documentos verificados", href: "/downloads" },
  ],
  pt: [
    { label: "Contato", detail: "Cotações, preços e especialistas em exportação", href: "/contact" },
    { label: "Perguntas frequentes", detail: "Pedido mínimo, prazo, amostras, pagamento, OEM", href: "/faq" },
    { label: "Downloads", detail: "Catálogo e documentos verificados", href: "/downloads" },
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
/*
  Locales whose desktop link row can never fit its column, so they use the compact rail at
  every width. Measured 2026-09-27 at 1700px, where the column is 680px and does not grow:
  fr 859px, ru 789px, de 729px (en 618, es 632, tr 630, pt 624, ja 574, ar 511, ko 505).
  The row is `whitespace-nowrap`, so an over-long row does not wrap — it runs under the
  centered wordmark ("Acheter maintenant" across HYDE, client screenshot 09-27). Listed here
  rather than only measured at runtime so the static HTML is already right and the header
  does not jump after hydration; the runtime check below catches anything this list misses.

  Emptied the same day: merging Applications, Guides and News into "Resources" took the
  row from seven items to five, and the longest (fr) now measures 603px. Kept as the place
  to list a locale again if a translation grows past the column.
*/
const LONG_NAV_LOCALES = new Set<string>([]);

export function SiteHeader({ categories }: { categories: MenuCategory[] }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const wideNavRef = useRef<HTMLDivElement>(null);
  const [navOverflows, setNavOverflows] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuOpenerRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  /* The menu fades and settles in and out on the same rhythm as search and the image
     dialog (globals.css .overlay-presence / .overlay-panel). It popped in and vanished
     until 2026-09-27, the one overlay on the site with no motion at all. */
  const menuPresence = useOverlayPresence(menuOpen);
  const [searchOpen, setSearchOpen] = useState(false);
  /*
    The dialog stays mounted after its first open so its exit animation
    (useOverlayPresence) still runs; before that first open it is not mounted at all,
    which is what keeps its chunk out of the initial page load.
  */
  const [searchEverOpened, setSearchEverOpened] = useState(false);
  const [openShelf, setOpenShelf] = useState<ShelfName | null>(null);
  /*
    Read off the path, for all three locales. This was `pathname.startsWith("/es/")` until
    2026-09-17, which made every /pt/ page compute `locale = "en"` — English labels on the
    Portuguese site, and nav links pointing back out of it. See localeFromPath's note.
  */
  const locale = localeFromPath(pathname);
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const longNav = LONG_NAV_LOCALES.has(locale) || navOverflows;

  /*
    Runtime guard for the list above: a translation edit or a fallback font can make any
    locale's row too wide. The row's natural width is read once while it is visible; after
    that it is compared with half the grid (the column it gets from 100rem up), so the
    header can switch back when the window widens even though the row is hidden by then.
  */
  useEffect(() => {
    const column = wideNavRef.current;
    const row = column?.parentElement;
    if (!column || !row || LONG_NAV_LOCALES.has(locale)) return;
    let natural = 0;
    const check = () => {
      /* The links' own extent: the flex row is as wide as its column, so its scrollWidth
         only reports the overflow case and would read "fits" as "exactly full". */
      const links = column.querySelector("nav")?.children;
      if (links?.length && column.offsetParent !== null) {
        natural = links[links.length - 1].getBoundingClientRect().right - links[0].getBoundingClientRect().left;
      }
      if (!natural) return;
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      setNavOverflows(natural > (row.clientWidth - gap) / 2);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(row);
    /* The row stops growing at the layout's max width, so a label that grows (a web font
       arriving late) is only seen through the links themselves. */
    for (const link of Array.from(column.querySelector("nav")?.children ?? [])) observer.observe(link);
    return () => observer.disconnect();
  }, [locale]);
  /* Copy in the page's own language, in source order en / es / pt. */
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const resourceLinks = headerNav.filter((link) => RESOURCE_HREFS.includes(link.href));
  const firstResourceHref = resourceLinks[0]?.href;
  /*
    The compact rail is also what 1376–1599px desktops see (HeaderNavigation.module.css), and
    a 1440px laptop has a mouse: the release session found "Guides / News" there instead of
    Resources on 09-28. So from xl up the rail shows the Resources button in place of its
    resource links; below xl (tablet, phone — no hover) the links stay.
  */
  const railFirstResourceHref = headerNav
    .filter((link) => link.href !== "/projects")
    .find((link) => RESOURCE_HREFS.includes(link.href))?.href;
  const resourcesCurrent = resourceLinks.some((link) => isCurrent(localisedHref(link.href, locale)));
  const companyCurrent = dict(companyShelfLinks, locale).some((link) =>
    isCurrent(localisedHref(link.href, locale)),
  );
  const buyCurrent = dict(buyShelfLinks, locale).some((link) =>
    isCurrent(localisedHref(link.href, locale)),
  );

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const restoreMenuFocus = () => {
    if (menuOpenerRef.current?.isConnected) menuOpenerRef.current.focus();
    else menuTriggerRef.current?.focus();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    /*
      Focus goes back to the button that opened the menu. It used to wait on
      requestAnimationFrame alone, and where frames never come (a background tab, some
      embedded webviews — 0 frames in 500 ms on the 09-28 live test) focus was left nowhere.
      Whichever arrives first, the frame or the timer.
    */
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      restoreMenuFocus();
    };
    requestAnimationFrame(restore);
    window.setTimeout(restore, 50);
  };

  /*
    Escape closes the menu wherever focus is. The drawer's own handler only hears keys
    pressed inside it, and focus reaches the drawer one effect after it appears; a reader
    who presses Escape at once got nothing (09-28 live test). The drawer's handler calls
    stopPropagation, so a key pressed inside it is not handled twice.
  */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setMenuOpen(false);
      window.setTimeout(() => {
        if (menuOpenerRef.current?.isConnected) menuOpenerRef.current.focus();
        else menuTriggerRef.current?.focus();
      }, 0);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
      data-long-nav={longNav ? "" : undefined}
      className={cn("relative sticky top-0 z-10 flex-grow-0 bg-surface", navigationStyles.header)}
      onMouseLeave={() => setOpenShelf(null)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenShelf(null);
      }}
    >
      <div>
        {/* Nav row */}
        <div className="layout z-30 bg-surface">
          <div className="relative col-content grid w-full grid-cols items-center gap-x gap-y-24 pb-8 pt-32">
            <div ref={wideNavRef} className={cn("col-span-full max-xl:hidden sm:col-span-4 md:col-span-6 xl:col-span-12", navigationStyles.wideNavigation)}>
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
              <nav className="flex gap-16 whitespace-nowrap">
                {headerNav.map((link) => {
                  const href = localisedHref(link.href, locale);
                  const current = isCurrent(href);

                  if (link.href === "/products") {
                    /*
                      A link, not a button. Chanel opens its panel on hover but the top
                      item still navigates, and the same applies here: /products/ is a
                      real page with its own copy and 435 indexed links, so turning the
                      nav item into a button to get a panel would cost the page its
                      entry point. Hover and focus open the shelf; the click goes through.
                    */
                    return (
                      <Link
                        key={link.href}
                        href={href}
                        aria-current={current ? "page" : undefined}
                        aria-expanded={openShelf === "products"}
                        aria-controls="products-shelf"
                        onFocus={() => setOpenShelf("products")}
                        onMouseEnter={() => setOpenShelf("products")}
                        onClick={() => setOpenShelf(null)}
                        className={cn(
                          "nav-marker text-c1 text-ink no-underline",
                          current && "current-nav",
                        )}
                      >
                        {navLabel(link, locale)}
                      </Link>
                    );
                  }

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

                  if (RESOURCE_HREFS.includes(link.href)) {
                    if (link.href !== firstResourceHref) return null;
                    return (
                      <button
                        key="resources"
                        type="button"
                        aria-controls="resources-shelf"
                        aria-expanded={openShelf === "resources"}
                        aria-haspopup="true"
                        aria-current={resourcesCurrent ? "page" : undefined}
                        onClick={() => setOpenShelf("resources")}
                        onFocus={() => setOpenShelf("resources")}
                        onMouseEnter={() => setOpenShelf("resources")}
                        className={cn(
                          "nav-marker bg-transparent text-c1 text-ink",
                          resourcesCurrent && "current-nav",
                        )}
                      >
                        {tx(locale, "Resources", { es: "Recursos", pt: "Recursos" })}
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
                        {tx(locale, "Buy it now", { es: "Comprar ahora", pt: "Comprar agora" })}
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

            <div className={cn("col-span-full grid grid-cols-2 content-start justify-between gap-x gap-y-24 xl:col-span-12", navigationStyles.controls)}>
              <Link href={homeHref} className="flex min-w-0 flex-shrink-0 items-center text-ink">
                <Wordmark className="pe-8" />
              </Link>

              {/*
                Icons keep their 20px visual footprint and baseline. A transparent
                pseudo-element extends each hit target to 44px without crowding the
                wordmark and language links on a 375px screen.
              */}
              <nav className="flex flex-grow items-center justify-end gap-24 sm:gap-32">
                {/*
                  The bare EN | ES link became a panel on 2026-09-08, at the client's
                  request and modelled on FSB's "Choose your location and language".

                  It still switches language on exactly the rule `languageTarget` encodes —
                  see the comment there and `hasSpanishMirror` — but it now also answers
                  the question a reader actually opens a location menu to ask, which is who
                  they talk to. `src/lib/locale-picker.ts` records why that is a better use
                  of the space than the globe animation the client asked about.
                */}
                <LocalePicker locale={locale} />
                <button
                  type="button"
                  aria-label={tx(locale, "Search", { es: "Buscar", pt: "Pesquisar" })}
                  aria-expanded={searchOpen}
                  onClick={() => {
                    setOpenShelf(null);
                    setSearchEverOpened(true);
                    setSearchOpen(true);
                  }}
                  className="header-icon-hit relative flex h-24 w-20 flex-none items-center justify-center text-ink-tertiary transition-colors duration-[var(--motion-fast)] hover:text-ink"
                >
                  <SearchIcon className="h-20 w-20" />
                </button>
                <button
                  type="button"
                  aria-label={tx(locale, "Open menu", { es: "Abrir menú", pt: "Abrir menu" })}
                  ref={menuTriggerRef}
                  aria-controls="site-menu-dialog"
                  aria-expanded={menuOpen}
                  onClick={(event) => {
                    menuOpenerRef.current = event.currentTarget;
                    setOpenShelf(null);
                    setMenuOpen(true);
                  }}
                  className="header-icon-hit relative flex h-24 w-20 flex-none items-center justify-center text-ink-tertiary transition-colors duration-[var(--motion-fast)] hover:text-ink"
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

        {/*
          Mobile and tablet nav rail.

          The row above is `max-xl:hidden`, so below 1376px the header used to offer a
          wordmark, a language link, a magnifier and a hamburger — nothing that names a
          destination. Most of this site's traffic arrives on a product page from search
          and leaves from there; a menu you have to discover is a menu most of them never
          open. See .nav-rail in globals.css for why this scrolls rather than wraps.
        */}
        <div className={cn("layout border-t border-line bg-surface xl:hidden", navigationStyles.compactNavigation)}>
          {/*
            09-28 (client: 「手机端导航栏……很乱没有逻辑」): the destinations scroll in their
            reading order and "Buy it now" is pinned on the right, always in view, instead of
            leading the scroll strip. Before, the CTA came first and the fifth label was cut
            mid-word at the screen edge, so the strip read as neither ordered nor finished.
          */}
          <div className="col-content flex min-w-0 items-center gap-16">
          <nav
            aria-label={tx(locale, "Main navigation", { es: "Navegación principal", pt: "Navegação principal" })}
            className="nav-rail min-w-0 flex-1"
          >
            {headerNav
              /*
                Two changes to what the phone rail shows, both about the same 375px.

                Projects comes out. The rail scrolls horizontally and anything past the
                fold is a link most visitors never see; Projects is the least
                load-bearing of the six — three reference pages the client does not treat
                as a selling surface — so it goes, and stays in the desktop row and the
                drawer.

                "Buy it now" moves to the front. Even with five items it ended at 464px
                on a 375px screen: present, but off the edge, which for the one control
                that leads to an order is the same as absent. Reading order is not
                sacred here — the rail is a shelf of destinations, not a sentence — and
                the item most likely to be wanted belongs where the eye lands first.
              */
              .filter((link) => link.href !== "/projects")
              .map((link) => {
              const href = localisedHref(link.href, locale);

              /* No permanent bold on Product Finder any more (09-28): in the rail, bold means "you are here", and a second always-bold label read as a second current page. */

              /*
                Opens the sourcing drawer rather than linking out. This reaches
                Alibaba, the price list, Contact and the mailbox in
                one more tap — sending it straight to the storefront would drop the buyer
                who wants a quote by email, and email is what this site is built to produce.
              */
              if (link.href === "/downloads") return null; // pinned outside the scroll strip

              const railLink = (
                <Link
                  key={link.href}
                  href={href}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className={cn(
                    "nav-rail-item",
                    RESOURCE_HREFS.includes(link.href) && "xl:hidden",
                    isCurrent(href) && "current-nav",
                  )}
                >
                  {navLabel(link, locale)}
                </Link>
              );
              if (link.href !== railFirstResourceHref) return railLink;
              return (
                <Fragment key={link.href}>
                  <button
                    type="button"
                    aria-controls="resources-shelf"
                    aria-expanded={openShelf === "resources"}
                    aria-haspopup="true"
                    aria-current={resourcesCurrent ? "page" : undefined}
                    onClick={() => setOpenShelf("resources")}
                    onFocus={() => setOpenShelf("resources")}
                    onMouseEnter={() => setOpenShelf("resources")}
                    className={cn("nav-rail-item hidden bg-transparent xl:inline-block", resourcesCurrent && "current-nav")}
                  >
                    {tx(locale, "Resources", { es: "Recursos", pt: "Recursos" })}
                  </button>
                  {railLink}
                </Fragment>
              );
            })}
          </nav>
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={(event) => {
              menuOpenerRef.current = event.currentTarget;
              setMenuOpen(true);
            }}
            className="nav-rail-cta flex-none"
          >
            {tx(locale, "Buy it now", { es: "Comprar ahora", pt: "Comprar agora" })}
            <span aria-hidden="true">›</span>
          </button>
          </div>
        </div>
      </div>

      <section
        id="products-shelf"
        aria-label={tx(locale, "Products", { es: "Productos", pt: "Produtos" })}
        aria-hidden={openShelf !== "products"}
        className={cn("header-shelf", openShelf === "products" && "header-shelf-open")}
      >
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {tx(locale, "Products", { es: "Productos", pt: "Produtos" })}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {tx(locale, "Fifteen product families. The number is how many verified records each one holds.", { es: "Quince familias de producto. El número es cuántas referencias verificadas contiene cada una.", pt: "Quinze famílias de produto. O número é quantas referências verificadas cada uma contém." })}
                </p>
                <Link
                  href={localisedHref("/product-finder", locale)}
                  onClick={() => setOpenShelf(null)}
                  className="short-marker mt-16 inline-block text-c1 text-ink no-underline"
                >
                  {tx(locale, "Product Finder", { es: "Buscador de productos", pt: "Localizador de produtos" })}
                </Link>
              </div>
              {/* Four columns of fifteen: the whole catalogue reachable in one hover
                  from any page, which is what the drawer already gives on a phone. */}
              <nav className="grid gap-x-24 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
                {categories.map((category) => {
                  const href = localisedHref(`/products/${category.slug}`, locale);
                  return (
                    <div key={category.slug}>
                      <Link
                        href={href}
                        onClick={() => setOpenShelf(null)}
                        aria-current={isCurrent(href) ? "page" : undefined}
                        className="header-shelf-link block border-t border-line pt-12 text-ink no-underline"
                      >
                        <span className="short-marker text-c1">
                          {category.labels[locale]}
                        </span>
                        <span className="ms-8 text-c2 tabular-nums text-ink-secondary">
                          {category.count}
                        </span>
                      </Link>
                      {category.children.length > 0 ? (
                        <ul className="mt-6">
                          {category.children.map((child) => (
                            <li key={child.slug}>
                              <Link
                                /*
                                  The static collection page, not the filter query.

                                  This shelf is server-rendered on every page, so it is
                                  the one place a crawler reliably sees sub-category
                                  links. Pointing it at ?type= gave those pages no
                                  inbound link at all — they existed only in the sitemap,
                                  which is precisely how a page ends up "discovered, not
                                  indexed".

                                  Spanish joined on 2026-09-03, when /es/collections/
                                  shipped. Until then it kept the filter, because a link
                                  to a page that does not exist is worse than a weak one.
                                */
                                href={
                                  locale === "en"
                                    ? `/collections/${category.slug}-${child.slug}/`
                                    : `/${locale}/collections/${category.slug}-${child.slug}/`
                                }
                                onClick={() => setOpenShelf(null)}
                                className="block py-2 text-c2 text-ink-secondary no-underline hover:text-ink"
                              >
                                {child.labels[locale]}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section
        id="company-shelf"
        aria-label={tx(locale, "Company", { es: "Empresa", pt: "Empresa" })}
        aria-hidden={openShelf !== "company"}
        className={cn("header-shelf", openShelf === "company" && "header-shelf-open")}
      >
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {tx(locale, "Company", { es: "Empresa", pt: "Empresa" })}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {tx(locale, "The factory, markets and technical support behind HYDE.", { es: "La fábrica, sus mercados y el apoyo técnico detrás de HYDE.", pt: "A fábrica, os mercados e o apoio técnico por trás da HYDE." })}
                </p>
              </div>
              <nav className="grid gap-x-24 gap-y-24 sm:grid-cols-2 xl:grid-cols-4">
                {dict(companyShelfLinks, locale).map((link) => {
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
        id="resources-shelf"
        aria-label={tx(locale, "Resources", { es: "Recursos", pt: "Recursos" })}
        aria-hidden={openShelf !== "resources"}
        className={cn("header-shelf", openShelf === "resources" && "header-shelf-open")}
      >
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-32 xl:grid-cols-[minmax(16rem,.55fr)_minmax(0,2.45fr)]">
              <div>
                <p className="text-c2 uppercase tracking-[.12em] text-ink-secondary">
                  {tx(locale, "Resources", { es: "Recursos", pt: "Recursos" })}
                </p>
                <p className="mt-12 max-w-[28rem] text-c1 text-ink-secondary">
                  {tx(locale, "Where the products are used, how to specify them, and what buyers ask.", {
                    es: "Dónde se usan los productos, cómo especificarlos y qué preguntan los compradores.",
                    pt: "Onde os produtos são usados, como especificá-los e o que os compradores perguntam.",
                  })}
                </p>
              </div>
              <nav className="grid gap-x-24 gap-y-24 sm:grid-cols-3">
                {resourceLinks.map((link) => {
                  const href = localisedHref(link.href, locale);
                  const detail = dict(resourceDetails, locale)[link.href as keyof typeof resourceDetails.en];
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      onClick={() => setOpenShelf(null)}
                      aria-current={isCurrent(href) ? "page" : undefined}
                      className="header-shelf-link border-t border-line pt-16 text-ink no-underline"
                    >
                      <span className="short-marker text-c1">{navLabel(link, locale)}</span>
                      <span className="mt-8 block text-c2 text-ink-secondary">{detail}</span>
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
        aria-label={tx(locale, "Buy it now", { es: "Comprar ahora", pt: "Comprar agora" })}
        aria-hidden={openShelf !== "buy"}
        className={cn("header-shelf", openShelf === "buy" && "header-shelf-open")}
      >
        <div className="header-shelf-clip">
          <div className="layout py-32">
            <div className="col-content grid gap-24 xl:grid-cols-4">
              {dict(buyShelfLinks, locale).map((link) => {
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
                <span>{tx(locale, "Buy on Alibaba", { es: "Comprar en Alibaba", pt: "Comprar no Alibaba" })}</span>
                <span aria-hidden="true">›</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {menuPresence.rendered ? (
        <SiteMenuDrawer
          state={menuPresence.visible ? "open" : "closed"}
          locale={locale}
          currentPath={pathname}
          categories={categories}
          onClose={closeMenu}
        />
      ) : null}
      {searchEverOpened ? (
        <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
      ) : null}
    </div>
  );
}
