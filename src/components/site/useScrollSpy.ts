"use client";

import { useEffect, useState } from "react";

/**
 * Which of `ids` was last to pass `line` (a fraction of the viewport height from the top),
 * and how far the reader is through `progressId` (0–1). Read from positions once a frame
 * while scrolling: an IntersectionObserver band can be jumped over by a fast flick or an
 * anchor jump, and then the highlight stays on the wrong section.
 */
export function useScrollSpy(ids: string[], line = 0.3, progressId?: string) {
  const [active, setActive] = useState(ids[0] ?? "");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const y = window.innerHeight * line;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < y) current = id;
      }
      setActive(current);
      const target = progressId ? document.getElementById(progressId) : null;
      if (target) {
        const r = target.getBoundingClientRect();
        setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / Math.max(1, r.height))));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids, line, progressId]);
  return { active, progress };
}
