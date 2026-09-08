#!/usr/bin/env node
/**
 * Cross-references a Bing/Google keyword export against the catalogue.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS FOR
 *
 * A keyword export read by eye tells you almost nothing: it is a hundred lines of
 * alphanumeric noise, and the temptation is to skim it, find three that look like
 * questions, and write about those. The useful questions are different and none of them
 * can be answered by reading:
 *
 *   · Which searched model numbers do we actually publish? Those are people looking for
 *     a specific part we sell, and every one of them should land on that part's page.
 *   · Which do we NOT publish? Either a competitor's model, or — more interestingly —
 *     one of ours that has no page because it has no photograph.
 *   · Which queries are shaped like a question or a comparison? Those are article briefs
 *     written by the market rather than by us.
 *   · Which ask for a document — CAD, BIM, cutsheet, catalogue, PDF? That is a distinct
 *     demand and it is not answered by any amount of prose.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS ALSO EVIDENCE OF WHO IS SEARCHING
 *
 * The client asked, reasonably, whether the impressions were real people or the two
 * agents working on this site. Query SHAPE answers it in a way volume cannot: barcodes,
 * other companies' model numbers, pasted BOM lines, non-English queries and misspellings
 * are things a search engine records when a human types them and nobody's tooling
 * produces. So this also counts those classes.
 *
 * Usage:
 *   node scripts/analyse-search-terms.mjs <keyword-report.csv> [--json]
 *
 * The CSV is the Bing Webmaster "Keyword report" export: 关键字,印象数,点击次数,点击率,平均排名
 */

import { readFileSync, readdirSync } from "node:fs";

const [, , csvPath] = process.argv;
const JSON_OUT = process.argv.includes("--json");

if (!csvPath) {
  console.error("usage: node scripts/analyse-search-terms.mjs <keyword-report.csv> [--json]");
  process.exit(1);
}

/* -------------------------------------------------------------------------
 * The catalogue, indexed by every string a buyer might type at us
 * ---------------------------------------------------------------------- */

const products = [];
for (const file of readdirSync("content/products")) {
  if (!file.endsWith(".json")) continue;
  const record = JSON.parse(readFileSync(`content/products/${file}`, "utf8"));
  products.push({
    model: record.model,
    slug: record.slug,
    family: (record.categoryPath ?? [])[0] ?? "",
    published: Boolean(record.heroImage?.src),
  });
}

/** Model numbers vary in spacing and case across the catalogue and in what people type. */
const key = (s) => s.toLowerCase().replace(/[\s._*×/-]/g, "");

const byKey = new Map();
for (const product of products) {
  const k = key(product.model);
  if (!byKey.has(k)) byKey.set(k, product);
}

/* -------------------------------------------------------------------------
 * Query classification
 * ---------------------------------------------------------------------- */

/* A question a buyer asked in words — the strongest article brief there is. */
const QUESTION = /\b(what|which|how|why|when|where|vs|versus|difference|between|cual|cómo|qué|para que)\b/i;

/* Someone wants a file, not a paragraph. */
const DOCUMENT = /\b(pdf|cad|bim|dwg|dxf|cutsheet|cut sheet|catalog|catalogue|catlogue|ficha|datasheet|data sheet|spec sheet|drawing|模型|图纸|样本)\b/i;

/* A barcode: EAN-13 or UPC-A, typed or scanned off a carton. */
const BARCODE = /^\d{12,14}$/;

/* Non-Latin or clearly non-English tokens — a buyer in their own language. */
const NON_ENGLISH = /[一-鿿Ѐ-ӿ]|(?:cerradura|bloquedor|pintu|ficha|tecnica|técnica|puerta|manija|arriba|solicitud)/i;

/* Our own name, however mangled. Navigational intent: they already know the company. */
const BRAND = /canton|hyland|hylan|cantonlock|conton|hyde/i;

/** Every model-number-looking token in a query. */
function modelTokens(query) {
  return (query.match(/\b[a-z]{0,4}[-\s]?\d{2,6}[a-z]{0,4}\b/gi) ?? [])
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
}

/* -------------------------------------------------------------------------
 * Read the export
 * ---------------------------------------------------------------------- */

