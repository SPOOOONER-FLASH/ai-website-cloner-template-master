import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type ProductFixture = {
  alibabaSearchTerm?: string;
};

const fixtures = [
  ["hyde-ar4-110-mortise-lock.json", "110"],
  ["hyde-ar4-140-mortise-lock.json", "140"],
  ["hyde-ar4-101-mortise-lock.json", "110"],
  ["hyde-ar4-1121-hook-bolt-lock.json", "1121"],
] as const;

test("AR-4 Alibaba exits use the confirmed numeric catalogue lookup", () => {
  for (const [file, query] of fixtures) {
    const product = JSON.parse(
      readFileSync(`content/products/${file}`, "utf8"),
    ) as ProductFixture;

    assert.equal(
      product.alibabaSearchTerm,
      query,
    );
  }
});
