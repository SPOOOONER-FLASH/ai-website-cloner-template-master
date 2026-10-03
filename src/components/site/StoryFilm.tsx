"use client";

import { useEffect, useRef, useState } from "react";
import { shouldConserveBandwidth } from "@/lib/carousel";

interface StoryFilmProps {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** What the film shows, for a screen reader — the film has no sound and no words of its own. */
  label: string;
}

/**
 * The one moving thing on a story page: a silent single-take film that loops.
 *
 * FSB's 1138 page moves in exactly one place, its hero film, and everything under it is
 * still. That restraint is the point, so this component does one job and nothing else.
 *
 * It does not autoplay when the visitor asks for reduced motion or is saving data; the
 * poster (the film's last frame, the whole product at rest) stands in. When it does play,
 * a pause button is always present, because looping motion that cannot be stopped fails
 * WCAG 2.2.2.
 */
export function StoryFilm({
  src,
  poster,
  width,
  height,
  label,
}: StoryFilmProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const stoppedByVisitor = useRef(false);
  const [playing, setPlaying] = useState(false);

  /*
    Plays only while on screen. On the home page the film sits below the fold, and with
    preload="none" nothing is downloaded until the visitor scrolls to it. A visitor who
    pressed pause is not overruled by scrolling back.
  */
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (motion.matches || shouldConserveBandwidth(connection)) return;
    // Playing is reported back through onPlay/onPause, so no state is set here.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stoppedByVisitor.current) video.play().catch(() => undefined);
        else if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    stoppedByVisitor.current = !video.paused;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <div className="relative bg-surface-alt">
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block h-auto w-full"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-16 left-16 bg-surface/85 px-12 py-8 text-c2 text-ink backdrop-blur-[2px] hover:bg-surface"
      >
        {playing ? "Pause film" : "Play film"}
      </button>
    </div>
  );
}
