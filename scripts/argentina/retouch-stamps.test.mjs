import assert from "node:assert/strict";
import test from "node:test";
import { retouch } from "./retouch-stamps.mjs";

/* 60 × 60 grey face crossed by a dark diagonal ridge (x = 10 + y/2); a bright letter sits on the ridge. */
const W = 60, H = 60, CH = 3;
const ridge = (y) => 10 + y / 2;
function face() {
  const data = new Uint8Array(W * H * CH).fill(120);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = Math.abs(x - ridge(y)) < 1.5 ? 30 : 120;
    if (x >= 16 && x <= 26 && y >= 20 && y <= 30) v = 230; // the letter
    data.fill(v, (y * W + x) * CH, (y * W + x) * CH + CH);
  }
  return data;
}
const box = { mode: "lines", whole: true, left: [[10, 0], [40, 60]], right: [[50, 0], [80, 60]], poly: [[5, 15], [45, 15], [45, 35], [5, 35]] };
const px = (data, x, y) => data[(y * W + x) * CH];

test("lines: the letter goes, the ridge runs on through the patch", () => {
  const data = face();
  retouch(data, W, H, CH, box);
  assert.ok(Math.abs(px(data, 25, 25) - 120) < 10, `letter gone (${px(data, 25, 25)})`);
  assert.ok(px(data, 22, 25) < 60, `ridge continues through the letter (${px(data, 22, 25)})`);
  assert.ok(Math.abs(px(data, 30, 25) - 120) < 10, "face beside the ridge stays face");
});

test("lines: nothing outside the polygon changes", () => {
  const before = face(), data = face();
  retouch(data, W, H, CH, box);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y >= 15 && y <= 35 && x >= 5 && x <= 45) continue;
    assert.equal(px(data, x, y), px(before, x, y), `pixel ${x},${y} changed`);
  }
});

test("harmonic: a letter on a plain face settles to the face around it", () => {
  const data = new Uint8Array(W * H * CH).fill(100);
  for (let y = 20; y <= 30; y++) for (let x = 20; x <= 30; x++) data.fill(240, (y * W + x) * CH, (y * W + x) * CH + CH);
  retouch(data, W, H, CH, { ...box, fill: "harmonic", poly: [[15, 15], [35, 15], [35, 35], [15, 35]] });
  assert.ok(Math.abs(px(data, 25, 25) - 100) < 8, `filled (${px(data, 25, 25)})`);
});
