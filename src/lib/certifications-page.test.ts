import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("certification registry is a public route linked from the site drawer", () => {
  const pagePath = "src/app/(en)/certifications/page.tsx";
  assert.equal(existsSync(pagePath), true);

  const menu = readFileSync("src/components/site/SiteMenuDrawer.tsx", "utf8");
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  assert.match(menu, /Certificates[^\n]+\/certifications\//);
  assert.match(sitemap, /entry\("\/certifications"/);
});

test("certificate page names all three HYDE records and never restores the KALE report", () => {
  const source = readFileSync("src/app/(en)/certifications/page.tsx", "utf8");
  assert.match(source, /certificates\.map/);
  assert.match(source, /exact model scope/i);
  assert.doesNotMatch(source, /KALE|151120057GZU-001|KD070\/20-101/);
});

test("downloads lists every HYDE certificate as a model-scoped request", () => {
  const source = readFileSync("src/app/(en)/downloads/page.tsx", "utf8");
  assert.match(source, /certificates\.map/);
  assert.match(source, /Request verified copy/i);
  assert.match(source, /coversModel/);
  assert.match(source, /reference/);
  assert.doesNotMatch(source, /KALE|151120057GZU-001|KD070\/20-101/);
});
