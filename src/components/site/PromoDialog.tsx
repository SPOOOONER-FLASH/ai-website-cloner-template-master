"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { promoDialog, promoIsInWindow, promoSurfaceFor } from "@/data/promo";
import type { PromoCard } from "@/data/types";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { HydeLockup } from "./icons";

/**
 * The site-wide promotional stack.
 *
 * Two offers sit in the bottom-left corner after a short delay, each pointing at its own
 * destination and each dismissible on its own.
 *
 * That last requirement is why this is NOT a modal any more. An earlier version put both
 * cards inside one `aria-modal="true"` dialog with a full-screen overlay, which is the
 * right shape when a single close button dismisses the whole thing. Once each card
 * closes independently the modal reading breaks down: `aria-modal` asserts the rest of
 * the page is inert, and a dimmed page you cannot interact with but are expected to keep
 * reading is a contradiction. So the overlay is gone, there is no focus trap, and the
 * stack is an ordinary complementary region the visitor can ignore.
 *
 * What survives from the modal version: Escape still closes everything, every control is
 * reachable by keyboard, and each card is labelled.
 */

/** Written on FIRST SHOW, not on dismissal. Appearing IS the impression. */
const STORAGE_KEY = "canton-promo";

interface StoredState {
  lastSeen: number;
  version: number;
  /** ctaHref of every card dismissed during this cooldown window. */
  dismissed?: string[];
}

function readState(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (typeof parsed.lastSeen !== "number" || typeof parsed.version !== "number") {
      return null;
    }
    return {
      lastSeen: parsed.lastSeen,
      version: parsed.version,
      dismissed: Array.isArray(parsed.dismissed) ? parsed.dismissed : [],
    };
  } catch {
    // Private-mode Safari throws on localStorage; a promo stack is not worth an error.
    return null;
  }
}

function writeState(state: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Nothing to do — the visitor simply sees it again next time. */
  }
}

/**
 * The cooldown check.
 *
 * A version bump beats the cooldown outright. That is the only way to get the stack back
 * in front of someone who dismissed it — including the client checking their own site,
 * which is worth remembering before wondering why "the popup is gone again".
 */
function isSuppressed(now: number): boolean {
  const state = readState();
  if (!state) return false;
  if (state.version !== promoDialog.version) return false;
  return now - state.lastSeen < promoDialog.cooldownMinutes * 60 * 1000;
}

export function PromoDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const surface = promoSurfaceFor(pathname);
  const allowedHere = surface !== null && promoDialog.surfaces.includes(surface);

  useEffect(() => {
    if (!allowedHere || !promoIsInWindow()) return;
    if (isSuppressed(Date.now())) return;

    const timer = window.setTimeout(() => {
      const previous = readState();
      const carried =
        previous?.version === promoDialog.version ? (previous.dismissed ?? []) : [];

      // Both state updates happen here, inside the timeout, rather than in a second
      // effect that reads storage after `open` flips. A separate effect would set state
      // synchronously on render and cascade; this is already asynchronous.
      setDismissed(carried);
      setOpen(true);

      writeState({
        lastSeen: Date.now(),
        version: promoDialog.version,
        dismissed: carried,
      });
    }, promoDialog.delaySeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [allowedHere, pathname]);

  /** Dismissing one card remembers it, so it stays gone across pages in this window. */
  const dismissCard = useCallback((href: string) => {
    setDismissed((current) => (current.includes(href) ? current : [...current, href]));
    const state = readState();
    writeState({
      lastSeen: state?.lastSeen ?? Date.now(),
      version: promoDialog.version,
      dismissed: [...new Set([...(state?.dismissed ?? []), href])],
    });
  }, []);

  const dismissAll = useCallback(() => {
    setOpen(false);
    const state = readState();
    writeState({
      lastSeen: state?.lastSeen ?? Date.now(),
      version: promoDialog.version,
      dismissed: promoDialog.cards.map((c) => c.ctaHref),
    });
  }, []);

  // Escape clears the whole stack. Nothing is trapped, so this is a convenience, not a
  // requirement — but a visitor who hits Escape expects everything floating to go away.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismissAll();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, dismissAll]);

  const visible = promoDialog.cards.filter((card) => !dismissed.includes(card.ctaHref));

  if (!open || !visible.length) return null;

  return (
    /*
      `complementary` rather than `dialog`: this is supporting content beside the page,
      not something the visitor has to deal with before continuing. Bottom-left on
      desktop, bottom-centre on mobile — the corner keeps it clear of the content column.
    */
    <aside
      aria-label="Offers"
      className="fixed bottom-0 left-0 z-40 flex w-full max-w-[420px] flex-col gap-16 p-16 xs:p-24"
    >
      {visible.map((card) => (
        <PromoCardBlock key={card.ctaHref} card={card} onDismiss={dismissCard} />
      ))}
    </aside>
  );
}

function PromoCardBlock({
  card,
  onDismiss,
}: {
  card: PromoCard;
  onDismiss: (href: string) => void;
}) {
  const { title, titleLight, body, ctaLabel, ctaHref, image, visual } = card;
  // A catalogue PDF is a file, not a route — Link would try to client-navigate to it.
  const isFile = /^https?:|\.(pdf|zip|dwg|rfa)$/i.test(ctaHref);
  const isExternal = /^https?:/i.test(ctaHref);

  const ctaClass =
    "text-c1 text-surface underline-offset-4 transition-opacity duration-200 hover:underline hover:opacity-80";

  return (
    /*
      A hairline border instead of a drop shadow. The card floats over white page content
      and needs an edge, but the site's visual language has no shadows anywhere else and
      adding one here would make this the only soft object on the page.
    */
    <div className="relative border border-line bg-surface">
      <button
        type="button"
        onClick={() => onDismiss(ctaHref)}
        aria-label={`Close: ${title}`}
        className="absolute right-12 top-12 z-10 flex h-24 w-24 items-center justify-center text-ink transition-colors duration-200 hover:text-ink-secondary"
      >
        <svg viewBox="0 0 24 24" className="h-16 w-16" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M24 23 12.7 11.6 23.3 1l-.7-.7L12 10.9 1.4.3.7 1l10.6 10.6L0 23l.7.7L12 12.3l11.3 11.3.7-.6z"
          />
        </svg>
      </button>

      <div className="grid w-full grid-cols-[96px_1fr] gap-0">
        {visual === "logo" || !image ? (
          <div className="flex items-center justify-center bg-ink p-12 text-surface">
            <HydeLockup variant="white" className="h-20" />
          </div>
        ) : (
          <MediaPlaceholder {...image} className="h-full w-full" />
        )}

        <div className="flex flex-col justify-between">
          <div className="px-16 pb-12 pt-14 pr-40">
            <p className="text-c1 font-bold text-ink">
              {title}
              {titleLight ? <span className="font-normal"> {titleLight}</span> : null}
            </p>
            <p className="mt-4 text-c2 text-ink-secondary">{body}</p>
          </div>

          <div className="bg-ink px-16 py-10">
            {isFile || isExternal ? (
              <a
                href={ctaHref}
                className={ctaClass}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {ctaLabel}
              </a>
            ) : (
              <Link href={ctaHref} className={ctaClass}>
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
