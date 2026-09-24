"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { linkIntent, newDepths, pageType, readStyle } from "@/lib/engagement";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Reading depth, read style, product and contact clicks → GA4, GTM and Clarity.
 * Rules live in src/lib/engagement.ts; this file only listens.
 *
 * Each event goes to three places:
 *   gtag("event", …)        GA4 reports (the params need registering once as custom
 *                           dimensions — CLIENT-RUNBOOK.md)
 *   dataLayer.push({event}) so a GTM trigger can use it without any code change
 *   clarity("set", …)       read_style and page_type as Clarity tags, so recordings can
 *                           be filtered to "skim" or "read" — the client's actual question
 *
 * GA4 is loaded lazyOnload (Analytics.tsx), so gtag may not exist yet when the first depth
 * fires. Events wait in a small buffer and flush once it does, rather than being queued
 * ahead of gtag's own `config` call and dropped.
 */
type Params = Record<string, string | number>;
const buffer: Array<[string, Params]> = [];

function send(name: string, params: Params) {
  try {
    window.dataLayer?.push({ event: name, ...params });
    if (typeof window.gtag === "function") {
      while (buffer.length) {
        const [n, p] = buffer.shift()!;
        window.gtag("event", n, p);
      }
      window.gtag("event", name, params);
    } else if (buffer.length < 50) {
      buffer.push([name, params]);
    }
  } catch {
    // An ad blocker or a stubbed tag. Measurement must never break the page.
  }
}

function tagClarity(key: string, value: string) {
  try {
    window.clarity?.("set", key, value);
  } catch {
    /* same as above */
  }
}

export function EngagementTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const type = pageType(pathname);
    const reported = new Set<number>();
    let depth = 0;
    let seconds = 0;
    let secondsAt75: number | undefined;
    let sent = false;
    tagClarity("page_type", type);

    const measure = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const now = scrollable <= 0 ? 100 : Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100);
      if (now <= depth) return;
      depth = now;
      if (depth >= 75 && secondsAt75 === undefined) secondsAt75 = seconds;
      for (const d of newDepths(depth, reported)) {
        reported.add(d);
        send("scroll_depth", { percent: d, page_type: type });
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), measure()));
    };

    // Visible seconds only: a tab left open in the background is not reading.
    const clock = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds++;
      if (type === "article" && seconds === 60 && depth >= 50) tagClarity("read_style", "read");
    }, 1000);

    const finish = () => {
      if (sent || type !== "article") return;
      sent = true;
      const style = readStyle({ seconds, depth, secondsAt75 });
      tagClarity("read_style", style);
      send("article_read", { read_style: style, percent: depth, seconds, page_type: type });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") finish();
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href) return;
      const intent = linkIntent(href, pathname);
      if (intent) send(intent.name, intent.params);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", finish);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      finish(); // client-side navigation to the next page
      window.clearInterval(clock);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [pathname]);

  return null;
}
