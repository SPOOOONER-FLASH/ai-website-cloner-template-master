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
  assert.match(detail, /<ProductImageZoom \{\.\.\.product\.heroImage\} priority \/>/);
  assert.match(detail, /<ProductImageZoom key=\{`\$\{image\.src\}-\$\{image\.label\}`\} \{\.\.\.image\} \/>/);
});

test("zoom opens an on-demand dialog and supports keyboard dismissal", () => {
  assert.match(zoom, /aria-label=\{`Enlarge \$\{label\}`\}/);
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
