#!/usr/bin/env node
/**
 * Crawls the WHOLE stahlock.com catalogue and caches model, category, specs, features
 * and related models for every product page.
 *
 * ---------------------------------------------------------------------------
 * WHY A SECOND STAHLOCK SCRIPT
 *
 * `fetch-stahlock-features.mjs` already exists and fetched 305 pages. It works from a
 * mapping produced in August that pairs a cantonlock slug with a stahlock page, and it
 * takes only the Features prose. Two things have changed:
 *
 *   1. The catalogue was 435 products then and is 584 now, so the mapping covers barely
 *      half of it. Anything imported since August has no stahlock counterpart recorded.
 *   2. The client asked (2026-09-09, repeated 2026-09-10) for 规格型号数据 — the SPEC and
 *      MODEL data, not the prose. Those are different fields on the page.
 *
 * So this one goes the other way round: enumerate stahlock's own catalogue first, keep
 * everything each page states, and match to our records afterwards. That ordering also
 * finds the models stahlock publishes and we do not — which the mapping-first approach
 * structurally cannot.
 *
 * ---------------------------------------------------------------------------
 * PROVENANCE, AND WHY CRAWLING THIS SITE IS NOT RUDE
 *
 * stahlock.com is the client's OWN other storefront. The client confirmed on 2026-09-04
 * that every Features block there is written and checked by a person. Its robots.txt
 * allows `/` for all agents and disallows only /data/, /extension/, /framework/,
 * /plugins/, /_cache/ and /_config/ — none of which are product pages.
 *
 * There is no sitemap, and product URLs are `index.php?id=N`. The 305 pages already
 * cached span ids 1901–2436, so the sweep runs a little either side of that to find the
 * real boundaries rather than assuming them. One request at a time with a pause, and
 * anything already cached is skipped, because it is a small shared host.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS EXTRACTED, AND WHAT IS DELIBERATELY NOT
 *
 * Each page carries Product JSON-LD (name, sku, image, category, brand) — structured and
 * unambiguous, so that is the primary source. The spec lines sit above "Product Features"
 * as `Label: value` pairs; the features sit below it; related models appear at the foot.
 *
 * NOTHING IS WRITTEN INTO content/products HERE. Fetching and applying stay separate for
 * the same reason the older script split them: a timeout halfway through a 600-page sweep
 * must not leave the catalogue half-changed. Applying is `apply-stahlock-*.mjs`, and it
 * goes through stahlock-cited-policy.mjs, which is what keeps a certification claim on
 * their page from silently becoming a certification claim on ours.
 *
 *   node scripts/crawl-stahlock-catalogue.mjs              # resume; fetch what is missing
 *   node scripts/crawl-stahlock-catalogue.mjs --from 1890 --to 2500
 *   node scripts/crawl-stahlock-catalogue.mjs --limit 25   # a sample first
 *   node scripts/crawl-stahlock-catalogue.mjs --report     # no network; summarise cache
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const CACHE = "docs/research/stahlock-catalogue.json";
const DELAY_MS = 350;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i > -1 ? Number(args[i + 1]) : fallback;
};
const reportOnly = args.includes("--report");
const from = flag("--from", 1890);
const to = flag("--to", 2500);
const limit = flag("--limit", Infinity);

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};

/* ---------------------------------------------------------------- extraction */

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/** Visible text, one entry per element, scripts and styles removed. */
function textNodes(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, ""),
  )
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** The Product JSON-LD block, or null. Primary source: it is structured, not scraped. */
function productJsonLd(html) {
  for (const match of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(decode(match[1].trim()));
      if (parsed?.["@type"] === "Product") return parsed;
    } catch {
      /* A malformed block on their page is not a reason to abandon the page. */
    }
  }
  return null;
}

/**
 * Turn one product page into a record, or null when the id is not a product.
 *
 * The page layout is: heading, `Category: X`, then `Label: value` spec lines, then
 * "Product Features" and the prose, then boilerplate that is identical on every page.
 * The boilerplate is cut by stopping at the first marker rather than by blocklisting
 * phrases — a blocklist would silently start including their marketing copy the day they
 * reword it.
 */
