import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (...parts: string[]) => readFileSync(join(root, ...parts), "utf8");

/* The header is a server component plus its client islands (2026-09-28): read both. */
const header = [read("src", "components", "site", "SiteHeader.tsx"), read("src", "components", "site", "HeaderIslands.tsx")].join("\n");
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
  assert.match(header, /"layout border-t border-line bg-surface xl:hidden"/);
  assert.match(header, /navigationStyles\.compactNavigation/);
  /* 09-28: the destinations scroll; "Buy it now" is pinned beside the strip, not inside it. */
  assert.match(header, /<div className="col-content flex min-w-0 items-center gap-16">\s*<nav[\s\S]*?className="nav-rail min-w-0 flex-1"/);
  assert.match(header, /<\/nav>\s*<HeaderRailCta className="nav-rail-cta flex-none">/);

  /*
    Not a second copy of the labels: both rows read the same CMS-backed array.

    This used to require the literal `headerNav.map` twice. The rail now reads
    `headerNav.filter(...).map(...)` — 2026-09-01, dropping Projects so "Buy it now"
    fits inside 375px — which is still the same array and still not a restated label
    list, so the assertion counts uses of `headerNav` rather than one exact call shape.
    Hard-coding a label list in the rail would leave only one use and fail here.
  */
  assert.ok(
    (header.match(/headerNav\b/g) ?? []).length >= 2,
    "the rail should derive from headerNav, not restate the labels",
  );
  assert.match(header, /headerNav[\s\S]{0,200}?\.map\(/);

  // The rail deliberately omits Projects; the desktop row and the drawer still carry it.
  assert.match(header, /\.filter\(\(link\) => link\.href !== "\/projects"\)/);
});

test("the rail scrolls rather than wraps, and hides its scrollbar", () => {
  assert.match(css, /\.nav-rail\s*\{[\s\S]*overflow-x:\s*auto/);
  assert.match(css, /\.nav-rail\s*\{[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /\.nav-rail::-webkit-scrollbar\s*\{\s*display:\s*none;\s*\}/);
  assert.match(css, /\.nav-rail\s*\{[\s\S]*mask-image/);
});

test("no rail label is permanently bold: bold means the current page", () => {
  /* 09-28: bold is reserved for the current page; no label is permanently emphasised. */
  assert.doesNotMatch(header, /nav-rail-item nav-rail-item-emphasis/);
  assert.match(css, /\.nav-rail-item-emphasis\s*\{\s*font-weight:\s*var\(--font-weight-semibold\);\s*\}/);
});

test("the drawer opens on the approved buyer question before utility navigation", () => {
  const question = drawer.indexOf("experience.title");
  const categories = drawer.indexOf("categories.map");
  const storefront = drawer.indexOf("siteSettings.alibaba.storefront");

  assert.ok(question > 0, "the selected menu experience renders its question first");
  assert.ok(categories > question, "full mobile category access follows the buyer paths");
  assert.ok(storefront > question, "the Alibaba utility action does not outrank the RFQ paths");
  assert.match(drawer, /experience\.primary\.map/);
});

test("the drawer lists the catalog itself, not just a Products hub link", () => {
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
