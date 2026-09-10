import assert from "node:assert/strict";
import test from "node:test";
import { UNMAPPED_FINISHES, bhmaBase, bhmaFinish, bhmaFinishesFor } from "./bhma-finish.ts";

/*
  These tests exist because the failure mode here is silent and expensive.

  A wrong BHMA number does not break a build, does not look wrong on the page, and is not
  caught by anybody reading English — it is caught by a North American specifier at
  submittal, after the container has shipped. So the cases below are the four ways the
  mapping can be wrong, each pinned:

    1. the same appearance over a different base metal is a DIFFERENT number
    2. a metal outside A156.18's three base groups gets no number at all
    3. a material naming two metals gets no number, rather than the first one named
    4. a finish code that is genuinely ambiguous gets no number, rather than the likelier

  Every number asserted below was read off a published BHMA chart, not inferred from a
  neighbouring row. Sources are in the module header and in
  docs/research/2026-09-10-north-american-specification.md.
*/

test("the same appearance over a different base metal is a different number", () => {
  /* Satin chromium: 626 on brass, 652 on steel. Visually identical, not interchangeable. */
  assert.equal(bhmaFinish("SC", "Solid brass")?.bhma, "626");
  assert.equal(bhmaFinish("SC", "Iron")?.bhma, "652");

  /* Bright chromium: 625 on brass, 651 on steel. */
  assert.equal(bhmaFinish("CP", "Brass")?.bhma, "625");
  assert.equal(bhmaFinish("CP", "Steel")?.bhma, "651");

  /* Satin nickel: 619 on brass, 646 on steel. */
  assert.equal(bhmaFinish("SN", "Solid brass")?.bhma, "619");
  assert.equal(bhmaFinish("SN", "Steel")?.bhma, "646");

  /* And the US number is the SAME across both bases, which is exactly why the older US
     system is not sufficient on its own — US26D covers both 626 and 652. */
  assert.equal(bhmaFinish("SC", "Solid brass")?.us, "US26D");
  assert.equal(bhmaFinish("SC", "Iron")?.us, "US26D");
});

test("stainless is not classified as steel", () => {
  /*
    The string "stainless steel" contains "steel". If the steel test ran first, every
    stainless product in the catalogue — the largest material group, 165 published
    records — would be designated a steel base and get plated-chrome numbers instead of
    solid-stainless ones.
  */
  assert.equal(bhmaBase("Stainless steel"), "stainless");
  assert.equal(bhmaBase("304 stainless steel"), "stainless");
  assert.equal(bhmaBase("304SS"), "stainless");
  assert.equal(bhmaBase("Iron"), "steel");
  assert.equal(bhmaFinish("SSS", "Stainless steel")?.bhma, "630");
  assert.equal(bhmaFinish("PSS", "304 stainless steel")?.bhma, "629");
});

test("zinc alloy and aluminium get no designation, because A156.18 has no group for them", () => {
  /*
    92 published products are zinc alloy — the second largest material group. A156.18's
    base materials are steel, brass/bronze and stainless only. A specification calling for
    626 on a brass base cannot be met by a zinc-alloy casting however close the colour is,
    so the honest answer is no number.
  */
  assert.equal(bhmaBase("Zinc alloy"), null);
  assert.equal(bhmaBase("Aluminum"), null);
  assert.equal(bhmaBase("Aluminium"), null);
  assert.equal(bhmaFinish("SC", "Zinc alloy"), null);
  assert.equal(bhmaFinish("CP", "Zinc alloy"), null);
});

test("a material naming two metals gets no designation, not the first one named", () => {
  /*
    "brass or stainless steel" is a choice the buyer has not made; "stainless steel/brass/
     solid steel" is an assembly. Either way there is no single base to designate, and
    picking the first metal in the string would answer a question nobody asked.
  */
  assert.equal(bhmaBase("Brass or stainless steel"), null);
  assert.equal(bhmaBase("Stainless steel/brass/solid steel"), null);
  assert.equal(bhmaBase("zinc alloy+brass"), null);
  assert.equal(bhmaBase("Iron+stainless steel"), null);
});

