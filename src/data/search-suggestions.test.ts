import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  suggestedCategories,
  suggestedProducts,
  suggestionHref,
  suggestionLabel,
} from "./search-suggestions.ts";

const root = process.cwd();

const categorySlugs = new Set(
  (
    JSON.parse(fs.readFileSync(path.join(root, "content/categories.json"), "utf8")) as {
      categories: { slug: string }[];
    }
  ).categories.map((category) => category.slug),
);

interface ProductRecord {
  slug: string;
  categoryPath: string[];
  heroImage?: { src: string };
  specs?: unknown[];
}

const products = new Map<string, ProductRecord>();
for (const file of fs.readdirSync(path.join(root, "content/products"))) {
  const record = JSON.parse(
    fs.readFileSync(path.join(root, "content/products", file), "utf8"),
  ) as ProductRecord;
  products.set(`/products/${record.categoryPath[0]}/${record.slug}/`, record);
}

test("every suggested category is a real category", () => {
  for (const suggestion of suggestedCategories) {
    const match = /^\/products\/([^/]+)\/$/.exec(suggestion.href);
    assert.ok(match, `${suggestion.href} is not a category path`);
    assert.ok(categorySlugs.has(match[1]), `${match[1]} is not a category slug`);
  }
});

/**
 * The point of a suggestion is that following it answers a question. A model with two
 * spec rows and no photograph is a worse landing page than the category above it, so if
 * one of these records ever thins out this test says so instead of the visitor finding
 * out. Nine rows is the floor the five picks cleared when they were chosen (2026-08-31).
 */
test("every suggested model still has a photograph and a real spec table", () => {
  for (const suggestion of suggestedProducts) {
    const record = products.get(suggestion.href);
    assert.ok(record, `${suggestion.href} is not a published product page`);
    assert.ok(record.heroImage?.src, `${suggestion.href} has no hero image`);
    assert.ok(
      (record.specs ?? []).length >= 9,
      `${suggestion.href} is down to ${(record.specs ?? []).length} spec rows — pick a ` +
        `better-documented model, or fill this one in`,
    );
  }
});

test("suggestions span categories rather than crowding one", () => {
  const spread = new Set(suggestedProducts.map((s) => s.href.split("/")[2]));
  assert.equal(spread.size, suggestedProducts.length, "one suggested model per category");
});

test("both locales get a label and a resolvable path", () => {
  for (const suggestion of [...suggestedCategories, ...suggestedProducts]) {
    assert.ok(suggestionLabel(suggestion, "en").length > 0);
    assert.ok(suggestionLabel(suggestion, "es").length > 0);
    assert.notEqual(
      suggestionLabel(suggestion, "es"),
      suggestionLabel(suggestion, "en"),
      `${suggestion.href} has an untranslated Spanish label`,
    );
    assert.equal(suggestionHref(suggestion, "es"), `/es${suggestion.href}`);
    assert.equal(suggestionHref(suggestion, "en"), suggestion.href);
  }
});
