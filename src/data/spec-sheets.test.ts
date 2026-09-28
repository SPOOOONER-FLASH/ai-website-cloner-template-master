import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import test from "node:test";

/*
  The product page links a spec sheet only for slugs in src/data/generated/spec-sheets.json
  (written by scripts/build_spec_sheets.py). A listed slug without its PDF is a 404 link; a
  PDF without a listing is a stale file for a product that no longer qualifies.
*/
const manifest = JSON.parse(readFileSync("src/data/generated/spec-sheets.json", "utf8")) as string[];
const dir = "public/downloads/spec-sheets";

test("every listed spec sheet exists, and every sheet is listed", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".pdf")).map((f) => f.slice(0, -4)).sort();
  assert.deepEqual(files, [...manifest].sort());
});

test("sheets exist only for published HYDE products with a confirmed model code", () => {
  for (const slug of manifest) {
    const file = `content/products/${slug}.json`;
    assert.ok(existsSync(file), `${slug}: no product record`);
    const p = JSON.parse(readFileSync(file, "utf8"));
    assert.ok(!p.sites || p.sites.includes("hyde"), `${slug}: not on the HYDE catalogue`);
    assert.ok(p.heroImage?.src, `${slug}: no photograph`);
    assert.ok(!p.modelTbc, `${slug}: model code not confirmed`);
  }
});
