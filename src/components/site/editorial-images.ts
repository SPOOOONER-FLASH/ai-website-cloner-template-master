import editorialImages from "./editorial-images.config.json";
import productImages from "./product-images.config.json";
import brandedEditorial from "../../../docs/design-references/branded-editorial-list.json";
import brandedCompany from "../../../docs/design-references/branded-company-list.json";

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
export const BRANDED_EDITORIAL_VARIANT_DIRECTORY = "/images/editorial-hyde/responsive";

/**
 * Swaps an editorial or company photograph for its HYDE-marked copy.
 *
 * ---------------------------------------------------------------------------
 * WHY THE SWAP HAPPENS HERE RATHER THAN IN THE DATA
 *
 * Twenty-odd files across src/data, content/ and the page components name editorial
 * images by their plain path. Rewriting all of those would have been twenty chances to
 * miss one, and a missed one is invisible: the page renders the unmarked original and
 * looks perfectly correct.
 *
 * Every editorial `<img>` on the site already funnels through this module for its srcSet,
 * so it is the one place the substitution can be made exhaustively. Authors keep writing
 * `/images/editorial/hyde-hero-lever.webp`; the marked copy is what ships.
 *
 * ---------------------------------------------------------------------------
 * ONLY THE FILES WITH EVIDENCE
 *
 * The list is generated from declared provenance — a sidecar saying the file came from a
 * real photograph — and most of the editorial library is not in it, because most of the
 * editorial library is generated illustrative imagery whose own sidecar says so. Marking
 * one of those would sign a picture we did not photograph of a part that does not exist.
 * See scripts/build-branded-editorial-list.mjs.
 */
const BRANDED_EDITORIAL = new Set(
  brandedEditorial.map((file) => `/images/editorial/${file}`),
);
const BRANDED_COMPANY = new Set(brandedCompany.map((file) => `/images/company/${file}`));

function brandedSource(src: string): string | undefined {
  if (BRANDED_EDITORIAL.has(src)) return src.replace("/images/editorial/", "/images/editorial-hyde/");
  if (BRANDED_COMPANY.has(src)) return src.replace("/images/company/", "/images/company-hyde/");
  return undefined;
}

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
  const marked = brandedSource(src);
  const config = imageConfig[src] ?? productConfig[src];
  const directory = imageConfig[src]
    ? marked
      ? BRANDED_EDITORIAL_VARIANT_DIRECTORY
      : EDITORIAL_VARIANT_DIRECTORY
    : PRODUCT_VARIANT_DIRECTORY;
  if (!config) return { src: marked ?? src };

  const served = marked ?? src;
  const candidates = config.variants.map(
    (width) => `${variantPath(served, width, directory)} ${width}w`,
  );
  candidates.push(`${served} ${config.sourceWidth}w`);

  return {
    src: served,
    srcSet: candidates.join(", "),
    sizes,
  };
}
