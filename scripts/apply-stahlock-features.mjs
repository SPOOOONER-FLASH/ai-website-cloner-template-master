#!/usr/bin/env node
/**
 * Writes the stahlock Features prose into product records that have nothing better.
 *
 * WHAT THIS FIXES. 126 products carry no usable one-line summary — the sentence that
 * shows in listings, in search results and in the Google snippet. That was the largest
 * single content gap on the site and the only fix on offer was somebody writing 126
 * descriptions by hand. stahlock is the client's own storefront and its Features text has
 * been checked by a person, so it is better source material than anything generated here.
 *
 * THE RULES, and each of them exists to stop a specific bad outcome:
 *
 *   1. NOTHING IS OVERWRITTEN. A product with a real summary keeps it. The two sites have
 *      diverged since the mapping was made and the version here has been edited since.
 *   2. NO CERTIFICATION OR STANDARD CLAIMS. Any sentence reaching for EN 1125, ANSI, CE,
 *      "fire rated" or "certified" is dropped, exactly as scripts/stahlock-cited.mjs does
 *      for spec rows. stahlock is a storefront, not a certificate, and this site removed
 *      those claims deliberately on 2026-08-27. Re-importing them through a description
 *      would undo that quietly.
 *   3. NO MARKETING FILLER. "High quality", "best price", "customer satisfaction" — a
 *      sentence that would apply to any product in any catalogue tells a buyer nothing and
 *      tells an answer engine less.
 *   4. LENGTH IS BOUNDED. The summary is a one-liner; three sentences of prose belongs on
 *      the product page, not in a listing card. Longer text is kept whole in `features`
 *      and only the first usable sentence becomes the summary.
 *
 * Every write records where it came from, so any sentence on the site can be traced back
 * to the stahlock page it was read from.
 *
 * Usage:
 *   node scripts/apply-stahlock-features.mjs           # report
 *   node scripts/apply-stahlock-features.mjs --write
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CACHE = "docs/research/stahlock-features.json";
const DIR = "content/products";
const write = process.argv.includes("--write");

if (!existsSync(CACHE)) {
  console.error(`${CACHE} not found — run scripts/fetch-stahlock-features.mjs first.`);
  process.exit(1);
}

const cache = JSON.parse(readFileSync(CACHE, "utf8"));

/** Same guard as scripts/stahlock-cited-policy.mjs. Word boundaries on both sides. */
const CERTIFICATION =
  /\b(?:standard|certif(?:icate|ication|ied)?|EN\s?1\d{3,4}|ANSI|BHMA|CE|fire[\s-]?rated|UL[\s-]?listed|approved)\b/i;

/** Sentences that would be true of anything. */
const FILLER =
  /\b(?:high quality|best price|competitive price|customer satisfaction|welcome to|OEM.{0,12}ODM available|we are a|our company|factory direct)\b/i;

/*
  28, not 40. The first cut used 40 and it was throwing away the best line on the page:
  "External handle for panic bar systems" is 37 characters, names the product, and is
  exactly what a listing card wants — while the 48-character "Adjustable spindle length
  based on door thickness" sailed through and became the summary instead. A length floor
  is a proxy for informativeness and a bad one; the scoring below is the real filter.
*/
const MIN = 28;
const MAX = 220;
/** Below this, one sentence is too thin to stand alone as the summary. */
const JOIN_UNDER = 60;

const sentences = (text) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Words that mean the sentence is naming the thing rather than an attribute of it. */
const PRODUCT_NOUN =
  /\b(handle|trim|lever|knob|device|lock|latch|bar|hinge|closer|cylinder|bolt|stopper|viewer|pull|set|plate|escutcheon|fitting|spring)\b/i;

/** Attribute bullets. True of the product, but not an answer to "what is this". */
const ATTRIBUTE_OPENER =
  /^(adjustable|available|optional|suitable|compatible|supplied|standard|comes with|can be|finish|material|size|packing)\b/i;

/**
 * The best sentence to publish as a one-line summary, or null.
 *
 * SCORED, NOT FIRST-WINS. The first usable sentence gave model 027 the summary
 * "Adjustable spindle length based on door thickness" — true, and useless as the line a
 * buyer reads in a listing, because it never says the product is an exterior lever trim.
 * A listing summary has one job: say what the thing IS. So a sentence naming the product
 * outranks an attribute bullet, and length breaks ties because the longer of two
 * descriptive sentences carries more of the answer.
 */
