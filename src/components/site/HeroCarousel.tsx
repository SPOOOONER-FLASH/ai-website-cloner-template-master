"use client";

import type { FocusEvent, PointerEvent, TransitionEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLink } from "@/components/site/ArrowLink";
import { cn } from "@/lib/utils";
import {
  getNextSlideIndex,
  getRenderedSlideIndexes,
  shouldConserveBandwidth,
  shouldAutoplay,
} from "@/lib/carousel";
import type { HeroCarouselContent } from "@/types/fsb-modules";
import { getResponsiveEditorialImageProps } from "./editorial-images";

interface HeroCarouselProps {
  content: HeroCarouselContent;
}

const STAGE_DELAY_MS = 3000;
const DISPLAY_INTERVAL_MS = 6000;
const TRANSITION_SAFETY_MS = 2000;

export function HeroCarousel({ content }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [conserveData, setConserveData] = useState(false);
  const [stagedIndex, setStagedIndex] = useState<number | null>(null);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [activeReady, setActiveReady] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const loadedIndexes = useRef(new Set<number>());
  const pendingTarget = useRef<number | null>(null);
  const transitionInProgress = useRef(false);
  const activationFrames = useRef<number[]>([]);
  const stageTimer = useRef<number | null>(null);
  const advanceTimer = useRef<number | null>(null);
  const transitionFallbackTimer = useRef<number | null>(null);
  const slideCount = content.slides.length;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setDocumentHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          effectiveType?: string;
          addEventListener?: (type: "change", listener: () => void) => void;
          removeEventListener?: (type: "change", listener: () => void) => void;
        };
      }
    ).connection;
    const sync = () => setConserveData(shouldConserveBandwidth(connection));

    sync();
    connection?.addEventListener?.("change", sync);
    return () => connection?.removeEventListener?.("change", sync);
  }, []);

  const cancelActivationFrames = useCallback(() => {
    for (const frame of activationFrames.current) {
      window.cancelAnimationFrame(frame);
    }
    activationFrames.current = [];
  }, []);

  useEffect(() => cancelActivationFrames, [cancelActivationFrames]);

  const clearAutoplayTimers = useCallback(() => {
    if (stageTimer.current !== null) window.clearTimeout(stageTimer.current);
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    stageTimer.current = null;
    advanceTimer.current = null;
  }, []);

  const finishTransition = useCallback(() => {
    if (transitionFallbackTimer.current !== null) {
      window.clearTimeout(transitionFallbackTimer.current);
      transitionFallbackTimer.current = null;
    }
    setLeavingIndex(null);
    transitionInProgress.current = false;
  }, []);

  useEffect(
    () => () => {
      if (transitionFallbackTimer.current !== null) {
        window.clearTimeout(transitionFallbackTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    // A live OS preference change cancels CSS transitions. Complete the state
    // change explicitly because cancelled transitions do not reliably emit
    // `transitionend` in every browser.
    if (!reducedMotion || (leavingIndex === null && !transitionInProgress.current)) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      cancelActivationFrames();
      setStagedIndex(null);
      pendingTarget.current = null;
      finishTransition();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [cancelActivationFrames, finishTransition, leavingIndex, reducedMotion]);

  const beginTransition = useCallback(
    (targetIndex: number) => {
      if (
        transitionInProgress.current ||
        targetIndex === activeIndex ||
        targetIndex < 0 ||
        targetIndex >= slideCount
      ) {
        return;
      }

      transitionInProgress.current = true;
      pendingTarget.current = null;
      setStagedIndex(null);
      setActiveReady(loadedIndexes.current.has(targetIndex));

      if (reducedMotion) {
        setLeavingIndex(null);
        setActiveIndex(targetIndex);
        transitionInProgress.current = false;
        return;
      }

      setLeavingIndex(activeIndex);
      setActiveIndex(targetIndex);
      transitionFallbackTimer.current = window.setTimeout(
        finishTransition,
        TRANSITION_SAFETY_MS,
      );
    },
    [activeIndex, finishTransition, reducedMotion, slideCount],
  );

  const activateStagedSlide = useCallback(
    (targetIndex: number) => {
      cancelActivationFrames();
      const firstFrame = window.requestAnimationFrame(() => {
        const secondFrame = window.requestAnimationFrame(() => {
          activationFrames.current = [];
          beginTransition(targetIndex);
        });
        activationFrames.current.push(secondFrame);
      });
      activationFrames.current.push(firstFrame);
    },
    [beginTransition, cancelActivationFrames],
  );

  const markSlideLoaded = useCallback(
    (index: number) => {
      loadedIndexes.current.add(index);
      if (index === activeIndex) setActiveReady(true);
      if (pendingTarget.current === index) activateStagedSlide(index);
    },
    [activeIndex, activateStagedSlide],
  );

  useEffect(() => {
    if (
      !activeReady ||
      leavingIndex !== null ||
      !shouldAutoplay({
        isHovered: hovered,
        isFocused: focusWithin,
        isDocumentHidden: documentHidden,
        reducedMotion,
        conserveData,
      }) ||
      slideCount < 2
    ) {
      return;
    }

    const targetIndex = getNextSlideIndex(activeIndex, slideCount, 1);
    stageTimer.current = window.setTimeout(() => {
      setStagedIndex(targetIndex);
    }, STAGE_DELAY_MS);
    advanceTimer.current = window.setTimeout(() => {
      pendingTarget.current = targetIndex;
      setStagedIndex(targetIndex);
      if (loadedIndexes.current.has(targetIndex)) {
        activateStagedSlide(targetIndex);
      }
    }, DISPLAY_INTERVAL_MS);

    return clearAutoplayTimers;
  }, [
    activeIndex,
    activeReady,
    activateStagedSlide,
    clearAutoplayTimers,
    conserveData,
    documentHidden,
    focusWithin,
    hovered,
    leavingIndex,
    reducedMotion,
    slideCount,
  ]);

  const requestSlide = (delta: number) => {
    if (slideCount < 2 || transitionInProgress.current) return;
    clearAutoplayTimers();
    const targetIndex = getNextSlideIndex(activeIndex, slideCount, delta);
    pendingTarget.current = targetIndex;
    setStagedIndex(targetIndex);
    if (loadedIndexes.current.has(targetIndex)) {
      activateStagedSlide(targetIndex);
    }
  };

  const previous = () => requestSlide(-1);
  const next = () => requestSlide(1);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusWithin(false);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 48) return;
    if (distance > 0) previous();
    else next();
  };

  const handleSlideTransitionEnd = (
    index: number,
    event: TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      index !== leavingIndex ||
      event.target !== event.currentTarget ||
      event.propertyName !== "opacity"
    ) {
      return;
    }

    finishTransition();
  };

  const activeSlide = content.slides[activeIndex];
  const renderedIndexes = getRenderedSlideIndexes({
    activeIndex,
    stagedIndex,
    leavingIndex,
    slideCount,
  });

  return (
    /*
      `layout` is load-bearing and was missing.

      This section previously carried `col-outset`, but its parent `.modules` is not a
      grid — it only manages vertical rhythm — so the band class resolved to nothing and
      the carousel ran edge to edge, caption included. Establishing the grid here puts
      both the image and the caption on the content band, which is where every other
      module on the page sits and which gives the hero the margins the reference has.
    */
    <section
      aria-label={content.ariaLabel}
      aria-roledescription="carousel"
      className="layout"
      onBlur={handleBlur}
      onFocus={() => setFocusWithin(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="col-content relative aspect-[4/3] touch-pan-y overflow-hidden bg-surface-alt sm:aspect-[1920/754]"
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
        }}
        onPointerUp={handlePointerUp}
      >
        {renderedIndexes.map((index) => {
          const slide = content.slides[index];
          const responsive = slide.media.src
            ? getResponsiveEditorialImageProps(
                slide.media.src,
                // Below `sm` the frame is 4:3 while the source is ~2.55:1. The
                // object-cover crop therefore needs ~1.9x the frame width to
                // avoid upscaling the source vertically on phones.
                "(min-width: 1440px) 1376px, (min-width: 640px) 96vw, 184vw",
              )
            : null;
          const isInitialLcp =
            index === 0 && activeIndex === 0 && leavingIndex === null;

          return (
            <div
              aria-hidden={index !== activeIndex}
              data-active={index === activeIndex}
              // Timing, easing and the scale settle live in globals.css (.hero-slide).
              // Staging the incoming frame for one paint preserves a true crossfade.
              className={cn(
                "hero-slide absolute inset-0",
                index === activeIndex && "z-[1]",
              )}
              key={`${slide.title}-${index}`}
              onTransitionCancel={(event) =>
                handleSlideTransitionEnd(index, event)
              }
              onTransitionEnd={(event) => handleSlideTransitionEnd(index, event)}
            >
              {responsive ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  {...responsive}
                  alt={slide.media.label}
                  className="absolute inset-0 h-full w-full object-cover"
                  decoding="async"
                  fetchPriority={isInitialLcp ? "high" : "auto"}
                  loading={isInitialLcp ? "eager" : "lazy"}
                  onLoad={() => markSlideLoaded(index)}
                  ref={(element) => {
                    if (element?.complete && element.naturalWidth > 0) {
                      markSlideLoaded(index);
                    }
                  }}
                />
              ) : null}
            </div>
          );
        })}

        {/*
          Manual controls removed on request: the strip of arrows and dots read as
          clutter against a full-bleed image. The carousel now advances on its own.
          Autoplay still pauses on hover, on focus, when the tab is hidden, and under
          prefers-reduced-motion — so it is not a trap for anyone reading the caption.
        */}
      </div>

      <div aria-live="polite" className="col-content grid w-full grid-cols gap-x pb-32 pt-16 md:pb-48 md:pt-24">
        <div className="col-span-full grid grid-cols-subgrid gap-x gap-y-16">
          <div className="col-span-full md:col-span-5 xl:col-span-6">
            <h2 className="text-heading-3 font-semibold">{activeSlide.title}</h2>
            <p className="mt-4 max-w-[36rem] text-copy">{activeSlide.body}</p>
          </div>
          <div className="col-span-full md:[grid-column:span_3/-1] xl:[grid-column:span_6/-1]">
            <ArrowLink href={activeSlide.href} prefetch={false}>
              {activeSlide.linkLabel}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
