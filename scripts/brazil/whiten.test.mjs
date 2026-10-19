import assert from "node:assert/strict";
import test from "node:test";
import { whitenBackground } from "./whiten.mjs";

/* 5 × 5 RGB: a near-white border ring, a dark part ring, and a near-white highlight in the middle. */
test("near-white connected to the edge turns white; a highlight inside the part does not", () => {
  const w = 5, h = 5, ch = 3;
  const data = new Uint8Array(w * h * ch);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1;
    const centre = x === 2 && y === 2;
    data.fill(edge || centre ? 245 : 40, (y * w + x) * ch, (y * w + x) * ch + ch);
  }
  whitenBackground(data, w, h, ch);
  assert.equal(data[0], 255, "border pixel whitened");
  assert.equal(data[(1 * w + 1) * ch], 40, "part untouched");
  assert.equal(data[(2 * w + 2) * ch], 245, "enclosed highlight untouched");
});
