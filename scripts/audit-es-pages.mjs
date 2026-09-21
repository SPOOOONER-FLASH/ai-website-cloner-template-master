#!/usr/bin/env node
/**
 * Reads every exported /es/ page and reports the English still visible on it.
 *
 * ---------------------------------------------------------------------------
 * WHY THE SPANISH TREE NEEDS THIS TOO, AND WHY IT COULD NOT HAVE EXISTED BEFORE
 *
 * The Portuguese audit works by comparison: a phrase is reported when the /pt/ page agrees
 * with the English twin and the SPANISH twin has changed it. Spanish was the control
 * because Spanish was the finished tree.
 *
 * On 2026-09-17 that stopped being true in the useful direction — Portuguese reached 0
 * English phrases across 690 pages while nobody had ever counted Spanish. So the control
 * flips: here PORTUGUESE is the control, and a phrase is reported when it appears in the
 * /es/ page AND in the English twin AND NOT in the Portuguese twin.
 *
 * The client's own evidence for running it: the Clarity sessions of 2026-09-17 are full of
 * Spain, Colombia, Mexico and Panama landing on /es/ pages, several of them straight from
 * ChatGPT. Spanish is not a mirror we keep for completeness; it is where the buyers are.
 *
 * Usage:
 *   node scripts/audit-es-pages.mjs            # summary, worst routes first
 *   node scripts/audit-es-pages.mjs --full     # every phrase, grouped by route
 *   node scripts/audit-es-pages.mjs --json
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const FULL = process.argv.includes("--full");
const JSON_OUT = process.argv.includes("--json");

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
 * code as it is to be prose, and the control cannot tell those apart either. That rule
 * has a known blind spot — it is why "Dirección" sat on a Portuguese page for a week —
 * so single-word residue is caught by morphology greps instead, not here.
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

const esPages = pages(join(OUT, "es"));
if (!esPages.length) {
  console.error(`No Spanish pages under ${OUT}/es. Run a build first.`);
  process.exit(1);
}

const routes = [];
let missingEnglishTwin = 0;

for (const esPath of esPages) {
  /* out/es/products/x/index.html -> /products/x/ */
  const route =
    "/" + relative(join(OUT, "es"), esPath).split(sep).slice(0, -1).join("/") + "/";
  const clean = route === "//" ? "/" : route;

  const enPath = join(OUT, clean, "index.html");
  const ptPath = join(OUT, "pt", clean, "index.html");
  if (!existsSync(enPath)) {
    missingEnglishTwin += 1;
    continue;
  }

  const es = phrases(visibleText(readFileSync(esPath, "utf8")));
  const en = phrases(visibleText(readFileSync(enPath, "utf8")));
  const pt = existsSync(ptPath)
    ? phrases(visibleText(readFileSync(ptPath, "utf8")))
    : null;

  const english = [];
  for (const phrase of es) {
    if (!en.has(phrase)) continue;
    /*
      No Portuguese twin means no control, so the phrase is reported only if Spanish and
      English agree — which on those few routes over-reports rather than under-reports,
      and over-reporting is the safe direction for an audit somebody acts on.
    */
    if (pt && pt.has(phrase)) continue;
    english.push(phrase);
  }

  routes.push({ route: `/es${clean}`, english: english.sort(), total: es.size });
}

const withEnglish = routes
  .filter((r) => r.english.length)
  .sort((a, b) => b.english.length - a.english.length);

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
      {
        pages: routes.length,
        withEnglish: withEnglish.length,
        phrases: ranked.length,
        routes: withEnglish,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

console.log("Spanish pages, against the English and Portuguese twins of each route\n");
console.log(`  pages compared        ${routes.length}`);
console.log(`  pages with English    ${withEnglish.length}`);
console.log(`  distinct phrases      ${ranked.length}`);
if (missingEnglishTwin) {
  console.log(`  Spanish-only          ${missingEnglishTwin} (no twin to compare)`);
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
  "\n⚠ A phrase is reported only when the Portuguese page translated it and the Spanish\n" +
    "  page did not. Model numbers, finish codes and standards are therefore excluded\n" +
    "  automatically — they are identical in Portuguese too.",
);
