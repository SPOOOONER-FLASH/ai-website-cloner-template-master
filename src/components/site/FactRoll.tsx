"use client";

import { useEffect, useRef, useState } from "react";
import { rollAt } from "@/lib/fact-roll";

/**
 * One counted figure in the SiteFacts strip — the only client code the strip ships.
 *
 * The server renders the strip and puts the TRUE value in this span's HTML; this island
 * only animates a number already on screen (see the long comment in SiteFacts.tsx for why
 * that rule is absolute). Every island observes the same `<section>` with the same
 * threshold, so the figures still start together and `index` staggers them left to right,
 * exactly as the single client component did before the 2026-09-28 split.
 *
 * Unchanged behaviour: no roll under `prefers-reduced-motion`, no roll if the strip is
 * already on screen at mount, nothing fades or hides. If the observer or rAF never runs
 * (hidden tab, throttled webview) the real value simply stays.
 */
export function FactRoll({
  value,
  countTo,
  index,
}: {
  value: string;
  countTo: number;
  index: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  /* null means "not rolling" — render the real value. */
  const [rolled, setRolled] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current?.closest("section");
    if (!node) return;

    let frame = 0;
    let settled = 0;
    let observer: IntersectionObserver | undefined;
    const start = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const { value: current, done } = rollAt(countTo, index, now - t0);
        setRolled(done ? null : current);
        if (!done) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    /* Deferred a frame so the position read happens after first layout. */
    settled = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      /* Already on screen: leave the correct value alone rather than flicker it to 0. */
      const box = node.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          start();
        },
        { threshold: 0.25 },
      );
      observer.observe(node);
    });

    return () => {
      observer?.disconnect();
      if (settled) cancelAnimationFrame(settled);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [countTo, index]);

  return <span ref={ref}>{rolled ?? value}</span>;
}
