import assert from "node:assert/strict";
import test from "node:test";

import type { Product } from "@/data/types";
import {
  buildFacets,
  countActive,
  filterProducts,
  matchesQuery,
  paginate,
  selectionFromParams,
  selectionToParams,
  sortForDisplay,
  toggleValue,
  visiblePageNumbers,
  FACET_LABELS,
  FACET_PARAM_NAMES,
  PAGE_SIZE,
  PRIMARY_FACETS,
  SECONDARY_FACETS,
  type FacetKey,
} from "./product-finder.ts";

test("visiblePageNumbers keeps a three-page window with direct first and last controls", () => {
  assert.deepEqual(visiblePageNumbers(1, 22), [1, 2, 3]);
  assert.deepEqual(visiblePageNumbers(2, 22), [1, 2, 3]);
  assert.deepEqual(visiblePageNumbers(3, 22), [2, 3, 4]);
  assert.deepEqual(visiblePageNumbers(21, 22), [20, 21, 22]);
  assert.deepEqual(visiblePageNumbers(22, 22), [20, 21, 22]);
  assert.deepEqual(visiblePageNumbers(1, 2), [1, 2]);
  assert.deepEqual(visiblePageNumbers(1, 0), []);
});

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

/* -------------------------------------------------------------------------
 * Display order and pagination
 * ---------------------------------------------------------------------- */

const withPhoto = (slug: string, src?: string) =>
  ({ slug, model: slug, name: slug, series: "", categoryPath: [], summary: "",
     specs: [], material: "", finishes: [], doorTypes: [], certifications: [],
     heroImage: src ? { src, ratio: "1 / 1", label: slug } : { ratio: "1 / 1", label: slug },
     gallery: [], attachmentIds: [], relatedModels: [], seoTitle: "", seoDescription: "" }) as unknown as Product;

test("sortForDisplay puts photographed products first and keeps incoming order", () => {
  const list = [
    withPhoto("a"),
    withPhoto("b", "/images/b.webp"),
    withPhoto("c"),
    withPhoto("d", "/images/d.webp"),
  ];
  assert.deepEqual(
    sortForDisplay(list).map((p) => p.slug),
    ["b", "d", "a", "c"],
  );
});

test("sortForDisplay does not drop the products without photography", () => {
  const list = [withPhoto("a"), withPhoto("b", "/images/b.webp")];
  assert.equal(sortForDisplay(list).length, 2);
});

test("paginate slices PAGE_SIZE per page and reports the range", () => {
  const items = Array.from({ length: 120 }, (_, i) => i);
  const first = paginate(items, 1);
  assert.equal(first.items.length, PAGE_SIZE);
  assert.deepEqual([first.page, first.pageCount, first.from, first.to], [1, 6, 1, 20]);

  const last = paginate(items, 6);
  assert.equal(last.items.length, 20);
  assert.deepEqual([last.from, last.to], [101, 120]);
});

test("the client asked for 20 a page; changing it is a decision, not a tweak", () => {
  assert.equal(PAGE_SIZE, 20);
});

test("paginate clamps an out-of-range page instead of showing nothing", () => {
  const items = Array.from({ length: 10 }, (_, i) => i);
  assert.equal(paginate(items, 99).page, 1 + 0); // only one page exists
  assert.equal(paginate(items, 0).page, 1);
  assert.equal(paginate(items, -5).page, 1);
});

test("paginate reports an empty result honestly", () => {
  const empty = paginate([], 1);
  assert.deepEqual([empty.total, empty.pageCount, empty.from, empty.to], [0, 1, 0, 0]);
});

test("page survives a round trip through the URL, and page 1 stays implicit", () => {
  assert.equal(selectionToParams({}, "", 1).toString(), "");
  assert.equal(selectionToParams({}, "", 4).get("page"), "4");
  assert.equal(selectionFromParams(new URLSearchParams("page=4")).page, 4);
  assert.equal(selectionFromParams(new URLSearchParams("")).page, 1);
  assert.equal(selectionFromParams(new URLSearchParams("page=abc")).page, 1);
});

test("the rail carries only category and type; the rest sit behind the panel", () => {
  assert.deepEqual(PRIMARY_FACETS, ["category", "subCategory"]);
  assert.equal(PRIMARY_FACETS.includes("material" as FacetKey), false);
  assert.equal(SECONDARY_FACETS.includes("series" as FacetKey), true);
  const all = [...PRIMARY_FACETS, ...SECONDARY_FACETS].sort();
  assert.deepEqual(all, (Object.keys(FACET_LABELS) as FacetKey[]).sort());
});

test("the finder claims only its own query parameters", () => {
  // It mirrors state into the address bar by rebuilding the query string, so it has to
  // know which keys are its own — otherwise it wipes things like ?promo=1 on every
  // keystroke, which is exactly what it used to do.
  for (const key of Object.keys(FACET_LABELS)) assert.ok(FACET_PARAM_NAMES.has(key));
  assert.ok(FACET_PARAM_NAMES.has("q"));
  assert.ok(FACET_PARAM_NAMES.has("page"));
  assert.equal(FACET_PARAM_NAMES.has("promo"), false);
  assert.equal(FACET_PARAM_NAMES.has("utm_source"), false);
});
