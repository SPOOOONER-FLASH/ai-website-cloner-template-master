import test from "node:test";
import assert from "node:assert/strict";
import {
  applyImageAltOverride,
  createImageAltOverrideMap,
} from "../data/image-alt-overrides.ts";

test("a central image override updates English and Spanish alt text without changing the asset", () => {
  const overrides = createImageAltOverrideMap([
    {
      src: "/images/products/model-100.webp",
      label: "HYDE model 100 mortise lock on a white background",
      labelEs: "Cerradura de embutir HYDE modelo 100 sobre fondo blanco",
    },
  ]);

  assert.deepEqual(
    applyImageAltOverride(
      {
        src: "/images/products/model-100.webp",
        ratio: "1 / 1",
        label: "Old label",
        sourceNote: "2022-watermarked",
      },
      overrides,
    ),
    {
      src: "/images/products/model-100.webp",
      ratio: "1 / 1",
      label: "HYDE model 100 mortise lock on a white background",
      labelEs: "Cerradura de embutir HYDE modelo 100 sobre fondo blanco",
      sourceNote: "2022-watermarked",
    },
  );
});

test("images without a matching central override remain unchanged", () => {
  const image = { src: "/images/products/model-101.webp", ratio: "1 / 1", label: "Model 101" };
  const overrides = createImageAltOverrideMap([]);

  assert.equal(applyImageAltOverride(image, overrides), image);
});

test("duplicate image paths fail fast instead of making CMS order decide the alt text", () => {
  assert.throws(
    () =>
      createImageAltOverrideMap([
        { src: "/images/products/model-100.webp", label: "First" },
        { src: "/images/products/model-100.webp", label: "Second" },
      ]),
    /Duplicate image alt override/,
  );
});
