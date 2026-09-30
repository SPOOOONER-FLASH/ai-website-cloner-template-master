"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { useOverlayPresence } from "@/hooks/useOverlayPresence";
import type { MenuCategory } from "@/data/categories";
import type { Locale } from "@/data/locales";

/*
  The interactive parts of SiteHeader, split out on 2026-09-28 so the header's text, links
  and shelves are server-rendered HTML. SiteHeader.tsx (a server component) renders the
  markup and drops these islands where state or the current path is needed; they share
  one piece of state through HeaderContext, which HeaderProvider owns.

  Both overlays load on demand. The header sits in the root layout, so anything it
  imports statically is hydrated on every page of the site — including plain articles
  that never open a menu or a search box. The dialog alone drags in the whole
  search-matching library. `ssr: false` is safe here because a closed overlay renders
  nothing, so there is no server HTML to lose; the chunk arrives on first open instead.
*/
const loadSearchDialog = () => import("./SearchDialog").then((module) => module.SearchDialog);
const loadMenuDrawer = () => import("./SiteMenuDrawer").then((module) => module.SiteMenuDrawer);

const SearchDialog = dynamic(loadSearchDialog, { ssr: false });
const SiteMenuDrawer = dynamic(loadMenuDrawer, { ssr: false });

/**
 * Fetch an overlay's chunk BEFORE it is asked for. Client 2026-09-29:「首次点击侧边栏会卡顿」.
 *
 * Splitting the overlays out was right — the header is in the root layout, so a static
 * import would hydrate the whole search-matching library on every article page. But
 * "the chunk arrives on first open" meant the user paid for the download at the worst
 * possible moment: the hamburger is tapped, and nothing happens until the network
 * answers. On a phone on 4G that is the whole of the delay, and it happens once per
 * visit, which is exactly when the buyer is deciding whether this site is well built.
 *
 * Warming the chunk instead keeps both: it is still out of the initial bundle, so first
 * paint and hydration are unchanged, but by the time anyone reaches for the menu the
 * module is already parsed and the open is synchronous.
 *
 * Idempotent because `import()` caches its module promise, so the hover, the focus and
 * the idle callback below all resolve to the same fetch; the rejection is swallowed
 * because a failed prefetch must not surface — the real click retries and can report.
 */
function warmOverlays() {
  void loadSearchDialog().catch(() => {});
  void loadMenuDrawer().catch(() => {});
}

/**
 * The prefetch, on the browser's own idle time.
 *
 * `requestIdleCallback` rather than an effect that runs immediately: the chunk must not
 * compete with the hero image or the fonts for the bandwidth of the first second, and it
 * is not needed until a human moves. Safari still has no `requestIdleCallback`, so it
 * falls back to a timeout — the point is "after the page has settled", not a precise
 * moment. The hover and focus handlers on the buttons cover anyone who arrives sooner.
 */
function useWarmOverlays() {
  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (idle) {
      const handle = idle(warmOverlays);
      const cancel = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      return () => cancel?.(handle);
    }
    const timer = window.setTimeout(warmOverlays, 1500);
    return () => window.clearTimeout(timer);
  }, []);
}

/**
 * The same warm-up, for anyone who reaches a button before the idle callback has run.
 *
 * `onPointerEnter` covers a mouse, which arrives milliseconds before the click and is
 * the whole window on desktop. `onTouchStart` is what matters on a phone, where there is
 * no hover at all: it fires on finger-down, ahead of the click that follows it, and that
 * head start is usually enough on its own. `onFocus` covers the keyboard.
 */
const OVERLAY_WARMUP = {
  onPointerEnter: warmOverlays,
  onTouchStart: warmOverlays,
  onFocus: warmOverlays,
} as const;

export type ShelfName = "products" | "company" | "buy" | "resources";

