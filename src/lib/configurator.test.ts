import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  STEPS,
  answersFromParams,
  answersToParams,
  nextStep,
  noteFor,
  normaliseFinishes,
  optionsFor,
  specificationLine,
  OPTION_NOTES,
  OPTION_NOTES_ES,
  remaining,
  reviseAt,
  stepPath,
  type Answers,
} from "./configurator.ts";
import type { FinderProduct } from "./product-finder.ts";

/**
 * Runs against the real catalogue.
 *
 * The invariant being protected — "no choice ever leads to nothing" — is a claim about
 * this catalogue's actual shape: which materials exist under which categories, which
 * finishes are only on stainless. A fixture of three invented products satisfies it
 * trivially and proves nothing about the site.
 */
/*
  Read from content/ rather than importing src/data/products.ts — that module reaches the
  rest of the data layer through extensionless imports Node cannot resolve under --test.
  The records are the same ones; `publishedProducts` is products carrying a hero image,
  which is the filter applied here.
*/
const DIR = "content/products";
const ALL = readdirSync(DIR)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(`${DIR}/${file}`, "utf8")) as FinderProduct);
const catalogue = ALL.filter((product) => product.heroImage?.src);

test("the catalogue is big enough for this test to mean anything", () => {
  assert.ok(catalogue.length > 300, `only ${catalogue.length} products`);
});

test("no offered option ever leads to zero products", () => {
  /*
    The whole point. Walked exhaustively over the first two steps and then sampled — a
    full walk of five steps is thousands of paths and this is a unit test, not a crawl.
  */
  for (const category of optionsFor(catalogue, {}, "category")) {
    assert.ok(category.count > 0);
    const a1: Answers = { category: category.value };
    assert.equal(remaining(catalogue, a1).length, category.count);

    for (const sub of optionsFor(catalogue, a1, "subCategory")) {
      assert.ok(sub.count > 0, `${category.value} / ${sub.value} offered but empty`);
      const a2: Answers = { ...a1, subCategory: sub.value };
      assert.equal(remaining(catalogue, a2).length, sub.count);

      for (const material of optionsFor(catalogue, a2, "material")) {
        const a3: Answers = { ...a2, material: material.value };
        assert.equal(
          remaining(catalogue, a3).length,
          material.count,
          `${category.value}/${sub.value}/${material.value} count disagrees`,
        );
        assert.ok(remaining(catalogue, a3).length > 0);
      }
    }
  }
});

test("a step with one answer or none is never asked", () => {
  /*
    Walk every category to the end, answering the first option each time, and assert the
    walk terminates and never presents a question the reader cannot meaningfully answer.
  */
  for (const category of optionsFor(catalogue, {}, "category")) {
    let answers: Answers = { category: category.value };
    let guard = 0;

    for (;;) {
      const step = nextStep(catalogue, answers);
      if (!step) break;
      assert.ok(guard++ < STEPS.length, `${category.value}: walk did not terminate`);

      const options = optionsFor(catalogue, answers, step.key);
      assert.ok(
        options.length > 1,
        `${category.value}: asked "${step.key}" with ${options.length} option(s)`,
      );
      answers = { ...answers, [step.key]: options[0].value };
    }

    assert.ok(remaining(catalogue, answers).length > 0, `${category.value} ended empty`);
  }
});

test("the walk always ends with something to show", () => {
  // Answering the LAST option at each step, rather than the first, walks other branches.
  for (const category of optionsFor(catalogue, {}, "category")) {
    let answers: Answers = { category: category.value };
    for (;;) {
      const step = nextStep(catalogue, answers);
      if (!step) break;
      const options = optionsFor(catalogue, answers, step.key);
      answers = { ...answers, [step.key]: options[options.length - 1].value };
    }
    const left = remaining(catalogue, answers);
    assert.ok(left.length > 0, `${category.value}: ended with no product`);
  }
});

test("going back to an earlier step drops the answers that depended on it", () => {
  /*
    A finish was chosen from the options one material produced. Keeping it while changing
    the material is the one way this UI could still show an empty result.
  */
  const answers: Answers = {
    category: "deadbolts",
    subCategory: "x",
    material: "y",
    finish: "z",
  };
  assert.deepEqual(reviseAt(answers, "material"), {
    category: "deadbolts",
    subCategory: "x",
  });
  assert.deepEqual(reviseAt(answers, "category"), {});
});

test("a configuration survives a round trip through the URL", () => {
  // It has to: the URL is how a specifier sends a configuration to a colleague.
  const answers: Answers = { category: "lock-cases", material: "Iron" };
  const round = answersFromParams(new URLSearchParams(answersToParams(answers).toString()));
  assert.deepEqual(round, answers);
  assert.deepEqual(answersFromParams(null), {});
  // Unknown params are ignored rather than trusted.
  assert.deepEqual(answersFromParams(new URLSearchParams("evil=1")), {});
});

test("the progress rail lists the steps that will actually be asked", () => {
  const path = stepPath(catalogue, { category: "knob-locks" });
  assert.equal(path[0], "category");
  assert.ok(path.length >= 2);
  assert.ok(new Set(path).size === path.length, "a step is listed twice");
});

