import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { cardFigure } from "./card-figure.ts";
import type { Product } from "../data/types.ts";

const product = (
  specs: Array<{ label: string; value: string }>,
  specsEs?: Array<{ label: string; value: string }>,
) => ({ specs, specsEs }) as unknown as Product;

describe("cardFigure", () => {
  it("prefers the figure a lock is actually bought on", () => {
    /*
      A card has room for one number. Backset decides whether a mortise lock can go in
      the door at all and cannot be corrected on site; a carton "Size" cannot.
    */
    const figure = cardFigure(
      product([
        { label: "Size", value: "220 × 24mm" },
        { label: "Backset", value: "60mm / 70mm adjustable" },
      ]),
    );

    assert.equal(figure?.label, "Backset");
  });

  it("says nothing rather than something weaker when no figure is recorded", () => {
    /*
      276 of the 636 published products have no dimension on record. A card that falls
      back to "Stainless Steel" next to a neighbour reading "Backset 60mm" is a card
      admitting we cannot state our own product.
    */
    assert.equal(
      cardFigure(
        product([
          { label: "Material", value: "Stainless Steel" },
          { label: "Length", value: "Different length according to customer request" },
        ]),
      ),
      undefined,
    );
  });

  it("states the same number in Spanish as in English", () => {
    /*
      copy:parity checks figures in prose; it does not see a figure a component derives.
      A Spanish card showing a different backset from the English one is the defect that
      took 534 product titles, arriving one component further down.
    */
    const specs = [{ label: "Backset", value: "60mm / 70mm adjustable" }];
    const en = cardFigure(product(specs), "en");
    const es = cardFigure(
      product(specs, [{ label: "Entrada", value: "60 mm / 70 mm regulable" }]),
      "es",
    );

    assert.equal(es?.label, "Entrada");
    assert.match(es?.value ?? "", /60/);
    assert.match(en?.value ?? "", /60/);
  });

  it("falls back to the English value when the Spanish record has no matching row", () => {
    const es = cardFigure(product([{ label: "Backset", value: "60mm" }], []), "es");

    assert.equal(es?.value, "60mm");
  });

  it("every figure it returns for the real catalogue contains a digit", () => {
    /*
      The whole point is printing a number. A row like "Available on request" satisfies
      the label match and says nothing, so the guard is asserted against real content
      rather than trusted from the regex.
    */
    const dir = "content/products";
    let checked = 0;

    for (const file of readdirSync(dir).filter((name) => name.endsWith(".json"))) {
      const record = JSON.parse(readFileSync(`${dir}/${file}`, "utf8")) as Product;
      const figure = cardFigure(record);
      if (!figure) continue;
      assert.match(figure.value, /\d/, `${record.model} printed "${figure.value}"`);
      checked += 1;
    }

    assert.ok(checked > 300, `expected the catalogue to yield figures, got ${checked}`);
  });
});