test("622 flat black is a steel-base code only", () => {
  /*
    The trap this module was written for, and it caught the module's own first draft.
    622 reads like a coating that should apply over anything; the BHMA chart lists it
    against base material A, steel, alone. Matt black over brass or stainless is a real
    finish we sell and it is not 622.
  */
  assert.equal(bhmaFinish("MB", "Iron")?.bhma, "622");
  assert.equal(bhmaFinish("MB", "Solid brass"), null);
  assert.equal(bhmaFinish("MB", "Stainless steel"), null);
  assert.ok(UNMAPPED_FINISHES["MB over brass or stainless"], "the gap is documented");
});

test("ambiguous house codes get no number rather than the likelier one", () => {
  /*
    `SS` is the catalogue's commonest finish value and it does not say satin or polished.
    630 and 629 are two different submittals, so it stays unmapped — the single most
    tempting guess in the whole table.
  */
  assert.equal(bhmaFinish("SS", "Stainless steel"), null);
  assert.equal(bhmaFinish("NP", "Steel"), null);
  assert.equal(bhmaFinish("AB", "Solid brass"), null);
  for (const code of ["SS", "NP", "AB", "AC", "BN", "SP"]) {
    assert.ok(UNMAPPED_FINISHES[code], `${code} is unmapped with a stated reason`);
  }
});

test("both spellings of satin brass resolve to the same number", () => {
  /*
    The client names it BS (2026-09-08) and the catalogue's own records use SB. Picking one
    to be correct would leave the other silently unmapped — the same decision configurator.ts
    already made for the trade names.
  */
  assert.equal(bhmaFinish("SB", "Solid brass")?.bhma, "606");
  assert.equal(bhmaFinish("BS", "Solid brass")?.bhma, "606");
});

test("a product's dotted finish list is split, and duplicates collapse", () => {
  /*
    Twelve records cram several finishes into one string. Read whole, "PB.SC.CP" is not a
    finish; read split, it is three, two of which have numbers on a brass base.
  */
  const result = bhmaFinishesFor({ finishes: ["PB.SC.CP"], material: "Solid brass" });
  assert.deepEqual(
    result.map((f) => f.bhma),
    ["605", "626", "625"],
  );

  /* SC and CP over steel are 652 and 651; SB has no steel row, so it drops out. */
  const steel = bhmaFinishesFor({ finishes: ["SC", "CP", "SB"], material: "Iron" });
  assert.deepEqual(
    steel.map((f) => f.bhma),
    ["652", "651"],
  );

  /* Nothing at all for a zinc-alloy part, whatever finishes it lists. */
  assert.deepEqual(bhmaFinishesFor({ finishes: ["SC", "CP", "MB"], material: "Zinc alloy" }), []);
});

test("case and whitespace in the catalogue do not change the answer", () => {
  assert.equal(bhmaFinish(" sss ", "Stainless steel")?.bhma, "630");
  assert.equal(bhmaFinish("sc", "SOLID BRASS")?.bhma, "626");
});

test("written-out finish names resolve to the same number as their code", () => {
  /*
    A third of the `finishes` field is prose, not codes. Accepting the spellings adds no
    new claim — the numbers were already sourced — and it is what took coverage from 65
    published records to the figure scripts/audit-bhma-finishes.mjs now prints.
  */
  assert.equal(bhmaFinish("Satin Stainless", "Stainless steel")?.bhma, "630");
  assert.equal(bhmaFinish("satin stainless steel (SS)", "304 stainless steel")?.bhma, "630");
  assert.equal(bhmaFinish("Mirror polished", "Stainless steel")?.bhma, "629");
  assert.equal(bhmaFinish("Satin Nickel", "Solid brass")?.bhma, "619");
  assert.equal(bhmaFinish("Chrome plated", "Brass")?.bhma, "625");

  /* Names that would need a decision stay unrecognised. */
  assert.equal(bhmaFinish("Satin", "Stainless steel"), null);
  assert.equal(bhmaFinish("Brushed satin", "Solid brass"), null);
  assert.equal(bhmaFinish("Painted", "Iron"), null);
  assert.equal(bhmaFinish("Custom finish", "Stainless steel"), null);
});
