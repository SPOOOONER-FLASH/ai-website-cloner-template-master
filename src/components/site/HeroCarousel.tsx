"use client";

import Image from "next/image";
import type { FocusEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLink } from "@/components/site/ArrowLink";
import { ArrowRightIcon } from "@/components/site/icons";
import { cn } from "@/lib/utils";
import { getNextSlideIndex, shouldAutoplay } from "@/lib/carousel";
import type { HeroCarouselContent } from "@/types/fsb-modules";

interface HeroCarouselProps {
  content: HeroCarouselContent;
}

export function HeroCarousel({ content }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<number | null>(null);
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
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!shouldAutoplay({ isHovered: hovered, isFocused: focusWithin, isDocumentHidden: documentHidden, reducedMotion }) || slideCount < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => getNextSlideIndex(current, slideCount, 1));
    }, 6000);
    return () => window.clearInterval(timer);
  }, [documentHidden, focusWithin, hovered, reducedMotion, slideCount]);

  const previous = () => setActiveIndex((current) => getNextSlideIndex(current, slideCount, -1));
  const next = () => setActiveIndex((current) => getNextSlideIndex(current, slideCount, 1));

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

  const activeSlide = content.slides[activeIndex];

  return (
    <section
      aria-label={content.ariaLabel}
      aria-roledescription="carousel"
      className="col-outset"
      onBlur={handleBlur}
      onFocus={() => setFocusWithin(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative aspect-[1920/754] touch-pan-y overflow-hidden bg-surface-alt"
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
        }}
        onPointerUp={handlePointerUp}
      >
        {content.slides.map((slide, index) => (
          <div
            aria-hidden={index !== activeIndex}
            className={cn(
              // 240ms — the agreed ceiling for the motion system. Was 700ms, which read
              // as a slideshow dissolve rather than the restrained crossfade specified.
              "absolute inset-0 transition-[opacity,transform] duration-[var(--motion-medium)] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
              index === activeIndex
                ? "z-[1] translate-x-0 opacity-100"
                : "pointer-events-none translate-x-8 opacity-0",
            )}
            key={`${slide.title}-${index}`}
          >
            {slide.media.src ? (
              <Image
                alt={slide.media.label}
                className="object-cover"
                fill
                priority={index === 0}
                sizes="100vw"
                src={slide.media.src}
              />
            ) : null}
          </div>
        ))}

        {slideCount > 1 ? (
          <div className="absolute bottom-0 right-0 z-[2] flex h-48 items-center border-l border-t border-line bg-surface/95">
            <button
              aria-label="Previous slide"
              className="flex h-48 w-48 items-center justify-center border-r border-line text-ink hover:bg-ink hover:text-surface"
              onClick={previous}
              type="button"
            >
              <ArrowRightIcon className="h-16 w-16 rotate-180" />
            </button>
            <div className="flex h-48 items-center gap-10 px-16" role="tablist" aria-label="Select slide">
              {content.slides.map((slide, index) => (
                <button
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-selected={index === activeIndex}
                  className={cn(
                    "h-8 w-8 border border-ink transition-colors",
                    index === activeIndex ? "bg-brand" : "bg-surface",
                  )}
                  key={slide.title}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  type="button"
                />
              ))}
            </div>
            <button
              aria-label="Next slide"
              className="flex h-48 w-48 items-center justify-center border-l border-line text-ink hover:bg-ink hover:text-surface"
              onClick={next}
              type="button"
            >
              <ArrowRightIcon className="h-16 w-16" />
            </button>
          </div>
        ) : null}
      </div>

      <div aria-live="polite" className="col-content grid w-full grid-cols gap-x pb-32 pt-16 md:pb-48 md:pt-24">
        <div className="col-span-full grid grid-cols-subgrid gap-x gap-y-16">
          <div className="col-span-full md:col-span-5 xl:col-span-6">
            <h2 className="text-heading-3 font-semibold">{activeSlide.title}</h2>
            <p className="mt-4 max-w-[36rem] text-copy">{activeSlide.body}</p>
          </div>
          <div className="col-span-full md:[grid-column:span_3/-1] xl:[grid-column:span_6/-1]">
            <ArrowLink href={activeSlide.href}>{activeSlide.linkLabel}</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
