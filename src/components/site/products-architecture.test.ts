import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  PRODUCT_FAMILIES,
  PRODUCT_STORY,
  getProductsArchitecture,
} from "./products-architecture.ts";

const root = process.cwd();
const categoryFile = JSON.parse(
  readFileSync(join(root, "content", "categories.json"), "utf8"),
) as { categories: Array<{ slug: string }> };
const categorySlugs = new Set(categoryFile.categories.map((category) => category.slug));
const editorialConfig = JSON.parse(
  readFileSync(
    join(root, "src", "components", "site", "editorial-images.config.json"),
    "utf8",
  ),
) as Record<string, { sourceWidth: number; variants: number[] }>;

test("the editorial map exposes exactly nine real product families", () => {
  assert.equal(PRODUCT_FAMILIES.length, 9);
  assert.equal(new Set(PRODUCT_FAMILIES.map((family) => family.slug)).size, 9);

  for (const family of PRODUCT_FAMILIES) {
    assert.ok(categorySlugs.has(family.slug), `${family.slug} is not a canonical category`);
    assert.match(family.label.en, /\S/);
    assert.match(family.label.es, /\S/);
    assert.match(family.description.en, /\S/);
    assert.match(family.description.es, /\S/);
  }
});

test("English and Spanish maps preserve canonical category routes", () => {
  const english = getProductsArchitecture("en");
  const spanish = getProductsArchitecture("es");

  assert.deepEqual(
    english.families.map((family) => family.href),
    PRODUCT_FAMILIES.map((family) => `/products/${family.slug}/`),
  );
  assert.deepEqual(
    spanish.families.map((family) => family.href),
    PRODUCT_FAMILIES.map((family) => `/es/products/${family.slug}/`),
  );
  assert.equal(english.brandLine, "Engineered by Canton Hyland");
  assert.equal(spanish.brandLine, "Engineered by Canton Hyland");
});

test("the Products story gives range, application, and technical imagery one job each", () => {
  assert.deepEqual(
    PRODUCT_STORY.map((chapter) => chapter.role),
    ["range", "application", "technical"],
  );
  assert.equal(new Set(PRODUCT_STORY.map((chapter) => chapter.image)).size, 3);

  for (const chapter of PRODUCT_STORY) {
    assert.ok(editorialConfig[chapter.image], `missing editorial config for ${chapter.image}`);
    assert.ok(existsSync(join(root, "public", chapter.image)), `missing ${chapter.image}`);
    assert.ok(
      existsSync(join(root, "public", `${chapter.image}.json`)),
      `missing provenance for ${chapter.image}`,
    );
  }
});

test("the editorial architecture makes no designer or certification claim", () => {
  const serialized = JSON.stringify({ PRODUCT_FAMILIES, PRODUCT_STORY });
  assert.doesNotMatch(serialized, /designed by/i);
  assert.doesNotMatch(serialized, /ANSI|EN 1125|certified|grade \d/i);
});

test("both Products routes render one shared editorial system without losing discovery", () => {
  const component = readFileSync(
    join(root, "src", "components", "site", "ProductsEditorialOverview.tsx"),
    "utf8",
  );
  const english = readFileSync(join(root, "src", "app", "(en)", "products", "page.tsx"), "utf8");
  const spanish = readFileSync(join(root, "src", "app", "es", "products", "page.tsx"), "utf8");

  assert.equal((component.match(/<h1\b/g) ?? []).length, 1);
  assert.match(component, /architecture\.families\.map/);
  assert.match(component, /architecture\.photographySeries\.map/);
  assert.match(component, /applicationChapter/);
  assert.match(component, /technicalChapter/);
  assert.match(component, /\/downloads\//);
  assert.match(component, /\/contact\//);
  assert.doesNotMatch(component, /Designed by/i);

  assert.match(english, /<ProductsEditorialOverview[\s\S]*locale="en"/);
  assert.match(spanish, /<ProductsEditorialOverview[\s\S]*locale="es"/);
  assert.doesNotMatch(english, /<CategoryCard/);
  assert.doesNotMatch(spanish, /<CategoryCard/);

  for (const page of [english, spanish]) {
    assert.match(page, /compare-index-heading|id="comparar"/);
    assert.match(page, /ProductIndexList/);
  }
});
