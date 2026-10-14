#!/usr/bin/env node
/**
 * Export guard for the article → product route (docs/collaboration/tasks/2026-10-12-article-product-routes.md).
 *
 * Every built guide and news page, in every locale, must keep the buyer block (`id="article-products"`)
 * and its quote link to that locale's contact page as a fragment (`/contact/#…`), and must not link
 * `/contact/?…`: a query string makes every article a separate crawlable contact URL, which is what
 * Ahrefs reported as 3,843 nofollow links before 2026-10-12. Prints coverage of product links per locale.
 *
 *   node scripts/check-article-routes.mjs           report
 *   node scripts/check-article-routes.mjs --check   exit 1 on any failure (run in test:export)
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const LOCALES = ["", "es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"];
const failures = [];
const rows = [];

for (const locale of LOCALES) {
  const prefix = locale ? `/${locale}` : "";
  let pages = 0;
  let withProducts = 0;
  for (const section of ["guides", "news"]) {
    const dir = join(OUT, locale, section);
    if (!existsSync(dir)) continue;
    for (const slug of readdirSync(dir)) {
      const file = join(dir, slug, "index.html");
      if (!existsSync(file)) continue;
      const html = readFileSync(file, "utf8");
      const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
      if (!main.includes('data-link-list="article-body"')) continue; // listing or pagination page, not an article
      pages++;
      const where = `${prefix}/${section}/${slug}/`;
      if (!main.includes('id="article-products"')) {
        failures.push(`${where}: buyer block (id="article-products") missing`);
        continue;
      }
      if (!main.includes(`href="${prefix}/contact/#`)) failures.push(`${where}: no ${prefix}/contact/# link in the buyer block`);
      if (/href="[^"]*\/contact\/\?/.test(main)) failures.push(`${where}: links /contact/? (use a #fragment)`);
      const block = main.slice(main.indexOf('id="article-products"'));
      if (/href="[^"]*\/products\/[^"/]+\/[^"/]+\/"/.test(block)) withProducts++;
    }
  }
  if (!pages) failures.push(`${prefix || "/"}: no article pages found`);
  rows.push(`${(locale || "en").padEnd(3)} articles ${String(pages).padStart(3)}  with product links ${withProducts}`);
}

console.log(rows.join("\n"));
if (failures.length) {
  console.error(`\n✖ ${failures.length} article route problem(s):\n  ${failures.slice(0, 20).join("\n  ")}`);
  if (process.argv.includes("--check")) process.exit(1);
} else {
  console.log("✓ every article keeps its buyer block and a fragment contact link");
}
