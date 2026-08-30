import assert from "node:assert/strict";
import test from "node:test";
import { localiseProductValues } from "./spanish-product.ts";

test("known catalogue facts use the reviewed Latin American trade glossary", () => {
  assert.deepEqual(
    localiseProductValues(["Stainless steel", "Entrance doors", "Matt Black"], "es"),
    ["Acero inoxidable", "Puertas de entrada", "Negro mate"],
  );
});

test("unknown factual values stay visible instead of being guessed", () => {
  assert.deepEqual(localiseProductValues(["Client-specific alloy"], "es"), [
    "Client-specific alloy",
  ]);
});

test("English routes retain the source catalogue wording", () => {
  assert.deepEqual(localiseProductValues(["Stainless steel"], "en"), ["Stainless steel"]);
});
