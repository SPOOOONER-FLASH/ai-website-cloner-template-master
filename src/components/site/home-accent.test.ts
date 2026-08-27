import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (...segments: string[]) => readFileSync(join(root, ...segments), "utf8");
const css = read("src", "app", "globals.css");

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

test("the ten post-carousel homepage modules opt into the accent in both locales", () => {
  for (const page of [read("src", "app", "(en)", "page.tsx"), read("src", "app", "es", "page.tsx")]) {
    assert.equal(page.match(/homeAccent/g)?.length, 10);
    assert.match(page, /<HeroCarousel[\s\S]*?<PageTeaserModule content=\{content\.teaser1\} \/>/);
    assert.doesNotMatch(page, /<PageTeaserModule content=\{content\.teaser1\} homeAccent/);
  }
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
