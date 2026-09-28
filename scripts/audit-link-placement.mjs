#!/usr/bin/env node
/**
 * How visibly each section is linked, measured on the built site.
 *
 * Client, 2026-09-28: 「必须确保每条内链都有显眼可达的位置……多出现，互相串联，你有没有相关的
 * 审查捕捉机制和脚本」. `npm run seo:graph` answers "is anything an orphan" — zero inbound
 * links. It passed while /product-studies/ was linked from one page and the configurator
 * from two: reachable, and in practice invisible. This answers the other question: for each
 * section, how many exported pages link to it.
 *
 *   chrome  linked from ≥ 90% of the locale's pages (header or footer)   — fine
 *   linked  linked from ≥ 5 pages                                        — fine
 *   WEAK    linked from fewer than 5 pages                               — exit 1
 *
 * The source-level twin is src/components/site/internal-link-placement.test.ts, which
 * fails at `npm test` when a new route is in neither the drawer nor the chrome. This one
 * catches what source cannot: a link that exists in code but does not render.
 *
 * Reads out/ (the release checkout's, or your own after a build).
 *
 *   node scripts/audit-link-placement.mjs              English
 *   node scripts/audit-link-placement.mjs --locale es  one locale tree
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const LOCALES = ["es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"];
const locale = process.argv.includes("--locale") ? process.argv[process.argv.indexOf("--locale") + 1] : "en";
/* Reached from somewhere more specific than site chrome; keep in step with the test's EXEMPT. */
const EXEMPT = new Set(["compare", "collections", "video", "404", "admin"]); // 404 and the CMS are not sections
const WEAK_BELOW = 5;

if (!existsSync(OUT)) {
  console.error("out/ not found — run this in a release checkout or after npm run build.");
  process.exit(1);
}

const base = locale === "en" ? OUT : join(OUT, locale);
const prefix = locale === "en" ? "" : `/${locale}`;

/** Every index.html in this locale's tree (English excludes the other locale folders). */
function pages(dir, top = true) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      if (entry.name === "index.html") found.push(join(dir, entry.name));
      continue;
    }
    if (top && locale === "en" && (LOCALES.includes(entry.name) || entry.name.startsWith("_") || entry.name === "images")) continue;
    if (entry.name.startsWith("_") || entry.name === "images") continue;
    found.push(...pages(join(dir, entry.name), false));
  }
  return found;
}

/** A section: each top-level folder, or its first nested page when it has no index. */
const sections = readdirSync(base, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("_") && e.name !== "images" && !(locale === "en" && LOCALES.includes(e.name)) && !EXEMPT.has(e.name))
  .map((e) => {
    if (existsSync(join(base, e.name, "index.html"))) return `${prefix}/${e.name}/`;
    const nested = readdirSync(join(base, e.name), { withFileTypes: true }).find((c) => c.isDirectory() && existsSync(join(base, e.name, c.name, "index.html")));
    return nested ? `${prefix}/${e.name}/${nested.name}/` : null;
  })
  .filter(Boolean);

const files = pages(base);
const inbound = new Map(sections.map((s) => [s, 0]));
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const section of sections) {
    const bare = section.replace(/\/$/, "");
    if (html.includes(`href="${section}"`) || html.includes(`href="${bare}"`)) inbound.set(section, inbound.get(section) + 1);
  }
}

const rows = [...inbound].map(([section, n]) => ({
  section,
  n,
  status: n >= files.length * 0.9 ? "chrome" : n >= WEAK_BELOW ? "linked" : "WEAK",
}));
rows.sort((a, b) => a.n - b.n);
console.log(`${locale}: ${files.length} pages, ${rows.length} sections\n`);
for (const r of rows) console.log(`${r.status.padEnd(7)} ${String(r.n).padStart(5)}  ${r.section}`);
const weak = rows.filter((r) => r.status === "WEAK");
if (weak.length) {
  console.error(`\n✗ ${weak.length} section(s) linked from fewer than ${WEAK_BELOW} pages — give each a place in the footer, header or a related page`);
  process.exit(1);
}
console.log(`\n✓ every section is linked from at least ${WEAK_BELOW} pages`);