function pickSummary(features) {
  const candidates = [];
  for (const block of features) {
    for (const sentence of sentences(block)) {
      if (sentence.length < MIN || sentence.length > MAX) continue;
      if (CERTIFICATION.test(sentence)) continue;
      if (FILLER.test(sentence)) continue;

      let score = 0;
      if (PRODUCT_NOUN.test(sentence)) score += 100;
      if (ATTRIBUTE_OPENER.test(sentence)) score -= 60;
      // Longer is more informative, but only up to the point of being a paragraph.
      score += Math.min(sentence.length, 160) / 4;
      candidates.push({ sentence, score });
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  /*
    NOTHING RATHER THAN SOMETHING WRONG. If no sentence on the page names the product,
    every candidate is an attribute bullet, and "Adjustable spindle length based on door
    thickness" as a product's entire description is worse than a blank: a blank is a gap we
    can still see and chase, a wrong line looks finished. Same rule we give the colleague
    filling in the data sheet — if you are not sure, leave it empty.
  */
  if (!PRODUCT_NOUN.test(best.sentence)) return null;

  /*
    Many pages are bullet lists rather than prose, so the best line is a short phrase.
    Adding the next descriptive bullet turns "External lever handle for panic bar" into
    something that also says what it does, which is what a listing card is for.
  */
  if (best.sentence.length < JOIN_UNDER) {
    const second = candidates.find(
      (c) => c !== best && !ATTRIBUTE_OPENER.test(c.sentence) && c.sentence.length >= 20,
    );
    if (second) {
      const join = (s) => s.replace(/[.\s]+$/, "");
      return `${join(best.sentence)}. ${join(second.sentence)}.`;
    }
  }

  return best.sentence;
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
const applied = [];
const skippedHasSummary = [];
const skippedNoUsable = [];
const rejected = [];

for (const file of files) {
  const path = join(DIR, file);
  const product = JSON.parse(readFileSync(path, "utf8"));
  const entry = cache[product.slug];
  if (!entry?.features?.length) continue;

  /*
    Two thresholds, because they answer different questions. ADEQUATE (40) is "is the
    summary already there good enough to leave alone" — the same number the design brief
    uses to count a product as needing one, so the two reports agree. MIN (28) is "is this
    candidate SENTENCE usable", which is a lower bar: "External handle for panic bar
    systems" is 37 characters and is a better line than most of what it replaces.

    Using one number for both silently reclassified every 28-to-40-character summary as
    adequate, and thirty products that the design brief still lists as missing a
    description would have been skipped here.
  */
  const ADEQUATE = 40;
  if (product.summary && product.summary.trim().length >= ADEQUATE) {
    skippedHasSummary.push(product.model);
    continue;
  }

  const summary = pickSummary(entry.features);
  if (!summary) {
    skippedNoUsable.push(product.model);
    for (const block of entry.features) {
      for (const s of sentences(block)) {
        if (CERTIFICATION.test(s)) rejected.push(`[cert] ${product.model}: ${s.slice(0, 90)}`);
        else if (FILLER.test(s)) rejected.push(`[filler] ${product.model}: ${s.slice(0, 90)}`);
      }
    }
    continue;
  }

  applied.push({ model: product.model, slug: product.slug, summary, url: entry.url });

  if (write) {
    product.summary = summary;
    /* Provenance, so any sentence can be traced back to the page it was read from. */
    product.summarySource = entry.url;
    writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
  }
}

console.log(
  `${Object.keys(cache).length} cached pages · ${applied.length} summaries ${write ? "written" : "available"}\n` +
    `skipped: ${skippedHasSummary.length} already had one, ${skippedNoUsable.length} had nothing usable`,
);

console.log("\nsample of what would be written:");
for (const a of applied.slice(0, 8)) console.log(`  ${a.model.padEnd(12)} ${a.summary}`);

if (rejected.length) {
  console.log(`\n${rejected.length} sentence(s) rejected by the guards:`);
  for (const r of rejected.slice(0, 8)) console.log(`  ${r}`);
}

if (!write) console.log("\n--write not given; nothing written.");
