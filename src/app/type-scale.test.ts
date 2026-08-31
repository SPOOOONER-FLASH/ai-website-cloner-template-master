import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

/**
 * Client report, 2026-08-31: the site reads as dense and tiring on a phone.
 *
 * The cause was a collapsed scale — `--text-h3` and `--text-c1` held the SAME clamp, so a
 * card title, a footer heading and body copy all rendered at one size, and h1 sat 6px
 * above them. These tests keep the steps apart. They read the smallest value of each
 * clamp, which is the phone end and the end the complaint was about.
 */
function clampMin(token: string): number {
  const declaration = new RegExp(`--${token}:\\s*([^;]+);`).exec(css);
  assert.ok(declaration, `--${token} is not declared`);

  const value = declaration[1].trim();
  const clamp = /^clamp\(\s*([\d.]+)rem/.exec(value);
  if (clamp) return Number(clamp[1]);

  const fixed = /^([\d.]+)rem$/.exec(value);
  assert.ok(fixed, `--${token} is neither a clamp nor a plain rem: ${value}`);
  return Number(fixed[1]);
}

test("each type level is clearly larger than the one below it", () => {
  const h1 = clampMin("text-h1");
  const h2 = clampMin("text-h2");
  const h3 = clampMin("text-h3");
  const c1 = clampMin("text-c1");
  const c2 = clampMin("text-c2");

  // 0.2rem === 2px at the 62.5% root. Anything less is not a step a reader can see.
  assert.ok(h1 - h2 >= 0.2, `h1 (${h1}rem) must clear h2 (${h2}rem) by 2px`);
  assert.ok(h2 - h3 >= 0.2, `h2 (${h2}rem) must clear h3 (${h3}rem) by 2px`);
  assert.ok(
    h3 - c1 >= 0.2,
    `h3 (${h3}rem) must clear body (${c1}rem) by 2px — they were once identical, which ` +
      `is what made section titles indistinguishable from paragraphs`,
  );
  assert.ok(c1 - c2 >= 0.2, `body (${c1}rem) must clear caption (${c2}rem) by 2px`);
});

test("a page title is legible as a title on a phone", () => {
  assert.ok(clampMin("text-h1") >= 2.8, "h1 starts at 28px or more");
  // 12px secondary text on a phone was the other half of the density complaint.
  assert.ok(clampMin("text-c2") >= 1.3, "caption text starts at 13px or more");
});

test("line height moves with size, so nothing sets larger text on a shorter slug", () => {
  for (const level of ["h1", "h2", "h3", "c1", "c2"] as const) {
    const size = clampMin(`text-${level}`);
    const leading = clampMin(`leading-${level}`);
    assert.ok(
      leading >= size * 1.2,
      `--leading-${level} (${leading}rem) is tighter than 1.2x --text-${level} (${size}rem)`,
    );
  }
});
