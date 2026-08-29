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

test("missing images remain honest placeholders rather than zoom controls", () => {
  assert.match(zoom, /if \(!src\)/);
  assert.match(zoom, /<MediaPlaceholder/);
});
