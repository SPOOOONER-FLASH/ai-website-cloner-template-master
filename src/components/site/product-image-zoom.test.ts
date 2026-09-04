import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const detail = readFileSync(
  new URL("./ProductDetail.tsx", import.meta.url),
  "utf8",
);
const zoom = readFileSync(
  new URL("./ProductImageZoom.tsx", import.meta.url),
  "utf8",
);

test("product hero and gallery images use the same accessible zoom surface", () => {
  assert.match(detail, /import \{ ProductImageZoom \}/);
  assert.match(detail, /<ProductImageZoom \{\.\.\.heroImage\} priority locale=\{locale\} \/>/);
  /*
    The gallery renders every view through the same component as the hero, with the same
    locale. That is the invariant worth protecting — a gallery view that quietly became a
    plain <img> would lose the zoom, and inspecting a detail is why these images exist.

    Matched on the props rather than on an exact source line: the previous assertion
    pinned the whole element including its `key`, so wrapping each view in a grid cell —
    which moved the key to the wrapper and changed nothing about the zoom — failed a test
    named for something the change did not touch. A test that breaks on layout is a test
    that will be edited to pass rather than read.
  */
  assert.match(detail, /<ProductImageZoom \{\.\.\.image\} locale=\{locale\} \/>/);
  assert.match(detail, /gallery\.map\(/);
});

test("zoom opens an on-demand dialog and supports keyboard dismissal", () => {
  assert.match(zoom, /aria-label=\{copy\.enlarge\}/);
  assert.match(zoom, /Ampliar imagen/);
  assert.match(zoom, /role="dialog"/);
  assert.match(zoom, /aria-modal="true"/);
  assert.match(zoom, /event\.key === "Escape"/);
  assert.match(zoom, /open \? \(/);
  assert.match(zoom, /loading="eager"/);
});

test("fine pointers get the selected full-image pan zoom without a decorative loupe", () => {
  assert.match(zoom, /onPointerMove=\{moveZoomOrigin\}/);
  assert.match(zoom, /onPointerLeave=\{resetZoomOrigin\}/);
  assert.match(zoom, /event\.pointerType !== "mouse"/);
  assert.match(zoom, /--product-zoom-x/);
  assert.match(zoom, /product-pointer-zoom/);
  assert.doesNotMatch(zoom, /ZoomIn/);
});

test("pointer zoom remains progressive enhancement over the existing dialog", () => {
  assert.match(zoom, /onClick=\{\(\) => setOpen\(true\)\}/);
  assert.match(zoom, /aria-describedby=\{inspectionHintId\}/);
  assert.match(zoom, /Move across the image to inspect details/);
});

test("missing images remain honest placeholders rather than zoom controls", () => {
  assert.match(zoom, /if \(!src\)/);
  assert.match(zoom, /<MediaPlaceholder/);
});
