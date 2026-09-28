import assert from "node:assert/strict";
import test from "node:test";

import type { NewsArticle, Product } from "@/data/types";
import { categoryFaqItems, guideArticles, guideFactors, MAX_ARTICLES } from "./category-guide.ts";

const make = (model: string, specs: Array<[string, string]>): Product =>
  ({
    model,
    slug: model.toLowerCase(),
    name: model,
    series: "S",
    categoryPath: ["lever-handles"],
    specs: specs.map(([label, value]) => ({ label, value })),
  }) as unknown as Product;

const range = [
  make("A1", [["Backset", "60/70mm"], ["Material", "Zinc alloy"], ["Type", "Lever"]]),
  make("A2", [["Backset", "60/70mm"], ["Material", "Zinc alloy"]]),
  make("A3", [["Backset", "60mm"], ["Material", "Zinc alloy"]]),
  make("A4", [["Material", "Stainless steel"]]),
  make("A5", [["Material", "Zinc alloy"], ["Finish", "SN"]]),
];

test("factors are counted from spec rows, most-stated first, category facts skipped", () => {
  const factors = guideFactors(range);
  assert.deepEqual(factors.map((f) => f.label), ["Material", "Backset"]);
  assert.deepEqual(factors[0].values, [
    { value: "Zinc alloy", count: 4 },
    { value: "Stainless steel", count: 1 },
  ]);
  assert.equal(factors[1].stated, 3);
});

test("a row stated by too few models is not presented as a choice", () => {
  assert.ok(!guideFactors(range).some((f) => f.label === "Finish"));
});

test("tiny ranges get no block rather than a one-line guide", () => {
  assert.deepEqual(guideFactors(range.slice(0, 2)), []);
  assert.deepEqual(categoryFaqItems("Lever Handles", range.slice(0, 2), []), []);
});

test("FAQ answers say how many models do not state a value instead of hiding them", () => {
  const faq = categoryFaqItems("Lever Handles", range, ["Tubular"]);
  assert.match(faq[0].answer, /^5 published models, in 1 types: Tubular\./);
  const backset = faq.find((item) => item.question.includes("backset"));
  assert.ok(backset);
  assert.match(backset.answer, /60\/70mm \(2\), 60mm \(1\)/);
  assert.match(backset.answer, /2 of 5 models do not state this yet/);
});

test("articles are linked only when their curated model list names this range", () => {
  const article = (slug: string, models: string[], publishedAt = "2026-09-01") =>
    ({ slug, relatedModels: models, publishedAt }) as unknown as NewsArticle;
  const picked = guideArticles(range, [
    article("unrelated", ["Z9"]),
    article("one", ["a1"]),
    article("two", ["A1", "A2"]),
    ...Array.from({ length: 6 }, (_, i) => article(`extra-${i}`, ["A3"])),
  ]);
  assert.equal(picked[0].slug, "two");
  assert.ok(!picked.some((a) => a.slug === "unrelated"));
  assert.equal(picked.length, MAX_ARTICLES);
