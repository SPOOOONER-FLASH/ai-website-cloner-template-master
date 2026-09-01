#!/usr/bin/env node
/**
 * Measures commercial-intent vocabulary on the built category pages.
 *
 * The question this answers is narrow and worth stating, because keyword work attracts
 * vagueness: for each of the fifteen category pages, does the visible copy contain the
 * words a buyer uses when they are trying to BUY rather than to learn — manufacturer,
 * supplier, MOQ, lead time, wholesale, sample — and does it contain the head term at all
 * outside the title?
 *
 * It reads the EXPORT, not the source, because what ships is what gets crawled. Text is
 * taken from the rendered HTML with tags stripped, so a word that only exists in a meta
 * tag or a JSON-LD blob does not count as body copy. That distinction is the entire
 * point: structured data tells a crawler what the page IS, body copy is what an answer
 * engine can quote.
 *
 * Usage:
 *   node scripts/audit-keyword-coverage.mjs           # per-category table
 *   node scripts/audit-keyword-coverage.mjs --missing # only what is absent
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const library = JSON.parse(
  readFileSync(join(root, "docs/research/commercial-keywords.json"), "utf8"),
);

/** Visible text only: drop script, style and every tag, then collapse whitespace. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function titleOf(html) {
  return (/<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? "").toLowerCase();
}

const { commercial, transactional, qualifying } = library.intentModifiers;
const missingOnly = process.argv.includes("--missing");
const allTerms = [...commercial, ...transactional, ...qualifying];

/*
  CHROME HAS TO BE SUBTRACTED OR THIS SCRIPT LIES.

  The first version of this audit reported that all fifteen category pages carried
  commercial and transactional vocabulary, which looked like a solved problem. Every page
  scored identically — 3/7 and 2/8 — and identical scores across fifteen different pages
  is not coverage, it is a shared header and footer. The words it was finding were
  "manufacturer", "supplier", "factory", "price", "catalogue", "export": the nav, the
  Alibaba block and the footer, present on all 941 pages including the 404.

  A term that appears on every page distinguishes nothing and cannot help any page rank
  for anything. So the intersection across all pages is computed first and treated as
  chrome; what each page is credited with is only what it says that its siblings do not.
*/
const pages = [];
for (const category of library.categories) {
  const file = join(root, "out/products", category.slug, "index.html");
  if (!existsSync(file)) {
    pages.push({ category, error: "not in out/ — build first" });
    continue;
  }
  const html = readFileSync(file, "utf8");
  pages.push({ category, body: visibleText(html), title: titleOf(html) });
}

const readable = pages.filter((p) => !p.error);
const chrome = new Set(
  allTerms.filter((term) =>
    readable.every((p) => p.body.includes(term.toLowerCase())),
  ),
);

const rows = [];
let pagesRead = 0;

for (const page of pages) {
  const { category } = page;
  if (page.error) {
    rows.push({ slug: category.slug, error: page.error });
    continue;
  }
  pagesRead += 1;

  const head = category.published.toLowerCase().replace(/ & /g, " ");
  const singular = category.anchor?.toLowerCase() ?? null;

  /** Own copy only: on this page, and not on every other page too. */
  const own = (list) =>
    list.filter((t) => !chrome.has(t) && page.body.includes(t.toLowerCase()));

  rows.push({
    slug: category.slug,
    anchorRank: category.anchorRank ?? null,
    headInBody: page.body.includes(head),
    singularInBody: singular ? page.body.includes(singular) : null,
    inTitle: page.title.includes(head.split(" ")[0]),
    commercial: own(commercial),
    transactional: own(transactional),
    qualifying: own(qualifying),
    words: page.body.split(" ").filter(Boolean).length,
  });
}

if (!pagesRead) {
  console.log("No category pages found in out/. Run `npm run build` first.");
  process.exit(0);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  `commercial-intent coverage over ${pagesRead} built category pages\n` +
    `(text is taken from rendered HTML with tags stripped — meta and JSON-LD do not count)\n`,
);

console.log(`chrome — on every page, so credited to none: ${[...chrome].join(", ") || "none"}
`);

console.log(
  `${pad("category", 26)}${pad("anchor", 7)}${pad("words", 7)}${pad("comm", 6)}${pad("txn", 5)}qualifying`,
);
console.log("-".repeat(78));

for (const r of rows) {
  if (r.error) {
    console.log(`${pad(r.slug, 26)}${r.error}`);
    continue;
  }
  if (missingOnly && r.commercial.length && r.transactional.length) continue;
  console.log(
    `${pad(r.slug, 26)}${pad(r.anchorRank ?? "—", 7)}${pad(r.words, 7)}` +
      `${pad(`${r.commercial.length}/${commercial.length}`, 6)}` +
      `${pad(`${r.transactional.length}/${transactional.length}`, 5)}` +
      `${r.qualifying.length}/${qualifying.length}`,
  );
}

const withCommercial = rows.filter((r) => !r.error && r.commercial.length).length;
const withTransactional = rows.filter((r) => !r.error && r.transactional.length).length;
const headMissing = rows.filter((r) => !r.error && !r.headInBody);

console.log("");
console.log(`pages whose body copy carries any commercial word    : ${withCommercial}/${pagesRead}`);
console.log(`pages whose body copy carries any transactional word : ${withTransactional}/${pagesRead}`);

if (headMissing.length) {
  console.log("");
  console.log("head term missing from body copy entirely (it exists only in the title):");
  for (const r of headMissing) console.log(`   ${r.slug}`);
}

const noAnchor = library.categories.filter((c) => !c.anchor);
console.log("");
console.log(
  `categories nobody links to with a descriptive word: ${noAnchor.length}/15 — ` +
    noAnchor.map((c) => c.slug).join(", "),
);
