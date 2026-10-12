import assert from "node:assert/strict";
import test from "node:test";
import { contactHref, inquiryPrefill } from "./inquiry-prefill.ts";

test("the query string wins over the fragment, so old ?model= links keep working", () => {
  assert.deepEqual(inquiryPrefill("?model=307", "#model=311&from=guides%2Fx"), { product: "", model: "307", from: "guides/x" });
});

test("a fragment-only quote link pre-fills model and source article", () => {
  const p = inquiryPrefill("", "#model=575+ABET%2C+564&from=guides%2Fstrike-plates-and-keeps-2026");
  assert.equal(p.model, "575 ABET, 564");
  assert.equal(p.from, "guides/strike-plates-and-keeps-2026");
});

test("empty input yields empty strings and values are capped", () => {
  assert.deepEqual(inquiryPrefill("", ""), { product: "", model: "", from: "" });
  assert.equal(inquiryPrefill(`?product=${"x".repeat(300)}`, "").product.length, 200);
});

test("contactHref builds a fragment, drops empty values, and never a query string", () => {
  assert.equal(contactHref("/fr", { model: "307", product: undefined, from: "news/a" }), "/fr/contact/#model=307&from=news%2Fa");
  assert.equal(contactHref("", {}), "/contact/");
  assert.ok(!contactHref("", { model: "1" }).includes("?"));
});
