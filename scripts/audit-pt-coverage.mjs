#!/usr/bin/env node
/**
 * How much of the site actually exists in Portuguese.
 *
 * ---------------------------------------------------------------------------
 * WHY A THIRD LOCALE NEEDS A COUNTER AND THE SECOND ONE DID NOT
 *
 * Spanish shipped as a deliberate, finished mirror: `hasSpanishMirror` lists the prefixes
 * that exist, and a path not on that list gets no hreflang, so the gaps are visible as
 * absent links. Portuguese is arriving incrementally, starting 2026-09-16 from a Brazilian
 * enquiry, and `localised()` gives every unfinished field an English fallback so the page
 * renders rather than crashes.
 *
 * That fallback is the right behaviour and it is also how a translation stalls at 60% for
 * a year: the site looks finished from the inside. So the fallback is counted. A number
 * that moves is a project; a number nobody prints is a hope.
 *
 *   node scripts/audit-pt-coverage.mjs
 *   node scripts/audit-pt-coverage.mjs --json
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const JSON_OUT = process.argv.includes("--json");

/* ---------------------------------------------------------------- products ------ */

const productDir = "content/products";
const products = readdirSync(productDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(productDir, f), "utf8")))
  .filter((p) => !(p.sites ?? []).length || (p.sites ?? []).includes("hyde"));

/**
 * The fields a product needs per locale. `specs` counts as one field rather than per row:
 * a record either has a translated spec table or it does not, and counting eight rows
 * eight times would make the percentage a function of how chatty a record is.
 */
const PRODUCT_FIELDS = ["name", "summary", "specs", "seoTitle", "seoDescription"];

function localeSuffix(field, suffix) {
  return `${field}${suffix}`;
}

/**
 * A field with nothing to translate is not a translation gap.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS DISTINCTION EARNS ITS COMPLEXITY
 *
 * On 2026-09-17 this reported "123 specsPt still falling back" after every translatable
 * spec row had in fact been translated. 136 published products carry an EMPTY spec table
 * in English — the factory has not supplied the dimensions — so there is no Portuguese to
 * write and no amount of translation work will move the number.
 *
 * Counting those as a translation gap points the next session at the wrong job: it looks
 * like an afternoon of glossary work and it is actually a question for the factory. The
 * two are reported separately now, because a number that cannot be moved by the work it
 * appears to describe is worse than no number.
 */
function countRecords(records, fields, suffix) {
  let present = 0;
  let total = 0;
  const missingByField = {};
  const emptySourceByField = {};
  for (const record of records) {
    for (const field of fields) {
      const source = record[field];
      const sourceEmpty = Array.isArray(source) ? source.length === 0 : !source;
      if (sourceEmpty) {
        emptySourceByField[field] = (emptySourceByField[field] ?? 0) + 1;
        continue;
      }
      total += 1;
      const value = record[localeSuffix(field, suffix)];
      const filled = Array.isArray(value) ? value.length > 0 : Boolean(value);
      if (filled) present += 1;
      else missingByField[field] = (missingByField[field] ?? 0) + 1;
    }
  }
  return { present, total, missingByField, emptySourceByField };
}

/* -------------------------------------------------------------------- news ------ */

const newsDir = "content/news";
const news = readdirSync(newsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(newsDir, f), "utf8")));

const NEWS_FIELDS = ["title", "summary", "body", "seoTitle", "seoDescription"];

/* ------------------------------------------------------------------ routes ------ */

/**
 * Route parity, counted from the filesystem rather than from a list.
 *
 * A list of "pages we have translated" is a document that goes stale the first time
 * somebody adds a route. The directory is the truth.
 */
function routeCount(root) {
  if (!existsSync(root)) return 0;
  let n = 0;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "page.tsx") n += 1;
    }
  };
  walk(root);
  return n;
}

