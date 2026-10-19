import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/*
  Every model an article lists must be a HYDE record, spelt exactly as its `model`
  (2026-10-12). An unresolved entry is dropped silently by NewsDetail, so a typo ("D101"
  for "D101 SS") or a RAYEN-only model leaves a cited article with no product to offer.
  A model whose product has no photograph may stay: it is withheld, not wrong.
*/
const root = process.cwd();
const products = fs
  .readdirSync(path.join(root, "content/products"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(root, "content/products", f), "utf8")) as { model: string; sites?: string[] });
const hydeModels = new Set(products.filter((p) => !p.sites || p.sites.includes("hyde")).map((p) => p.model));

test("every relatedModels entry on a guide or news article is an exact HYDE model", () => {
  const bad: string[] = [];
  for (const section of ["guides", "news"]) {
    for (const file of fs.readdirSync(path.join(root, "content", section)).filter((f) => f.endsWith(".json"))) {
      const article = JSON.parse(fs.readFileSync(path.join(root, "content", section, file), "utf8")) as { relatedModels?: string[] };
      for (const model of article.relatedModels ?? []) if (!hydeModels.has(model)) bad.push(`${section}/${file}: ${model}`);
    }
  }
  assert.deepEqual(bad, []);
});
