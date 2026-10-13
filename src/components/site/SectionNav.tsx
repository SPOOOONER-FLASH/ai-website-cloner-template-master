"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProductPage.module.css";

/**
 * The bar that stays under the site header on a long page and says where the reader is —
 * from the 2026-10-12 product-page preview (Yuangao design 2's scroll-spy pill nav), which
 * the client approved. The underline slides to the section nearest the top third of the
 * screen. Without JavaScript it is a plain row of in-page links.
 */
export function SectionNav({
  label,
  items,
  lead,
  action,
}: {
  label: string;
  items: { id: string; label: string }[];
  lead?: string;
  action?: { href: string; label: string };
}) {
  const [active, setActive] = useState(items[0]?.id);
  const row = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  /*
    Sit flush under the site header. Its height is not a token (--h-main-nav also counts the
    event banner, which scrolls away), so it is measured and published as --sticky-header,
    which the chapter headings and anchor offsets read too.
  */
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("body .sticky.top-0");
    if (!header) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--sticky-header", `${header.getBoundingClientRect().height}px`);
    const ro = new ResizeObserver(publish);
    ro.observe(header);
    publish();
    return () => {
      ro.disconnect();
      root.style.removeProperty("--sticky-header");
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top < line) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  useEffect(() => {
    const link = row.current?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!link || !bar.current) return;
    bar.current.style.setProperty("--x", `${link.offsetLeft}px`);
    bar.current.style.setProperty("--w", `${link.offsetWidth}px`);
    // Scroll only the bar sideways (phones): scrollIntoView would also move the page.
    const r = row.current;
    if (r && (link.offsetLeft < r.scrollLeft || link.offsetLeft + link.offsetWidth > r.scrollLeft + r.clientWidth)) {
      r.scrollTo({ left: link.offsetLeft - 24 });
    }
  }, [active]);

  return (
    <nav className={`layout ${styles.sectionNav}`} aria-label={label}>
      <div className={`col-content ${styles.sectionRow}`} ref={row}>
        {lead ? <span className={styles.sectionLead}>{lead}</span> : null}
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
            {item.label}
          </a>
        ))}
        <span ref={bar} className={styles.sectionBar} aria-hidden="true" />
        {action ? (
          <a className={styles.sectionAction} href={action.href}>
            {action.label}
          </a>
        ) : null}
      </div>
    </nav>
  );
}
