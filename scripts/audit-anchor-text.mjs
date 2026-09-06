#!/usr/bin/env node
/**
 * Finds internal links whose anchor text says nothing.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS WORTH A SCRIPT
 *
 * An internal link does two jobs: it tells Google what the destination is about, and it
 * tells a buyer whether to click. "Learn more" does neither. Google has said for years
 * that anchor text is a ranking signal for the TARGET page, so a catalogue whose links
 * all read "view details" is a catalogue that describes none of its own pages.
 *
 * The fix is cheap and the measurement is cheap; what is expensive is finding them by
 * hand across a thousand pages. So this reads the built output and lists them, ranked by
 * how many pages carry each offender — because one bad anchor in a shared component is a
 * thousand bad anchors.
 *
 * ---------------------------------------------------------------------------
 * WHAT COUNTS AS EMPTY, AND WHAT DOES NOT
 *
 * A phrase is empty when it would fit under any link on any site. "Read the article" is
 * empty. "Compare every model in this range" is not — it names the destination, even
 * though it is a common phrasing.
 *
 * Two deliberate exemptions. Breadcrumbs are short by design and their meaning comes from
 * position; and a link whose text is a model number ("015 — Panic Exit Device") is doing
 * exactly what this audit wants, so number-led anchors are never flagged.
 *
 * Usage:  node scripts/audit-anchor-text.mjs [--out tmp/claude-anchors.json]
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const outPath = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const ROOT = "out";

/*
  Phrases that carry no information about the destination. Kept as whole-string matches
  rather than substrings: "more" inside "More in the 9000 series" is fine, and a substring
  rule would flag it.
*/
const EMPTY = new Set([
  "learn more", "read more", "more", "click here", "here", "details", "view details",
  "view", "see more", "find out more", "go", "continue", "next", "link", "this page",
  "read the article", "see all", "view all", "explore", "discover", "submit",
  "más", "ver más", "leer más", "haga clic aquí", "aquí", "detalles", "ver detalles",
  "ver", "continuar", "siguiente", "enlace", "esta página", "ver todo", "explorar",
]);

/** A model number leading the anchor is the good case, never the bad one. */
const MODEL_LED = /^[0-9]|^[A-Z]{1,3}\d/;

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name === "index.html") pages.push(p);
  }
};
walk(ROOT);

const offenders = new Map();
let links = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  /* Breadcrumbs are exempt; strip their container before looking at anything else. */
  const body = html.replace(/<nav[^>]*aria-label="(?:Breadcrumb|Ruta de navegación)"[\s\S]*?<\/nav>/gi, " ");

  for (const m of body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
    if (!text) continue;
    links += 1;
    const key = text.toLowerCase();
    if (MODEL_LED.test(text)) continue;
    if (!EMPTY.has(key)) continue;
    const record = offenders.get(key) ?? { text, href, pages: 0, examples: [] };
    record.pages += 1;
    if (record.examples.length < 3) record.examples.push(relative(ROOT, page).replace(/\\/g, "/"));
    offenders.set(key, record);
  }
}

const ranked = [...offenders.values()].sort((a, b) => b.pages - a.pages);
console.log(`${pages.length} pages, ${links} internal links`);
if (!ranked.length) {
  console.log("\n✔ no empty anchor text found.");
} else {
  console.log(`\n${ranked.length} empty anchor phrase(s), by how many pages carry them:\n`);
  for (const r of ranked) {
    console.log(`${String(r.pages).padStart(5)}  "${r.text}"  ->  ${r.href}`);
    console.log(`       e.g. ${r.examples.join(", ")}`);
  }
  console.log(`\nOne offender in a shared component is one edit. Fix those first.`);
}

if (outPath) {
  writeFileSync(outPath, `${JSON.stringify({ pages: pages.length, links, offenders: ranked }, null, 1)}\n`);
  console.log(`\n-> ${outPath}`);
}
