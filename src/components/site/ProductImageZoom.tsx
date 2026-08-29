"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, X } from "lucide-react";
import type { ImageRef } from "@/data/types";
import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "./MediaPlaceholder";

type ProductImageZoomProps = ImageRef & {
  priority?: boolean;
  className?: string;
};

/**
 * Product-only image inspection.
 *
 * The catalogue keeps its flat editorial layout until the visitor asks for detail.
 * Opening the control mounts the large image on demand, so 435 static product pages do
 * not preload a second copy of every photograph. The same button works with a mouse,
 * keyboard or touch; missing photography remains an honest placeholder.
 */
export function ProductImageZoom({
  src,
  ratio,
  label,
  priority,
  className,
}: ProductImageZoomProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  if (!src) {
    return (
      <MediaPlaceholder
        ratio={ratio}
        label={label}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Enlarge ${label}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative block w-full cursor-zoom-in overflow-hidden text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink",
          className,
        )}
      >
        <MediaPlaceholder
          src={src}
          ratio={ratio}
          label={label}
          priority={priority}
          className="transition-transform duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015] motion-reduce:transition-none"
        />
        <span className="absolute bottom-12 right-12 grid size-40 place-items-center border border-ink bg-surface text-ink shadow-[4px_4px_0_var(--color-line)] transition-transform duration-200 group-hover:-translate-x-2 group-hover:-translate-y-2 group-focus-visible:-translate-x-2 group-focus-visible:-translate-y-2 motion-reduce:transition-none">
          <ZoomIn aria-hidden="true" size={19} strokeWidth={1.5} />
          <span className="sr-only">Open large image</span>
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/92 p-16 sm:p-32"
          role="dialog"
          aria-modal="true"
          aria-label={`Large image: ${label}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close large image"
            onClick={() => setOpen(false)}
            className="absolute right-16 top-16 grid size-48 place-items-center border border-surface bg-ink text-surface outline-offset-4 hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-surface sm:right-32 sm:top-24"
          >
            <X aria-hidden="true" size={26} strokeWidth={1.25} />
          </button>
          {/* Mounted only after interaction; this request does not compete with LCP. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={label}
            loading="eager"
            decoding="async"
            className="max-h-[86vh] max-w-[94vw] object-contain"
          />
        </div>
      ) : null}
    </>
  );
}
