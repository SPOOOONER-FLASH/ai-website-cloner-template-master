"use client";

import { useEffect, useRef } from "react";

/**
 * Tells the factory-story stage which step is in the middle of the screen (data-active).
 * The server renders step 0 active, so without this island the stage simply shows the first
 * photograph and the steps read as a list beside it.
 */
export function StoryStage() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const section = ref.current?.closest("section");
    const stage = section?.querySelector<HTMLElement>("[data-stage]");
    const steps = section ? [...section.querySelectorAll<HTMLElement>("[data-step]")] : [];
    if (!stage || !steps.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) stage.dataset.active = (e.target as HTMLElement).dataset.step;
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
