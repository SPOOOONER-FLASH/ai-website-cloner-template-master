#!/usr/bin/env node
/**
 * Fetches the human-verified "Features" prose from stahlock.com and caches it.
 *
 * PROVENANCE. stahlock.com is the client's other storefront — their own site, their own
 * copy. The client confirmed on 2026-09-04 that every product's Features block there has
 * been checked by a person, which makes it better source material than anything that
 * could be generated here: it describes what the part actually does, in the words the
 * company already uses.
 *
 * The URL for each product comes from the mapping kimi produced in August
 * (docs/collaboration/reviews/2026-08-29-kimi-seo-stahlock/), which pairs a cantonlock
 * slug with a stahlock page and was reviewed at the time. 305 of 435 products have one.
 *
 * TWO STAGES ON PURPOSE. This one only fetches and caches; nothing is written into the
 * catalogue. Applying it is a separate, reviewable step, because "copy 305 descriptions
 * into the product records" is not something that should happen inside a network loop
 * where a timeout halfway through leaves the catalogue half-changed.
 *
 * POLITE. One request at a time with a pause between, and anything already cached is
 * skipped — so a re-run after a failure fetches only what is missing. Their server is a
 * small shared host and this is 305 pages.
 *
 * Usage:
 *   node scripts/fetch-stahlock-features.mjs            # fetch what is missing
 *   node scripts/fetch-stahlock-features.mjs --limit 20 # a sample first
 *   node scripts/fetch-stahlock-features.mjs --refetch  # ignore the cache
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

const MAPPING_DIR = "docs/collaboration/reviews/2026-08-29-kimi-seo-stahlock";
const CACHE = "docs/research/stahlock-features.json";
const DELAY_MS = 350;

const args = process.argv.slice(2);
const refetch = args.includes("--refetch");
const limitFlag = args.indexOf("--limit");
const limit = limitFlag > -1 ? Number(args[limitFlag + 1]) : Infinity;

/* ----------------------------------------------------------------- mapping */

const urlBySlug = new Map();
for (const file of ["stahlock_mapping_dryrun.csv", "stahlock_category_mismatch.csv"]) {
  const path = `${MAPPING_DIR}/${file}`;
  if (!existsSync(path)) continue;
  const [head, ...lines] = readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean);
  const cols = head.replace(/^﻿/, "").split(",");
  const slugAt = cols.indexOf("cantonlock_slug");
  const urlAt = cols.indexOf("stahlock_url");
  const modelAt = cols.indexOf("stahlock_model");
  for (const line of lines) {
    const c = line.split(",");
    if (!c[slugAt] || !c[urlAt] || urlBySlug.has(c[slugAt])) continue;
    urlBySlug.set(c[slugAt], { url: c[urlAt], stahlockModel: c[modelAt] ?? "" });
  }
}

/** Only slugs we actually publish — the mapping predates several catalogue changes. */
const slugs = new Set(
  readdirSync("content/products")
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")).slug),
);

const targets = [...urlBySlug.entries()].filter(([slug]) => slugs.has(slug));

/* ------------------------------------------------------------- extraction */

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Pulls the Features paragraphs out of the page.
 *
 * The block is `<div class="pro-contentok-left">` holding a `<strong>Features:</strong>`
 * heading and then one `<p>` per point. The heading paragraph and the empty `<p><br/></p>`
 * spacers the CMS emits are dropped; what is left is the sentences a person wrote.
 */
function extractFeatures(html) {
  const block = /<div class="pro-contentok-left">([\s\S]*?)<\/div>/i.exec(html);
  if (!block) return [];
  return [...block[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, " ")))
    /*
      Drop the section headings the CMS leaves inside the block. Some pages open with
      "Features:", others with "Description:" or "Product Description:" — a heading is not
      a sentence about the product, and carrying one through would put the word
      "Description:" at the top of a product summary on our site.
    */
    .filter((t) => t && !/^(product\s+)?(features|description|specifications?)\s*[:：]?$/i.test(t));
}

function extractTitle(html) {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  return h1 ? decode(h1[1].replace(/<[^>]+>/g, " ")) : "";
}

/* ------------------------------------------------------------------ fetch */

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};
const todo = targets.filter(([slug]) => refetch || !cache[slug]).slice(0, limit);

console.log(
  `${targets.length} products mapped to stahlock · ${Object.keys(cache).length} cached · fetching ${todo.length}`,
);

let ok = 0;
let empty = 0;
let failed = 0;

for (const [index, [slug, { url, stahlockModel }]] of todo.entries()) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "cantonlock.com content sync (same owner)" },
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const features = extractFeatures(html);
    cache[slug] = {
      url,
      stahlockModel,
      title: extractTitle(html),
      features,
      fetchedAt: new Date().toISOString().slice(0, 10),
    };
    if (features.length) ok += 1;
    else empty += 1;
  } catch (error) {
    failed += 1;
    cache[slug] = { url, stahlockModel, error: String(error).slice(0, 120) };
  }

  if ((index + 1) % 25 === 0 || index === todo.length - 1) {
    writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);
    console.log(`  ${index + 1}/${todo.length} — ${ok} with features, ${empty} empty, ${failed} failed`);
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
}

writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);

const withFeatures = Object.values(cache).filter((c) => c.features?.length).length;
console.log(
  `\n${CACHE}: ${Object.keys(cache).length} pages cached, ${withFeatures} carry Features text.`,
);
