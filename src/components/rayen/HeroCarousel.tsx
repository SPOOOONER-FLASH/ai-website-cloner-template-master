"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The rotating photograph behind the RAYEN home page headline.
 *
 * Client instruction, 2026-09-13: 「首页的做一个轮播图」.
 *
 * WHAT ROTATES, AND WHAT DOES NOT
 * Only the photograph. The headline, the positioning sentence and the two buttons stay put.
 *
 * That is the whole design decision here and it is worth stating plainly: a carousel that
 * swaps the h1 every six seconds means a reader who looks up mid-sentence has lost the
 * sentence, and the one claim the page most needs to land is the one it keeps taking away.
 * Rotating the picture underneath a fixed statement gives the movement the client asked for
 * and costs the reader nothing — the text is still there the whole time, and every frame is
 * evidence for the same claim rather than a different claim.
 *
 * WHY NOT REUSE src/components/site/HeroCarousel.tsx
 * That one is HYDE's: it reads HeroCarouselContent, pulls responsive sources through
 * editorial-images.ts, and carries bandwidth heuristics for a much heavier set of assets.
 * src/data/rayen.ts exists precisely so the Chinese site does not import HYDE's data layer —
 * borrowing the component would drag that boundary back across. This is forty lines of the
 * same idea over RAYEN's own photographs.
 *
 * WHAT IT REFUSES TO DO
 *   · No autoplay when the reader has asked for reduced motion — they get the first frame
 *     and the dots, which is a complete experience, not a degraded one.
 *   · No advancing while the tab is hidden, hovered, or focused inside. A carousel that
 *     moves on while somebody is reaching for a button moves the button.
 *   · No layout shift: every frame is stacked in the same box and cross-faded, so nothing
 *     below the fold ever jumps.
 *   · Slide one is rendered into the static HTML as a normal <img> with fetchPriority high,
 *     so the export shows a complete hero before any JavaScript runs at all — the page has
 *     to work for a buyer on a slow connection in a factory office.
 */

export type HeroSlide = { src: string; alt: string };

const INTERVAL_MS = 6000;

export function HeroCarousel({ slides, label }: { slides: HeroSlide[]; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    stop();
    if (paused || reducedMotion || slides.length < 2) return;
    timer.current = window.setInterval(
      () => setActive((index) => (index + 1) % slides.length),
      INTERVAL_MS,
    );
    return stop;
  }, [paused, reducedMotion, slides.length, stop]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        /* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */
        <img
          key={slide.src}
          src={slide.src}
          alt={index === 0 ? slide.alt : ""}
          aria-hidden={index === 0 ? undefined : true}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            index === active ? "opacity-90" : "opacity-0"
          }`}
          /* Only the first frame is worth the connection before the page is readable. */
          fetchPriority={index === 0 ? "high" : "low"}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}

      {slides.length > 1 ? (
        <div
          className="absolute bottom-5 right-5 z-10 flex gap-2 md:bottom-7 md:right-7"
          role="tablist"
          aria-label={label}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={slide.alt}
              onClick={() => setActive(index)}
              className={`h-1.5 w-7 rounded-full transition-colors ${
                index === active ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
