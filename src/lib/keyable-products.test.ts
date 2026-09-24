import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";
import { keyableProducts } from "./keyable-products.ts";
import type { Product } from "../data/types.ts";

/*
  The homepage column card says "N models can be keyed alike or master keyed".

  A count printed on the homepage is the kind of number that goes stale silently: the
  catalogue gains sixty products in an afternoon and nothing tells anyone the sentence
  underneath the flagship pair is now wrong. content/faq.json carried "435 models across
  15 families" for weeks when the real figure was 361 — see published-counts.test.ts,
  which exists because of that. These tests hold the rule that produces the number, so
  the card and the catalogue cannot drift apart without a test going red.
*/

const catalogue = (): Product[] =>
  readdirSync("content/products")
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(`content/products/${name}`, "utf8")) as Product);

const product = (over: Partial<Product>): Product =>
  ({ heroImage: { src: "/images/products/x.webp" }, specs: [], ...over }) as unknown as Product;

describe("keyableProducts", () => {
  it("counts a keying spec row", () => {
    const found = keyableProducts([
      product({ specs: [{ label: "Keying", value: "Can be keyed alike to the deadbolt series, or master keyed" }] }),
    ]);

    assert.equal(found.length, 1);
  });

  it("counts a feature line, which is where half the catalog states it", () => {
    const found = keyableProducts([
      product({ specs: [], features: ["Can be keyed alike or master keyed"] }),
    ]);

    assert.equal(found.length, 1);
  });

  it("does not count a product with no photograph", () => {
    /*
      A model with no photograph is off every browse surface. Counting it would advertise
      a choice the buyer cannot actually make from the site.
    */
    const found = keyableProducts([
      {
        heroImage: { ratio: "1 / 1", label: "x" },
        specs: [{ label: "Keying", value: "Master keyed" }],
      } as unknown as Product,
    ]);

    assert.equal(found.length, 0);
  });

  it("does not count a lock that merely mentions a cylinder", () => {
    const found = keyableProducts([
      product({ specs: [{ label: "Cylinder", value: "5-pin tumbler, solid brass plug" }] }),
    ]);

    assert.equal(found.length, 0);
  });

  it("the real catalog supports the claim the homepage makes", () => {
    /*
      Not asserted as a fixed number — the catalogue grows, and a test that has to be
      edited on every import is a test people start editing without reading. What must
      hold is that the claim is substantial and that every product behind it is published.
    */
    const found = keyableProducts(catalogue());

    assert.ok(found.length > 40, `only ${found.length} keyable models; the card claims a range`);
    for (const item of found) {
      assert.ok(item.heroImage?.src, "a counted model must have a photograph");
    }
  });
});
