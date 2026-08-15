import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlobeIcon, MenuIcon, SearchIcon, Wordmark } from "../shared/icons";

/** `current: true` marks the active section — the one nav case that gets brand red. */
const NAV_LINKS = [
  { label: "Products", href: "#", current: false },
  { label: "Projects", href: "#", current: false },
  { label: "Insights", href: "#", current: false },
  { label: "Service + Downloads", href: "#", current: false },
];

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
  return (
    <div
      className="sticky z-10 flex-grow-0 bg-surface"
      style={{ top: "calc(-1 * var(--h-main-nav-banner))" }}
    >
      <div>
        {/* Promo bar — the whole 48px strip is the link */}
        <Link
          href="#"
          className="layout group relative h-[var(--h-main-nav-banner)] w-full bg-ink text-surface"
        >
          <div className="col-content grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-4">
            <span className="text-c1 text-brand underline-offset-4 group-hover:text-brand-hover group-hover:underline max-lg:text-center lg:[grid-column:-2/-1]">
              Project Planner
            </span>
          </div>
        </Link>

        {/* Nav row */}
        <div className="layout z-30 bg-surface">
          <div className="relative col-content grid w-full grid-cols items-center gap-x gap-y-24 pb-8 pt-32">
            <div className="col-span-full max-xl:hidden sm:col-span-4 md:col-span-6 xl:col-span-12">
              <nav className="flex gap-64">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      "text-c1 underline-offset-4 hover:underline",
                      // Rule 1: brand red marks the current section only.
                      link.current ? "text-brand" : "text-ink hover:text-brand-hover",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="col-span-full grid grid-cols-2 content-start justify-between gap-x gap-y-24 xl:col-span-12">
              <Link href="/" className="flex flex-shrink-0 items-center text-ink">
                <Wordmark className="pr-8 text-[1.6rem] sm:text-[2.4rem]" />
              </Link>

              {/*
                The language / search / menu panels are overlays on the reference site and
                render `display: none` at rest. This prototype ships the controls as inert
                visual elements — see site-header.spec.md "Known gap".
              */}
              <nav className="flex flex-grow justify-end gap-32">
                <button
                  type="button"
                  className="flex items-center gap-8 text-ink underline-offset-4 hover:text-brand-hover hover:underline"
                >
                  <GlobeIcon className="h-16 w-16 text-ink-tertiary" />
                  <span className="text-c2">ZH | EN</span>
                </button>
                <button type="button" aria-label="Search" className="text-ink-tertiary">
                  <SearchIcon className="h-20 w-20" />
                </button>
                <button type="button" aria-label="Menu" className="stack text-ink-tertiary">
                  <MenuIcon className="h-16 w-22" />
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
    </div>
  );
}
