import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectionSpecRanges } from "./collection-spec-range.ts";
import type { Product } from "../data/types.ts";

/*
  These tests exist because every bug they lock was a WRONG NUMBER on a live page, not a
  crash. A range that silently omits a stated value, or splits a thousands separator, or
  reads fewer figures in Spanish than in English, still renders — it just tells the buyer
  something the catalogue contradicts one row below. A specifier who catches one of those
  discounts every other figure on the site, so each is locked here rather than left to be
  noticed by eye in a spec table nobody re-reads.
*/

const product = (specs: Array<{ label: string; value: string }>): Product =>
  ({ specs }) as unknown as Product;

const find = (products: Product[], label: string) =>
  collectionSpecRanges(products, "en").find((r) => r.label === label);

describe("collectionSpecRanges", () => {
  it("reads the push-bar span recorded as 'Bar Length' into the size range", () => {
    /*
      The panic-exit family splits the same measurement across two labels. Reading only
      "Length" printed "650–1040mm" while an 1110mm bar sat in the same collection.
    */
    const ranges = find(
      [
        product([{ label: "Length", value: "1040mm" }]),
        product([{ label: "Bar Length", value: "1110mm" }]),
        product([{ label: "Length", value: "650mm / 800mm / 1000mm, Customizable" }]),
      ],
      "Size",
    );

    assert.equal(ranges?.value, "650–1110mm");
    assert.equal(ranges?.stated, 3);
  });

  it("distributes a trailing unit across the list it closes, so ES reads what EN reads", () => {
    /*
      "650mm / 800mm / 1000mm" (English) and "650 / 800 / 1000 mm" (Spanish) are the same
      device. Before the fix the Spanish page printed a range starting at 1000.
    */
    const english = find(
      [
        product([{ label: "Length", value: "650mm / 800mm / 1000mm" }]),
        product([{ label: "Bar Length", value: "1110mm" }]),
        product([{ label: "Length", value: "1040mm" }]),
      ],
      "Size",
    );
    const spanish = find(
      [
        product([{ label: "Length", value: "650 / 800 / 1000 mm" }]),
        product([{ label: "Bar Length", value: "1110 mm" }]),
        product([{ label: "Length", value: "1040 mm" }]),
      ],
      "Size",
    );

    assert.equal(spanish?.value, english?.value);
    assert.equal(english?.value, "650–1110mm");
  });

  it("keeps a thousands separator inside one figure", () => {
    /*
      The comma split that separates finishes turned "200,000 cycles" into
      "200, 000 cycles". Finish rows never carry digits, so reading them never caught it.
    */
    const cycles = find(
      [
        product([{ label: "Cycle life", value: "200,000 cycles" }]),
        product([{ label: "Cycle life", value: "200,000 cycles" }]),
        product([{ label: "Cycle life", value: "200,000 cycles" }]),
      ],
      "Cycle life",
    );

    assert.equal(cycles?.value, "200,000 cycles");
  });

  it("still splits a comma that separates two finishes", () => {
    const finishes = find(
      [
        product([{ label: "Finish", value: "Satin Stainless, Powder-Coated Black" }]),
        product([{ label: "Finish", value: "Satin Stainless" }]),
        product([{ label: "Finish", value: "Polished Brass" }]),
      ],
      "Finish",
    );

    assert.ok(finishes?.value.split(", ").includes("Powder-Coated Black"));
    assert.ok(finishes?.value.split(", ").includes("Satin Stainless"));
  });

  it("says nothing when fewer than three products state the field", () => {
    /*
      The glass entrance package depends on this: three products, no recorded specs, and
      the page must show no panel rather than a figure one record spoke for.
    */
    assert.deepEqual(
      collectionSpecRanges([
        product([{ label: "Backset", value: "60mm" }]),
        product([{ label: "Backset", value: "70mm" }]),
        product([]),
      ]),
      [],
    );
  });
});
