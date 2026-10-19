import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

/*
  Every non-English locale has /<code>/llms.txt, robots.txt lets crawlers fetch it past the
  blanket *.txt disallow, and the root llms.txt points at it (2026-10-13). Before this the only
  fr/de/ja/ko/tr/ru/ar/pt URL an answer engine was handed was the locale home page.
*/
const LOCALES = ["es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"];

test("each locale has its own llms.txt route", () => {
  for (const l of LOCALES) {
    const route = `src/app/${l}/llms.txt/route.ts`;
    assert.ok(existsSync(route), `${route} missing`);
    assert.match(readFileSync(route, "utf8"), new RegExp(`localeLlmsResponse\\("${l}"\\)`));
  }
});

test("robots allows the locale llms files and the root file links them", () => {
  assert.match(readFileSync("src/lib/seo-policy.ts", "utf8"), /"\/\*\/llms\.txt"/);
  assert.match(readFileSync("src/app/llms.txt/route.ts", "utf8"), /\/\$\{code\}\/llms\.txt/);
});
