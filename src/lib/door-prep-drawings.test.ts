import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";

/*
  A door preparation drawing is the one image on this site that somebody cuts a hole from.

  That changes what the tests have to be. An outline drawing with a wrong figure is caught
  when the part arrives; a preparation drawing with a wrong figure is caught after the
  customer's door has already been drilled. So these check three things the eye does not:

  1. Nothing is clipped. The first version of the generator computed the viewBox height
     from the margins and produced a 720×300 box around a 570-tall drawing — every single
     drawing lost its lower hole. SVG does not warn about that, it just crops.
  2. Every figure on the drawing traces back to a spec row in content/products. No hole is
     drawn from a model number, a sibling model or a standard.
  3. Every drawing says it is a hole pattern and not a product outline, because a reader
     who mistakes one for the other builds the wrong thing either way.
*/

const DIR = "public/images/door-prep";
const INDEX = `${DIR}/index.json`;
const PRODUCTS = "content/products";

interface Entry {
  model: string;
  diameter: number;
  centres: number;
  holeLabel: string;
  source: { hole: string; centre: string };
  note: string;
}

const index = JSON.parse(readFileSync(INDEX, "utf8")) as Record<string, Entry>;

/** Largest coordinate the drawing actually paints, across attributes and path data. */
function extent(svg: string) {
  let maxX = 0;
  let maxY = 0;
  for (const match of svg.matchAll(/(?:\bx|x1|x2|cx)="(-?\d+(?:\.\d+)?)"/g)) {
    maxX = Math.max(maxX, Number(match[1]));
  }
  for (const match of svg.matchAll(/(?:\by|y1|y2|cy)="(-?\d+(?:\.\d+)?)"/g)) {
    maxY = Math.max(maxY, Number(match[1]));
  }
  for (const match of svg.matchAll(/[ML](-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)) {
    maxX = Math.max(maxX, Number(match[1]));
    maxY = Math.max(maxY, Number(match[2]));
  }
  return { maxX, maxY };
}

describe("door preparation drawings", () => {
  it("draws at least one, so the suite fails loudly if the generator stops running", () => {
    assert.ok(Object.keys(index).length > 0, "no door preparation drawings were indexed");
  });

  it("nothing is painted outside its own viewBox", () => {
    for (const slug of Object.keys(index)) {
      const svg = readFileSync(`${DIR}/${slug}.svg`, "utf8");
      const box = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
      assert.ok(box, `${slug} has no viewBox`);

      const { maxX, maxY } = extent(svg);
      assert.ok(maxX <= Number(box[1]) + 1, `${slug} paints to x=${maxX} in a ${box[1]}-wide box`);
      assert.ok(maxY <= Number(box[2]) + 1, `${slug} paints to y=${maxY} in a ${box[2]}-tall box`);
    }
  });

  it("every figure traces back to a spec row on the product", () => {
    for (const [slug, entry] of Object.entries(index)) {
      const path = `${PRODUCTS}/${slug}.json`;
      assert.ok(existsSync(path), `${slug} has a drawing but no product record`);

      const product = JSON.parse(readFileSync(path, "utf8")) as {
        model: string;
        specs?: Array<{ label: string; value: string }>;
      };
      assert.equal(product.model, entry.model);

      const values = (product.specs ?? []).map((spec) => spec.value);
      assert.ok(
        values.includes(entry.source.hole),
        `${slug}: hole figure "${entry.source.hole}" is not a spec row any more`,
      );
      assert.ok(
        values.includes(entry.source.centre),
        `${slug}: center figure "${entry.source.centre}" is not a spec row any more`,
      );

      /* The drawn numbers must be the numbers in those rows, not a rounding of them. */
      assert.ok(
        entry.source.hole.includes(String(entry.diameter)),
        `${slug}: drew Ø${entry.diameter} from "${entry.source.hole}"`,
      );
      assert.ok(
        entry.source.centre.includes(String(entry.centres)),
        `${slug}: drew ${entry.centres} centers from "${entry.source.centre}"`,
      );
    }
  });

  it("every drawing says it is a hole pattern, not a product outline", () => {
    for (const slug of Object.keys(index)) {
      const svg = readFileSync(`${DIR}/${slug}.svg`, "utf8");
      assert.match(
        svg,
        /Not a product outline/,
        `${slug} does not disclaim being an outline drawing`,
      );
      assert.match(svg, /(?:millimeters|millimetres)/, `${slug} does not state its units`);
    }
  });

  it("every SVG on disk is indexed", () => {
    const orphans = readdirSync(DIR)
      .filter((name) => name.endsWith(".svg"))
      .map((name) => name.replace(/\.svg$/, ""))
      .filter((slug) => !(slug in index));

    assert.deepEqual(orphans, [], `unindexed drawings: ${orphans.join(", ")}`);
  });
});
