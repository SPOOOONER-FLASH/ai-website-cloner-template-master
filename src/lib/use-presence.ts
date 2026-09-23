"use client";

import { useEffect, useState } from "react";

/**
 * Keeps an overlay mounted long enough to play its exit, then unmounts it.
 *
 * The search dialog and the product lightbox used to appear and vanish in one frame:
 * `open ? <Overlay/> : null`. Nothing can fade out once React has removed it, so every
 * close was a cut. This returns two flags:
 *
 *   mounted — render the overlay at all (true from open until the exit has finished)
 *   visible — the state its CSS should show; drive `data-state` from this
 *
 * Opening mounts at once and flips `visible` one frame later, so the enter transition has
 * a "from" state to start from. Closing flips `visible` at once and unmounts after
 * `exitMs`. Re-opening during an exit cancels the unmount and is visible on the next
 * frame — a double click never waits for an animation to finish.
 *
 * Under prefers-reduced-motion the exit wait is skipped entirely.
 *
 * Deliberately not an animation library: two booleans and a timer. The site is already
 * paying ~690 KB of shared JavaScript per page.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const [previousOpen, setPreviousOpen] = useState(open);

  // The synchronous half happens during render, on the frame `open` changes — React's
  // "adjust state when a prop changes" pattern — so opening mounts without an extra
  // render pass and closing starts its fade immediately. Only the timed halves (the
  // frame delay, the exit timer) live in the effect.
  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (open) setMounted(true);
    else setVisible(false);
  }

  useEffect(() => {
    if (open) {
      let second = 0;
      const show = () => setVisible(true);
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(show);
      });
      // Safety net: rAF does not run in a hidden tab and is throttled by some power-saving
      // modes. Without this, a dialog opened there would mount and stay at opacity 0.
      const fallback = window.setTimeout(show, 50);
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
        window.clearTimeout(fallback);
      };
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setMounted(false), reduced ? 0 : exitMs);
    return () => window.clearTimeout(timer);
  }, [open, exitMs]);

  return { mounted, visible };
}

/**
 * The exit duration every overlay passes to usePresence. Must equal --motion-fast in
 * globals.css (the `[data-state="closed"]` transitions) — shorter cuts the fade off,
 * longer leaves an invisible overlay mounted and swallowing clicks.
 */
export const OVERLAY_EXIT_MS = 180;
