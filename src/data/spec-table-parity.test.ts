import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * A translated spec table is never SHORTER than the English one.
 *
 * ---------------------------------------------------------------------------
 * THE DEFECT
 *
 * `072-panic-exit-device-lock-case` published ten spec rows in English and Portuguese and
 * six in Spanish. The four missing ones were centre distance, follower, cylinder apertures
 * and what the case is used with — which is to say, the four a specifier needs to decide
 * whether the case fits their door.
 *
 * Nothing failed. The page rendered, every row on it was correct Spanish, and the audits
 * were quiet: `audit:es:pages` compares the WORDS on a page against its twins, and a row
 * that is absent has no words to compare.
 *
 * ---------------------------------------------------------------------------
 * WHY LENGTH IS THE RIGHT THING TO ASSERT
 *
 * Not "the labels match": a Spanish table legitimately merges or reorders rows, and the
 * translated label is not derivable for every field. But a table cannot be complete and
 * shorter at the same time. Count is the weakest check that still catches a dropped row,
 * and a weak check nobody argues with survives longer than a strict one somebody deletes.
 */
const DIR = path.join(process.cwd(), "content/products");

test("no translated spec table is shorter than the English one", () => {
  const short: string[] = [];

  for (const file of fs.readdirSync(DIR).filter((name) => name.endsWith(".json"))) {
    const record = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")) as {
      specs?: unknown[];
      specsEs?: unknown[];
      specsPt?: unknown[];
    };
    const english = record.specs?.length ?? 0;
    if (!english) continue;

    for (const [locale, rows] of [
      ["es", record.specsEs],
      ["pt", record.specsPt],
    ] as const) {
      /* Absent is a different state from incomplete, and it is a legitimate one. */
      if (!rows?.length) continue;
      if (rows.length < english) {
        short.push(`${file} (${locale}): ${rows.length} rows against ${english} English`);
      }
    }
  }

  assert.deepEqual(
    short,
    [],
    "these records publish fewer specs in a translation than in English — the reader of " +
      "that language is deciding with less information than the English reader",
  );
});
