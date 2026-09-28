"use client";

import { useEffect, useState } from "react";

const EXIT_MS = 180;
/* If the browser withholds animation frames (a background tab, some embedded webviews,
   screenshot tools), the entrance still completes on this timer. */
const FRAME_FALLBACK_MS = 50;

/**
 * Keep a closed overlay mounted just long enough for its exit transition.
 *
 * `rendered` is true from the same render that opens the overlay: mounting never waits on
 * requestAnimationFrame. Until 2026-09-28 it did, and in a pane where rAF never fired the
 * menu drawer simply did not open (aria-expanded="true", nothing in the DOM). Only the
 * closed→open class flip waits a frame (so the entrance transition has a start state), and
 * even that has a timer fallback.
 */
export function useOverlayPresence(open: boolean) {
  const [lingering, setLingering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [previousOpen, setPreviousOpen] = useState(open);

  // Adjust state while rendering when `open` flips (React's recommended alternative to a
  // synchronous setState inside an effect).
  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (open) setLingering(true);
    else setVisible(false);
  }

  useEffect(() => {
    if (open) {
      let done = false;
      const show = () => {
        if (done) return;
        done = true;
        setVisible(true);
      };
      const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(show));
      const timer = window.setTimeout(show, FRAME_FALLBACK_MS);
      return () => {
        done = true;
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setLingering(false), reducedMotion ? 0 : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  return { rendered: open || lingering, visible: open && visible };
}
