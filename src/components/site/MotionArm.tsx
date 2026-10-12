"use client";

import { useEffect, useRef } from "react";

/**
 * Arms its parent section's entrance (data-armed) and fires it (data-inview) — nothing else.
 *
 * The section is complete as rendered: routes drawn, pins placed, bars at length. This only
 * takes them back to their start state when ALL of these hold: the visitor has not asked
 * for reduced motion, JavaScript is running, and the section is still below the fold. Then
 * it plays them forward once when the section arrives.
 *
 * Two triggers, on purpose. SiteFacts once shipped figures stuck at opacity 0 because an
 * IntersectionObserver did not deliver in a hidden document; the scroll check is the second
 * way in, so a missed observer callback costs an animation, never content.
 */
export function MotionArm() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (host.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    host.dataset.armed = "true";
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && fire(), {
      rootMargin: "0px 0px -20% 0px",
    });
    function stop() {
      io.disconnect();
      window.removeEventListener("scroll", check);
    }
    function fire() {
      host!.dataset.inview = "true";
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
