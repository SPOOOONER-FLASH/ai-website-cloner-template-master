import drawings from "../../../public/images/drawings/index.json";
import doorPrep from "../../../public/images/door-prep/index.json";
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

interface PrepEntry {
  model: string;
  diameter: number;
  centres: number;
  holeLabel: string;
  source: { hole: string; centre: string };
  note: string;
}

const PREP_INDEX = doorPrep as Record<string, PrepEntry>;

const PREP_COPY = {
  en: {
    heading: "Door preparation",
    pattern: (diameter: number, centres: number) =>
      `Two holes, Ø${diameter}mm, at ${centres}mm centers.`,
    caution:
      "Hole positions only — this is not a product outline. Confirm door thickness and the material you are drilling before cutting.",
  },
  es: {
    heading: "Preparación de la puerta",
    pattern: (diameter: number, centres: number) =>
      `Dos taladros de Ø${diameter} mm a ${centres} mm entre ejes.`,
    caution:
      "Solo posiciones de taladro — no es un plano de contorno del producto. Confirme el espesor de la puerta y el material que va a taladrar antes de cortar.",
  },
  pt: {
    heading: "Preparação da porta",
    pattern: (diameter: number, centres: number) =>
      `Dois furos de Ø${diameter} mm a ${centres} mm entre eixos.`,
    caution:
      "Apenas posições de furação — não é o contorno do produto. Confirme a espessura da porta e o material que vai furar antes de cortar.",
  },
} as const;

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
  pt: {
    heading: "Desenho cotado",
    partial: "Detalhe dos trincos",
    partialNote: "O contorno da caixa não está publicado; só são desenhadas as cotas indicadas.",
    scale: "Desenhado à escala 1:1 a partir da ficha publicada",
    open: "Abrir em tamanho completo",
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
      <p className="mt-4 text-c2 text-ink-secondary">
        {t.scale}
        {entry.partial ? ` · ${t.partialNote}` : ""}
      </p>
    </div>
  );
}

/**
 * The hole pattern to drill, under the outline it belongs to.
 *
 * Two drawings answer two questions and a specifier needs both: the outline says whether
 * the part suits the door, the preparation says what to cut. MIWA publish them as 外形図
 * and 切欠図 and keep them together; so do we, because a preparation drawing found on its
 * own is a set of holes with no part attached to it.
 *
 * ⚠ This one is the drawing somebody saws from, so it carries the disclaimer in the
 * markup as well as burnt into the SVG: hole positions only, and door thickness is the
 * customer's to confirm. Renders for the 56 products whose records publish both a fixing
 * hole diameter and a centre distance, and nothing at all for the rest.
 *
 * ⚠ RENDERED AS A SIBLING OF ProductDrawing, NOT INSIDE IT. The first version nested this
 * under the outline drawing, which would have meant it never rendered once: the two sets
 * do not overlap at all — every one of the 56 preparation drawings belongs to a product
 * with NO outline drawing, because a pull handle publishes its fixing centres while a
 * lock case publishes its case geometry. Two recipes, two populations.
 */
export function DoorPreparation({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const entry = PREP_INDEX[slug];
  if (!entry) return null;
  const t = PREP_COPY[locale];
  const href = `/images/door-prep/${slug}.svg`;

  return (
    <div className="mt-48 border-t border-line pt-24">
      <h2 className="text-h3 text-ink">{t.heading}</h2>

      <a href={href} className="mt-16 block border border-line bg-surface-alt p-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={href}
          alt={`${entry.model} — ${t.heading}`}
          loading="lazy"
          decoding="async"
          className="mx-auto block max-h-[36rem] w-auto"
        />
      </a>

      <p className="mt-12 text-c2 text-ink-secondary">
        {t.pattern(entry.diameter, entry.centres)}
      </p>
      <p className="mt-4 text-c2 text-ink-secondary">{t.caution}</p>
    </div>
  );
}
