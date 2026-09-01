import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";

import {
  chooseWatermarkCorner,
  findLegacyBrandCorner,
  getAdaptiveMarkGeometry,
  getLegacyRepairRegion,
  getWatermarkGeometry,
  resolveSafeOutputPath,
  shouldPreferLocalRepair,
  shouldUseBoundaryFill,
} from "./watermark-product-images.mjs";

test("watermark geometry stays proportional on catalogue images", () => {
  assert.deepEqual(getWatermarkGeometry(800, 800), {
    margin: 20,
    logoWidth: 112,
    logoHeight: 28,
    plateWidth: 152,
    plateHeight: 100,
  });

  assert.deepEqual(getWatermarkGeometry(2400, 943), {
    margin: 24,
    logoWidth: 140,
    logoHeight: 35,
    plateWidth: 188,
    plateHeight: 107,
  });
});

test("watermark geometry remains inside a small image", () => {
  const geometry = getWatermarkGeometry(180, 120);

  assert.ok(geometry.plateWidth + geometry.margin * 2 <= 180);
  assert.ok(geometry.plateHeight + geometry.margin * 2 <= 120);
  assert.ok(geometry.logoWidth > geometry.logoHeight);
});

test("adaptive logo is smaller than the legacy-cover plate", () => {
  const adaptive = getAdaptiveMarkGeometry(800, 800);
  const legacyCover = getWatermarkGeometry(800, 800);

  assert.deepEqual(adaptive, {
    margin: 20,
    logoWidth: 96,
    logoHeight: 24,
  });
  assert.ok(adaptive.logoWidth < legacyCover.logoWidth);
});

test("legacy red-script badge is detected in either top corner", () => {
  const createFixture = (side) => {
    const width = 100;
    const height = 100;
    const channels = 3;
    const data = new Uint8Array(width * height * channels).fill(244);
    const left = side === "left" ? 5 : 77;

    for (let y = 3; y <= 15; y += 1) {
      for (let x = left - 2; x <= left + 20; x += 1) {
        const offset = (y * width + x) * channels;
        data[offset] = 45;
        data[offset + 1] = 45;
        data[offset + 2] = 45;
      }
    }
    for (let y = 6; y <= 11; y += 1) {
      for (let x = left; x <= left + 16; x += 1) {
        const offset = (y * width + x) * channels;
        data[offset] = 205;
        data[offset + 1] = 35;
        data[offset + 2] = 42;
      }
    }

    return { channels, data, height, width };
  };

  assert.equal(findLegacyBrandCorner(createFixture("left")), "top-left");
  assert.equal(findLegacyBrandCorner(createFixture("right")), "top-right");
});

test("plain scenes do not invent a legacy badge", () => {
  assert.equal(
    findLegacyBrandCorner({
      channels: 3,
      data: new Uint8Array(100 * 100 * 3).fill(220),
      height: 100,
      width: 100,
    }),
    undefined,
  );
});

test("adaptive placement chooses the quietest corner unless a legacy badge wins", () => {
  const metrics = {
    "bottom-left": { entropy: 6.2 },
    "bottom-right": { entropy: 4.8 },
    "top-left": { entropy: 5.4 },
    "top-right": { entropy: 2.1 },
  };

  assert.equal(chooseWatermarkCorner(metrics), "top-right");
  assert.equal(chooseWatermarkCorner(metrics, "top-left"), "top-left");
});

test("derived output preserves the relative product path", () => {
  const fixtureRoot = resolve("tmp/codex-watermark-path-test");
  const sourceRoot = resolve(fixtureRoot, "public/images/products");
  const outputRoot = resolve(fixtureRoot, "output");
  const output = resolveSafeOutputPath(
    resolve(sourceRoot, "argentina-ar4/hyde-ar4-110.webp"),
    sourceRoot,
    outputRoot,
  );

  assert.equal(
    output.replaceAll("\\", "/"),
    resolve(outputRoot, "argentina-ar4/hyde-ar4-110.webp").replaceAll("\\", "/"),
  );
});

test("a red fire-door sign below the logo band is not a legacy badge", () => {
  const width = 100;
  const height = 100;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(215);

  for (let y = 22; y <= 28; y += 1) {
    for (let x = 76; x <= 94; x += 1) {
      const offset = (y * width + x) * channels;
      data[offset] = 205;
      data[offset + 1] = 35;
      data[offset + 2] = 42;
    }
  }

  assert.equal(
    findLegacyBrandCorner({ channels, data, height, width }),
    undefined,
  );
});

test("a top-corner red banner without a dark oval is not a legacy badge", () => {
  const width = 100;
  const height = 100;
  const channels = 3;
  const data = new Uint8Array(width * height * channels).fill(244);

  for (let y = 5; y <= 10; y += 1) {
    for (let x = 4; x <= 23; x += 1) {
      const offset = (y * width + x) * channels;
      data[offset] = 205;
      data[offset + 1] = 35;
      data[offset + 2] = 42;
    }
  }

  assert.equal(
    findLegacyBrandCorner({ channels, data, height, width }),
    undefined,
  );
});

test("legacy repair core contains the oval, registered symbol, and tagline", () => {
  assert.deepEqual(
    getLegacyRepairRegion(
      {
        bounds: { maxX: 47, maxY: 25, minX: 16, minY: 15 },
        sampleHeight: 256,
        sampleWidth: 256,
      },
      800,
      800,
    ),
    { height: 149, left: 5, top: 12, width: 200 },
  );
});

test("a matching real background is preferred over generative inpainting", () => {
  assert.equal(shouldPreferLocalRepair({ edgeDifference: 0 }), true);
  assert.equal(shouldPreferLocalRepair({ edgeDifference: 9.9 }), true);
  assert.equal(shouldPreferLocalRepair({ edgeDifference: 10.1 }), false);
  assert.equal(shouldPreferLocalRepair(undefined), false);
});

test("a visible clone-edge mismatch uses a boundary-continuous fill", () => {
  assert.equal(shouldUseBoundaryFill(0), false);
  assert.equal(shouldUseBoundaryFill(4), false);
  assert.equal(shouldUseBoundaryFill(7.32), true);
});

test("derived output rejects files outside the product image root", () => {
  const fixtureRoot = resolve("tmp/codex-watermark-path-test");
  assert.throws(
    () =>
      resolveSafeOutputPath(
        resolve(fixtureRoot, "public/images/editorial/hero.webp"),
        resolve(fixtureRoot, "public/images/products"),
        resolve(fixtureRoot, "output"),
      ),
    /outside the product image root/,
  );
});
