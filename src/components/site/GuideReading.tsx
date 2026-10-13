"use client";

import { useScrollSpy } from "./useScrollSpy";
import styles from "./GuidePage.module.css";

const NONE: string[] = [];

/**
 * The guide's reading progress: a hairline across the top of the window measured on the
 * article body only (not the footer), and a small "about N min left" note once reading has
 * started. Yuangao design 4's reading progress, from the 2026-10-12 preview the client
 * approved. `labels.left` carries "{n}".
 */
export function GuideReading({ targetId, minutes, labels }: { targetId: string; minutes: number; labels: { left: string; nearly: string } }) {
  const { progress } = useScrollSpy(NONE, 0.3, targetId);
  const left = Math.max(0, Math.round(minutes * (1 - progress)));
  const show = progress > 0.03 && progress < 0.98;
  return (
    <>
      <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <p className={styles.left} data-show={show} aria-hidden="true">
        {left ? labels.left.replace("{n}", String(left)) : labels.nearly}
      </p>
    </>
  );
}
