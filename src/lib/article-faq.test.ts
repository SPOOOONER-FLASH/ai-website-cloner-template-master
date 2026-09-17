import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { articleFaqItems, ungroundedNumbers } from "./article-faq.ts";
import type { NewsArticle } from "../data/types.ts";

const DIR = path.join(process.cwd(), "content/news");

function articles(): NewsArticle[] {
  return fs
    .readdirSync(DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(DIR, name), "utf8")) as NewsArticle);
}

/**
 * The rule this file exists to hold: an FAQ answer may not introduce a figure the article
 * does not state.
 *
 * Two independent reasons, and either alone would justify it.
 *
 * The site's: a fabricated dimension is the one error this catalogue cannot absorb, and an
 * FAQ block is the easiest place in the world to write one — it is prose, it reads as a
 * summary, and nobody diffs it against the body.
 *
 * Google's: FAQ markup whose answers do not appear on the page is treated as a spam
 * signal. A number in the markup that is nowhere in the text is exactly that, and the
 * penalty lands on the article rather than the block.
 */
test("no FAQ answer states a number its own article does not", () => {
  const offenders: string[] = [];

  for (const article of articles()) {
    for (const locale of ["en", "es", "pt"] as const) {
      const missing = ungroundedNumbers(article, locale);
      if (missing.length) {
        offenders.push(`${article.slug} [${locale}]: ${missing.join(", ")}`);
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    "these figures appear in an FAQ answer and nowhere in the article body",
  );
});

test("an FAQ block is never empty and never half-written", () => {
  const offenders: string[] = [];

  for (const article of articles()) {
    if (!article.faq) continue;
    if (!article.faq.en?.length) offenders.push(`${article.slug}: faq present with no English`);
    for (const locale of ["en", "es", "pt"] as const) {
      for (const item of article.faq[locale] ?? []) {
        if (!item.question?.trim()) offenders.push(`${article.slug} [${locale}]: empty question`);
        if (!item.answer?.trim()) offenders.push(`${article.slug} [${locale}]: empty answer`);
        /*
          A question that is not a question reads as a heading, and a retrieval system
          matching a user's query against it loses the thing that made the pair worth
          making. Cheap to check, and it caught two on the first run.
        */
        if (!/[?？]\s*$/.test(item.question)) {
          offenders.push(`${article.slug} [${locale}]: not a question — "${item.question}"`);
        }
      }
    }
  }

  assert.deepEqual(offenders, []);
});

/**
 * The visible block and the markup must come from one call.
 *
 * Google penalises FAQ markup whose answers are not on the page, so the two must not be
 * allowed to drift. Asserting they come from the same function is the cheap version of
 * that — the expensive version is reading the built HTML, which `audit-seo` does.
 */
test("the rendered items and the markup items are the same list", () => {
  const withFaq = articles().filter((article) => article.faq);
  assert.ok(withFaq.length > 0, "expected at least one article to carry an FAQ block");

  for (const article of withFaq) {
    const rendered = articleFaqItems(article, "en");
    assert.deepEqual(rendered, article.faq!.en);
  }
});
