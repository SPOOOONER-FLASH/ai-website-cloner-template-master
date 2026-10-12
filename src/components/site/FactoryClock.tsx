"use client";

import { useEffect, useState } from "react";

/** The factory's local time (Asia/Shanghai). A static export cannot know it, so the HTML
 *  carries a dash and the island fills it in; the label beside it says GMT+8 either way. */
export function FactoryClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Shanghai", hour12: false }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time ?? "—"}</span>;
}
