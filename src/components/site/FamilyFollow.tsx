"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./HomeMotion.module.css";

export interface FollowItem {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  model: string;
}

/**
 * Desktop only: the lead product of the family under the pointer follows the cursor.
 * It is a preview of the link, never the only place the picture or the name appears — the
 * row itself carries the family name and count, and on touch screens a thumbnail.
 */
export function FamilyFollow({ items }: { items: FollowItem[] }) {
  const anchor = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const host = anchor.current?.closest("section");
    if (!host || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.18;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      if (card.current) card.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>("[data-family]");
      tx = e.clientX + 32;
      ty = e.clientY - 150;
      if (!row) return setIndex(-1);
      setIndex((was) => {
        if (was < 0) { x = tx; y = ty; } // appear at the pointer, then follow it
        return Number(row.dataset.family);
      });
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => setIndex(-1);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  const item = index >= 0 ? items[index] : null;
  return (
    <>
      <span ref={anchor} hidden />
      <div ref={card} aria-hidden="true" className={cn(styles.follow, item && styles.followOn)}>
        {item && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- same responsive props as the row thumbnail */}
            <img key={index} src={item.src} srcSet={item.srcSet} sizes="320px" alt="" className={styles.followImage} />
            <span className={styles.followModel}>{item.model}</span>
          </>
        )}
      </div>
    </>
  );
}
