import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

import { articlesCitingModel, CITING_LIMIT } from "./citing-articles.ts";

const a = (slug: string, publishedAt: string, relatedModels: string[]) => ({ slug, publishedAt, relatedModels });

test("guides come before news, newest first within each", () => {
  const guides = [a("g-old", "2026-09-01", ["LC04 85*60"]), a("g-new", "2026-09-23", ["LC04 85*60"])];
  const news = [a("n", "2026-09-25", ["LC04 85*60"]), a("other", "2026-09-26", ["564"])];
  assert.deepEqual(
    articlesCitingModel("LC04 85*60", guides, news).map((c) => `${c.section}/${c.article.slug}`),
    ["guides/g-new", "guides/g-old", "news/n"],
  );
});

test("only an exact relatedModels entry counts, and the list is capped", () => {
  const many = Array.from({ length: 9 }, (_, i) => a(`g${i}`, "2026-09-01", ["564"]));
  assert.equal(articlesCitingModel("564", many, []).length, CITING_LIMIT);
  assert.equal(articlesCitingModel("564 MB", many, []).length, 0);
});

/*
  The back-link only exists when the article's model string matches the product record
  exactly. On 2026-09-28 five entries did not ("LC04 85-60" against the record's "LC04 85*60"),
  so the article showed no product card and the product page could not find the article.
  Two entries name models the catalogue has never had and stay listed here until an editor
  decides what the article meant: 808 SS ET (the 808 records are ABET, MBET, SNET, SNPS) and
  a bare D101 (the records all carry a finish suffix). Brass Piano Hinge has no model code.
*/
const KNOWN_UNRESOLVED = new Set([
  "news/brass-piano-hinge-is-a-finish-not-a-metal|Brass Piano Hinge",
  "guides/container-loading-door-hardware-2026|D101",
  "guides/container-loading-door-hardware-2026|808 SS ET",
]);

test("every relatedModels entry resolves to a product record", () => {
  const models = new Set(
    readdirSync("content/products")
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")).model),
  );
  const missing: string[] = [];
  for (const section of ["news", "guides"]) {
    for (const file of readdirSync(`content/${section}`).filter((f) => f.endsWith(".json"))) {
      const article = JSON.parse(readFileSync(`content/${section}/${file}`, "utf8"));
      for (const model of article.relatedModels ?? []) {
        const key = `${section}/${article.slug}|${model}`;
        if (!models.has(model) && !KNOWN_UNRESOLVED.has(key)) missing.push(key);
      }
    }
  }
  assert.deepEqual(missing, [], "relatedModels must match content/products model strings exactly");
});
