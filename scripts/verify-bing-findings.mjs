#!/usr/bin/env node
/**
 * Re-measures every finding in Bing's Site Scan against the CURRENT export.
 *
 * WHY THIS EXISTS RATHER THAN A CLAIM IN A CHAT MESSAGE. The Bing report is a snapshot of
 * a crawl taken on 2026-09-01 — `docs/research/bing-site-scan-2026-09-01.csv`, exported by
 * the client from Webmaster Tools. Its counts describe the site as it was that day, and
 * Bing will not recrawl on demand, so its panel keeps showing them for weeks after the
 * cause is gone. That is exactly how "we fixed it" turns into an argument.
 *
 * So each finding is restated as something measurable against out/, and re-run on every
 * release. The output is a table of THEN versus NOW: what Bing counted, what the current
 * export contains, and whether the gap is closed. A finding that is genuinely still open
 * says so; a finding that only survives in Bing's cache is named as such.
 *
 * ONE FINDING CANNOT BE ANSWERED HERE AND IS REPORTED, NOT HIDDEN. "Your site lacks
 * inbound links from high-quality domains" is a fact about other people's websites. No
 * change to this repository can move it, and pretending otherwise by silently dropping it
 * would misrepresent the audit.
 *
 * THRESHOLDS ARE BING'S, NOT INVENTED. Bing Webmaster Tools flags a meta description
 * under 25 characters and a title under 15; it flags a page under roughly 300 words as
 * thin. Those are the numbers used below, so a page passing here should pass there.
 *
 * Usage: node scripts/verify-bing-findings.mjs [--json]
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
if (!existsSync(OUT)) {
  console.error("out/ not found — run npm run build first.");
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "_next" || entry === "admin") continue;
      walk(full, acc);
    } else if (entry.endsWith(".html")) acc.push(full);
  }
  return acc;
}

/** Visible words only — script, style and tags stripped. */
function visibleWordCount(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(" ").length : 0;
}

const pages = [];
for (const file of walk(OUT)) {
  const html = readFileSync(file, "utf8");
  const rel = `/${relative(OUT, file).split(sep).join("/")}`;

  /*
    Only pages we ask to be indexed are counted. A noindex redirect stub has no h1 by
    design — counting it would report a defect we deliberately created, and chasing that
    number would mean undoing the fix for Bing's previous complaint.
  */
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) continue;

  pages.push({
    path: rel,
    title: (/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "").trim(),
    description: (
      /<meta[^>]+name="description"[^>]+content="([^"]*)"/i.exec(html)?.[1] ?? ""
    ).trim(),
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    imgNoAlt: (html.match(/<img\b[^>]*>/gi) ?? []).filter((t) => !/\balt="[^"]/.test(t))
      .length,
    words: visibleWordCount(html),
  });
}

/** Bing's own thresholds. */
const TITLE_MIN = 15;
const DESC_MIN = 25;
const THIN_WORDS = 300;

const dupTitles = (() => {
  const seen = new Map();
  for (const p of pages) {
    if (!p.title) continue;
    seen.set(p.title, (seen.get(p.title) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, n]) => n > 1);
})();

const findings = [
  {
    id: "img-no-alt",
    bing: "The <img> tag does not have an ALT attribute defined.",
    severity: "Low",
    was: 4,
    now: pages.reduce((n, p) => n + p.imgNoAlt, 0),
    offenders: pages.filter((p) => p.imgNoAlt).map((p) => `${p.imgNoAlt}× ${p.path}`),
  },
  {
    id: "desc-short",
    bing: "Meta descriptions on many of your pages are too short.",
    severity: "Moderate",
    was: 26,
    now: pages.filter((p) => p.description.length < DESC_MIN).length,
    offenders: pages
      .filter((p) => p.description.length < DESC_MIN)
      .map((p) => `${p.description.length} chars — ${p.path}`),
  },
  {
    id: "title-duplicate",
    bing: "Too many pages with identical titles.",
    severity: "Moderate",
    was: 32,
    now: dupTitles.reduce((n, [, count]) => n + count, 0),
    offenders: dupTitles.map(([title, n]) => `${n}× ${JSON.stringify(title.slice(0, 70))}`),
  },
  {
    id: "title-short",
    bing: "Many of your page titles are too short.",
    severity: "Moderate",
    was: 22,
    now: pages.filter((p) => p.title.length < TITLE_MIN).length,
    offenders: pages
      .filter((p) => p.title.length < TITLE_MIN)
      .map((p) => `${p.title.length} chars — ${p.path}`),
  },
  {
    id: "thin-content",
    bing: "There are too many pages with insufficient content.",
    severity: "Moderate",
    was: 18,
    now: pages.filter((p) => p.words < THIN_WORDS).length,
    offenders: pages
      .filter((p) => p.words < THIN_WORDS)
      .sort((a, b) => a.words - b.words)
      .map((p) => `${p.words} words — ${p.path}`),
  },
  {
    id: "h1-missing",
    bing: "The <h1> tag is missing.",
    severity: "High",
    was: 4,
    now: pages.filter((p) => p.h1Count === 0).length,
    offenders: pages.filter((p) => p.h1Count === 0).map((p) => p.path),
  },
  {
    id: "inbound-links",
    bing: "Your site lacks inbound links from high-quality domains.",
    severity: "Moderate",
    was: 1,
    now: null,
    note:
      "Off-site. 101 backlinks from 4 domains (worldbid 68, traderscity 27, hydeland.cn 4, " +
      "bau-muenchen 2), and 95 of them point at the homepage. Nothing in this repository " +
      "changes it; the lever is repointing those listings at the product pages they " +
      "describe — see docs/research/BACKLINK_DEEPLINKS.md.",
  },
];

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ pagesChecked: pages.length, findings }, null, 2));
  process.exit(0);
}

console.log(
  `Bing Site Scan (2026-09-01) re-measured against the current export\n` +
    `${pages.length} indexable pages checked\n`,
);

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("finding", 18)}${pad("severity", 10)}${pad("was", 6)}${pad("now", 6)}status`);
console.log("-".repeat(72));

let open = 0;
for (const f of findings) {
  if (f.now === null) {
    console.log(`${pad(f.id, 18)}${pad(f.severity, 10)}${pad(f.was, 6)}${pad("—", 6)}off-site`);
    continue;
  }
  const status = f.now === 0 ? "CLOSED" : f.now < f.was ? "improved" : "OPEN";
  if (f.now > 0) open += 1;
  console.log(`${pad(f.id, 18)}${pad(f.severity, 10)}${pad(f.was, 6)}${pad(f.now, 6)}${status}`);
}

for (const f of findings) {
  if (!f.now) continue;
  console.log(`\n${f.id} — ${f.bing}`);
  for (const o of (f.offenders ?? []).slice(0, 10)) console.log(`   ${o}`);
  if ((f.offenders ?? []).length > 10) {
    console.log(`   … and ${f.offenders.length - 10} more`);
  }
}

const offsite = findings.find((f) => f.now === null);
if (offsite) console.log(`\ninbound-links — ${offsite.note}`);

console.log(
  `\n${findings.filter((f) => f.now === 0).length} of ${findings.filter((f) => f.now !== null).length} on-page findings closed; ${open} still open.`,
);
