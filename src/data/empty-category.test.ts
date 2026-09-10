import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

/*
  A category with nothing published in it must not produce a page.

  On 2026-09-10 `flip-up-grab-bars` was added ahead of its photographs. Every top-level
  category had always had products, so nothing enforced the case, and it immediately
  produced four routes carrying ten findings between them — no JSON-LD itemListElement,
  no html lang attribute, a canonical pointing at the homepage, and a noindex tag inside
  an indexable release. `npm run test:export` blocked the release on them, which is the
  audit doing its job, but it blocked it at the last possible moment.

  This asserts the same rule three seconds into `npm test` instead.

  WHY THIS READS JSON AND HTML RATHER THAN IMPORTING categories.ts. That module pulls
  content/categories.json through a bare import, which `node --test` cannot load without
  an import attribute — the same constraint that made src/lib/fact-roll.ts a standalone
  module. Reading the files is not a workaround here so much as the stronger test: it
  checks the data and the built output, which is what actually ships.
*/

const PRODUCT_DIR = "content/products";
const OUT = "out";

/** Top-level category slugs that have at least one product with a photograph. */
function categoriesWithPublishedProducts(): Set<string> {
  const live = new Set<string>();
  for (const file of readdirSync(PRODUCT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const record = JSON.parse(readFileSync(`${PRODUCT_DIR}/${file}`, "utf8"));
    if (record.sites && !record.sites.includes("hyde")) continue;
    if (!record.heroImage?.src) continue;
    if (record.categoryPath?.[0]) live.add(record.categoryPath[0]);
  }
  return live;
}

function declaredCategories(): string[] {
  const raw = JSON.parse(readFileSync("content/categories.json", "utf8"));
  const list = Array.isArray(raw) ? raw : (raw.categories ?? []);
  return list.map((c: { slug: string }) => c.slug);
}

test("every declared category either has published products or is not built", (t) => {
  if (!existsSync(OUT)) {
    t.skip("out/ not built in this checkout");
    return;
  }
  const live = categoriesWithPublishedProducts();
  const offenders: string[] = [];

  for (const slug of declaredCategories()) {
    if (live.has(slug)) continue;
    /* Empty category: none of its four routes may exist in the export. */
    for (const route of [
      `${OUT}/products/${slug}/index.html`,
      `${OUT}/es/products/${slug}/index.html`,
      `${OUT}/compare/${slug}/index.html`,
      `${OUT}/es/compare/${slug}/index.html`,
    ]) {
      if (existsSync(route)) offenders.push(route);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    "these routes belong to a category with no published product — an empty page and an empty compare table",
  );
});

test("every category that does have products is built", (t) => {
  /*
    The reverse guard. Filtering empty categories must not silently drop a real one, and
    it must stay derived rather than becoming a hand-kept exclusion list — two sources of
    truth is how a category ends up photographed and still invisible.
  */
  if (!existsSync(OUT)) {
    t.skip("out/ not built in this checkout");
    return;
  }
  const declared = new Set(declaredCategories());
  const missing: string[] = [];
  for (const slug of categoriesWithPublishedProducts()) {
    if (!declared.has(slug)) continue;
    if (!existsSync(`${OUT}/products/${slug}/index.html`)) missing.push(slug);
  }
  assert.deepEqual(missing, [], "these categories have published products but no built page");
});
