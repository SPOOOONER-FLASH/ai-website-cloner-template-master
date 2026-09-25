#!/usr/bin/env node
/**
 * Reads every exported /pt/ page and reports the English still visible on it.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS READS THE BUILT HTML AND NOT THE DATA
 *
 * `npm run audit:pt` counts translated FIELDS — product names, article bodies, Q&A pairs —
 * and on 2026-09-17 it reported news at 100% and products at 96% while the client opened
 * the Portuguese site and found English on most pages he clicked.
 *
 * Both numbers were true. The gap is everything that is not a data field: navigation
 * labels, button copy, form labels, table headers, empty states, breadcrumbs, filter
 * facets, the strings inside components. A field audit cannot see any of it, because none
 * of it is a field.
 *
 * So this one reads what a reader actually receives. It is the same rule that found every
 * other defect in this tree: the only place a locale bug is visible is the exported HTML.
 *
 * ---------------------------------------------------------------------------
 * HOW IT DECIDES A STRING IS ENGLISH
 *
 * It does not guess at language. It compares: a phrase is reported when it appears in the
 * /pt/ page AND in the English twin of that page, and does NOT appear in the Spanish twin.
 * Spanish is the control. If a phrase survives translation into Spanish unchanged it is a
 * model number, a standard, a finish code or a brand — not English prose — and it is not
 * reported. If Spanish changed it and Portuguese did not, Portuguese is untranslated.
 *
 * That comparison is why this can run without a dictionary and without false alarms on
 * "EN 1125", "SSET", "HYDE" or "304/201".
 *
 * Usage:
 *   node scripts/audit-pt-pages.mjs            # summary, worst routes first
 *   node scripts/audit-pt-pages.mjs --full     # every phrase, grouped by route
 *   node scripts/audit-pt-pages.mjs --json
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
/*
  2026-09-25: generalised from audit-pt-pages.mjs to any locale. `--locale de` reads out/de/;
  Spanish stays the control group (a phrase the Spanish page translated and this page did
  not is untranslated interface copy; a phrase Spanish kept is a model number or a
  standard). Everything below is the Portuguese audit with "pt" made a parameter.
*/
const LOCALE = process.argv.find((a) => a.startsWith("--locale="))?.slice(9) ?? process.argv[process.argv.indexOf("--locale") + 1] ?? "pt";
if (!/^[a-z]{2}$/.test(LOCALE)) {
  console.error("usage: node scripts/audit-locale-pages.mjs --locale de [--full] [--json]");
  process.exit(2);
}
const FULL = process.argv.includes("--full");
const JSON_OUT = process.argv.includes("--json");

/* ------------------------------------------------------------------ text ------ */

/**
 * Visible text only: script, style and JSON-LD are stripped before anything else.
 *
 * The RSC payload at the end of every Next export repeats the whole page as escaped
 * JSON, so leaving `<script>` in would double-count every phrase and report the English
 * of a *different* page that happened to be in a shared chunk.
 */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * The phrases worth comparing.
 *
 * Two or more words, because a single word is as likely to be a model number or a finish
 * code as it is to be prose, and the Spanish control cannot tell those apart either.
 */
function phrases(text) {
  return new Set(
    text
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " "))
      .filter((line) => line.length >= 8 && line.length <= 240)
      .filter((line) => /\s/.test(line))
      .filter((line) => /[A-Za-z]{3}/.test(line)),
  );
}

/* ----------------------------------------------------------------- pages ------ */

function pages(dir) {
  const found = [];
  if (!existsSync(dir)) return found;
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "index.html") found.push(path);
    }
  };
  walk(dir);
  return found;
}

const ptPages = pages(join(OUT, LOCALE));
if (!ptPages.length) {
  console.error(`No ${LOCALE} pages under ${OUT}/${LOCALE}. Run a build first.`);
  process.exit(1);
}

/* --------------------------------------------------------------- compare ------ */

const routes = [];
let missingEnglishTwin = 0;

for (const ptPath of ptPages) {
  /* out/pt/products/x/index.html -> /products/x/ */
  const route =
    "/" + relative(join(OUT, LOCALE), ptPath).split(sep).slice(0, -1).join("/") + "/";
  const clean = route === "//" ? "/" : route;

  const enPath = join(OUT, clean, "index.html");
  const esPath = join(OUT, "es", clean, "index.html");
  if (!existsSync(enPath)) {
    /* A Portuguese-only page — /pt/ferragens-porta-corta-fogo/ — has nothing to compare. */
    missingEnglishTwin += 1;
    continue;
  }

  const pt = phrases(visibleText(readFileSync(ptPath, "utf8")));
  const en = phrases(visibleText(readFileSync(enPath, "utf8")));
  const es = existsSync(esPath)
    ? phrases(visibleText(readFileSync(esPath, "utf8")))
    : null;

  const english = [];
  for (const phrase of pt) {
    if (!en.has(phrase)) continue;
    /*
      No Spanish twin means no control, so the phrase is reported only if Portuguese and
      English agree — which on those few routes over-reports rather than under-reports,
      and over-reporting is the safe direction for an audit somebody acts on.
    */
    if (es && es.has(phrase)) continue;
    english.push(phrase);
  }

  routes.push({ route: `/${LOCALE}${clean}`, english: english.sort(), total: pt.size });
}

/* ---------------------------------------------------------------- report ------ */

const withEnglish = routes.filter((r) => r.english.length).sort(
  (a, b) => b.english.length - a.english.length,
);

/** The same phrase on many routes is one component, not many bugs. */
const byPhrase = new Map();
for (const { route, english } of withEnglish) {
  for (const phrase of english) {
    if (!byPhrase.has(phrase)) byPhrase.set(phrase, []);
    byPhrase.get(phrase).push(route);
  }
}
const ranked = [...byPhrase.entries()].sort((a, b) => b[1].length - a[1].length);

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      { pages: routes.length, withEnglish: withEnglish.length, phrases: ranked.length, routes: withEnglish },
      null,
      2,
    ),
  );
  process.exit(0);
}

console.log("Portuguese pages, against the English and Spanish twins of each route\n");
console.log(`  pages compared        ${routes.length}`);
console.log(`  pages with English    ${withEnglish.length}`);
console.log(`  distinct phrases      ${ranked.length}`);
if (missingEnglishTwin) {
  console.log(`  ${LOCALE}-only            ${missingEnglishTwin} (no twin to compare)`);
}

console.log(`\nMost widespread untranslated phrases — fix these first:\n`);
for (const [phrase, on] of ranked.slice(0, FULL ? ranked.length : 40)) {
  const label = phrase.length > 96 ? `${phrase.slice(0, 93)}…` : phrase;
  console.log(`  ${String(on.length).padStart(4)} pages  ${label}`);
}

if (FULL) {
  console.log(`\n\nBy route:\n`);
  for (const { route, english } of withEnglish) {
    console.log(`  ${route}  — ${english.length}`);
    for (const phrase of english) console.log(`      ${phrase}`);
  }
} else if (ranked.length > 40) {
  console.log(`\n  … ${ranked.length - 40} more. Run with --full for all of them.`);
}

console.log(
  "\n⚠ A phrase is reported only when the Spanish page translated it and the Portuguese\n" +
    "  page did not. Model numbers, finish codes and standards are therefore excluded\n" +
    "  automatically — they are identical in Spanish too.",
);
