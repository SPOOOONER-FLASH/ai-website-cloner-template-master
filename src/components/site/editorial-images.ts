import editorialImages from "./editorial-images.config.json";
import productImages from "./product-images.config.json";

interface EditorialImageConfig {
  sourceWidth: number;
  variants: number[];
}

const imageConfig = editorialImages as Record<string, EditorialImageConfig>;

/*
  Product photographs are a SECOND library, deliberately kept in its own file.

  The homepage serves twenty-one images. Twelve carried candidates; the six product
  thumbnails served their full 1000–1100px square into a box that is never wider than
  420 CSS px, because this whole mechanism was only ever pointed at the editorial
  library and a product path fell through to `{ src }`. Both call sites were already
  passing a correct `sizes` — it was being dropped along with the srcSet.

  They are not merged into editorial-images.config.json because that filename is how the
  next session decides where to look. A product photograph listed inside a file called
  "editorial" is a fact nobody can find, and the two libraries also differ in a way that
  matters: editorial sources are 1800px scenery, these are square catalogue plates whose
  watermark scales with them.
*/
const productConfig = productImages as Record<string, EditorialImageConfig>;

export interface ResponsiveEditorialImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
}

function variantPath(src: string, width: number, directory: string) {
  const filename = src.slice(src.lastIndexOf("/") + 1).replace(/\.webp$/i, "");
  return `${directory}/${filename}-${width}w.webp`;
}

/** Where each library's generated candidates are written. Mirrored in the generator. */
export const EDITORIAL_VARIANT_DIRECTORY = "/images/editorial/responsive";
export const PRODUCT_VARIANT_DIRECTORY = "/images/responsive/products";

/**
 * Adds pre-generated candidates for the curated editorial library and for the product
 * photographs listed in product-images.config.json.
 *
 * Certificate marks, SVGs and client-supplied facility assets keep their existing URL —
 * an SVG has no fixed pixel width to offer candidates for.
 */
export function getResponsiveEditorialImageProps(
  src: string,
  sizes = "100vw",
): ResponsiveEditorialImageProps {
  const config = imageConfig[src] ?? productConfig[src];
  const directory = imageConfig[src]
    ? EDITORIAL_VARIANT_DIRECTORY
    : PRODUCT_VARIANT_DIRECTORY;
  if (!config) return { src };

  const candidates = config.variants.map(
    (width) => `${variantPath(src, width, directory)} ${width}w`,
  );
  candidates.push(`${src} ${config.sourceWidth}w`);

  return {
    src,
    srcSet: candidates.join(", "),
    sizes,
  };
}
