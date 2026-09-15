#!/usr/bin/env node
/**
 * Lists every finish UNION publishes for a model, with the finish name it gives each one.
 *
 *   node scripts/scrape-artunion-finishes.mjs MUL2101
 *   node scripts/scrape-artunion-finishes.mjs MUL2101 --write
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS SEPARATE FROM scrape-artunion-specs.mjs
 *
 * That script deliberately keeps ONE VARIANT PER SIZE and not one per finish, and its
 * comment explains why: the numbers it exists to collect — weight, pitch, hole sizes —
 * vary with size, not with whether the brass is mirrored or smoked. Fetching fifteen
 * finishes to read the same weight fifteen times would be rude to UNION's server and
 * would still miss a length.
 *
 * The finish LIST is the opposite question, and it is a real one: the client asked on
 * 2026-09-15 for MUL2101, which UNION publishes in five colours. Those five are five
 * different order codes, and a buyer who wants the black one cannot be told "black" — they
 * need `MUL2101-15-215`.
 *
 * ---------------------------------------------------------------------------
 * WHY THE NAME IS FETCHED AND NOT READ OFF THE PICTURE
 *
 * The client sent a screenshot of the five swatches. One is obviously black and one is
 * obviously gold; the other three are a chrome, a brown and a copper-pink that no honest
 * person names from a phone photograph of a phone screen. UNION states the material and
 * finish for each part number in words. So the words are what we take.
 *
 * Price is not read, in line with the client's standing instruction and with the policy
 * already written into scrape-artunion-specs.mjs.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ORIGIN = "https://www.artunion.co.jp";
const CACHE = "content/rayen/artunion-specs.json";
const DELAY_MS = 1200;
const UA = "RAYEN-spec-reader/1.0 (hardware catalogue; contact via rayen site)";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const argv = process.argv.slice(2);
const model = argv.find((a) => !a.startsWith("--"));
const write = argv.includes("--write");

if (!model) {
  console.error("Usage: node scripts/scrape-artunion-finishes.mjs <MODEL> [--write]");
  process.exit(1);
}

async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": UA } });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  return response.text();
}

async function variantIds(id) {
  const response = await fetch(`${ORIGIN}/products/search_id.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
    body: new URLSearchParams({ id }).toString(),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} search_id`);
  const path = (await response.text()).trim();
  if (!path.startsWith("/")) return [];
  const html = await get(`${ORIGIN}${path}`);
  const ids = new Set();
  for (const m of html.matchAll(/detail\.php\?id=([A-Za-z0-9\-]+)/g)) ids.add(m[1]);
  /* Prefix-exact, same rule as the spec scraper: a search is a substring search. */
  return [...ids].filter((v) => v.toUpperCase().startsWith(`${id.toUpperCase()}-`)).sort();
}

/** UNION prints 材質・仕上 as one string; that string is the finish name. */
function materialFinish(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const at = lines.findIndex((l) => /^材質・?仕上/.test(l));
  return at >= 0 ? (lines[at + 1] ?? "") : "";
}

const ids = await variantIds(model);
await sleep(DELAY_MS);

if (!ids.length) {
  console.error(`${model}: UNION returns no variants for this number.`);
  process.exit(1);
}

const finishes = [];
for (const id of ids) {
  const html = await get(`${ORIGIN}/products/detail.php?id=${encodeURIComponent(id)}`);
  const name = materialFinish(html);
  finishes.push({ id, materialFinish: name });
  console.log(`  ${id.padEnd(20)} ${name || "(材質・仕上 not found)"}`);
  await sleep(DELAY_MS);
}

console.log(`\n${model}: ${finishes.length} published finishes.`);

if (!write) {
  console.log("Nothing written. Re-run with --write to record them in the cache.");
  process.exit(0);
}

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : { models: {} };
cache.models[model] = { ...(cache.models[model] ?? {}), finishes };
cache.fetchedAt = new Date().toISOString();
writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
console.log(`Recorded under models.${model}.finishes in ${CACHE}`);
