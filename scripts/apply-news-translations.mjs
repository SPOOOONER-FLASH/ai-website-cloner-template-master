#!/usr/bin/env node
/**
 * Writes Spanish translations into content/news/*.json from a batch file.
 *
 * WHY A SCRIPT FOR SOMETHING DONE ONCE. The translations themselves are the artifact —
 * there is no generator that can re-derive them, and pretending otherwise would be the
 * mistake this repository's rules warn about in the other direction. What this exists for
 * is the WRITE: eight article records, four fields each, hand-edited into JSON is thirty-
 * two chances to break a file that the build reads. Doing it through a script that
 * validates before it writes turns those into zero.
 *
 * WHAT IT CHECKS, and why each check is here rather than left to review:
 *
 *   1. THE ARTICLE EXISTS. A typo in a slug would otherwise create nothing and report
 *      success, and a missing translation is invisible — the page falls back to English
 *      and looks fine to anyone who does not read Spanish.
 *   2. THE PARAGRAPH COUNT MATCHES. `bodyEs` is rendered paragraph-for-paragraph against
 *      `body`. A translation with one paragraph fewer does not error; it silently drops a
 *      paragraph of the article, and the two versions then disagree about what the
 *      company said.
 *   3. NOTHING IS OVERWRITTEN unless --force. A later hand edit by the Spanish reviewer
 *      outranks this file.
 *
 * Usage:
 *   node scripts/apply-news-translations.mjs <batch.json> [<batch.json> …] [--write] [--force]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/news";
const args = process.argv.slice(2);
const write = args.includes("--write");
const force = args.includes("--force");
const batches = args.filter((a) => !a.startsWith("--"));

if (!batches.length) {
  console.error("Give at least one batch file: node scripts/apply-news-translations.mjs <batch.json>");
  process.exit(1);
}

/** slug -> filename, so a batch keys on the slug rather than on a path. */
const fileBySlug = new Map();
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const article = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  fileBySlug.set(article.slug, file);
}

const FIELDS = ["titleEs", "summaryEs", "bodyEs", "seoTitleEs", "seoDescriptionEs"];

let applied = 0;
let skipped = 0;
const problems = [];

for (const batch of batches) {
  if (!existsSync(batch)) {
    problems.push(`batch not found: ${batch}`);
    continue;
  }
  const entries = JSON.parse(readFileSync(batch, "utf8"));

  for (const [slug, translation] of Object.entries(entries)) {
    const file = fileBySlug.get(slug);
    if (!file) {
      problems.push(`no article with slug "${slug}" — check the spelling against ${DIR}`);
      continue;
    }

    const path = join(DIR, file);
    const article = JSON.parse(readFileSync(path, "utf8"));

    if (!Array.isArray(translation.bodyEs)) {
      problems.push(`${slug}: bodyEs is not an array`);
      continue;
    }
    if (translation.bodyEs.length !== article.body.length) {
      problems.push(
        `${slug}: ${translation.bodyEs.length} Spanish paragraphs against ${article.body.length} English — ` +
          `a mismatch silently drops or duplicates a paragraph`,
      );
      continue;
    }
    if (!force && article.bodyEs) {
      skipped += 1;
      continue;
    }

    for (const field of FIELDS) {
      if (translation[field] !== undefined) article[field] = translation[field];
    }

    if (write) writeFileSync(path, `${JSON.stringify(article, null, 2)}\n`);
    applied += 1;
    console.log(`  ${slug.padEnd(46)} ${translation.bodyEs.length} paragraphs`);
  }
}

console.log(
  `\n${applied} article(s) ${write ? "written" : "ready"}, ${skipped} already translated (use --force to replace)`,
);

if (problems.length) {
  console.error(`\n${problems.length} problem(s) — nothing was written for these:`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

if (!write) console.log("--write not given; nothing written.");
