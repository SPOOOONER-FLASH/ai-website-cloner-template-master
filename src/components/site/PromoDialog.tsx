"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { promoDialog, promoIsInWindow, promoSurfaceFor } from "@/data/promo";
import type { PromoCard } from "@/data/types";
import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { HydeLockup } from "./icons";

/**
 * The site-wide promotional dialog.
 *
 * Behaviour is modelled on FSB's newsletter popup — a timed interruption with a long
 * cooldown, bottom-left on desktop and centred on mobile — but the decision is made in
 * the browser rather than on a server, because a static export has no server to ask.
 *
 * Deliberately better than the original in one respect. FSB's dialog has no `role`, no
 * accessible name, no label on its close button, no Escape handler and no focus
 * management, so a keyboard user meets an unannounced trap. Everything here is the same
 * visually and none of that is copied.
 */

/** Written on FIRST SHOW, not on dismissal — matching FSB. Appearing IS the impression. */
const STORAGE_KEY = "canton-promo";

interface StoredState {
  lastSeen: number;
  version: number;
}

function readState(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (typeof parsed.lastSeen !== "number" || typeof parsed.version !== "number") {
      return null;
    }
    return { lastSeen: parsed.lastSeen, version: parsed.version };
  } catch {
    // Private-mode Safari throws on localStorage; a promo dialog is not worth an error.
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
 * A version bump beats the cooldown outright, which is how a new campaign reaches people
 * who dismissed the previous one yesterday.
 */
function isSuppressed(now: number): boolean {
  const state = readState();
  if (!state) return false;
  if (state.version !== promoDialog.version) return false;
  return now - state.lastSeen < promoDialog.cooldownHours * 60 * 60 * 1000;
}

export function PromoDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  const surface = promoSurfaceFor(pathname);
  const allowedHere = surface !== null && promoDialog.surfaces.includes(surface);

  const close = useCallback(() => {
    setOpen(false);
    // Send focus back where it came from, or the visitor lands at the top of the document.
    if (restoreFocusTo.current instanceof HTMLElement) restoreFocusTo.current.focus();
  }, []);

  useEffect(() => {
    if (!allowedHere || !promoIsInWindow()) return;
    if (isSuppressed(Date.now())) return;

    const timer = window.setTimeout(() => {
      restoreFocusTo.current = document.activeElement;
      setOpen(true);
      writeState({ lastSeen: Date.now(), version: promoDialog.version });
    }, promoDialog.delaySeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [allowedHere, pathname]);

  // Escape closes, and Tab is kept inside the dialog while it is open.
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open || !promoDialog.cards.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center xs:items-end xs:justify-start"
      role="presentation"
    >
      {/*
        The overlay is the one heavy block on an otherwise all-white site. That is
        deliberate and matches the reference: a modal that does not visibly take over the
        page reads as a banner, and people ignore banners.
      */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-[rgba(0,0,0,0.72)]"
      />

      {/*
        One dialog, one close button, one focus trap — containing a stack of cards.

        Two offers do NOT get two dialogs. `aria-modal="true"` asserts that everything
        outside the element is inert, so two of them at once are mutually contradictory
        and no screen reader has defined behaviour for it. Stacking inside a single
        dialog gives the visual the client asked for and keeps the semantics valid.

        `max-h-screen` plus scroll matters more with two cards than it did with one: at
        600px wide two cards are roughly 580px tall, which does not fit under a phone's
        browser chrome.
      */}
      <div className="relative max-h-screen w-full max-w-[600px] overflow-y-auto px-24 py-24 xs:px-0 xs:pb-0">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title-0"
          className="relative"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-16 top-16 z-10 flex h-24 w-24 items-center justify-center text-ink transition-colors duration-200 hover:text-ink-secondary"
          >
            <svg viewBox="0 0 24 24" className="h-24 w-24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M24 23 12.7 11.6 23.3 1l-.7-.7L12 10.9 1.4.3.7 1l10.6 10.6L0 23l.7.7L12 12.3l11.3 11.3.7-.6z"
              />
            </svg>
          </button>

          {/*
            A hairline between cards rather than a gap: the stack has to read as one
            object sitting in the corner, and a gap would make it two floating panels.
          */}
          <div className="divide-y divide-line bg-surface">
            {promoDialog.cards.map((card, index) => (
              <PromoCardBlock key={card.ctaHref} card={card} index={index} onNavigate={close} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoCardBlock({
  card,
  index,
  onNavigate,
}: {
  card: PromoCard;
  index: number;
  onNavigate: () => void;
}) {
  const { title, titleLight, body, ctaLabel, ctaHref, image, visual } = card;
  // A catalogue PDF is a file, not a route — Link would try to client-navigate to it.
  const isFile = /^https?:|\.(pdf|zip|dwg|rfa)$/i.test(ctaHref);

  const ctaClass =
    "text-c1 text-surface underline-offset-4 transition-opacity duration-200 hover:underline hover:opacity-80";

  return (
    <div className="grid w-full gap-0 xs:grid-cols-2">
      {visual === "logo" || !image ? (
        /*
          Black panel, white mark. The brand lockup is drawn, not photographed, so it
          needs no asset, stays sharp at any density, and gives the dialog the one solid
          black field the identity is built around.
        */
        <div className="flex min-h-[132px] items-center justify-center bg-ink p-24 text-surface">
          <HydeLockup variant="white" className="h-28" />
        </div>
      ) : (
        <MediaPlaceholder {...image} className="h-full w-full" />
      )}

      <div className="flex flex-col justify-between">
        {/* Only the first card clears the close button, so only it needs the gutter. */}
        <div className={cn("px-24 pb-16 pt-20", index === 0 && "xs:pr-32")}>
          <h2 id={`promo-title-${index}`} className="text-h3 text-ink">
            {title}
            {titleLight ? (
              <>
                <br />
                <span className="font-normal">{titleLight}</span>
              </>
            ) : null}
          </h2>
          <p className="mt-8 text-c1 text-ink-secondary">{body}</p>
        </div>

        {/*
          A full-width band with a text link inside it rather than a filled button — the
          reference does the same, and the site's colour rules reserve a solid fill for a
          page's own primary action.

          Black band, white link. The dialog is deliberately monochrome: the brand lockup
          is black-and-white, and dropping red in beside it would introduce a second
          accent that appears nowhere else in the identity.
        */}
        <div className="bg-ink px-24 py-16">
          {isFile ? (
            <a href={ctaHref} className={ctaClass} onClick={onNavigate}>
              {ctaLabel}
            </a>
          ) : (
            <Link href={ctaHref} className={ctaClass} onClick={onNavigate}>
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
