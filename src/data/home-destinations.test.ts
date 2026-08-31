import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

/**
 * Client decision, 2026-08-31: the homepage hero and carousel sell CATEGORIES.
 *
 * They used to point at single SKUs — the first frame, titled "Panic Exit Devices",
 * landed on /products/panic-exit-devices/305-fire-door-panic-exit-device, a page with
 * three spec rows. A visitor who clicks a frame headed with a category name expects the
 * range, and one thin SKU is a worse answer than fifty. The frame that already pointed
 * at /products/lock-cases was the one doing it right.
 *
 * A product depth is 3 segments (/products/<category>/<slug>); a category is 2.
 */
function heroHrefs(source: string): string[] {
  return [...source.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Everything above the `teaser1` export is hero/carousel content. */
function heroSection(file: string): string {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const end = source.indexOf("export const teaser1");
  assert.ok(end > 0, `${file} no longer declares teaser1; update this test's boundary`);
  return source.slice(0, end);
}

for (const file of ["src/data/home.ts", "src/data/home-es.ts"]) {
  test(`${file} hero and carousel frames link to categories, not single products`, () => {
    for (const href of heroHrefs(heroSection(file))) {
      const productPath = href.replace(/^\/es/, "");
      if (!productPath.startsWith("/products/")) continue;

      const depth = productPath.split("/").filter(Boolean).length;
      assert.ok(
        depth <= 2,
        `${file}: ${href} is a single product page. Homepage frames link to the category ` +
          `(/products/<category>), so the visitor lands on the whole range.`,
      );
    }
  });
}

test("every homepage product destination is a category that exists", () => {
  const { categories } = JSON.parse(
    fs.readFileSync(path.join(root, "content/categories.json"), "utf8"),
  ) as { categories: { slug: string }[] };
  const slugs = new Set(categories.map((c) => c.slug));

  for (const file of ["src/data/home.ts", "src/data/home-es.ts"]) {
    for (const href of heroHrefs(heroSection(file))) {
      const match = /^(?:\/es)?\/products\/([^/]+)\/?$/.exec(href);
      if (!match) continue;
      assert.ok(slugs.has(match[1]), `${file}: /products/${match[1]} is not a category slug`);
    }
  }
});
