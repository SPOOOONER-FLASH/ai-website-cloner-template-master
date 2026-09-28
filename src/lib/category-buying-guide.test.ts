import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { CATEGORY_GUIDES } from "../data/category-buying-guides.ts";
import { categoryFacts } from "./category-facts.ts";
import { dict, fill } from "./i18n.ts";
import type { Locale } from "../data/site.ts";
import type { Product } from "../data/types.ts";

/*
  The buying guide prints figures only from the catalogue (src/lib/category-facts.ts).
  These tests lock the two things a reader would notice: every category with published
  products has a guide, and no rendered sentence carries an unfilled `{placeholder}` —
  which is what happens when an item's `needs` list forgets a fact its answer prints.

  Records are read from content/products directly (src/data/products.ts resolves a
  generated module the test runner cannot load), with the same HYDE + photograph rule.
*/
const products = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")) as Product & { sites?: string[] })
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);
const byCategory = (slug: string) => products.filter((p) => p.categoryPath[0] === slug);
const categories = [...new Set(products.map((p) => p.categoryPath[0]))];
const vars = (slug: string, locale: Locale) =>
  Object.fromEntries(Object.entries(categoryFacts(byCategory(slug), locale)).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string | number>;

test("every published category has a buying guide", () => {
  const missing = categories.filter((slug) => !CATEGORY_GUIDES[slug]);
  assert.deepEqual(missing, []);
});

test("no rendered guide sentence keeps an unfilled placeholder, in any of the ten locales", () => {
  const locales: Locale[] = ["en", "es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"];
  const leaks: string[] = [];
  for (const slug of categories) {
    const guide = CATEGORY_GUIDES[slug];
    if (!guide) continue;
    for (const locale of locales) {
      const v = vars(slug, locale);
      const texts = [dict(guide.intro, locale), ...guide.items.filter((i) => (i.needs ?? []).every((n) => n in v)).flatMap((i) => [dict(i.question, locale), dict(i.answer, locale)])];
      for (const text of texts) {
        const out = fill(text, v);
        if (/\{[a-zA-Z]+\}/.test(out)) leaks.push(`${slug} ${locale}: ${out.slice(0, 80)}`);
      }
    }
  }
  assert.deepEqual(leaks, []);
});

test("the categories that state dimensions keep at least one dimension answer", () => {
  for (const slug of ["lock-cases", "lever-handles", "knob-locks", "night-latches-rim-locks", "deadbolts", "door-closers"]) {
    const v = vars(slug, "en");
    const kept = CATEGORY_GUIDES[slug].items.filter((i) => (i.needs ?? []).length && (i.needs ?? []).every((n) => n in v));
    assert.ok(kept.length >= 1, `${slug} lost every dimension answer: facts ${JSON.stringify(Object.keys(v))}`);
  }