interface HeaderState {
  openShelf: ShelfName | null;
  setOpenShelf: (shelf: ShelfName | null) => void;
  menuOpen: boolean;
  openMenu: (opener: HTMLButtonElement) => void;
  menuTriggerRef: RefObject<HTMLButtonElement | null>;
  searchOpen: boolean;
  openSearch: () => void;
}

const HeaderContext = createContext<HeaderState | null>(null);

function useHeader(): HeaderState {
  const state = useContext(HeaderContext);
  if (!state) throw new Error("Header islands must render inside HeaderProvider");
  return state;
}

/* Same rule as before the split: the page itself or anything under it. */
function useIsCurrent() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The header's root element and its state: the open shelf, the menu drawer, the search
 * dialog, the Escape and outside-pointer handlers, focus return, and the runtime check
 * that switches to the compact rail when a locale's link row outgrows its column.
 */
export function HeaderProvider({
  locale,
  categories,
  longNavLocale,
  className,
  children,
}: {
  locale: Locale;
  categories: MenuCategory[];
  /** The locale is on SiteHeader's LONG_NAV_LOCALES list, so the static HTML is already compact. */
  longNavLocale: boolean;
  className: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  useWarmOverlays();
  const headerRef = useRef<HTMLDivElement>(null);
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
  const longNav = longNavLocale || navOverflows;

  /*
    Runtime guard for LONG_NAV_LOCALES: a translation edit or a fallback font can make any
    locale's row too wide. The row's natural width is read once while it is visible; after
    that it is compared with half the grid (the column it gets from 100rem up), so the
    header can switch back when the window widens even though the row is hidden by then.
  */
  useEffect(() => {
    const column = headerRef.current?.querySelector<HTMLElement>("[data-header-wide-nav]");
    const row = column?.parentElement;
    if (!column || !row || longNavLocale) return;
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
  }, [locale, longNavLocale]);

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

  const state: HeaderState = {
    openShelf,
    setOpenShelf,
    menuOpen,
    openMenu: (opener) => {
      menuOpenerRef.current = opener;
      setMenuOpen(true);
    },
    menuTriggerRef,
    searchOpen,
    openSearch: () => {
      setOpenShelf(null);
      setSearchEverOpened(true);
      setSearchOpen(true);
    },
  };

  return (
    <HeaderContext.Provider value={state}>
      <div
        ref={headerRef}
        data-long-nav={longNav ? "" : undefined}
        className={className}
        onMouseLeave={() => setOpenShelf(null)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpenShelf(null);
        }}
      >
        {children}
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
    </HeaderContext.Provider>
  );
}

/**
 * A header link that knows whether it points at the current page. `markCurrent` adds the
 * semibold `current-nav` class as well as `aria-current`; `closesShelf` closes any open
 * shelf when the pointer or focus reaches it (the plain items in the desktop row).
 */
export function HeaderLink({
  href,
  className,
  markCurrent = false,
  closesShelf = false,
  children,
}: {
  href: string;
  className: string;
  markCurrent?: boolean;
  closesShelf?: boolean;
  children: ReactNode;
}) {
  const { setOpenShelf } = useHeader();
  const current = useIsCurrent()(href);
  const close = closesShelf ? () => setOpenShelf(null) : undefined;

  return (
    <Link
      href={href}
      /*
        No viewport prefetch (2026-09-30). Every header link is in the first viewport of every
        page, so Next fetched the RSC payload and route chunks of five routes — about 70 KB,
        the Product Finder's 43 KB payload among them — the moment the page hydrated, on a
        phone still downloading the hero's second slide and the first product photographs.
        Lighthouse listed those fetches in the LCP's network dependency tree. A click still
        navigates client-side; it fetches the payload then, one round trip from the edge.
      */
      prefetch={false}
      aria-current={current ? "page" : undefined}
      onFocus={close}
      onMouseEnter={close}
      className={cn(className, markCurrent && current && "current-nav")}
    >
      {children}
    </Link>
  );
}

