import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * type-scale.test.ts checks that the size TOKENS are well spaced. Nothing checked that
 * components USE them: HeroCarousel set `text-heading-3` and `text-copy`, which exist
 * nowhere, and the homepage caption rendered at an inherited size for weeks while every
 * test passed (found by the 2026-09-22 HYDE design audit).
 *
 * Likewise the three motion clocks (--motion-fast / medium / slow) existed while
 * components wrote duration-200, duration-300, 150ms ease-out, 180ms ease-out — each area
 * of the site moved at its own speed.
 */
const siteRoot = join(process.cwd(), "src", "components", "site");
const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

const sources = readdirSync(siteRoot)
  .filter((name) => /\.(tsx|module\.css)$/.test(name) && !name.includes(".test."))
  .map((name) => ({
    name,
    // Comments may explain history ("used to be 150ms") — only code is checked.
    code: readFileSync(join(siteRoot, name), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, ""),
  }));

test("every size-like text-* class a component uses is defined in globals.css", () => {
  const defined = new Set<string>();
  for (const match of css.matchAll(/\.text-([a-z0-9-]+)\s*[{,]/g)) defined.add(match[1]);
  for (const match of css.matchAll(/--text-([a-z0-9-]+)\s*:/g)) defined.add(match[1]);

  const sizeLike = /^(?:[hcd]\d|heading|copy|body|display|caption|title|lead)/;
  const unknown: string[] = [];
  for (const { name, code } of sources) {
    for (const match of code.matchAll(/(?<![\w-])text-([a-z][a-z0-9-]*)/g)) {
      const token = match[1];
      if (sizeLike.test(token) && !defined.has(token)) unknown.push(`${name}: text-${token}`);
    }
  }
  assert.deepEqual(unknown, [], `undefined type classes render at an inherited size`);
});

test("components move on the three motion clocks, not their own durations", () => {
  const raw: string[] = [];
  for (const { name, code } of sources) {
    for (const match of code.matchAll(/(?<![\w-])duration-\d+\b|(?<![\w.])\d+ms\b/g)) {
      raw.push(`${name}: ${match[0]}`);
    }
  }
  assert.deepEqual(
    raw,
    [],
    "use duration-fast / duration-medium / duration-slow, or var(--motion-*) in CSS",
  );
});
