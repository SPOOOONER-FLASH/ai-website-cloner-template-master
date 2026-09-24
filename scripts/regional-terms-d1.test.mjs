import assert from "node:assert/strict";
import test from "node:test";
import { applyRules, picaporteRule } from "./normalize-regional-terms.mjs";

// Client decision D1 (2026-09-24): Spanish lock terms follow the RAE; picaporte is retired.
test("picaporte becomes pestillo, keeping case and number", () => {
  const rules = [picaporteRule()];
  assert.equal(applyRules("El picaporte entra en el cerradero.", rules, {}), "El pestillo entra en el cerradero.");
  assert.equal(applyRules("Picaportes de acero.", rules, {}), "Pestillos de acero.");
});

test("a sentence that already says pestillo is refused, not collapsed", () => {
  // Three deadbolts plus a latch: two parts. A swap would give both one word.
  assert.throws(() => applyRules("Tres pestillos cuadrados, más picaporte", [picaporteRule()], {}), /rewrite it by hand/);
  // A different sentence in the same string is fine.
  assert.equal(
    applyRules("El cerrojo tiene dos pestillos. El picaporte es aparte.", [picaporteRule()], {}),
    "El cerrojo tiene dos pestillos. El pestillo es aparte.",
  );
});
