import assert from "node:assert/strict";
import test from "node:test";
import { cn } from "./utils.ts";

/*
  These exist because the failure they guard was invisible.

  `cn("text-h1 text-ink")` returned `"text-ink"` for as long as this project has had a
  custom type scale, and nothing complained: no type error, no lint warning, no test. The
  homepage h1 rendered at 16px and it took measuring the DOM on a phone viewport to find
  it. A silent class-eater deserves an assertion, not a comment.
*/

const SCALE = ["d1", "h1", "h2", "h3", "c1", "c2", "lead"];

test("a type-scale class survives being combined with a colour", () => {
  for (const step of SCALE) {
    const out = cn(`text-${step} text-ink`);
    assert.ok(
      out.includes(`text-${step}`),
      `cn() dropped text-${step} — tailwind-merge is treating it as a colour again`,
    );
    assert.ok(out.includes("text-ink"), `cn() dropped the colour alongside text-${step}`);
  }
});

test("two type-scale classes still conflict, last one wins", () => {
  assert.equal(cn("text-h1 text-h2"), "text-h2");
  assert.equal(cn("text-c1", "text-d1"), "text-d1");
});

test("real colour conflicts are still resolved", () => {
  assert.equal(cn("text-ink text-brand"), "text-brand");
});

test("ordinary Tailwind merging is untouched", () => {
  assert.equal(cn("px-8 px-16"), "px-16");
  assert.equal(cn("mt-24", false && "mt-48"), "mt-24");
});
