import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteRoot = join(process.cwd(), "src", "components", "site");
const header = readFileSync(join(siteRoot, "SiteHeader.tsx"), "utf8");
const menu = readFileSync(join(siteRoot, "SiteMenuDrawer.tsx"), "utf8");
const promo = readFileSync(join(siteRoot, "PromoDialog.tsx"), "utf8");
const search = readFileSync(join(siteRoot, "SearchDialog.tsx"), "utf8");

test("requested overlays stay above the passive promotional rail", () => {
  assert.match(header, /sticky top-0 z-10/);
  assert.match(menu, /fixed inset-0 z-50/);
  assert.match(search, /fixed inset-0 z-50/);
  assert.match(promo, /fixed[^\n]*z-\[5\]/);
});
