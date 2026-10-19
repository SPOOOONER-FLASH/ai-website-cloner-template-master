import assert from "node:assert/strict";
import test from "node:test";
import { ansiHand, dinHand } from "./handing.ts";
import { flatten, keyPlan } from "./master-key.ts";
import { lookupFinish } from "./finish-lookup.ts";
import { HS_ITEMS, inCategories } from "./hs-codes.ts";

test("handing: the four ANSI hands and their DIN equivalents", () => {
  assert.equal(ansiHand("left", "away"), "LH");
  assert.equal(ansiHand("right", "toward"), "RHR");
  // In-swinging: the pull side is the inside, where the hinges appear mirrored.
  assert.equal(dinHand("left", "away"), "right");
  assert.equal(dinHand("right", "away"), "left");
  // Out-swinging: outside is the pull side.
  assert.equal(dinHand("left", "toward"), "left");
  assert.equal(dinHand("right", "toward"), "right");
});

test("master key symbols follow the keying-schedule article", () => {
  const three = flatten(keyPlan({ levels: 3, branches: [2], changeKeys: 2 })).map((n) => n.symbol);
  assert.deepEqual(three, ["GM", "A", "A1", "A2", "B", "B1", "B2"]);
  const four = flatten(keyPlan({ levels: 4, branches: [1, 2], changeKeys: 1 }));
  assert.deepEqual(four.map((n) => n.symbol), ["GGM", "A", "AA", "AA1", "AB", "AB1"]);
  assert.deepEqual(four.at(-1)?.above, ["AB", "A", "GGM"]);
  const five = flatten(keyPlan({ levels: 5, branches: [1, 1, 2], changeKeys: 1 })).map((n) => n.symbol);
  assert.deepEqual(five, ["GGM", "A", "AA", "AAA", "AAA1", "AAB", "AAB1"]);
  assert.throws(() => keyPlan({ levels: 4, branches: [2], changeKeys: 1 }));
});

test("finish lookup answers in all three code systems", () => {
  const sc = lookupFinish("SC");
  assert.equal(sc.kind, "rows");
  if (sc.kind === "rows") assert.deepEqual(sc.rows.map((r) => r.bhma).sort(), ["626", "652"]);
  const us = lookupFinish("us 32d");
  assert.ok(us.kind === "rows" && us.rows.every((r) => r.bhma === "630" && r.house === "SSS"));
  const bhma = lookupFinish("622");
  assert.ok(bhma.kind === "rows" && bhma.rows[0].base === "steel");
  assert.equal(lookupFinish("Satin Chrome").kind, "rows");
  assert.equal(lookupFinish("SS").kind, "unmapped");
  assert.equal(lookupFinish("612").kind, "unknown");
});

test("HS items carry six-digit codes and resolve their categories", () => {
  for (const item of HS_ITEMS) assert.match(item.hs, /^83\d{2}\.\d{2}$/, item.id);
  assert.ok(inCategories(["glass-door-accessories", "glass-door-handles"], ["glass-door-accessories/glass-door-handles"]));
  assert.ok(inCategories(["knob-locks", "tubular-locks"], ["knob-locks"]));
  assert.ok(!inCategories(["knob-locksmith"], ["knob-locks"]));
});
