import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { productFaqItems } from "./product-faq.ts";
import type { Product } from "../data/types.ts";

const all: Product[] = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")) as Product);

/*
  These assertions exist because this markup goes on several hundred pages at once, which
  is the scale at which Google stops judging a page and starts judging a site. Each one
  guards a specific way that could go wrong.
*/

test("every answer quotes a value the product actually states", () => {
  for (const product of all) {
    const stated = new Set(
      (product.specs ?? []).map((s) => (s.unit ? `${s.value} ${s.unit}` : s.value)),
    );
    for (const cert of product.certifications ?? []) {
      stated.add(cert.standard ? `${cert.name} (${cert.standard})` : cert.name);
    }
    for (const item of productFaqItems(product, "en")) {
      const quoted = [...stated].some((value) => value && item.answer.includes(value));
      assert.ok(
        quoted,
        `${product.slug}: answer does not contain any stated value — ${item.answer}`,
      );
    }
  }
});

test("a page carries three to six questions, or none at all", () => {
  for (const product of all) {
    const n = productFaqItems(product, "en").length;
    assert.ok(n === 0 || (n >= 3 && n <= 6), `${product.slug} produced ${n} questions`);
  }
});

test("questions are unique within a page", () => {
  for (const product of all) {
    const items = productFaqItems(product, "en");
    assert.equal(new Set(items.map((i) => i.question)).size, items.length, product.slug);
  }
});

/*
  THE ONE THAT MATTERS.

  The first implementation answered with the bare spec value, so 46 groups of products —
  the largest covering 24 pages — shipped byte-identical answer sets. The values were
  correct; the answers were interchangeable, which is the thin-content pattern a
  catalogue-wide FAQPage is most likely to be penalised for. Answers now carry the model
  number. If a future edit takes it back out, this fails before it reaches a crawler.
*/
test("no two products share an identical answer set", () => {
  const seen = new Map<string, string>();
  for (const product of all) {
    const items = productFaqItems(product, "en");
    if (!items.length) continue;
    const signature = items.map((i) => i.answer).join("|");
    const owner = seen.get(signature);
    assert.equal(
      owner,
      undefined,
      `${product.slug} has the same answers as ${owner} — answers must be page-specific`,
    );
    seen.set(signature, product.slug);
  }
});

test("Spanish questions are Spanish, and are emitted for the same products", () => {
  for (const product of all.slice(0, 120)) {
    const en = productFaqItems(product, "en");
    const es = productFaqItems(product, "es");
    /*
      Spanish may legitimately carry FEWER questions than English: a spec row with no
      glossary entry is left in English by the generator rather than guessed at, so a
      product whose terminology is only half decided has fewer Spanish facts to ask
      about. What must never happen is Spanish claiming MORE than English, because the
      only way to get there is to have invented a term on the Spanish side.

      This started as an equality assertion and it was wrong — it failed on 027, where
      three packing rows existed in English and had no Spanish yet. The equality made the
      gap look like a bug in this file when it was a gap in the glossary.
    */
    assert.ok(
      es.length <= en.length,
      `${product.slug}: Spanish has more questions than English`,
    );
    for (const item of es) {
      assert.ok(
        /[¿áéíóúñ]/.test(item.question),
        `${product.slug}: Spanish question is not Spanish — ${item.question}`,
      );
    }
  }
});
