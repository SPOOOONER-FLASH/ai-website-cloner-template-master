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

/**
 * Every English → Portuguese pair in a translation table.
 *
 * BOTH key spellings, and that is the whole point of this function.
 *
 * The first version matched only `"English": "Portuguese"`. TypeScript lets a key that is
 * a valid identifier go unquoted, so the single-word rows are written `Latch: "Lingueta"`
 * — and the regex walked straight past all five of them. The table pass that used the
 * same pattern left them behind, and this test then reported the file clean: `Latch`
 * still said `Lingueta` and `Deadbolt` still said `Trinco`, which is exactly the swap
 * everything else had just been corrected out of.
 *
 * It is the second time in this work that unquoted single-word keys have hidden rows from
 * a matcher — the glossary audit earlier reported 86 missing keys instead of 12 for the
 * same reason. A matcher over source text has to accept every spelling the language does.
 */
function pairs(file: string): Array<[string, string]> {
  const lines = readFileSync(file, "utf8").split("\n");
  const out: Array<[string, string]> = [];
  for (let i = 0; i < lines.length; i++) {
    /* `"English": "Portuguese"` or `English: "Portuguese"`, on one line or wrapped to two. */
    const key = /^\s*(?:"((?:[^"\\]|\\.)+)"|([A-Za-z_$][\w$]*))\s*:\s*(.*)$/.exec(lines[i]);
    if (!key) continue;
    const en = key[1] ?? key[2];
    const rest = key[3].trim() || (lines[i + 1] ?? "").trim();
    const value = /^"((?:[^"\\]|\\.)*)"/.exec(rest);
    if (value) out.push([en, value[1]]);
  }
  return out;
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
