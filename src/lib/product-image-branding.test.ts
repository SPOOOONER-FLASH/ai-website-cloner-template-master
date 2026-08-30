import assert from "node:assert/strict";
import test from "node:test";

import {
  brandProductImageRef,
  toHydeBrandedProductImageSrc,
} from "../data/product-image-branding.ts";

test("product image sources resolve to the non-destructive HYDE derivative tree", () => {
  assert.equal(
    toHydeBrandedProductImageSrc("/images/products/argentina-ar4/hyde-ar4-110.webp"),
    "/images/products-hyde/argentina-ar4/hyde-ar4-110.webp",
  );
});

test("non-product and already branded sources stay unchanged", () => {
  assert.equal(
    toHydeBrandedProductImageSrc("/images/editorial/home-panic-exit-bars.webp"),
    "/images/editorial/home-panic-exit-bars.webp",
  );
  assert.equal(
    toHydeBrandedProductImageSrc("/images/products-hyde/model-100.webp"),
    "/images/products-hyde/model-100.webp",
  );
});

test("branding preserves image metadata and does not mutate the source object", () => {
  const source = {
    src: "/images/products/model-100.webp",
    ratio: "1 / 1",
    label: "HYDE model 100 mortise lock",
    sourceNote: "2022-watermarked",
  };

  const branded = brandProductImageRef(source);

  assert.deepEqual(branded, {
    ...source,
    src: "/images/products-hyde/model-100.webp",
  });
  assert.notEqual(branded, source);
});
