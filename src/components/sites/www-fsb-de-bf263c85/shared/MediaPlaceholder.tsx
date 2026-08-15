import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  /** The ORIGINAL asset's aspect ratio, verbatim — e.g. "2880 / 1391", "1 / 1". */
  ratio: string;
  /** What occupies this slot, plus the ratio. e.g. "产品图 1:1". */
  label: string;
  className?: string;
}

/**
 * Stands in for every image, video and decorative graphic in the prototype.
 *
 * No asset is fetched from the layout reference. Each slot renders as a flat block at
 * the original aspect ratio so every module keeps its exact height and the page's
 * vertical rhythm is unchanged.
 *
 * COLOUR (rules 2–4): decorative scaffolding, so no brand red. Fill is --color-line,
 * label is --color-ink-secondary. Flat — no border, no shadow, no radius.
 */
export function MediaPlaceholder({ ratio, label, className }: MediaPlaceholderProps) {
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
