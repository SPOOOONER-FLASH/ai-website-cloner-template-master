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

/**
 * The other half of the density complaint, reported 2026-08-31 as "乱加粗，没有章法".
 *
 * The weights were h1 700 / h2 400 / h3 700 / body 400 — a level-2 heading rendered
 * LIGHTER than a level-3 one. Nothing in the page told the reader which of two headings
 * outranked the other, so bold stopped carrying information and just added noise.
 *
 * Amazon's pages read as calm at a smaller body size because weight is spent sparingly
 * and monotonically. We are B2B and do not copy their layout, but that rule is not a
 * consumer-retail idea — it is what makes any dense catalogue scannable.
 */
function weightOf(selector: string): number {
  const block = new RegExp(`\\.${selector}\\s*\\{[^}]*\\}`).exec(css);
  assert.ok(block, `.${selector} is not declared`);

  const weight = /font-weight:\s*var\(--font-weight-(\w+)\)/.exec(block[0]);
  assert.ok(weight, `.${selector} does not set a font weight`);

  const scale: Record<string, number> = { regular: 400, semibold: 600, bold: 700 };
  const resolved = scale[weight[1]];
  assert.ok(resolved, `unknown weight token --font-weight-${weight[1]}`);
  return resolved;
}

test("weight never increases as the heading level goes down", () => {
  const h1 = weightOf("text-h1");
  const h2 = weightOf("text-h2");
  const h3 = weightOf("text-h3");
  const c1 = weightOf("text-c1");

  assert.ok(h1 >= h2, `h1 (${h1}) must not be lighter than h2 (${h2})`);
  assert.ok(
    h2 >= h3,
    `h2 (${h2}) must not be lighter than h3 (${h3}) — it was 400 against 700, which made ` +
      `a section heading weigh less than the card titles beneath it`,
  );
  assert.ok(h3 > c1, `h3 (${h3}) must outweigh body (${c1})`);
});

test("reading sizes carry no positive letter-spacing", () => {
  /*
    Every level used to add ~0.36px of tracking, body included. Positive tracking is a
    device for small text and capitals; at 16px and above it just pushes words apart and
    costs a line per paragraph. Caption text at 13px keeps its tracking on purpose.
  */
  for (const level of ["h2", "h3", "c1"] as const) {
    const declared = new RegExp(`--tracking-${level}:\\s*(-?[\\d.]+)rem`).exec(css);
    assert.ok(declared, `--tracking-${level} is not declared`);
    assert.ok(
      Number(declared[1]) <= 0,
      `--tracking-${level} is ${declared[1]}rem; reading sizes should sit at 0 or tighter`,
    );
  }
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
