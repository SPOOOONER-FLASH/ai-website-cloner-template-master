import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/*
  Client 09-28: 「轮播图怎么不轮播了」. Two ways it froze: hover on the whole section (the image
  fills the first screen, and on phones a tap fires mouseenter with no mouseleave), and a
  slide change that waited only on requestAnimationFrame.
*/
const src = readFileSync("src/components/site/HeroCarousel.tsx", "utf8");

test("hover pauses only over the caption, and only for a real mouse", () => {
  assert.doesNotMatch(src, /onMouseEnter=\{\(\) => setHovered\(true\)\}/);
  assert.match(src, /onPointerEnter=\{\(event\) => \{\s*if \(event\.pointerType === "mouse"\) setHovered\(true\);/);
});

test("a slide change never waits on animation frames alone", () => {
  assert.match(src, /activationTimer\.current = window\.setTimeout\(start, 120\)/);
});
