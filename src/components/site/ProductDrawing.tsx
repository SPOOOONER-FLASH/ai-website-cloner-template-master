import drawings from "../../../public/images/drawings/index.json";
import type { Locale } from "@/data/site";

/**
 * The dimensioned drawing, where the record publishes enough geometry to draw one.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS RENDERS FOR 42 PRODUCTS AND NOT 435
 *
 * FSB puts a line drawing on every product page and it is the part a specifier reads
 * hardest — a photograph shows what a part looks like, a drawing says whether it fits.
 * Ours can only be drawn where the factory has published the figures, which today is 42
 * of 435. The other 393 render nothing at all rather than an outline with a plausible
 * number on it: a drawing is read as measured, so a guessed dimension inside one does
 * more damage than the missing block.
 *
 * `index.json` is written by scripts/build-dimension-drawings.mjs beside the SVGs, so the
 * page never has to probe the filesystem and a missing file cannot become a broken image.
 *
 * ---------------------------------------------------------------------------
 * WHY <img> AND NOT INLINE SVG
 *
 * The drawing is a separate, cacheable, linkable asset — a specifier can open it on its
 * own and print it, which is exactly what they do with FSB's. Inlining would make it part
 * of the HTML payload on a page that already carries a photograph and a video poster.
 */

interface DrawingEntry {
  shape: string;
  note: string;
  partial: boolean;
}

const INDEX = drawings as Record<string, DrawingEntry>;

const COPY = {
  en: {
    heading: "Dimensioned drawing",
    partial: "Bolt detail",
    /* Said plainly, because a partial view that does not announce itself is a claim. */
    partialNote: "Case outline is not published; only the dimensions stated below are drawn.",
    scale: "Drawn 1:1 from the published specification",
    open: "Open full size",
  },
  es: {
    heading: "Plano acotado",
    partial: "Detalle de pestillos",
    partialNote: "El contorno de la caja no está publicado; solo se dibujan las cotas indicadas.",
    scale: "Dibujado a escala 1:1 según la ficha publicada",
    open: "Abrir a tamaño completo",
  },
} as const;

export function ProductDrawing({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const entry = INDEX[slug];
  if (!entry) return null;
  const t = COPY[locale];
  const href = `/images/drawings/${slug}.svg`;

  return (
    <div className="mt-48 border-t border-line pt-24">
      <h2 id="product-drawing-heading" className="text-h3 text-ink">
        {entry.partial ? t.partial : t.heading}
      </h2>

      {/*
        A light field behind the drawing, not the page white. The line work is a 0.7mm
        hairline; on the page's own #ffffff it has no edge and reads as a stray mark
        rather than a document — the same finding as the product plates, applied to
        vector art.
      */}
      <a href={href} className="mt-16 block border border-line bg-surface-alt p-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={href}
          alt={`${slug} — ${entry.note}`}
          loading="lazy"
          decoding="async"
          className="mx-auto block max-h-[42rem] w-auto"
        />
      </a>

      <p className="mt-12 text-c2 text-ink-secondary">{entry.note}</p>
      <p className="mt-4 text-c2 text-ink-tertiary">
        {t.scale}
        {entry.partial ? ` · ${t.partialNote}` : ""}
      </p>
    </div>
  );
}