const rows = readFileSync(csvPath, "utf8")
  .replace(/^﻿/, "")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    /* Fields are quoted and the query itself can contain commas — see the Hindalco row. */
    const fields = [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replaceAll('""', '"'));
    if (fields.length < 5) return null;
    const [query, impressions, clicks, , position] = fields;
    return {
      query,
      impressions: Number(impressions) || 0,
      clicks: Number(clicks) || 0,
      position: Number(position) || 0,
    };
  })
  .filter(Boolean);

const buckets = {
  matchedPublished: [],
  matchedUnpublished: [],
  modelNotOurs: [],
  questions: [],
  documents: [],
  barcodes: [],
  nonEnglish: [],
  brand: [],
};

for (const row of rows) {
  const q = row.query;

  if (BARCODE.test(q.replace(/\s/g, ""))) buckets.barcodes.push(row);
  if (QUESTION.test(q)) buckets.questions.push(row);
  if (DOCUMENT.test(q)) buckets.documents.push(row);
  if (NON_ENGLISH.test(q)) buckets.nonEnglish.push(row);
  if (BRAND.test(q)) buckets.brand.push(row);

  /* Model matching: any token in the query that resolves to a catalogue record. */
  let hit = null;
  for (const token of modelTokens(q)) {
    const product = byKey.get(key(token));
    if (product) {
      hit = { ...row, token, ...product };
      break;
    }
  }
  if (hit) {
    (hit.published ? buckets.matchedPublished : buckets.matchedUnpublished).push(hit);
  } else if (modelTokens(q).length && !BRAND.test(q) && !BARCODE.test(q.replace(/\s/g, ""))) {
    buckets.modelNotOurs.push({ ...row, tokens: modelTokens(q) });
  }
}

const total = rows.reduce((sum, r) => sum + r.impressions, 0);

if (JSON_OUT) {
  console.log(JSON.stringify({ rows: rows.length, impressions: total, buckets }, null, 1));
} else {
  console.log(`${rows.length} queries, ${total} impressions\n`);

  const show = (title, list, format) => {
    console.log(`── ${title} (${list.length}) ──`);
    for (const row of list.slice(0, 25)) console.log(`   ${format(row)}`);
    if (list.length > 25) console.log(`   … and ${list.length - 25} more`);
    console.log();
  };

  const imp = (r) => String(r.impressions).padStart(3);

  show(
    "model numbers we publish — these should land on the product page",
    buckets.matchedPublished,
    (r) => `${imp(r)}  "${r.query}"  →  /products/${r.family}/${r.slug}/`,
  );
  show(
    "model numbers we hold but do NOT publish (no photograph → noindex)",
    buckets.matchedUnpublished,
    (r) => `${imp(r)}  "${r.query}"  →  ${r.model} is built but noindex`,
  );
  show(
    "questions and comparisons — article briefs written by the market",
    buckets.questions,
    (r) => `${imp(r)}  "${r.query}"  (avg pos ${r.position.toFixed(1)})`,
  );
  show(
    "someone wants a FILE, not prose",
    buckets.documents,
    (r) => `${imp(r)}  "${r.query}"`,
  );
  show("barcodes typed or scanned off a carton", buckets.barcodes, (r) => `${imp(r)}  "${r.query}"`);
  show("not in English", buckets.nonEnglish, (r) => `${imp(r)}  "${r.query}"`);
  show(
    "model-shaped queries that match nothing of ours",
    buckets.modelNotOurs,
    (r) => `${imp(r)}  "${r.query.slice(0, 70)}"`,
  );

  const brandImpressions = buckets.brand.reduce((s, r) => s + r.impressions, 0);
  const brandClicks = buckets.brand.reduce((s, r) => s + r.clicks, 0);
  console.log(
    `── brand queries: ${buckets.brand.length} terms, ${brandImpressions} impressions, ` +
      `${brandClicks} clicks (${((brandClicks / brandImpressions) * 100 || 0).toFixed(1)}% CTR) ──`,
  );
  console.log(
    "   Navigational: they already know the company. High CTR here is the signature of\n" +
      "   real people looking for a supplier they have heard of, not of automated traffic.\n",
  );
}
