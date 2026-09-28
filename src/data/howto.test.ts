import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

/*
  HowTo markup is a claim that the page is a procedure. It may only sit on an article whose
  body already is one (explicit "Step one…" paragraphs), and each step must be traceable to
  the body — a condensation, not an addition. Added 2026-09-28 (monthly audit, Gemini's
  "no HowTo schema"). Only fitting-a-euro-cylinder qualifies today.
*/
const articles = ["content/news", "content/guides"].flatMap((dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: `${dir}/${f}`, json: JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) })),
);

test("HowTo only on articles whose body is an explicit step-by-step", () => {
  const withHowTo = articles.filter((a) => a.json.howTo);
  assert.ok(withHowTo.length >= 1, "fitting-a-euro-cylinder should carry HowTo");
  for (const { file, json } of withHowTo) {
    const body = (json.body ?? []).join("\n");
    assert.match(body, /Step one/, `${file}: body is not a step-by-step`);
    assert.ok(json.howTo.steps.length >= 3, `${file}: fewer than three steps`);
    for (const step of json.howTo.steps) {
      assert.ok(step.name && step.text, `${file}: empty step`);
    }
  }
});

test("the article page emits HowTo only in English", () => {
  const src = readFileSync("src/components/site/JsonLd.tsx", "utf8");
  assert.match(src, /locale === "en" && article\.howTo \? howToSchema/);
});
