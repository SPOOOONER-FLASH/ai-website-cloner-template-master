"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { X } from "lucide-react";
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
  const inspectionHintId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function moveZoomOrigin(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    const image = event.currentTarget.querySelector<HTMLElement>(".product-pointer-zoom");
    image?.style.setProperty("--product-zoom-x", `${x}%`);
    image?.style.setProperty("--product-zoom-y", `${y}%`);
  }

  function resetZoomOrigin(event: ReactPointerEvent<HTMLButtonElement>) {
    const image = event.currentTarget.querySelector<HTMLElement>(".product-pointer-zoom");
    image?.style.setProperty("--product-zoom-x", "50%");
    image?.style.setProperty("--product-zoom-y", "50%");
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
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
        aria-describedby={inspectionHintId}
        onClick={() => setOpen(true)}
        onPointerMove={moveZoomOrigin}
        onPointerLeave={resetZoomOrigin}
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
          className="product-pointer-zoom"
        />
        <span id={inspectionHintId} className="sr-only">
          Move across the image to inspect details. Activate to open the full image.
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
