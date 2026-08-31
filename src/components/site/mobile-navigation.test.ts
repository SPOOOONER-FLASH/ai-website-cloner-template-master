import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (...parts: string[]) => readFileSync(join(root, ...parts), "utf8");

const header = read("src", "components", "site", "SiteHeader.tsx");
const drawer = read("src", "components", "site", "SiteMenuDrawer.tsx");
const css = read("src", "app", "globals.css");

/**
 * Client decision, 2026-08-31, after reviewing the site on a phone.
 *
 * The inline nav row is `max-xl:hidden` — correct for a row that needs 486px — but it
 * left every viewport under 1376px (all phones, all tablets, a 1280px laptop) with a
 * wordmark, a language link, a magnifier and a hamburger, and nothing that names a
 * destination. These tests keep a rail on those viewports and keep the buying routes at
 * the top of the drawer rather than below nine navigation links.
 */

test("a nav rail names destinations on every viewport below xl", () => {
  assert.match(header, /className="layout border-t border-line bg-surface xl:hidden"/);
  assert.match(header, /className="nav-rail col-content"/);

  // Not a second copy of the labels: both rows read the same CMS-backed array.
  assert.match(header, /headerNav\.map/g);
  assert.ok(
    (header.match(/headerNav\.map/g) ?? []).length >= 2,
    "the rail should map headerNav, not restate the labels",
  );
});

test("the rail scrolls rather than wraps, and hides its scrollbar", () => {
  assert.match(css, /\.nav-rail\s*\{[\s\S]*overflow-x:\s*auto/);
  assert.match(css, /\.nav-rail\s*\{[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /\.nav-rail::-webkit-scrollbar\s*\{\s*display:\s*none;\s*\}/);
  assert.match(css, /\.nav-rail\s*\{[\s\S]*mask-image/);
});

test("Product Finder carries weight in the rail", () => {
  assert.match(header, /nav-rail-item nav-rail-item-emphasis/);
  assert.match(css, /\.nav-rail-item-emphasis\s*\{\s*font-weight:\s*var\(--font-weight-semibold\);\s*\}/);
});

test("the drawer opens on the buying block, not on navigation", () => {
  const buy = drawer.indexOf("{t.buy}");
  const catalogue = drawer.indexOf("{t.catalogue}");
  const company = drawer.indexOf("{t.company}");

  assert.ok(buy > 0 && catalogue > 0 && company > 0, "all three drawer sections render");
  assert.ok(buy < catalogue, "Buy it now precedes the catalogue");
  assert.ok(catalogue < company, "the catalogue precedes the background pages");

  // The storefront is the first thing under the first heading.
  assert.ok(
    drawer.indexOf("alibaba-hard-cta") < catalogue,
    "the Alibaba call to action sits inside the buying block",
  );
});

test("the drawer lists the catalogue itself, not just a Products hub link", () => {
  assert.match(drawer, /categories\.map/);
  assert.match(drawer, /categories: MenuCategory\[\]/);

  // Category data arrives as a prop; importing it here would ship categories.json,
  // its sub-category tree and the alt-override modules into the client bundle.
  assert.doesNotMatch(drawer, /import \{[^}]*getMenuCategories/);
  assert.doesNotMatch(drawer, /categories\.json/);
});

test("drawer items are list-sized, not headline-sized", () => {
  assert.match(css, /\.drawer-link\s*\{[\s\S]*font-size:\s*1\.6rem/);
  assert.match(css, /\.drawer-eyebrow\s*\{[\s\S]*font-size:\s*1\.2rem/);
  // The nine 24px links this replaced.
  assert.doesNotMatch(drawer, /text-h2/);
});
