import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFacets,
  countActive,
  filterProducts,
  matchesQuery,
  selectionFromParams,
  selectionToParams,
  toggleValue,
} from "./product-finder.ts";

/** Minimal fixtures — only the fields the finder reads. */
const make = (over) => ({
  model: "X",
  slug: "x",
  name: "Item",
  series: "S1",
  categoryPath: ["locks"],
  summary: "",
  specs: [],
  material: "Steel",
  finishes: ["Satin"],
  doorTypes: ["Timber"],
  certifications: [],
  heroImage: { ratio: "1 / 1", label: "" },
  gallery: [],
  attachmentIds: [],
  relatedModels: [],
  seoTitle: "",
  seoDescription: "",
  ...over,
});

const products = [
  make({ model: "A", categoryPath: ["locks", "mortise"], finishes: ["Satin"], doorTypes: ["Timber"] }),
  make({ model: "B", categoryPath: ["locks", "mortise"], finishes: ["Black"], doorTypes: ["Steel"] }),
  make({ model: "C", categoryPath: ["exit"], series: "S2", finishes: ["Satin", "Black"], doorTypes: ["Timber"] }),
];

test("values within one facet are OR'd", () => {
  const got = filterProducts(products, { finish: ["Satin", "Black"] });
  assert.equal(got.length, 3);
});

test("different facets are AND'd", () => {
  const got = filterProducts(products, { finish: ["Satin"], doorType: ["Timber"] });
  assert.deepEqual(got.map((p) => p.model), ["A", "C"]);
});

test("an empty selection returns everything", () => {
  assert.equal(filterProducts(products, {}).length, 3);
});

test("facet counts ignore that facet's own selection", () => {
  // With Satin ticked, the finish facet must still show Black as reachable —
  // otherwise every sibling option renders as (0) and the UI looks broken.
  const facets = buildFacets(products, { finish: ["Satin"] });
  const finish = facets.find((f) => f.key === "finish");
  const black = finish?.options.find((o) => o.value === "Black");
  assert.ok(black && black.count > 0, "Black should remain selectable");
});

test("facets with a single value are dropped", () => {
  const facets = buildFacets(products);
  assert.equal(facets.find((f) => f.key === "material"), undefined);
});

test("toggling twice returns to the original state", () => {
  const once = toggleValue({}, "finish", "Satin");
  assert.deepEqual(once, { finish: ["Satin"] });
  assert.deepEqual(toggleValue(once, "finish", "Satin"), {});
});

test("query matches across model and name, all terms required", () => {
  assert.equal(matchesQuery(products[0], "a"), true);
  assert.equal(matchesQuery(products[0], "zzz"), false);
  assert.equal(matchesQuery(products[0], "item satin"), true);
  assert.equal(matchesQuery(products[0], "item zzz"), false);
});

test("selection survives a round trip through URL params", () => {
  const selection = { finish: ["Satin", "Black"], category: ["locks"] };
  const parsed = selectionFromParams(selectionToParams(selection, "lever"));
  assert.deepEqual(parsed.selection, selection);
  assert.equal(parsed.query, "lever");
  assert.equal(countActive(selection), 3);
});