test("withheld products are not offered by the configurator", () => {
  // It runs on publishedProducts; a product with no photograph has nothing to show.
  assert.ok(catalogue.length < ALL.length);
  assert.ok(catalogue.every((p) => p.heroImage?.src));
});

test("the finish step offers finishes, not code strings", () => {
  /*
    `finishes` mixes bare codes, full names, a placeholder, and twelve dotted lists where
    one record holds five finishes in a single string. Offered raw, "PB.AB.AC.CP.SN"
    appears as one option, which is neither a finish nor a choice.
  */
  assert.deepEqual(normaliseFinishes(["PB.AB.AC.CP.SN"]), [
    "Polished Brass",
    "Antique Brass",
    "Antique Copper",
    "Chrome Plated",
    "Satin Nickel",
  ]);
  assert.deepEqual(normaliseFinishes(["All Available"]), []);
  assert.deepEqual(normaliseFinishes(["Antique Brass"]), ["Antique Brass"]);
  // An unsourced code stays a code rather than becoming an invented finish name.
  assert.deepEqual(normaliseFinishes(["PVD"]), ["PVD"]);
  assert.deepEqual(normaliseFinishes(["AB", "ab"]), ["Antique Brass"]);

  const offered = optionsFor(catalogue, { category: "brass-steel-hinges" }, "finish");
  assert.ok(offered.length > 0);
  for (const option of offered) {
    assert.ok(!option.value.includes("."), `"${option.value}" is a code list, not a finish`);
    assert.ok(
      option.value.toLowerCase() !== "all available",
      "the placeholder reached the reader",
    );
  }
});

test("the schedule line holds every position from the first render", () => {
  /*
    The point of the line is that it has its final shape before it has its final content
    — a reader can see how many decisions are left without counting steps, and the row
    does not grow sideways as it fills. So an unanswered step is a null slot, never a
    missing one.
  */
  const empty = specificationLine({});
  assert.equal(empty.length, STEPS.length);
  assert.ok(empty.every((slot) => slot.value === null));

  const partial = specificationLine({ category: "panic-exit-devices", material: "Stainless Steel" });
  assert.equal(partial.length, STEPS.length, "the line must not shrink as it fills");
  assert.deepEqual(
    partial.map((s) => s.value),
    ["panic-exit-devices", null, "Stainless Steel", null, null],
  );
  assert.deepEqual(
    partial.map((s) => s.key),
    STEPS.map((s) => s.key),
    "slots stay in step order, so the line reads the same way every time",
  );
});

test("every category and sub-category the configurator can offer has a definition", () => {
  /*
    THE POINT OF THIS TEST. The notes exist because a reader who cannot answer the
    Finder's questions cold is the whole reason the configurator exists — and a step that
    offers `night-latches-rim-locks` with no explanation hands that reader the same
    problem in a friendlier layout.

    A category added to the catalogue with no note fails here rather than shipping as a
    bare slug. Values are read from the real catalogue, so the check cannot drift from
    what the tool actually shows.

    doorType and material are deliberately NOT checked: they are free text with 95 and 64
    distinct values, most of them one-offs ("Bathroom Hotel", "Stainless steel/Brass/Solid
    steel"). Requiring a definition for each would demand 159 sentences about values that
    should be normalised in the data first. That cleanup is on the fill-in sheet.
  */
  const offered = new Set<string>();
  for (const key of ["category", "subCategory"] as const) {
    for (const option of optionsFor(catalogue, {}, key)) offered.add(option.value);
  }
  assert.ok(offered.size > 20, "expected the catalogue to offer both levels of taxonomy");

  const undefinedTerms = [...offered].filter((value) => !noteFor(value));
  assert.deepEqual(
    undefinedTerms,
    [],
    `these choices would be shown as a bare slug with no explanation: ${undefinedTerms.join(", ")}`,
  );

  // Both locales, or a Spanish reader gets a term with no definition where an English one has it.
  const untranslated = [...offered].filter((value) => !noteFor(value, "es"));
  assert.deepEqual(untranslated, [], `missing Spanish definitions: ${untranslated.join(", ")}`);
});

test("the definitions describe the trade, never the certification of our products", () => {
  /*
    These sentences are trade definitions, and that is exactly why they are safe to
    publish: "a mortise lock case is let into the edge of the door" is true of every
    mortise lock ever made. A sentence that reached for EN 1125, ANSI or "certified"
    would stop being a definition and become a product claim on a page where no
    certificate names a model — the same rule scripts/stahlock-cited-policy.mjs enforces
    on imported spec rows.
  */
  const CLAIM = /\b(?:certif(?:ied|ication)|EN\s?1\d{3,4}|ANSI|BHMA|UL[\s-]?listed|approved|tested to)\b/i;
  for (const [locale, notes] of [["en", OPTION_NOTES], ["es", OPTION_NOTES_ES]] as const) {
    for (const [term, note] of Object.entries(notes)) {
      assert.ok(!CLAIM.test(note), `${locale}/${term} makes a certification claim: "${note}"`);
    }
  }
});
