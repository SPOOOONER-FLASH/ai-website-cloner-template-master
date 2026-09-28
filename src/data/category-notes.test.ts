import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

/*
  The copper-hinge note on the hinge category page (src/data/category-notes.ts) makes two
  claims about the HYDE catalogue: some hinges are brass, and the rest are stainless steel,
  iron or zinc alloy. Both are checked here against content/products with the HYDE filter.
  The brief also forbids "pure copper" in any language.
*/
type P = { model: string; material?: string; sites?: string[]; categoryPath?: string[] };
const hinges = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")) as P)
  .filter((p) => p.categoryPath?.[0] === "brass-steel-hinges" && (!p.sites || p.sites.includes("hyde")));

test("the HYDE hinge range has brass models for the note to name", () => {
  const brass = hinges.filter((p) => p.material?.trim().toLowerCase() === "brass");
  assert.ok(brass.length >= 1);
});

test("every other HYDE hinge is stainless steel, iron or zinc alloy, as the note says", () => {
  for (const p of hinges) {
    if (p.material?.trim().toLowerCase() === "brass") continue;
    assert.match(p.material ?? "", /stainless|iron|zinc/i, `${p.model}: material "${p.material}"`);
  }
});

test("the note never says pure copper", () => {
  const source = readFileSync("src/data/category-notes.ts", "utf8").split("RULES.")[1].split("*/")[1];
  assert.doesNotMatch(source, /pure copper|cobre puro|cuivre pur|reines kupfer|saf bakır|чистая медь|純銅|순수한 구리|순동|纯铜|النحاس النقي/i);
});
