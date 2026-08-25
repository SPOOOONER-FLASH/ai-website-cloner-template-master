import { cn } from "@/lib/utils";
import { getResponsiveEditorialImageProps } from "./editorial-images";

interface MediaPlaceholderProps {
  /** Aspect ratio, CSS syntax — e.g. "2880 / 1391", "1 / 1". Reserves the space either way. */
  ratio: string;
  /** Alt text when `src` is set; placeholder caption when it is not. */
  label: string;
  /** Path under /public. When present the photo renders and the placeholder disappears. */
  src?: string;
  /** Browser layout hint used with the curated editorial srcset. */
  sizes?: string;
  className?: string;
  /**
   * Set on images that are above the fold.
   *
   *  is right for a 20-card grid and wrong for its first row: the
   * browser has to finish layout before it knows those images are in view, so the
   * request that should start first starts last. Eager + high fetchpriority puts them in
   * the queue alongside the stylesheet instead. Use it on a handful of images only —
   * marking everything priority is the same as marking nothing.
   */
  priority?: boolean;
}

/**
 * One image slot, in one of two states.
 *
 * `src` set    → renders the photo, cropped to `ratio` with object-fit: cover.
 * `src` absent → renders a flat labelled block at the same aspect ratio.
 *
 * The two states occupy identical space, so a page can be built and reviewed before
 * its photography exists and nothing shifts when the photo arrives. That is the whole
 * point of `ImageRef.src` being optional.
 *
 * COLOUR (rules 2–4): the placeholder is decorative scaffolding — fill --color-line,
 * label --color-ink-secondary, never brand red. Flat: no border, no shadow, no radius.
 *
 * A plain <img> rather than next/image: the build is a static export with
 * `images.unoptimized: true`, so next/image would add markup without optimising
 * anything. Files are sized and compressed at download time instead — see
 * scripts/download-homepage-images.mjs.
 */
export function MediaPlaceholder({
  ratio,
  label,
  src,
  sizes,
  className,
  priority,
}: MediaPlaceholderProps) {
  if (src) {
    const responsive = getResponsiveEditorialImageProps(src, sizes);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...responsive}
        alt={label}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={cn("w-full object-cover", className)}
        style={{ aspectRatio: ratio }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex w-full items-center justify-center bg-line p-8 text-center text-c2 text-ink-secondary",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {label}
    </div>
  );
}
