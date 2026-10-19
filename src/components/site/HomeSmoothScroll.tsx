"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smoothed wheel scrolling on the homepage only, as in the 2026-10-12 motion demo the client
 * compared it with (「为什么预览的这么好 线上不一样」). Lenis eases the wheel's steps; it scrolls the
 * window itself, so sticky positioning, IntersectionObserver and anchors keep working.
 *
 * Off for touch screens (their own scrolling is already smooth, and Lenis leaves touch alone
 * by default), for visitors who asked for reduced motion, and without JavaScript.
 */
export function HomeSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, anchors: true });
    let id = requestAnimationFrame(function frame(t) {
      lenis.raf(t);
      id = requestAnimationFrame(frame);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
  return null;
}
