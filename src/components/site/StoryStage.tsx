"use client";

import { useEffect, useRef } from "react";

/**
 * Drives the factory-story stage, two ways:
 *
 * 1. Which photograph is showing: the last step whose text has reached the middle of the
 *    screen. Every shot is marked `data-shot` = past / on / next, and the CSS wipes the next
 *    one in with a slight push (the 2026-10-12 demo's wipe, which the client asked for by
 *    screen recording). Read from positions on each frame rather than from an
 *    IntersectionObserver band, which a fast wheel flick or a jump to an anchor can step over.
 * 2. How far through the story the reader is: `--story-p` (0–1) on the stage, updated once a
 *    frame while the section is on screen, so each progress bar fills with the scroll rather
 *    than jumping when the step changes.
 *
 * The server renders the first shot "on", so without this island the stage shows the first
 * photograph and the steps read as a list beside it.
 */
export function StoryStage() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const section = ref.current?.closest("section");
    const stage = section?.querySelector<HTMLElement>("[data-stage]");
    const steps = section ? [...section.querySelectorAll<HTMLElement>("[data-step]")] : [];
    const shots = stage ? [...stage.querySelectorAll<HTMLElement>("[data-shot]")] : [];
    if (!section || !stage || !steps.length) return;

    let shown = -1;
    const show = (active: number) => {
      if (active === shown) return;
      shown = active;
      shots.forEach((shot, k) => shot.setAttribute("data-shot", k < active ? "past" : k === active ? "on" : "next"));
    };

    let frame = 0;
    const measure = () => {
      frame = 0;
      // Every read before any write, so one frame costs one layout.
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      const middle = window.innerHeight / 2;
      const active = Math.max(0, steps.filter((step) => step.getBoundingClientRect().top < middle).length - 1);
      stage.style.setProperty("--story-p", p.toFixed(4));
      show(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const near = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else window.removeEventListener("scroll", onScroll);
    });
    near.observe(section);

    return () => {
      near.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <span ref={ref} hidden />;
}
