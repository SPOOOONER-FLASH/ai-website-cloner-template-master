import type { ImageRef } from "./types";

const PRODUCT_IMAGE_PREFIX = "/images/products/";
const BRANDED_PRODUCT_IMAGE_PREFIX = "/images/products-hyde/";

export function toHydeBrandedProductImageSrc(src: string | undefined): string | undefined {
  if (!src?.startsWith(PRODUCT_IMAGE_PREFIX)) return src;
  return `${BRANDED_PRODUCT_IMAGE_PREFIX}${src.slice(PRODUCT_IMAGE_PREFIX.length)}`;
}

export function brandProductImageRef(image: ImageRef): ImageRef {
  const src = toHydeBrandedProductImageSrc(image.src);
  if (src === image.src) return image;
  return { ...image, src };
}

export function brandProductImageRefs(images: ImageRef[]): ImageRef[] {
  return images.map(brandProductImageRef);
}
