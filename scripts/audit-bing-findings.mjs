#!/usr/bin/env node
/**
 * Reproduces Bing Webmaster Tools' SEO checks against the built site.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS ALONGSIDE audit-seo.mjs
 *
 * Bing's export of 2026-09-10 lists six findings. Our own `npm run seo:audit` reports
 * zero semantic issues, unique titles and unique descriptions on the same build. Both are
 * telling the truth, and the difference is the population:
 *
 *   audit-seo.mjs  checks the 1,204 INDEXABLE pages — the ones we ask to be ranked
 *   Bing           crawls everything it can reach, including the 134 noindex pages and
 *                  the /es mirror, and reports on all of it
 *
 * That gap is worth closing rather than explaining away. A noindex page still gets
 * crawled, still spends crawl budget, and a missing `<h1>` on it is still a real defect —
 * these pages come back the moment a photograph arrives.
 *
 * So this audit deliberately runs over EVERY built page and mirrors Bing's own thresholds:
 *
 *   missing <h1>                 high severity
 *   <img> with no alt            low severity
 *   duplicate <title>            medium
 *   title shorter than 30 chars  medium  ("many page titles are too short")
 *   meta description < 100 chars medium  ("meta descriptions are too short")
 *
 * The one finding NOT reproduced here is "insufficient inbound links from high quality
 * domains", which is not a property of the HTML and cannot be fixed by editing it.
 *
 *   node scripts/audit-bing-findings.mjs
 *   node scripts/audit-bing-findings.mjs --list    # every offending URL
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const list = process.argv.includes("--list");

/* Bing's own thresholds, from its documentation and the wording of the export. */
const TITLE_MIN = 30;
const DESCRIPTION_MIN = 100;

function pages(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) pages(path, found);
    else if (entry.name === "index.html") found.push(path);
  }
  return found;
}

const urlOf = (path) =>
  `/${path.replaceAll("\\", "/").replace(/^out\//, "").replace(/index\.html$/, "")}`;

const findings = {
  "missing <h1> (high)": [],
  "<img> with no alt (low)": [],
  "title shorter than 30 chars": [],
  "meta description shorter than 100 chars": [],
  "duplicate <title>": [],
};

const titles = new Map();

for (const path of pages(OUT)) {
  const html = readFileSync(path, "utf8");
  const url = urlOf(path);

  /*
    Redirect stubs are excluded from every check. They exist to bounce a browser to the
    new URL and carry no content by design; scoring them for a missing h1 would produce a
    work list nobody should act on.
  */
  if (/http-equiv="refresh"/i.test(html)) continue;

  if (!/<h1[\s>]/i.test(html)) findings["missing <h1> (high)"].push(url);

  /* An <img> with no alt attribute at all. alt="" is a deliberate decorative marker. */
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((tag) => !/\balt\s*=/i.test(tag));
  if (noAlt.length) findings["<img> with no alt (low)"].push(`${url}  (${noAlt.length})`);

  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  if (title) {
    if (title.length < TITLE_MIN) {
      findings["title shorter than 30 chars"].push(`${url}  "${title}" (${title.length})`);
    }
    const seen = titles.get(title);
    if (seen) seen.push(url);
    else titles.set(title, [url]);
  }

  const description =
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ?? "";
  if (description && description.length < DESCRIPTION_MIN) {
    findings["meta description shorter than 100 chars"].push(`${url}  (${description.length})`);
  }
}

for (const [title, urls] of titles) {
  if (urls.length > 1) findings["duplicate <title>"].push(`"${title}" — ${urls.length} pages: ${urls.slice(0, 4).join(", ")}${urls.length > 4 ? " …" : ""}`);
}

let total = 0;
for (const [name, rows] of Object.entries(findings)) {
  console.log(`${String(rows.length).padStart(5)}  ${name}`);
  total += rows.length;
}
console.log(`\n  ${total} finding(s) across ${pages(OUT).length} built pages.`);
console.log("  Not checked here: inbound links from high-quality domains — not a property of the HTML.");

if (list) {
  for (const [name, rows] of Object.entries(findings)) {
    if (!rows.length) continue;
    console.log(`\n== ${name} ==`);
    for (const row of rows) console.log(`  ${row}`);
  }
}

process.exitCode = findings["missing <h1> (high)"].length ? 1 : 0;
