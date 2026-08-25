import editorialImages from "./editorial-images.config.json";

interface EditorialImageConfig {
  sourceWidth: number;
  variants: number[];
}

const imageConfig = editorialImages as Record<string, EditorialImageConfig>;

export interface ResponsiveEditorialImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
}

function variantPath(src: string, width: number) {
  const filename = src.slice(src.lastIndexOf("/") + 1).replace(/\.webp$/i, "");
  return `/images/editorial/responsive/${filename}-${width}w.webp`;
}

/**
 * Adds pre-generated candidates only for the curated editorial library.
 * Product, certificate, SVG and client-supplied facility assets keep their existing URL.
 */
export function getResponsiveEditorialImageProps(
  src: string,
  sizes = "100vw",
): ResponsiveEditorialImageProps {
  const config = imageConfig[src];
  if (!config) return { src };

  const candidates = config.variants.map(
    (width) => `${variantPath(src, width)} ${width}w`,
  );
  candidates.push(`${src} ${config.sourceWidth}w`);

  return {
    src,
    srcSet: candidates.join(", "),
    sizes,
  };
}
