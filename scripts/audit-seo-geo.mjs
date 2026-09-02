#!/usr/bin/env node
/**
 * The full-coverage SEO/GEO re-audit — the checks scripts/audit-seo.mjs does NOT make.
 *
 * That script is the CI gate and it is thorough about each page in isolation: canonical,
 * hreflang reciprocity, JSON-LD validity, Open Graph, sitemap parity, redirect stubs.
 * It reports zero issues, and that is true. But a page can pass every one of those and
 * still never be indexed, because the properties that decide indexing are not properties
 * of a page — they are properties of the SITE GRAPH.
 *
 * That is what this covers, and why it exists as a separate report rather than more
 * checks in the gate: these findings are usually not defects to block a build on. They
 * are editorial and structural facts a human has to weigh.
 *
 *   1. ORPHANS — in the sitemap, linked from nothing. This is the direct cause of the
 *      447 pages Search Console reports as "discovered, not indexed". A sitemap is a
 *      hint; an internal link is a vote, and a page with no votes sits in the queue
 *      indefinitely. We shipped 19 orphan pages once already and caught it by accident.
 *   2. LINK DEPTH — clicks from the homepage. Beyond three, crawl frequency collapses.
 *   3. DUPLICATE TITLES AND DESCRIPTIONS — the gate checks length, not uniqueness. Bing
 *      reported duplicate titles as a High-severity finding.
 *   4. IMAGE ALT — missing alt is both an accessibility defect and a lost description of
 *      a product photograph, which is the only thing an answer engine can read in it.
 *   5. GEO SURFACE — llms.txt, robots.txt AI-crawler rules, the IndexNow key file. These
 *      are what an answer engine reads before it reads any page.
 *
 * Reads out/, so it reports what actually shipped.
 *
 * Usage: node scripts/audit-seo-geo.mjs [--json]
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const ORIGIN = "https://cantonlock.com";

if (!existsSync(OUT)) {
  console.error("out/ not found — run npm run build first.");
  process.exit(1);
}

/* ---------------------------------------------------------------- collect */

function htmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "_next" || entry === "admin") continue;
      htmlFiles(full, acc);
    } else if (entry.endsWith(".html")) {
      acc.push(full);
    }
  }
  return acc;
}