/**
 * Opens a shelf on hover, focus or click. `href` makes it a link (Products: the page is a
 * real destination, so the top item still navigates and the click closes the shelf);
 * without it, a button. It is "current" when the page is any of `currentHrefs`.
 */
export function ShelfTrigger({
  shelf,
  href,
  currentHrefs,
  className,
  children,
}: {
  shelf: ShelfName;
  href?: string;
  currentHrefs: string[];
  className: string;
  children: ReactNode;
}) {
  const { openShelf, setOpenShelf } = useHeader();
  const isCurrent = useIsCurrent();
  const current = currentHrefs.some(isCurrent);
  const open = () => setOpenShelf(shelf);

  if (href) {
    return (
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        aria-expanded={openShelf === shelf}
        aria-controls={`${shelf}-shelf`}
        onFocus={open}
        onMouseEnter={open}
        onClick={() => setOpenShelf(null)}
        className={cn(className, current && "current-nav")}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-controls={`${shelf}-shelf`}
      aria-expanded={openShelf === shelf}
      aria-haspopup="true"
      aria-current={current ? "page" : undefined}
      onClick={open}
      onFocus={open}
      onMouseEnter={open}
      className={cn(className, current && "current-nav")}
    >
      {children}
    </button>
  );
}

/**
 * A drop-down shelf. Its contents are server-rendered; this island only opens and closes
 * it, and a click on any link inside closes it (each shelf link used to carry its own
 * `onClick={() => setOpenShelf(null)}`).
 */
export function ShelfPanel({
  shelf,
  label,
  children,
}: {
  shelf: ShelfName;
  label: string;
  children: ReactNode;
}) {
  const { openShelf, setOpenShelf } = useHeader();

  return (
    <section
      id={`${shelf}-shelf`}
      aria-label={label}
      aria-hidden={openShelf !== shelf}
      className={cn("header-shelf", openShelf === shelf && "header-shelf-open")}
      onClick={(event) => {
        if ((event.target as Element).closest("a")) setOpenShelf(null);
      }}
    >
      {children}
    </section>
  );
}

/** The magnifier. The icon arrives pre-rendered as `children`. */
export function HeaderSearchButton({ label, children }: { label: string; children: ReactNode }) {
  const { searchOpen, openSearch } = useHeader();

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={searchOpen}
      onClick={openSearch}
      {...OVERLAY_WARMUP}
      className="header-icon-hit relative flex h-24 w-20 flex-none items-center justify-center text-ink-tertiary transition-colors duration-[var(--motion-fast)] hover:text-ink"
    >
      {children}
    </button>
  );
}

/** The hamburger — the element focus falls back to when the menu's opener is gone. */
export function HeaderMenuButton({ label, children }: { label: string; children: ReactNode }) {
  const { menuOpen, openMenu, setOpenShelf, menuTriggerRef } = useHeader();

  return (
    <button
      type="button"
      aria-label={label}
      ref={menuTriggerRef}
      aria-controls="site-menu-dialog"
      aria-expanded={menuOpen}
      onClick={(event) => {
        setOpenShelf(null);
        openMenu(event.currentTarget);
      }}
      {...OVERLAY_WARMUP}
      className="header-icon-hit relative flex h-24 w-20 flex-none items-center justify-center text-ink-tertiary transition-colors duration-[var(--motion-fast)] hover:text-ink"
    >
      {children}
    </button>
  );
}

/**
 * "Buy it now", pinned at the end of the phone and tablet rail. Opens the sourcing drawer
 * rather than linking out: it reaches Alibaba, the price list, Contact and the mailbox in
 * one more tap, and keeps the buyer who wants a quote by email.
 */
export function HeaderRailCta({ className, children }: { className: string; children: ReactNode }) {
  const { menuOpen, openMenu } = useHeader();

  return (
    <button
      type="button"
      aria-expanded={menuOpen}
      onClick={(event) => openMenu(event.currentTarget)}
      className={className}
    >
      {children}
    </button>
  );
}
