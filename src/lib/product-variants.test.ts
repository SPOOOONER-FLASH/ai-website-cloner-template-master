import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import type { Product } from "../data/types";
import { productVariants } from "./product-variants.ts";

/*
  Read from content/ for the same reason configurator.test.ts does: src/data/products.ts
  cannot be imported under --test. Filter as the site does — HYDE records with a photograph.
*/
const DIR = "content/products";
const catalogue = readdirSync(DIR)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(`${DIR}/${file}`, "utf8")) as Product)
  .filter((p) => p.heroImage?.src && (!p.sites || p.sites.includes("hyde")));
const bySlug = new Map(catalogue.map((p) => [p.slug, p]));
const byModel = (model: string) => catalogue.find((p) => p.model === model)!;

test("587 MBET offers its real finish and function siblings", () => {
  const v = productVariants(byModel("587 MBET"), catalogue);
  assert.ok(v);
  assert.equal(v.base, "587");
  assert.deepEqual(v.finish.map((o) => o.value).sort(), ["MB", "PB", "SS"]);
  assert.deepEqual(v.fn.map((o) => o.value).sort(), ["BK", "ET", "PS"]);
  /* Same function kept where it exists: PB → 587 PBET, not PBBK. */
  assert.equal(v.finish.find((o) => o.value === "PB")?.model, "587 PBET");
  /* PS is only made in PB, so the option says it changes the finish too. */
  const ps = v.fn.find((o) => o.value === "PS");
  assert.equal(ps?.model, "587 PBPS");
  assert.equal(ps?.alsoChanges, "PB");
});

test("every option is a published HYDE record in the same category", () => {
  let pages = 0;
  for (const product of catalogue) {
    const v = productVariants(product, catalogue);
    if (!v) continue;
    pages += 1;
    for (const axis of [v.finish, v.fn]) {
      if (!axis.length) continue;
      assert.ok(axis.length >= 2, `${product.model}: an axis with one option`);
      assert.equal(axis.filter((o) => o.current).length, 1, `${product.model}: exactly one current option`);
      assert.equal(new Set(axis.map((o) => o.value)).size, axis.length, `${product.model}: duplicate values`);
      for (const option of axis) {
        const target = bySlug.get(option.slug);
        assert.ok(target, `${product.model} → ${option.slug} is not on the site`);
        assert.equal(target.categoryPath.join("/"), product.categoryPath.join("/"));
        assert.equal(option.current, option.slug === product.slug);
      }
    }
  }
  assert.ok(pages >= 60, `only ${pages} product pages get a switch`);
});

test("records whose code does not parse cleanly are never offered", () => {
  for (const product of catalogue) {
    const v = productVariants(product, catalogue);
    for (const option of [...(v?.finish ?? []), ...(v?.fn ?? [])]) {
      assert.ok(!/SNKT-1|90mm/.test(option.model), `${product.model} offers ${option.model}`);
    }
  }
});

test("a product with no siblings gets nothing", () => {
  const lonely = catalogue.find((p) => !productVariants(p, catalogue));
  assert.ok(lonely);
});

test("the studio's families agree with the product-page switch", async () => {
  const { variantFamilies } = await import("./product-variants.ts");
  const families = variantFamilies(catalogue);
  assert.ok(families.length >= 25, `only ${families.length} families`);
  for (const family of families) {
    for (const member of family.members) {
      const v = productVariants(bySlug.get(member.slug)!, catalogue);
      assert.ok(v, `${member.model} is in a studio family but gets no switch on its page`);
      assert.equal(v.base, family.base);
    }
  }
});
