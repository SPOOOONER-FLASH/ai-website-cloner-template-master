import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { HARDWARE_TERMS } from "./hardware-terms.ts";

/**
 * The glossary's claims, locked.
 *
 * Two of these are worth more than they look.
 *
 * The spec-label test is what stops the page quietly becoming a generic glossary. Every
 * label an entry names has to exist on a real product record — if somebody renames a spec
 * row in the catalogue, the count beside that term silently drops to zero and the page
 * keeps looking authoritative. This fails instead.
 *
 * The article test catches the cheaper failure: a "Read more" link to an article slug that
 * has been renamed. `seo:deadlinks` would find it too, but only after a full build, and
 * only on `out/`.
 */

const NEWS_DIR = "content/news";
const PRODUCT_DIR = "content/products";

/** Every spec label printed anywhere in the catalogue. */
const catalogueLabels = new Set<string>();
for (const file of readdirSync(PRODUCT_DIR)) {
  if (!file.endsWith(".json")) continue;
  const record = JSON.parse(readFileSync(join(PRODUCT_DIR, file), "utf8"));
  for (const spec of record.specs ?? []) catalogueLabels.add(spec.label);
}

describe("hardware glossary", () => {
  it("gives every term a unique anchor", () => {
    const ids = HARDWARE_TERMS.map((term) => term.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("is translated on both sides of every field", () => {
    for (const term of HARDWARE_TERMS) {
      assert.ok(term.termEs, `${term.id} has no Spanish term`);
      assert.ok(term.definitionEs, `${term.id} has no Spanish definition`);
      assert.ok(term.consequenceEs, `${term.id} has no Spanish consequence`);
    }
  });

  /*
    The consequence is the half that makes this page ours rather than a copy of every
    other glossary. An entry without one is a dictionary entry, and should not ship.
  */
  it("says what each term costs to get wrong", () => {
    for (const term of HARDWARE_TERMS) {
      assert.ok(
        term.consequence.length > 80,
        `${term.id} has no real consequence — a definition alone is a dictionary`,
      );
    }
  });

  it("names spec labels that exist in the catalogue", () => {
    for (const term of HARDWARE_TERMS) {
      for (const label of term.specLabels) {
        assert.ok(
          catalogueLabels.has(label),
          `${term.id} points at spec label "${label}", which no product record uses — ` +
            `the count on /glossary is therefore zero and the page still looks authoritative`,
        );
      }
    }
  });

  it("links only to articles that exist", () => {
    for (const term of HARDWARE_TERMS) {
      if (!term.article) continue;
      assert.ok(
        existsSync(join(NEWS_DIR, `${term.article}.json`)),
        `${term.id} links to /news/${term.article}/, which has no record`,
      );
    }
  });
});