function parse(html, id) {
  const jsonLd = productJsonLd(html);
  const lines = textNodes(html);

  const headingIndex = lines.findIndex((l) => /^STAHLOCK MODEL:/i.test(l));
  if (headingIndex === -1) return null;

  const heading = lines[headingIndex];
  const model = (jsonLd?.sku ?? heading).replace(/^.*MODEL:\s*/i, "").split(/\s+-\s+/)[0].trim();
  if (!model) return null;

  const END = /^(Let's Talk|Our Service|Related Products|Contact us for our product)/i;
  const FEATURES = /^Product Features$/i;

  const specs = [];
  const features = [];
  let inFeatures = false;

  for (const line of lines.slice(headingIndex + 1)) {
    if (END.test(line)) break;
    if (FEATURES.test(line)) {
      inFeatures = true;
      continue;
    }
    if (inFeatures) {
      features.push(line);
      continue;
    }
    /* `Label: value`, where the label is short enough to be a label and not a sentence. */
    const pair = line.match(/^([^:]{2,40}):\s*(.+)$/);
    if (pair) {
      /*
        Strip the bullet or number the page uses for layout before keeping the label.
        Their spec lines are written as "•\tMaterial: ..." and "1.\tLock/unlock ...", and
        carrying the marker into the label produces "•\tMaterial" as a field name — which
        then fails to match our own "Material" and is reported as a missing field that is
        really the same row twice. 217 labels in the first crawl had one.
      */
      const label = pair[1]
        .replace(/^[\s•·*\-–—]+/, "")
        .replace(/^\d+[.)]\s*/, "")
        .trim();
      if (label) specs.push({ label, value: pair[2].trim() });
    }
  }

  /* Related models are printed as "MODEL: 311" at the foot of the page. */
  const related = [
    ...new Set(
      lines
        .slice(headingIndex)
        .map((l) => l.match(/^MODEL:\s*(.+)$/)?.[1]?.trim())
        .filter(Boolean),
    ),
  ];

  return {
    id,
    url: `https://stahlock.com/index.php?id=${id}`,
    model,
    title: heading,
    category: jsonLd?.category ?? specs.find((s) => /^category$/i.test(s.label))?.value ?? null,
    image: jsonLd?.image ?? null,
    specs: specs.filter((s) => !/^category$/i.test(s.label)),
    features,
    related,
    fetchedAt: new Date().toISOString().slice(0, 10),
  };
}

/* ---------------------------------------------------------------- report */

function report() {
  const rows = Object.values(cache);
  console.log(`cached stahlock product pages: ${rows.length}`);
  if (!rows.length) return;

  const byCategory = new Map();
  let specRows = 0;
  for (const row of rows) {
    byCategory.set(row.category ?? "(none)", (byCategory.get(row.category ?? "(none)") ?? 0) + 1);
    specRows += row.specs.length;
  }
  console.log(`spec rows captured: ${specRows}`);
  console.log(`models with at least one spec row: ${rows.filter((r) => r.specs.length).length}`);
  console.log(`models with features prose: ${rows.filter((r) => r.features.length).length}\n`);
  console.log("by stahlock category:");
  for (const [name, n] of [...byCategory].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${name}`);
  }
}

if (reportOnly) {
  report();
  process.exit(0);
}

/* ---------------------------------------------------------------- sweep */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let fetched = 0;
let added = 0;
let skipped = 0;
let missed = 0;

for (let id = from; id <= to; id += 1) {
  if (fetched >= limit) break;
  if (cache[id]) {
    skipped += 1;
    continue;
  }

  let html;
  try {
    const response = await fetch(`https://stahlock.com/index.php?id=${id}`, {
      headers: {
        /* Identify honestly. This is the client's own site and they may read their logs. */
        "user-agent": "cantonlock-catalogue-sync (+https://cantonlock.com)",
      },
      signal: AbortSignal.timeout(20000),
    });
    fetched += 1;
    if (!response.ok) {
      missed += 1;
      await sleep(DELAY_MS);
      continue;
    }
    html = await response.text();
  } catch {
    missed += 1;
    await sleep(DELAY_MS);
    continue;
  }

  const record = parse(html, id);
  if (record) {
    cache[id] = record;
    added += 1;
    if (added % 20 === 0) {
      writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);
      console.log(`  … ${added} new, id ${id}`);
    }
  } else {
    missed += 1;
  }

  await sleep(DELAY_MS);
}

writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`\nfetched ${fetched}, new product pages ${added}, already cached ${skipped}, not a product ${missed}`);
report();
