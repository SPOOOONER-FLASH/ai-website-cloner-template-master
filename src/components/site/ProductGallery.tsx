"use client";

import { Children, useState } from "react";
import type { ReactNode } from "react";
import styles from "./ProductPage.module.css";

/**
 * One stage for every view of a product, with a counter, arrows and a thumbnail strip.
 * From the 2026-10-12 product-page preview (Yuangao design 2's buy-box gallery with design
 * 4's "01 / 08" counter), which the client approved: 「就用这个指南和产品页效果」.
 *
 * It replaced a grid in which every view sat at once, most of them small and below the
 * fold — on the 307, eight of ten photographs were never seen. The views themselves are
 * still the server-rendered ProductImageZoom buttons (so the pointer magnifier and the
 * full-size dialog are unchanged) and all of them stay in the HTML; this only decides which
 * one is in front. Without JavaScript the first view shows, as the server rendered it.
 */
export function ProductGallery({
  children,
  thumbnails,
  labels,
}: {
  children: ReactNode;
  thumbnails: ReactNode[];
  /** `show` carries "{n}" for the view number: a server component cannot pass a function. */
  labels: { views: string; previous: string; next: string; show: string };
}) {
  const views = Children.toArray(children);
  const [active, setActive] = useState(0);
  const count = views.length;
  const go = (step: number) => setActive((k) => (k + step + count) % count);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <div className={styles.stage}>
        {views.map((view, k) => (
          <div key={k} className={styles.view} data-active={k === active} inert={k !== active} aria-hidden={k !== active}>
            {view}
          </div>
        ))}
        {count > 1 ? (
          <>
            <p className={styles.counter} aria-live="polite">
              <b>{pad(active + 1)}</b> / {pad(count)}
            </p>
            <div className={styles.arrows}>
              <button type="button" onClick={() => go(-1)} aria-label={labels.previous}>←</button>
              <button type="button" onClick={() => go(1)} aria-label={labels.next}>→</button>
            </div>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className={styles.thumbs} role="group" aria-label={labels.views}>
          {thumbnails.map((thumb, k) => (
            <button
              key={k}
              type="button"
              aria-label={labels.show.replace("{n}", String(k + 1))}
              aria-pressed={k === active}
              onClick={() => setActive(k)}
              className={styles.thumb}
            >
              {thumb}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
