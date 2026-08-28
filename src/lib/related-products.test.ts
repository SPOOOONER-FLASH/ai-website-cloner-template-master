import assert from "node:assert/strict";
import test from "node:test";

import type { Product } from "@/data/types";
import { LIMIT, relatedBlock, rotatingNeighbours } from "./related-products.ts";

const make = (model: string, series: string, category = "handles"): Product =>
  ({
    model,
    slug: model.toLowerCase(),
    name: model,
    series,
    categoryPath: [category],
  }) as unknown as Product;

const group = ["A", "B", "C", "D", "E"].map((m) => make(m, "S"));

test("neighbours follow the product and wrap past the end", () => {
  assert.deepEqual(
    rotatingNeighbours(group[0], group).map((p) => p.model),
    ["B", "C", "D"],
  );
  assert.deepEqual(
    rotatingNeighbours(group[4], group).map((p) => p.model),
    ["A", "B", "C"],
  );
});

test("every member of a group gets a distinct slice — the point of rotating", () => {
  const slices = group.map((p) => rotatingNeighbours(p, group).map((n) => n.model).join());
  assert.equal(new Set(slices).size, group.length);
});

test("a product never lists itself", () => {
  for (const p of group) {
    assert.ok(!rotatingNeighbours(p, group).some((n) => n.slug === p.slug));
  }
});

test("a group of one yields nothing", () => {
  assert.deepEqual(rotatingNeighbours(group[0], [group[0]]), []);
});

test("a group smaller than LIMIT+1 returns what it has, without repeats", () => {
  const pair = [make("A", "S"), make("B", "S")];
  const items = rotatingNeighbours(pair[0], pair);
  assert.deepEqual(items.map((p) => p.model), ["B"]);
});

test("curated relations win and are labelled as such", () => {
  const product = make("A", "S");
  const block = relatedBlock({
    product,
    curated: [make("Z", "OTHER")],
    catalogue: group,
    categoryName: "Handles",
  });

  assert.equal(block?.source, "curated");
  assert.equal(block?.heading, "Related products");
  assert.deepEqual(block?.items.map((p) => p.model), ["Z"]);
});

test("series siblings are preferred over the wider category, and named honestly", () => {
  const product = make("A", "D101");
  const catalogue = [product, make("B", "D101"), make("C", "OTHER")];
  const block = relatedBlock({ product, curated: [], catalogue, categoryName: "Handles" });

  assert.equal(block?.source, "series");
  assert.equal(block?.heading, "More in the D101 series");
  assert.deepEqual(block?.items.map((p) => p.model), ["B"]);
});

test("a product alone in its series falls back to the category", () => {
  const product = make("A", "ONLY");
  const catalogue = [product, make("B", "OTHER")];
  const block = relatedBlock({ product, curated: [], catalogue, categoryName: "Handles" });

  assert.equal(block?.source, "category");
  assert.equal(block?.heading, "More in Handles");
  assert.deepEqual(block?.items.map((p) => p.model), ["B"]);
});

test("a category of one returns null so the caller can omit the section", () => {
  const product = make("A", "ONLY");
  assert.equal(
    relatedBlock({ product, curated: [], catalogue: [product], categoryName: "Handles" }),
    null,
  );
});

test("blank series is not treated as a series", () => {
  const product = make("A", "   ");
  const catalogue = [product, make("B", "   ")];
  const block = relatedBlock({ product, curated: [], catalogue, categoryName: "Handles" });

  assert.equal(block?.source, "category");
});

test("never more than LIMIT items", () => {
  const many = Array.from({ length: 40 }, (_, i) => make(`M${i}`, "S"));
  const block = relatedBlock({
    product: many[0],
    curated: [],
    catalogue: many,
    categoryName: "Handles",
  });

  assert.equal(block?.items.length, LIMIT);
});
