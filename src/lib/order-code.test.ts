import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseFinishValue, parseOrderCode } from "./order-code.ts";
import {
  DOOR_CONFIGURATION_CODES,
  FINISH_CODES,
  FUNCTION_CODES,
} from "../data/finish-codes.ts";

describe("parseOrderCode", () => {
  it("splits a four-letter suffix into finish then function", () => {
    assert.deepEqual(parseOrderCode("587 SSBK"), {
      base: "587",
      finishes: ["SS"],
      fn: "BK",
      unresolved: [],
    });
  });

  it("reads the client-confirmed LH852 GMBK", () => {
    const parsed = parseOrderCode("LH852 GMBK");
    assert.equal(parsed.base, "LH852");
    assert.deepEqual(parsed.finishes, ["GM"]);
    assert.equal(parsed.fn, "BK");
  });

  it("accepts a hyphen as the separator", () => {
    assert.deepEqual(parseOrderCode("564-MB").finishes, ["MB"]);
  });

  it("reads a bare finish code and a bare function code", () => {
    assert.deepEqual(parseOrderCode("564 MB").finishes, ["MB"]);
    assert.equal(parseOrderCode("023 ET").fn, "ET");
  });

  /*
    The reason the parser reads slots rather than letters. BS is both a finish code and a
    function code; only its position says which one is meant.
  */
  it("reads BS as a function in the second slot", () => {
    const parsed = parseOrderCode("9212 BNBS");
    assert.deepEqual(parsed.finishes, ["BN"]);
    assert.equal(parsed.fn, "BS");
  });

  /* Two-tone. BN is a finish and AC is a finish, so the pair is read as both. */
  it("reads a finish+finish pair as a two-tone model", () => {
    const parsed = parseOrderCode("9211 BNAC");
    assert.deepEqual(parsed.finishes, ["BN", "AC"]);
    assert.equal(parsed.fn, undefined);
  });

  it("keeps a second finish that trails the suffix", () => {
    assert.deepEqual(parseOrderCode("70 SNDK CP").finishes, ["SN", "CP"]);
  });

  it("reads S and D only when the caller opts in", () => {
    assert.deepEqual(parseOrderCode("316-D").unresolved, ["D"]);
    assert.equal(parseOrderCode("316-D", { doorCodes: true }).door, "D");
    assert.equal(parseOrderCode("316-S", { doorCodes: true }).door, "S");
  });

  it("leaves a suffix unresolved when either half is unknown", () => {
    // ET is a function code, never a finish, so ETAN cannot be read as finish+function.
    const parsed = parseOrderCode("023 ETAN");
    assert.deepEqual(parsed.finishes, []);
    assert.equal(parsed.fn, undefined);
    assert.deepEqual(parsed.unresolved, ["ETAN"]);
  });

  it("keeps product words out of the finish and function slots", () => {
    const parsed = parseOrderCode("F101 GLASS DOOR PATCH");
    assert.equal(parsed.base, "F101");
    assert.deepEqual(parsed.finishes, []);
    assert.deepEqual(parsed.unresolved, ["GLASS", "DOOR", "PATCH"]);
  });

  it("returns an empty base rather than throwing on an empty model", () => {
    assert.deepEqual(parseOrderCode(""), { base: "", finishes: [], unresolved: [] });
  });
});

describe("parseFinishValue", () => {
  it("splits a dot-separated list into codes", () => {
    assert.deepEqual(parseFinishValue("PB.AB.AC.CP.SN").codes, ["PB", "AB", "AC", "CP", "SN"]);
  });

  it("reads the factory's own code=name cells", () => {
    assert.deepEqual(parseFinishValue("Pb=polish Brass").codes, ["PB"]);
    assert.deepEqual(parseFinishValue("Sc= Satin chrome").codes, ["SC"]);
  });

  it("reads a written name back to its code", () => {
    assert.deepEqual(parseFinishValue("Satin Stainless Steel (SSS)").codes, ["SSS"]);
    assert.deepEqual(parseFinishValue("Antique Brass").codes, ["AB"]);
  });

  it("drops commentary that qualifies the offer rather than the colour", () => {
    assert.deepEqual(parseFinishValue("PB Are Available").codes, ["PB"]);
    assert.deepEqual(parseFinishValue("SC (Custom Available)").codes, ["SC"]);
  });

  it("does not repeat a code that the cell names twice", () => {
    assert.deepEqual(parseFinishValue("PB Brass Polish").codes, ["PB"]);
  });

  it("reports what it could not read instead of guessing", () => {
    const parsed = parseFinishValue("Satin+Polished");
    assert.deepEqual(parsed.codes, []);
    assert.ok(parsed.unresolved.length > 0);
  });
});

describe("the code tables", () => {
  it("has no duplicate codes within a table", () => {
    const finishes = FINISH_CODES.map((entry) => entry.code);
    assert.equal(new Set(finishes).size, finishes.length);
    const functions = FUNCTION_CODES.map((entry) => entry.code);
    assert.equal(new Set(functions).size, functions.length);
  });

  /*
    The honesty rule, locked. An unconfirmed code must not carry a name — the page prints
    whatever is here, so a name added without changing `evidence` would ship a guess as a
    fact. Changing this test is the deliberate act that lets a name through.
  */
  it("gives a name to confirmed codes only", () => {
    for (const entry of [...FINISH_CODES, ...FUNCTION_CODES, ...DOOR_CONFIGURATION_CODES]) {
      if (entry.evidence === "unconfirmed") {
        assert.equal(entry.name, null, `${entry.code} is unconfirmed but carries a name`);
      } else {
        assert.ok(entry.name, `${entry.code} is ${entry.evidence} but has no name`);
      }
    }
  });

  it("carries a Spanish name wherever it carries an English one", () => {
    for (const entry of [...FINISH_CODES, ...FUNCTION_CODES, ...DOOR_CONFIGURATION_CODES]) {
      assert.equal(
        Boolean(entry.name),
        Boolean(entry.nameEs),
        `${entry.code} is translated on one side only`,
      );
    }
  });

  it("explains every unconfirmed code rather than leaving it bare", () => {
    for (const entry of [...FINISH_CODES, ...FUNCTION_CODES, ...DOOR_CONFIGURATION_CODES]) {
      if (entry.evidence !== "unconfirmed") continue;
      assert.ok(entry.note, `${entry.code} is unconfirmed with no note saying why`);
      assert.ok(entry.noteEs, `${entry.code} has no Spanish note`);
    }
  });
});
