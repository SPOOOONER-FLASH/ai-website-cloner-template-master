"use client";

import { useEffect, useState } from "react";

const EXIT_MS = 180;

/** Keep a closed overlay mounted just long enough for its exit transition. */
export function useOverlayPresence(open: boolean) {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    let timeout = 0;

    if (open) {
      if (!rendered) {
        frame = window.requestAnimationFrame(() => setRendered(true));
      } else {
        frame = window.requestAnimationFrame(() => setVisible(true));
      }
    } else if (rendered) {
      frame = window.requestAnimationFrame(() => setVisible(false));
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      timeout = window.setTimeout(() => setRendered(false), reducedMotion ? 0 : EXIT_MS);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [open, rendered]);

  return { rendered, visible: open && visible };
}
