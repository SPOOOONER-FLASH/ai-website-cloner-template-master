#!/usr/bin/env node
/**
 * Checks the built site against the defects Bing's Site Scan reports.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS SEPARATELY FROM THE OTHER AUDITS
 *
 * Bing's Site Scan on 2026-09-07 listed seven issue classes — missing h1, duplicate
 * titles, short titles, short meta descriptions, thin content, missing alt, and no
 * inbound links from quality domains. Acting on that list directly would have been a
 * mistake, because Bing's crawl of cantonlock.com is 372 legacy `index.php` URLs and 9
 * pages of the current site: the counts are overwhelmingly about a site we did not build
 * and no longer serve from.
 *
 * So this measures the SAME defects against `out/`, where the numbers are ours and
 * actionable. Running both and comparing is what separates "Bing found 4 pages with no
 * h1" from "we have 4 pages with no h1" — which turned out to be different claims.
 *
 * Usage:  node scripts/audit-page-defects.mjs [--json]
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "out";
const JSON_OUT = process.argv.includes("--json");

/* Google truncates a title near 60 characters and shows little value under about 30. */
const TITLE_MIN = 30;
/* Below this a description is a fragment, not a summary of the page. */
const DESC_MIN = 110;
/* Under 200 words a page is usually navigation with a heading on top. */
const THIN_WORDS = 200;

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name === "index.html") pages.push(p);
  }
};
walk(ROOT);

const url = (file) =>
  `/${relative(ROOT, file).split("\\").join("/").replace(/index\.html$/, "")}`;

const defects = { missingH1: [], thin: [], shortTitle: [], shortDescription: [], missingAlt: [] };
const titles = new Map();

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const at = url(file);

  if (!/<h1[\s>]/.test(html)) defects.missingH1.push(at);

  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(at);
    if (title.length < TITLE_MIN) defects.shortTitle.push({ at, title, length: title.length });
  }

  const description = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? "";
  if (description.length < DESC_MIN) {
    defects.shortDescription.push({ at, length: description.length });
  }

  /*
    Word count from visible text only. Scripts and styles are stripped first: a page whose
    JSON-LD is long is not a page with a lot to read.
  */
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  if (words < THIN_WORDS) defects.thin.push({ at, words });

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt=/.test(img)) defects.missingAlt.push({ at, img: img.slice(0, 90) });
  }
}

const duplicateTitles = [...titles].filter(([, urls]) => urls.length > 1);

if (JSON_OUT) {
  console.log(JSON.stringify({ pages: pages.length, defects, duplicateTitles }, null, 1));
} else {
  console.log(`${pages.length} built pages\n`);
  const line = (label, n) => console.log(`  ${String(n).padStart(4)}  ${label}`);
  line("missing <h1>", defects.missingH1.length);
  line("thin (< 200 visible words)", defects.thin.length);
  line(`short title (< ${TITLE_MIN} chars)`, defects.shortTitle.length);
  line(`short description (< ${DESC_MIN} chars)`, defects.shortDescription.length);
  line("<img> without alt", defects.missingAlt.length);
  line("titles used by more than one page", duplicateTitles.length);

  const show = (name, list, fmt = (x) => x) => {
    if (!list.length) return;
    console.log(`\n${name}:`);
    for (const item of list.slice(0, 20)) console.log(`   ${fmt(item)}`);
    if (list.length > 20) console.log(`   … and ${list.length - 20} more`);
  };
  show("missing h1", defects.missingH1);
  show("thin", defects.thin, (x) => `${x.at}  (${x.words} words)`);
  show("short title", defects.shortTitle, (x) => `${x.at}  "${x.title}" (${x.length})`);
  show("short description", defects.shortDescription, (x) => `${x.at}  (${x.length})`);
  show("missing alt", defects.missingAlt, (x) => `${x.at}  ${x.img}`);
  if (duplicateTitles.length) {
    console.log("\nduplicate titles:");
    for (const [title, urls] of duplicateTitles) {
      console.log(`   "${title.slice(0, 64)}" ×${urls.length}`);
      console.log(`      ${urls.join("  ")}`);
    }
  }
}
