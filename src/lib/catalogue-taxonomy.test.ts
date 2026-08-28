import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import {
  canonicalCategorySlug,
  getLegacyProductParams,
} from "../data/category-aliases.ts";

type CategoryFixture = {
  slug: string;
  name: string;
  image: { src?: string };
};

type ProductFixture = {
  slug: string;
  categoryPath: string[];
};

const categories = (
  JSON.parse(readFileSync("content/categories.json", "utf8")) as {
    categories: CategoryFixture[];
  }
).categories;

const products = readdirSync("content/products")
  .filter((file) => file.endsWith(".json"))
  .map(
    (file) =>
      JSON.parse(readFileSync(`content/products/${file}`, "utf8")) as ProductFixture,
  );

test("Door Hinges is merged into Brass & Steel Door Hinges without losing products", () => {
  assert.equal(categories.some((category) => category.slug === "door-hinges"), false);

  const merged = categories.find((category) => category.slug === "brass-steel-hinges");
  assert.equal(merged?.name, "Brass & Steel Door Hinges");

  const mergedProducts = products.filter(
    (product) => product.categoryPath[0] === "brass-steel-hinges",
  );
  assert.equal(mergedProducts.length, 26);
  assert.ok(mergedProducts.some((product) => product.slug === "f100-ss-door-hinge"));
  assert.ok(
    mergedProducts.some((product) => product.slug === "stainless-steel-door-hinge"),
  );
  assert.equal(
    products.some((product) => product.categoryPath[0] === "door-hinges"),
    false,
  );
});

test("legacy hinge URLs resolve to the merged canonical category", () => {
  assert.equal(canonicalCategorySlug("door-hinges"), "brass-steel-hinges");
  assert.deepEqual(getLegacyProductParams(), [
    { category: "door-hinges", slug: "f100-ss-door-hinge" },
    { category: "door-hinges", slug: "stainless-steel-door-hinge" },
  ]);
});

test("category cover images belong to the category they introduce", () => {
  const stainlessHandles = categories.find(
    (category) => category.slug === "stainless-steel-handles",
  );
  const glassAccessories = categories.find(
    (category) => category.slug === "glass-door-accessories",
  );

  assert.equal(
    stainlessHandles?.image.src,
    "/images/products/9001-stainless-steel-handle.webp",
  );
  assert.equal(
    glassAccessories?.image.src,
    "/images/products/stainless-steel-glass-door-pull-handle.webp",
  );
});
