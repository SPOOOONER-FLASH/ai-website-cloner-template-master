"use client";

import { useScrollSpy } from "./useScrollSpy";
import styles from "./GuidePage.module.css";

/**
 * The guide's shape at a glance: one bar per section, as long as the section is (Yuangao
 * design 3's section bars, 2026-10-12 preview). Each is a link; the one being read is drawn
 * in ink. Without JavaScript they are plain in-page links.
 */
export function GuideSectionBars({ label, items }: { label: string; items: { id: string; text: string; share: number }[] }) {
  const { active } = useScrollSpy(items.map((item) => item.id));
  return (
    <nav className={styles.bars} aria-label={label}>
      {items.map((item, k) => (
        <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
          <span className={styles.barLabel}>{item.text}</span>
          <span className={styles.barTrack}>
            <span className={styles.barFill} style={{ width: `${Math.max(4, item.share * 100)}%`, animationDelay: `calc(var(--motion-fast) * ${k * 0.4})` }} />
          </span>
        </a>
      ))}
    </nav>
  );
}
