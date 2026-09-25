import assert from "node:assert/strict";
import test from "node:test";
import { marketLocales, MARKET_MIRROR_PATHS } from "../market-locales.ts";
import { marketCopy } from "./index.ts";
import { sourceEn } from "./source.en.ts";

/**
 * The seven market copies against the English source they were written from.
 *
 * The compiler already holds the SHAPE (every field present, every type right). What it
 * cannot see is the content: a translator who skipped a paragraph and left the English
 * in, an array that lost an item, a `{n}` placeholder translated away, a meta title that
 * runs past what a search result shows. These are the checks the Spanish and Portuguese
 * trees learned to need one outage at a time — see src/lib/language-choices.test.ts and
 * scripts/audit-pt-pages.mjs — written down once here for all seven.
 */

/** Every leaf string with its dotted path, so a failure names the field. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => leaves(item, path ? `${path}.${key}` : key));
  }
  return [];
}

/**
 * Fields that are COPIED from the source, not translated — identifiers, plus the fields
 * that hold place names and figures (`cities`, `stats[].value`), which legitimately read
 * the same in German or French as in English. `home.kicker` is the brand line.
 */
const VERBATIM = /(^|\.)(locale|number|slug|issuer|reference|coversModel|cities|value)$|^home\.kicker$/;

const source = leaves(sourceEn);

for (const code of marketLocales) {
  const copy = marketCopy[code];

  test(`${code}: carries every field the English source has, and no extra`, () => {
    const got = leaves(copy).map(([path]) => path).filter((path) => path !== "locale");
    const want = source.map(([path]) => path);
    assert.deepEqual(got, want);
    assert.equal(copy.locale, code);
  });

  test(`${code}: keeps slugs, category keys, record identifiers and the {n} placeholder`, () => {
    assert.deepEqual(Object.keys(copy.categories), Object.keys(sourceEn.categories));
    assert.deepEqual(
      copy.home.flagship.map((f) => f.slug),
      sourceEn.home.flagship.map((f) => f.slug),
    );
    copy.certifications.records.forEach((record, i) => {
      const original = sourceEn.certifications.records[i]!;
      assert.equal(record.issuer, original.issuer, `records[${i}].issuer`);
      assert.equal(record.reference, original.reference, `records[${i}].reference`);
      assert.equal(record.coversModel, original.coversModel, `records[${i}].coversModel`);
    });
    assert.ok(copy.common.modelsCount.includes("{n}"), "common.modelsCount lost its {n}");
    for (const page of MARKET_MIRROR_PATHS) assert.ok(copy.meta[page], `meta[${page}]`);
  });

  test(`${code}: is translated, not the English source with a different locale`, () => {
    const untranslated = leaves(copy)
      .filter(([path, value]) => !VERBATIM.test(path) && value.length > 14)
      .filter(([path, value]) => source.some(([sp, sv]) => sp === path && sv === value))
      .map(([path]) => path);
    assert.deepEqual(untranslated, [], "these fields still hold the English sentence");
  });

  test(`${code}: meta titles and descriptions fit a search result`, () => {
    for (const page of MARKET_MIRROR_PATHS) {
      const { title, description } = copy.meta[page];
      const t = [...title].length;
      const d = [...description].length;
      assert.ok(t >= 20 && t <= 45, `meta[${page}].title is ${t} characters (20–45)`);
      assert.ok(d >= 80 && d <= 160, `meta[${page}].description is ${d} characters (80–160)`);
      assert.ok(!/…$|\.\.\.$/.test(description), `meta[${page}].description is truncated`);
    }
  });

  test(`${code}: no Chinese characters, no Eastern Arabic digits, no direction marks`, () => {
    for (const [path, value] of leaves(copy)) {
      if (code !== "ja") {
        assert.ok(!/\p{Script=Han}/u.test(value), `${path} contains Han characters`);
      } else {
        assert.ok(!/\p{Script=Han}{7,}/u.test(value), `${path} has a 7+ kanji run with no kana`);
      }
      assert.ok(!/[٠-٩۰-۹]/.test(value), `${path} uses Eastern Arabic digits`);
      assert.ok(!/[‎‏‪-‮⁦-⁩]/.test(value), `${path} carries a bidi control`);
    }
  });
}

test("the seven market locales are the client's seven", () => {
  assert.deepEqual([...marketLocales].sort(), ["ar", "de", "fr", "ja", "ko", "ru", "tr"]);
});
