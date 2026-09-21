import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";

/*
  The homepage column card says "N dimension drawings, drawn only from published
  dimensions", and N is `Object.keys(public/images/drawings/index.json).length`.

  That sentence makes two claims, and only one of them is about a count. The second —
  "drawn only from published dimensions" — is the reason a specifier would trust the
  drawing at all, and it is the claim that quietly breaks: an index entry whose SVG was
  deleted still counts, and an SVG with no index entry is a drawing nobody can say where
  the numbers came from. Both are checked here, because the failure is invisible on the
  page: the card shows a slightly wrong number and every drawing still looks fine.
*/

const INDEX = "public/images/drawings/index.json";
const DIR = "public/images/drawings";

describe("dimension drawings", () => {
  const index = JSON.parse(readFileSync(INDEX, "utf8")) as Record<
    string,
    { shape: string; note: string; partial: boolean }
  >;

  it("every indexed drawing has an SVG on disk", () => {
    for (const slug of Object.keys(index)) {
      assert.ok(existsSync(`${DIR}/${slug}.svg`), `${slug} is indexed but has no SVG`);
    }
  });

  it("every SVG on disk is indexed, so nothing is drawn without a provenance note", () => {
    const orphans = readdirSync(DIR)
      .filter((name) => name.endsWith(".svg"))
      .map((name) => name.replace(/\.svg$/, ""))
      .filter((slug) => !(slug in index));

    assert.deepEqual(orphans, [], `SVGs with no index entry: ${orphans.join(", ")}`);
  });

  it("every entry records what it drew, so a partial drawing is knowably partial", () => {
    for (const [slug, entry] of Object.entries(index)) {
      assert.equal(typeof entry.note, "string", `${slug} has no note`);
      assert.ok(entry.note.length > 0, `${slug} has an empty note`);
      assert.equal(typeof entry.partial, "boolean", `${slug} does not say whether it is partial`);
    }
  });

  it("the count the homepage prints is substantial enough to be worth printing", () => {
    assert.ok(
      Object.keys(index).length > 50,
      `only ${Object.keys(index).length} drawings; the card claims a body of work`,
    );
  });
});