/**
 * The question-and-answer blocks, counted separately from the article fields.
 *
 * They live under `faq.<locale>` rather than in a `…Pt` suffixed field, so `countRecords`
 * cannot see them — and that is exactly how 35 Spanish articles carried English Q&A blocks
 * from the day the block shipped until 2026-09-17. Nothing measured it, so nobody knew.
 *
 * A block is counted only when it has the SAME NUMBER OF PAIRS as the English one. A
 * partial translation is not partial coverage here; it is a page that answers fewer
 * questions in one language than in another, which is a content difference rather than a
 * translation gap.
 */
function faqCoverage(locale) {
  const withFaq = news.filter((article) => article.faq?.en?.length);
  const complete = withFaq.filter(
    (article) => article.faq[locale]?.length === article.faq.en.length,
  );
  const pairs = complete.reduce((n, article) => n + article.faq[locale].length, 0);
  return { articles: complete.length, total: withFaq.length, pairs };
}

const faqEs = faqCoverage("es");
const faqPt = faqCoverage("pt");

const esRoutes = routeCount("src/app/es");
const ptRoutes = routeCount("src/app/pt") + routeCount("src/app/(en)/pt");

/* ------------------------------------------------------------------ report ------ */

const productEs = countRecords(products, PRODUCT_FIELDS, "Es");
const productPt = countRecords(products, PRODUCT_FIELDS, "Pt");
const newsEs = countRecords(news, NEWS_FIELDS, "Es");
const newsPt = countRecords(news, NEWS_FIELDS, "Pt");

const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

const report = {
  products: {
    records: products.length,
    es: { ...productEs, percent: pct(productEs.present, productEs.total) },
    pt: { ...productPt, percent: pct(productPt.present, productPt.total) },
  },
  news: {
    records: news.length,
    es: { ...newsEs, percent: pct(newsEs.present, newsEs.total) },
    pt: { ...newsPt, percent: pct(newsPt.present, newsPt.total) },
  },
  faq: {
    es: { ...faqEs, percent: pct(faqEs.articles, faqEs.total) },
    pt: { ...faqPt, percent: pct(faqPt.articles, faqPt.total) },
  },
  routes: { es: esRoutes, pt: ptRoutes, percent: pct(ptRoutes, esRoutes) },
};

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Portuguese coverage, against Spanish as the finished benchmark\n");
  console.log(
    `  product records   ${products.length}   ES ${report.products.es.percent}%   PT ${report.products.pt.percent}%`,
  );
  console.log(
    `  news articles     ${news.length}    ES ${report.news.es.percent}%   PT ${report.news.pt.percent}%`,
  );
  console.log(
    `  article Q&A       ${faqEs.total}    ES ${report.faq.es.percent}%   PT ${report.faq.pt.percent}%` +
      `   (${faqEs.pairs} ES pairs, ${faqPt.pairs} PT pairs)`,
  );
  console.log(
    `  routes            ES ${esRoutes} pages, PT ${ptRoutes} pages   (${report.routes.percent}%)`,
  );

  const missing = Object.entries(productPt.missingByField).sort((a, b) => b[1] - a[1]);
  if (missing.length) {
    console.log("\n  product fields still falling back to English:");
    for (const [field, n] of missing) console.log(`    ${String(n).padStart(4)}  ${field}Pt`);
  }
  const emptySource = Object.entries(productPt.emptySourceByField).sort((a, b) => b[1] - a[1]);
  if (emptySource.length) {
    console.log("\n  product fields with NOTHING to translate (the English is empty too):");
    for (const [field, n] of emptySource) console.log(`    ${String(n).padStart(4)}  ${field}`);
    console.log("    These are questions for the factory, not translation work.");
  }
  const missingNews = Object.entries(newsPt.missingByField).sort((a, b) => b[1] - a[1]);
  if (missingNews.length) {
    console.log("\n  news fields still falling back to English:");
    for (const [field, n] of missingNews) console.log(`    ${String(n).padStart(4)}  ${field}Pt`);
  }
  console.log(
    "\n  ⚠ An English fallback renders correctly and reads as unfinished, which is the point.\n" +
      "    Spanish would read as finished and be wrong — see the note in src/lib/localised.ts.",
  );
}
