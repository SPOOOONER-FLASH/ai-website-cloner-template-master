import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

/**
 * Sub-categories are a filter dimension, never a URL segment. That is exactly why they
 * rot silently: nothing 404s when a product's `categoryPath[1]` names a slug the category
 * does not declare. The product simply stops matching every filter the rail offers, and
 * the only way to reach it is the unfiltered list.
 *
 * On 2026-08-31 that had happened to 26 of 435 products across three singular/plural
 * splits — the catalogue held both `flush-bolts` and `door-flush-bolts`,
 * `patch-fittings` and `glass-door-patch-fittings`, `special-application` and
 * `special-applications`. Nine of the twenty glass-door records were unreachable.
 */

interface CategoryFixture {
  slug: string;
  children?: { slug: string; name: string }[];
}

const categories = (
  JSON.parse(readFileSync("content/categories.json", "utf8")) as {
    categories: CategoryFixture[];
  }
).categories;

const products = readdirSync("content/products")
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    file,
    ...(JSON.parse(readFileSync(`content/products/${file}`, "utf8")) as {
      categoryPath: string[];
    }),
  }));

const declared = new Map(
  categories.map((category) => [
    category.slug,
    new Set((category.children ?? []).map((child) => child.slug)),
  ]),
);

test("every product sub-category is declared by its category", () => {
  const orphans = products.filter(({ categoryPath }) => {
    const [parent, child] = categoryPath;
    const known = declared.get(parent);
    return Boolean(child) && Boolean(known) && !known!.has(child);
  });

  assert.deepEqual(
    orphans.map((p) => `${p.file}: ${p.categoryPath.join("/")}`),
    [],
    "these products name a sub-category their category does not declare, so no filter reaches them",
  );
});

test("no two sub-category slugs differ only by a trailing s", () => {
  for (const category of categories) {
    const slugs = (category.children ?? []).map((child) => child.slug);
    for (const slug of slugs) {
      const twin = slug.endsWith("s") ? slug.slice(0, -1) : `${slug}s`;
      assert.ok(
        !slugs.includes(twin),
        `${category.slug} declares both ${slug} and ${twin}`,
      );
    }
  }
});

/**
 * A declared sub-category holding nothing is a menu entry that leads to "no products
 * match". `getMenuCategories()` filters those out so the menu never offers one, but they
 * are still a content gap worth naming rather than leaving silent, so this test reports
 * rather than fails.
 */
test("empty sub-categories are known and stay hidden from the menu", () => {
  const empty: string[] = [];
  for (const category of categories) {
    for (const child of category.children ?? []) {
      const count = products.filter(
        (p) => p.categoryPath[0] === category.slug && p.categoryPath[1] === child.slug,
      ).length;
      if (count === 0) empty.push(`${category.slug}/${child.slug}`);
    }
  }

  // Update this list deliberately when the client supplies or removes products.
  assert.deepEqual(empty.sort(), [
    "hardware-accessories/armoured-lock-covers",
    "knob-locks/wafer-locks",
  ]);
});
