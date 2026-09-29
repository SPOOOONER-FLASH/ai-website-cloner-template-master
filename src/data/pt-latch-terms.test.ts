import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/*
  Brazilian Portuguese: `trinco` is the sprung latch the handle retracts; `trava` is the
  dead bolt the key throws. Evidence and the full history are in src/data/pt-glossary.ts's
  header — in short, that header used to assert the opposite and cite a fire-door standard
  for it, and 351 spec rows across 207 records followed it.

  The reason this is a test and not a comment is that the error propagated through people
  being careful: two glossary rows were edited INTO the mistake by later sessions
  reasoning from the header. A comment can be out-argued by a confident reader. A failing
  test has to be deliberately rewritten, and whoever rewrites it reads the evidence first.
*/

const isLatch = (en: string) => /\blatch(es)?\b/i.test(en) && !/\bdead\s?bolt/i.test(en);
const isDead = (en: string) => /\bdead\s?bolt(s)?\b/i.test(en) && !/\blatch(es)?\b/i.test(en);

/** Every `"English": "Portuguese"` pair in a translation table, value allowed to wrap. */
function pairs(file: string): Array<[string, string]> {
  const src = readFileSync(file, "utf8");
  return [...src.matchAll(/"((?:[^"\\\n]|\\.){3,300})":\s*\n?\s*"((?:[^"\\\n]|\\.){2,600})"/g)].map(
    ([, en, pt]) => [en, pt] as [string, string],
  );
}

for (const file of ["src/data/pt-glossary.ts", "src/data/pt-features.ts"]) {
  test(`${file}: the latch is never called lingueta, the deadbolt never trinco`, () => {
    for (const [en, pt] of pairs(file)) {
      if (isLatch(en)) {
        assert.ok(!/\blingueta/i.test(pt), `"${en}" is a latch but its Portuguese says lingueta: "${pt}"`);
      } else if (isDead(en)) {
        assert.ok(!/\btrinco/i.test(pt), `"${en}" is a deadbolt but its Portuguese says trinco: "${pt}"`);
      }
    }
  });
}

test("the published glossary term for Latch is Trinco", () => {
  const src = readFileSync("src/data/hardware-terms.ts", "utf8");
  assert.match(src, /termPt: "Trinco"/, "hardware-terms.ts must publish Trinco as the Portuguese for Latch");
  assert.ok(!/lingueta/i.test(src), "hardware-terms.ts still calls something a lingueta");
});

test("the correction is guarded by a runnable check, not only by this test", () => {
  /*
    This test reads source files. The 207 product records are checked by the script, which
    has to stay wired into test:export — otherwise a regenerated record can reintroduce
    the swap and nothing here would see it.
  */
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  assert.match(pkg.scripts["copy:pt-latch"] ?? "", /fix-pt-latch-terms\.mjs/);
  assert.match(pkg.scripts["test:export"], /fix-pt-latch-terms\.mjs --check/);
});
