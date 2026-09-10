import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/*
  A product with no photograph must not be reachable by browsing.

  WHY THIS TEST EXISTS. `isPublished()` has been the rule since the client asked for the
  photograph-less records to come down, and the sitemap, the search index, llms.txt and
  the category pages all honoured it. Four surfaces did not, and on 2026-09-09 the client
  pointed at the result: /product-finder/ listed all 598 models (its own copy said
  "Showing 598 published products", which was false), /products/ printed the same full
  A–Z, the drawer counted withheld records in its per-category totals, and the "more from
  this range" fallback on a product page linked straight into them — 410-glass-door-handle
  offered 100-30mm-glass-door-handle, a page with no image on it.

  Each of those was one call site importing `products` where it wanted `publishedProducts`,
  which is not a mistake a code comment prevents — the two names differ by one word and
  both compile. So the rule is asserted against the built output instead of against
  intent, the same way sitemap-escaping.test.ts is.

  WHAT IS DELIBERATELY STILL ALLOWED. The page itself is still built, still reachable by
  its URL, and marked noindex — see the note on isPublished() in src/data/products.ts.
  Model numbers from these records are printed on old quotations and sit in B2B
  directories; a 404 throws away whatever the URL had earned, whereas a quiet page
  publishes itself again the moment a photograph lands. So this test checks that nothing
  LINKS to them, not that they are absent.
*/

const OUT = "out";
const PRODUCT_DIR = "content/products";

/** Every product record with no hero image — the withheld set, derived not listed. */
function withheldHrefs(): Map<string, string> {
  const hrefs = new Map<string, string>();
  for (const file of readdirSync(PRODUCT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const record = JSON.parse(readFileSync(join(PRODUCT_DIR, file), "utf8"));
    if (record.heroImage?.src) continue;
    if (record.sites && !record.sites.includes("hyde")) continue;
    hrefs.set(`/products/${record.categoryPath[0]}/${record.slug}/`, record.model);
  }
  return hrefs;
}

/** Every built HTML page, minus the withheld products' own pages and the ES mirrors. */
function pages(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) pages(path, found);
    else if (entry.name === "index.html") found.push(path);
  }
  return found;
}

test("no built page links to a product that has no photograph", (t) => {
  if (!existsSync(OUT)) {
    t.skip("out/ not built in this checkout");
    return;
  }

  const withheld = withheldHrefs();
  assert.ok(withheld.size > 0, "expected some withheld records to guard");

  const offenders: string[] = [];
  for (const page of pages(OUT)) {
    /*
      A withheld page may of course contain its own URL — canonical tag, breadcrumb,
      hreflang. `/es` prefixed pages are the same route, so both are excused by suffix.
    */
    const html = readFileSync(page, "utf8");
    for (const [href, model] of withheld) {
      if (page.replaceAll("\\", "/").includes(href.slice(0, -1))) continue;
      if (!html.includes(`href="${href}"`) && !html.includes(`href="/es${href}"`)) continue;
      offenders.push(`${page.replaceAll("\\", "/")} links to ${model} (${href})`);
    }
  }

  assert.deepEqual(
    offenders.slice(0, 12),
    [],
    `${offenders.length} built page(s) link to a product with no photograph. ` +
      `Those surfaces must read publishedProducts, not products.`,
  );
});

test("the withheld set is derived from the photograph, not a hand-kept list", () => {
  /*
    Guards the reverse mistake: somebody adding a `hidden: true` flag alongside the rule.
    Two sources of truth for "is this live" is how a product ends up photographed and
    still invisible, which is worse than the bug this file is about.
  */
  const flagged: string[] = [];
  for (const file of readdirSync(PRODUCT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const record = JSON.parse(readFileSync(join(PRODUCT_DIR, file), "utf8"));
    if ("hidden" in record || "published" in record || "delisted" in record) {
      flagged.push(file);
    }
  }
  assert.deepEqual(flagged, [], "visibility is derived from heroImage.src alone");
});
