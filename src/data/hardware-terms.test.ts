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

  /*
    Three locales, every field. The glossary renders from this array with an ENGLISH
    fallback, so a missing Portuguese consequence does not crash the page — it prints the
    English one under a Portuguese heading, which looks like a finished page and is not.
    The type makes the fields required; this asserts they are not empty strings.
  */
  it("is translated on every side of every field", () => {
    for (const term of HARDWARE_TERMS) {
      assert.ok(term.termEs, `${term.id} has no Spanish term`);
      assert.ok(term.definitionEs, `${term.id} has no Spanish definition`);
      assert.ok(term.consequenceEs, `${term.id} has no Spanish consequence`);
      assert.ok(term.termPt, `${term.id} has no Portuguese term`);
      assert.ok(term.definitionPt, `${term.id} has no Portuguese definition`);
      assert.ok(term.consequencePt, `${term.id} has no Portuguese consequence`);
    }
  });

  /*
    Brazilian Portuguese, not European: this tree declares pt-BR in `news.ts` and in the
    Article markup, and Brazil is the market it was built for. The forms below are the
    ones that give a European draft away at a glance, and they are cheap to catch here —
    a reviewer reading 23 entries will not notice the fourth "stock".

    Kept after `src/data/portuguese-brazilian.test.ts` generalised the rule to the whole
    tree, because this list carries one word the general guard cannot: "stock" is an
    ordinary English word and sweeps through English copy everywhere else, but inside a
    glossary DEFINITION it is European Portuguese for "estoque".
  */
  it("writes Portuguese for Brazil", () => {
    const european = /(equipa|stock|actual|planeado|facto|ecrã|autocarro|comboio)/i;
    for (const term of HARDWARE_TERMS) {
      for (const [field, value] of [
        ["termPt", term.termPt],
        ["definitionPt", term.definitionPt],
        ["consequencePt", term.consequencePt],
      ] as const) {
        const hit = value.match(european);
        assert.ok(
          !hit,
          `${term.id}.${field} uses the European form "${hit?.[0]}" — this tree is pt-BR`,
        );
      }
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
