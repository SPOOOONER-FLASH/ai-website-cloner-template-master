import assert from "node:assert/strict";
import test from "node:test";

import {
  getWatermarkGeometry,
  resolveSafeOutputPath,
} from "./watermark-product-images.mjs";

test("watermark geometry stays proportional on catalogue images", () => {
  assert.deepEqual(getWatermarkGeometry(800, 800), {
    margin: 20,
    logoWidth: 144,
    logoHeight: 36,
    plateWidth: 174,
    plateHeight: 84,
  });

  assert.deepEqual(getWatermarkGeometry(2400, 943), {
    margin: 24,
    logoWidth: 176,
    logoHeight: 44,
    plateWidth: 212,
    plateHeight: 92,
  });
});

test("watermark geometry remains inside a small image", () => {
  const geometry = getWatermarkGeometry(180, 120);

  assert.ok(geometry.plateWidth + geometry.margin * 2 <= 180);
  assert.ok(geometry.plateHeight + geometry.margin * 2 <= 120);
  assert.ok(geometry.logoWidth > geometry.logoHeight);
});

test("derived output preserves the relative product path", () => {
  const output = resolveSafeOutputPath(
    "C:/repo/public/images/products/argentina-ar4/hyde-ar4-110.webp",
    "C:/repo/public/images/products",
    "C:/repo/tmp/codex-watermark-preview",
  );

  assert.equal(
    output.replaceAll("\\", "/"),
    "C:/repo/tmp/codex-watermark-preview/argentina-ar4/hyde-ar4-110.webp",
  );
});

test("derived output rejects files outside the product image root", () => {
  assert.throws(
    () =>
      resolveSafeOutputPath(
        "C:/repo/public/images/editorial/hero.webp",
        "C:/repo/public/images/products",
        "C:/repo/tmp/codex-watermark-preview",
      ),
    /outside the product image root/,
  );
});
