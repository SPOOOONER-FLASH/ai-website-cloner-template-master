import assert from "node:assert/strict";
import test from "node:test";
import { contactHref, inquiryPrefill } from "./inquiry-prefill.ts";

test("the query string wins over the fragment, so old ?model= links keep working", () => {
  assert.deepEqual(inquiryPrefill("?model=307", "#model=311&from=guides%2Fx"), { product: "", model: "307", from: "guides/x", note: "" });
});

test("a fragment-only quote link pre-fills model and source article", () => {
  const p = inquiryPrefill("", "#model=575+ABET%2C+564&from=guides%2Fstrike-plates-and-keeps-2026");
  assert.equal(p.model, "575 ABET, 564");
  assert.equal(p.from, "guides/strike-plates-and-keeps-2026");
});

test("empty input yields empty strings and values are capped", () => {
  assert.deepEqual(inquiryPrefill("", ""), { product: "", model: "", from: "", note: "" });
  assert.equal(inquiryPrefill(`?product=${"x".repeat(300)}`, "").product.length, 200);
});

test("contactHref builds a fragment, drops empty values, and never a query string", () => {
  assert.equal(contactHref("/fr", { model: "307", product: undefined, from: "news/a" }), "/fr/contact/#model=307&from=news%2Fa");
  assert.equal(contactHref("", {}), "/contact/");
  assert.ok(!contactHref("", { model: "1" }).includes("?"));
});

test("a calculator note survives the fragment round trip, line breaks included, with its own cap", () => {
  const note = "70mm overall. Halves needed: 35 outside, 35 inside.\nDoor thickness at the lock edge (mm): 60";
  const href = contactHref("/de", { product: "Profilzylinder", note, from: "tools/euro-cylinder-calculator" });
  const p = inquiryPrefill("", href.slice(href.indexOf("#")));
  assert.equal(p.note, note);
  assert.equal(p.product, "Profilzylinder");
  assert.equal(inquiryPrefill("", `#note=${"x".repeat(1000)}`).note.length, 800);
});
