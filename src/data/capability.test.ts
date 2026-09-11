import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { capabilityCopy, capabilitySteps } from "./capability.ts";

/** A stand-in count for the structural tests; the real one is asserted separately. */
const MODELS = 361;

/*
  The capability chain is the one section on the site whose entire job is to be believed,
  which makes it the one most worth asserting on.

  Two things can rot here without anyone noticing. A figure can drift away from the data
  it claims to count — the whole reason the counts are computed rather than typed. And a
  well-meaning edit can add a figure to a step that has nothing behind it, because every
  other step has one and the gap looks like an oversight. It is not an oversight; see the
  comment on the finishing step. These tests make both failures loud.
*/

test("the chain is a sequence, numbered without gaps", () => {
  const steps = capabilitySteps({ models: MODELS });
  assert.ok(steps.length >= 5, "a three-step chain is a feature list, not a process");
  assert.deepEqual(
    steps.map((s) => s.ordinal),
    steps.map((_, i) => String(i + 1).padStart(2, "0")),
    "ordinals must run 01..NN in order — they are the argument that this is one sequence",
  );
});

test("every step is written in both published locales", () => {
  for (const step of capabilitySteps({ models: MODELS })) {
    for (const field of ["title", "titleEs", "body", "bodyEs"] as const) {
      assert.ok(step[field]?.trim(), `step ${step.ordinal} is missing ${field}`);
    }
    /*
      A Spanish body that is character-identical to the English one is an untranslated
      paste, which on this site would ship to a Spanish-speaking buyer as an obvious
      tell. Titles are exempt: "Tooling"/"Utillaje" differ, but a one-word technical
      term legitimately can match across the two languages.
    */
    assert.notEqual(
      step.body.trim(),
      step.bodyEs.trim(),
      `step ${step.ordinal} has an untranslated Spanish body`,
    );
  }
});

test("a figure is present only where something was actually counted", () => {
  const steps = capabilitySteps({ models: MODELS });
  const withFigures = steps.filter((s) => s.figure);

  assert.ok(withFigures.length >= 1, "a chain with no figures at all states nothing");
  assert.ok(
    withFigures.length < steps.length,
    "every step carrying a figure means one was invented — stamping and polishing have none",
  );

  for (const step of withFigures) {
    const figure = step.figure!;
    assert.ok(figure.value.trim(), `step ${step.ordinal} has an empty figure value`);
    assert.ok(figure.label.trim() && figure.labelEs.trim(), `step ${step.ordinal} figure needs both labels`);
    assert.doesNotMatch(
      figure.value,
      /\bNaN\b|undefined|^0$/,
      `step ${step.ordinal} figure is a broken computation, not a fact`,
    );
  }
});

test("the model figure is whatever it was handed, never a literal", () => {
  for (const models of [1, 361, 999]) {
    const tooling = capabilitySteps({ models }).find((s) => s.title === "Tooling");
    assert.ok(tooling?.figure, "the tooling step should state how many models are in production");
    assert.equal(
      tooling.figure.value,
      String(models),
      "a hardcoded number here would go stale the day a model is added",
    );
  }
});

/*
  The pair to the test above, and the one that actually protects the claim on the page.

  Making `capabilitySteps` pure moved the counting to the caller, which means the figure
  could still be honest in this module and wrong on the site — someone passes a literal,
  and every test above keeps passing. So this reads the component and checks it is
  counting the catalogue. Reading source as text is blunt, but the alternative is
  importing `products.ts`, which cannot load here at all, and no check is worse than a
  blunt one.
*/
/*
  MOVED, NOT WEAKENED — 2026-09-11.

  This used to assert that CapabilityChain itself called
  `capabilitySteps({ models: publishedProducts.length })`. The invariant it protects is
  still exactly right: the figure on the page must come from the catalogue, so it cannot
  drift into a literal somebody forgets to update.

  What changed is WHERE the counting happens. CapabilityChain is a client component, and
  importing `publishedProducts` from client code ships the whole catalogue to the browser
  — 659 records, their specs and their summaries, in a 1,548 KB chunk, so that one integer
  could be rendered. The count moved to CompanyOverview, which is a server component and
  already has the data.

  So the assertion now follows the number across the two files: the parent must read it
  from the catalogue, and the child must use the prop rather than a constant. Either half
  alone would let the regression back in — a parent that passes a literal, or a child that
  ignores the prop.
*/
test("the capability figure is counted from the catalogue, on the server", () => {
  const child = readFileSync(
    new URL("../components/site/CapabilityChain.tsx", import.meta.url),
    "utf8",
  );
  const parent = readFileSync(
    new URL("../components/site/CompanyOverview.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    parent,
    /<CapabilityChain[^>]*models=\{publishedProducts\.length\}/,
    "CompanyOverview must pass publishedProducts.length, so the page updates with the catalogue",
  );
  assert.match(
    child,
    /capabilitySteps\(\{\s*models\s*\}\)/,
    "CapabilityChain must use the prop, not a literal of its own",
  );
  assert.doesNotMatch(
    child,
    /from "@\/data\/products"/,
    "CapabilityChain is a client component: importing the catalogue ships it to the browser",
  );
});

test("both locales have the surrounding copy the section needs", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = capabilityCopy[locale];
    for (const key of ["eyebrow", "title", "intro", "progress", "cta"] as const) {
      assert.ok(copy[key]?.trim(), `${locale} copy is missing ${key}`);
    }
  }
  assert.notEqual(capabilityCopy.en.intro, capabilityCopy.es.intro);
});
