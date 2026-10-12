"use client";

import { useEffect, useRef } from "react";

/**
 * Two jobs for its parent section, nothing else.
 *
 * 1. Arms the entrance (data-armed) and fires it (data-inview). The section is complete as
 *    rendered: routes drawn, pins placed, bars at length. This only takes them back to their
 *    start state when ALL of these hold: the visitor has not asked for reduced motion,
 *    JavaScript is running, and the section is still below the fold. Then it plays them
 *    forward once when the section arrives. Two triggers, on purpose: SiteFacts once shipped
 *    figures stuck at opacity 0 because an IntersectionObserver did not deliver in a hidden
 *    document; the scroll check is the second way in, so a missed callback costs an
 *    animation, never content.
 *
 * 2. Pauses the section's SVG (SMIL) animations while it is off screen, so the looping route
 *    markers cost nothing while the visitor reads the rest of the page.
 */
export function MotionArm() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const svgs = [...host.querySelectorAll("svg")];
    const io = new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting);
      for (const svg of svgs) {
        if (on) svg.unpauseAnimations();
        else svg.pauseAnimations();
      }
    });
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (host.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    host.setAttribute("data-armed", "true");
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && fire(), {
      rootMargin: "0px 0px -20% 0px",
    });
    function stop() {
      io.disconnect();
      window.removeEventListener("scroll", check);
    }
    function fire() {
      host!.setAttribute("data-inview", "true");
      stop();
    }
    function check() {
      if (host!.getBoundingClientRect().top < window.innerHeight * 0.8) fire();
    }
    io.observe(host);
    window.addEventListener("scroll", check, { passive: true });
    return stop;
  }, []);

  return <span ref={ref} hidden />;
}