/** out/products/deadbolts/index.html -> /products/deadbolts/ */
function routeOf(file) {
  const rel = relative(OUT, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel.replace(/\.html$/, "")}/`;
}

const files = htmlFiles(OUT);
const pages = new Map();

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route = routeOf(file);

  const title = (/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "").trim();
  const description =
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/i.exec(html)?.[1] ?? "";
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);

  /*
    Links are read from the rendered HTML only. A link that exists solely inside a click
    handler or a collapsed menu is not a link as far as a crawler is concerned — that
    distinction is the entire point of this audit, and counting them would hide the very
    problem it is looking for.
  */
  const links = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    let href = m[1];
    if (href.startsWith(ORIGIN)) href = href.slice(ORIGIN.length) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    links.add(href.split("#")[0].split("?")[0]);
  }

  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = images.filter((tag) => !/\balt="[^"]/.test(tag)).length;

  pages.set(route, { route, file, title, description, noindex, links, images: images.length, noAlt });
}

/* --------------------------------------------------------------- sitemap */

const sitemapPath = join(OUT, "sitemap.xml");
const sitemapUrls = existsSync(sitemapPath)
  ? [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].replace(ORIGIN, "") || "/")
  : [];

/* ------------------------------------------------------- inbound + depth */

const inbound = new Map();
for (const route of pages.keys()) inbound.set(route, 0);
for (const page of pages.values()) {
  // A page linking to itself is not a vote for itself.
  for (const href of page.links) {
    if (href === page.route) continue;
    if (inbound.has(href)) inbound.set(href, inbound.get(href) + 1);
  }
}

/** Breadth-first from the homepage over rendered links only. */
const depth = new Map([["/", 0]]);
let frontier = ["/"];
while (frontier.length) {
  const next = [];
  for (const route of frontier) {
    const page = pages.get(route);
    if (!page) continue;
    for (const href of page.links) {
      if (!pages.has(href) || depth.has(href)) continue;
      depth.set(href, depth.get(route) + 1);
      next.push(href);
    }
  }
  frontier = next;
}

/* ---------------------------------------------------------------- checks */

const findings = [];
const add = (level, id, detail, items = []) =>
  findings.push({ level, id, detail, count: items.length || undefined, items: items.slice(0, 12) });

// 1. Orphans, counted only over pages we actually ask to be indexed.
const indexable = sitemapUrls.filter((u) => pages.has(u) && !pages.get(u).noindex);
const orphans = indexable.filter((u) => inbound.get(u) === 0 && u !== "/");
if (orphans.length) {
  add("error", "orphan-in-sitemap", "in the sitemap but linked from no other page", orphans);
} else {
  add("ok", "orphan-in-sitemap", `all ${indexable.length} indexable sitemap URLs have at least one inbound link`);
}

// 2. Depth.
const unreachable = indexable.filter((u) => !depth.has(u));
const deep = indexable.filter((u) => (depth.get(u) ?? 0) > 3);
if (unreachable.length) {
  add("error", "unreachable-from-home", "no path of rendered links reaches these", unreachable);
} else {
  add("ok", "unreachable-from-home", "every indexable page is reachable from the homepage");
}
if (deep.length) {
  add("warn", "link-depth", "more than 3 clicks from the homepage", deep);
} else {
  add("ok", "link-depth", "no indexable page sits deeper than 3 clicks");
}

// 3. Duplicate titles and descriptions among indexable pages.
function duplicates(field) {
  const seen = new Map();
  for (const url of indexable) {
    const value = pages.get(url)[field];
    if (!value) continue;
    if (!seen.has(value)) seen.set(value, []);
    seen.get(value).push(url);
  }
  return [...seen.entries()].filter(([, urls]) => urls.length > 1);
}
for (const field of ["title", "description"]) {
  const dupes = duplicates(field);
  if (dupes.length) {
    add(
      "warn",
      `duplicate-${field}`,
      `the same ${field} on more than one indexable page`,
      dupes.map(([value, urls]) => `${urls.length}× ${JSON.stringify(value.slice(0, 60))} — ${urls[0]}`),
    );
  } else {
    add("ok", `duplicate-${field}`, `every indexable page has a unique ${field}`);
  }
}

// 4. Image alt text.
const missingAlt = indexable
  .map((u) => ({ url: u, ...pages.get(u) }))
  .filter((p) => p.noAlt > 0);
const totalNoAlt = missingAlt.reduce((n, p) => n + p.noAlt, 0);
if (totalNoAlt) {
  add("warn", "image-alt-missing", `${totalNoAlt} <img> without alt text`, missingAlt.map((p) => `${p.noAlt}× ${p.url}`));
} else {
  add("ok", "image-alt-missing", "every image on an indexable page carries alt text");
}

// 5. The GEO surface — what an answer engine reads before any page.
const geo = [
  ["llms.txt", "out/llms.txt"],
  ["robots.txt", "out/robots.txt"],
  ["sitemap.xml", "out/sitemap.xml"],
  ["IndexNow key", "out/6bb09b9b67d0e605a292835469627988.txt"],
];
const missingGeo = geo.filter(([, p]) => !existsSync(p)).map(([name]) => name);
if (missingGeo.length) add("error", "geo-surface-missing", "not in the export", missingGeo);
else add("ok", "geo-surface", `${geo.map(([n]) => n).join(", ")} all present`);

if (existsSync("out/robots.txt")) {
  const robots = readFileSync("out/robots.txt", "utf8");
  const bots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"];
  const absent = bots.filter((b) => !robots.includes(b));
  if (absent.length) add("warn", "ai-crawlers-unnamed", "no explicit rule in robots.txt", absent);
  else add("ok", "ai-crawlers", `robots.txt names ${bots.length} AI crawlers explicitly`);
  if (!robots.includes("Sitemap:")) add("error", "robots-sitemap", "robots.txt does not point at the sitemap");
}

if (existsSync("out/llms.txt")) {
  const llms = readFileSync("out/llms.txt", "utf8");
  const linked = (llms.match(/https:\/\/cantonlock\.com/g) ?? []).length;
  add(
    linked >= 100 ? "ok" : "warn",
    "llms-txt-coverage",
    `llms.txt names ${linked} site URLs (${(llms.length / 1024).toFixed(0)}KB)`,
  );
}

// 6. Sitemap hygiene against the graph.
const noindexInSitemap = sitemapUrls.filter((u) => pages.get(u)?.noindex);
if (noindexInSitemap.length) {
  add("error", "noindex-in-sitemap", "listed in the sitemap but marked noindex", noindexInSitemap);
} else {
  add("ok", "noindex-in-sitemap", "no noindex page is advertised in the sitemap");
}

const notInSitemap = [...pages.values()]
  .filter((p) => !p.noindex && !sitemapUrls.includes(p.route) && !p.route.startsWith("/es/"))
  .map((p) => p.route);
if (notInSitemap.length) {
  add("warn", "indexable-not-in-sitemap", "indexable but absent from the sitemap", notInSitemap);
} else {
  add("ok", "indexable-not-in-sitemap", "every indexable English page is in the sitemap");
}

/* ---------------------------------------------------------------- report */

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ pages: pages.size, indexable: indexable.length, findings }, null, 2));
  process.exit(findings.some((f) => f.level === "error") ? 1 : 0);
}

const ICON = { ok: "✔", warn: "⚠", error: "✖" };
console.log(`SEO / GEO full re-audit — ${pages.size} exported pages, ${indexable.length} indexable in sitemap\n`);

for (const level of ["error", "warn", "ok"]) {
  for (const f of findings.filter((x) => x.level === level)) {
    console.log(`${ICON[level]} ${f.id}${f.count ? ` (${f.count})` : ""} — ${f.detail}`);
    for (const item of f.items) console.log(`      ${item}`);
    if (f.count && f.count > f.items.length) console.log(`      … and ${f.count - f.items.length} more`);
  }
}

const errors = findings.filter((f) => f.level === "error").length;
const warns = findings.filter((f) => f.level === "warn").length;
console.log(`\n${errors} error(s), ${warns} warning(s), ${findings.length - errors - warns} clean.`);

// Depth histogram: the shape matters more than any single number.
const hist = new Map();
for (const url of indexable) {
  const d = depth.get(url) ?? "unreachable";
  hist.set(d, (hist.get(d) ?? 0) + 1);
}
console.log("\nclicks from the homepage:");
for (const [d, n] of [...hist.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])))) {
  console.log(`  ${String(d).padStart(11)}  ${String(n).padStart(4)}  ${"█".repeat(Math.ceil(n / 20))}`);
}

process.exit(errors ? 1 : 0);
