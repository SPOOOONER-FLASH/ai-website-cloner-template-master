import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * A fit range in a spec row reaches the SEO title whole (docs/collaboration/tasks/2026-09-30-title-range-facts.md).
 *
 * build-product-titles.mjs used to take only the upper bound of "35–55mm" ("for 55mm doors")
 * and to join DV05's "35–55mm / 60–100mm" into one "55–100mm", claiming the 56–59mm doors it
 * does not fit. A buyer reads the title as the fit; a half range is a wrong specification.
 */
const DIR = path.join(process.cwd(), "content", "products");
const RANGE = /^(\d+(?:\.\d+)?)\s*[-–—~]\s*(\d+(?:\.\d+)?)\s*mm$/i;
const products = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")))
  .filter((p) => !p.sites || p.sites.includes("hyde"));

test("a single door-thickness range appears in the title with both ends", () => {
  const wrong: string[] = [];
  for (const p of products) {
    const row = (p.specs ?? []).find((r: { label: string }) => r.label === "Door thickness");
    const m = String(row?.value ?? "").trim().match(RANGE);
    if (!m || !/mm doors/.test(p.seoTitle ?? "")) continue;
    if (!p.seoTitle.includes(`${m[1]}–${m[2]}mm`)) wrong.push(`${p.model}: ${row.value} → ${p.seoTitle}`);
  }
  assert.deepEqual(wrong, []);
});

test("DV05's two ranges stay two ranges in every language", () => {
  const dv05 = products.find((p) => p.model === "DV05");
  assert.ok(dv05, "DV05 is on the HYDE catalog");
  for (const key of ["seoTitle", "seoDescription", "seoTitleEs", "seoDescriptionEs", "seoTitlePt", "seoDescriptionPt"]) {
    const text = String(dv05[key] ?? "");
    assert.doesNotMatch(text, /55–100/, `${key} joins the ranges: ${text}`);
    if (/\d+mm/.test(text)) assert.match(text, /35–55mm \/ 60–100mm/, `${key}: ${text}`);
  }
});
