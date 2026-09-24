import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error plain .mjs script without type declarations
import { scan } from "../../scripts/normalize-product-dashes.mjs";

/**
 * No em dashes in HYDE product records or in the ES/PT glossary string literals (2026-09-24).
 *
 * The client reads an em dash in page copy as a sign of machine writing. About 2,700 sat in
 * the product records: SEO titles, spec values, image labels, summaries. The spec values are
 * also glossary keys, which is why the records and the glossaries are rewritten by one script
 * with one set of rules; change either alone and every Spanish or Portuguese spec row quietly
 * falls back to English. Chinese fields and RAYEN-only records are out of scope (see the script).
 */
test("product records and the ES/PT glossaries carry no em dash", () => {
  const left: { file: string; n: number }[] = scan();
  assert.deepEqual(
    left.map((c) => `${c.file.replace(/\\/g, "/").split("/").slice(-2).join("/")} (${c.n})`),
    [],
    "run node scripts/normalize-product-dashes.mjs --write",
  );
});
