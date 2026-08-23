"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { promoDialog, promoIsInWindow, promoSurfaceFor } from "@/data/promo";
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

  if (!open) return null;

  const { title, titleLight, body, ctaLabel, ctaHref, image, visual } = promoDialog;
  const isFile = /^https?:|\.(pdf|zip|dwg|rfa)$/i.test(ctaHref);

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

      <div className="relative max-h-screen w-full max-w-[600px] overflow-y-auto px-24 py-24 xs:px-0 xs:pb-0">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
          aria-describedby="promo-body"
          className="relative grid w-full gap-0 bg-surface xs:grid-cols-2"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-16 top-16 z-10 flex h-24 w-24 items-center justify-center text-ink transition-colors duration-200 hover:text-brand-hover"
          >
            <svg viewBox="0 0 24 24" className="h-24 w-24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M24 23 12.7 11.6 23.3 1l-.7-.7L12 10.9 1.4.3.7 1l10.6 10.6L0 23l.7.7L12 12.3l11.3 11.3.7-.6z"
              />
            </svg>
          </button>

          {visual === "logo" || !image ? (
            /*
              Black panel, white mark. The brand lockup is drawn, not photographed, so it
              needs no asset, stays sharp at any density, and gives the dialog the one
              solid black field the identity is built around.
            */
            <div className="flex min-h-[180px] items-center justify-center bg-ink p-24 text-surface">
              <HydeLockup />
            </div>
          ) : (
            <MediaPlaceholder {...image} className="h-full w-full" />
          )}

          <div className="flex flex-col justify-between">
            <div className="px-24 pb-24 pt-24 xs:pr-32">
              <h2 id="promo-title" className="text-h3 text-ink">
                {title}
                {titleLight ? (
                  <>
                    <br />
                    <span className="font-normal">{titleLight}</span>
                  </>
                ) : null}
              </h2>
              <p id="promo-body" className="mt-16 text-c1 text-ink-secondary">
                {body}
              </p>
            </div>

            {/*
              A full-width band with a text link inside it rather than a filled button —
              the reference does the same, and the site's colour rules reserve a solid
              fill for a page's own primary action.

              Black band, white link. The dialog is deliberately monochrome: the brand
              lockup is black-and-white, and dropping red in beside it would introduce a
              second accent that appears nowhere else in the identity.
            */}
            <div className="bg-ink px-24 py-16">
              {isFile ? (
                <a
                  href={ctaHref}
                  className="text-c1 text-surface underline-offset-4 transition-opacity duration-200 hover:underline hover:opacity-80"
                  onClick={close}
                >
                  {ctaLabel}
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  className="text-c1 text-surface underline-offset-4 transition-opacity duration-200 hover:underline hover:opacity-80"
                  onClick={close}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
