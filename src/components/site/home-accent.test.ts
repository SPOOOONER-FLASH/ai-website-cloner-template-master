import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (...segments: string[]) => readFileSync(join(root, ...segments), "utf8");
const css = read("src", "app", "globals.css");

/** The CMS file is the single source for the tree — see src/data/categories.ts. */
const categories: { slug: string; image?: { src?: string } }[] = JSON.parse(
  read("content", "categories.json"),
).categories;

test("homepage accent surfaces are visually neutral until hover or keyboard focus", () => {
  assert.match(
    css,
    /\.home-accent-surface\s*\{[\s\S]*?border-color:\s*transparent;[\s\S]*?box-shadow:\s*none;/,
  );
  assert.match(css, /\.home-accent-surface:has\(:focus-visible\)/);
  assert.match(css, /\.home-accent-surface:has\(:focus-visible\)[\s\S]*?\.home-accent-marker::after/);
  assert.match(css, /\.home-accent-surface:hover[\s\S]*?\.home-accent-marker::after/);
  assert.match(css, /border-color:\s*var\(--color-frame\)/);
  assert.match(css, /box-shadow:\s*0\.9rem 0\.9rem 0 var\(--color-shadow-hard\)/);
  assert.match(
    css,
    /\.home-accent-module\s*\{\s*margin:\s*0;\s*padding:\s*0;\s*\}/,
  );
  assert.match(
    css,
    /@media \(min-width:\s*46\.5rem\)[\s\S]*?\.home-accent-module\s*\{[\s\S]*?margin:\s*-1\.6rem;[\s\S]*?padding:\s*1\.6rem;/,
  );
});

test("homepage interaction hierarchy separates cards from editorial modules", () => {
  for (const page of [read("src", "app", "(en)", "page.tsx"), read("src", "app", "es", "page.tsx")]) {
    assert.equal(page.match(/homeAccent/g)?.length, 3);
    assert.equal(page.match(/homeEditorial/g)?.length, 4);
    assert.match(page, /<PageTeaserModule content=\{content\.teaser1\} homeAccent \/>/);
    assert.match(page, /<PageTeaserModule content=\{content\.teaser2\} homeAccent \/>/);
    assert.match(page, /<PageTeaserModule content=\{content\.teaser3\} homeAccent \/>/);
    assert.doesNotMatch(page, /<WelcomeIntro[^>]*homeAccent/);
    assert.doesNotMatch(page, /<TextModule[^>]*homeAccent/);
    assert.doesNotMatch(page, /<HeroModule[^>]*homeAccent/);
  }
});

test("homepage editorial heroes use image motion without a framed surface", () => {
  const hero = read("src", "components", "site", "HeroModule.tsx");

  assert.match(hero, /homeEditorial\?: boolean/);
  assert.match(hero, /homeEditorial && "home-editorial-surface"/);
  assert.match(hero, /homeEditorial && "home-editorial-media"/);
  assert.match(hero, /!homeAccent && !homeEditorial/);
  assert.match(css, /\.home-editorial-media\s*>\s*img/);
  assert.match(css, /\.home-editorial-surface:hover[\s\S]*?\.home-editorial-media\s*>\s*img/);
  assert.doesNotMatch(css, /\.home-editorial-surface:hover\s*\{[\s\S]*?box-shadow/);
});

/*
  This used to grep the source text of src/data/categories.ts for two slugs that had
  once shipped without a cover. It broke the moment that module started reading
  content/categories.json — the data was still correct, only its spelling had moved.

  Asserting on the data instead makes it both robust and stronger: it now covers all
  sixteen tiles rather than the two that happened to fail once, so a new category added
  through the CMS without a cover is caught too. Children are deliberately excluded —
  they are a filter dimension, never a tile.
*/
test("all catalogue category tiles ship with a real cover image", () => {
  const uncovered = categories
    .filter((category) => !category.image?.src)
    .map((category) => category.slug);

  assert.deepEqual(uncovered, [], `categories with no cover image: ${uncovered.join(", ")}`);
});

test("current navigation is bold at rest without a persistent underline", () => {
  const header = read("src", "components", "site", "SiteHeader.tsx");
  const drawer = read("src", "components", "site", "SiteMenuDrawer.tsx");

  assert.match(header, /current && "current-nav"/);
  assert.match(drawer, /current \? "current-nav" : ""/);
  assert.match(css, /\.current-nav\s*\{\s*font-weight:\s*var\(--font-weight-semibold\);\s*\}/);
  assert.doesNotMatch(css, /\.current-nav::after/);
  assert.doesNotMatch(header, /current-underline/);
  assert.doesNotMatch(drawer, /current-underline/);
});

test("homepage mobile disclosure preserves heading order", () => {
  const welcome = read("src", "components", "site", "WelcomeIntro.tsx");

  assert.match(welcome, /<h2 className="text-h3 text-ink">\{text\.more\}<\/h2>/);
  assert.doesNotMatch(welcome, /<h3 className="text-h3 text-ink">\{text\.more\}<\/h3>/);
});

test("homepage product CTA names its destination", () => {
  const home = read("src", "data", "home.ts");

  assert.match(home, /linkLabel:\s*"View Modern Tubular Door Lock"/);
  assert.doesNotMatch(home, /linkLabel:\s*"Learn more"/);
});
