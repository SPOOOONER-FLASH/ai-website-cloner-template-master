import assert from "node:assert/strict";
import test from "node:test";
import { firstMentions, isLinkableModel, mentionPattern, rowHeaderHref, splitMentions } from "./article-products.ts";

const index = new Map([
  ["LC8520", "/products/lock-cases/lc8520/"],
  ["575 ABET", "/products/knob-locks/575-abet/"],
  ["9014 SSET", "/products/stainless-steel-handles/9014-sset/"],
  ["9014 SS", "/products/stainless-steel-handles/9014-ss/"],
  ["307", "/products/panic-exit-devices/307/"],
  ["306-D", "/products/panic-exit-devices/306-d/"],
]);

test("bare numbers are never linkable in prose", () => {
  assert.equal(isLinkableModel("307"), false);
  assert.equal(isLinkableModel("564"), false);
  assert.equal(isLinkableModel("575 ABET"), true);
});

test("a match must stand alone and the longest model wins", () => {
  const p = mentionPattern(index.keys())!;
  const found = (s: string) => [...s.matchAll(p)].map((m) => m[1]);
  assert.deepEqual(found("UL 305 and 564mm"), []);
  assert.deepEqual(found("the LC85200 body"), []);
  assert.deepEqual(found("the 306-DX bar"), []);
  assert.deepEqual(found("order 9014 SSET today"), ["9014 SSET"]);
  assert.deepEqual(found("an LC8520 case, not 85mm"), ["LC8520"]);
});

test("only the first mention in the article is linked, and never in a heading", () => {
  const blocks = [
    { kind: "heading", text: "LC8520" },
    { kind: "paragraph", text: "The LC8520 and the 575 ABET." },
    { kind: "paragraph", text: "Again the LC8520." },
  ];
  const m = firstMentions(blocks, index);
  assert.deepEqual([...m.keys()], [1]);
  assert.deepEqual([...m.get(1)!.keys()].sort(), ["575 ABET", "LC8520"]);
});

test("splitMentions links each model once within the text", () => {
  const parts = splitMentions("LC8520 then LC8520", new Map([["LC8520", "/x/"]]));
  assert.deepEqual(parts, [{ model: "LC8520", href: "/x/" }, " then LC8520"]);
});

test("a digit-only row header links only when the article relates it", () => {
  assert.equal(rowHeaderHref("307", index, new Set()), undefined);
  assert.equal(rowHeaderHref("307", index, new Set(["307"])), "/products/panic-exit-devices/307/");
  assert.equal(rowHeaderHref(" LC8520 ", index, new Set()), "/products/lock-cases/lc8520/");
  assert.equal(rowHeaderHref("LC8520 85mm", index, new Set()), undefined);
});
