import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { PUBLISHED_LENGTHS_MM, roundUpHalf, sizeCylinder } from "./cylinder-length.ts";

/*
  The calculator must give the same answers as the guide it was built from. These rows are
  the lookup table in content/guides/door-thickness-to-cylinder-length-2026.json (4mm
  escutcheon each side, centered case): door → standard half → order from our range.
*/
test("reproduces the published lookup table", () => {
  const rows: [number, number, number][] = [
    [35, 27.5, 56], [40, 27.5, 56], [45, 27.5, 56], [50, 30, 60],
    [55, 35, 70], [60, 35, 70], [70, 40, 80], [80, 45, 90],
  ];
  for (const [door, halfMm, order] of rows) {
    const r = sizeCylinder({ doorMm: door, outsideTrimMm: 4, insideTrimMm: 4 });
    assert.equal(r.outside.halfMm, halfMm, `${door}mm door half`);
    assert.equal(r.publishedMm, order, `${door}mm door order length`);
  }
});

test("rounds up, never down, and never below 27.5", () => {
  assert.equal(roundUpHalf(10), 27.5);
  assert.equal(roundUpHalf(27.6), 30);
  assert.equal(roundUpHalf(30), 30);
  assert.equal(roundUpHalf(30.1), 35);
});

test("an off-center case gives an asymmetric split, outside first", () => {
  const r = sizeCylinder({ doorMm: 60, outsideTrimMm: 4, insideTrimMm: 4, centerFromOutsideMm: 25 });
  assert.equal(r.outside.halfMm, 30);
  assert.equal(r.inside.halfMm, 40);
  assert.equal(r.asymmetric, true);
  assert.equal(r.publishedMm, 70);
});

test("above the longest published length there is no model to name", () => {
  assert.equal(sizeCylinder({ doorMm: 100, outsideTrimMm: 4, insideTrimMm: 4 }).publishedMm, null);
});

test("the published lengths match the cylinder models in the catalog", () => {
  const lengths = new Set<number>();
  for (const f of readdirSync("content/products").filter((n) => n.endsWith(".json"))) {
    const p = JSON.parse(readFileSync(`content/products/${f}`, "utf8"));
    if (p.sites && !p.sites.includes("hyde")) continue;
    if (p.categoryPath?.[0] !== "lock-cylinders") continue;
    const lead = String(p.model).match(/^\d+/);
    if (lead) lengths.add(Number(lead[0]));
  }
  assert.deepEqual([...lengths].sort((a, b) => a - b), [...PUBLISHED_LENGTHS_MM]);
});
