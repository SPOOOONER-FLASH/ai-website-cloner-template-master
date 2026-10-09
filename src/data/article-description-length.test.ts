import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * Guide and news meta descriptions stay within what a search result shows.
 *
 * On 2026-10-09 the copy session's full audit found 161 English, Spanish and Portuguese
 * descriptions over 160 characters (longest 262). Google cuts at roughly 155–160, so the
 * clause that made the page worth clicking was usually the one cut off, on a site whose
 * Google click-through had fallen to 0.87%. All 161 were rewritten answer-first and
 * fact-checked against each article body. The seven overlay locales are already held to
 * 155 by their own pipeline; this locks the three record-level fields.
 */

const LIMIT = 160;
// E1 title experiment (readout 2026-10-14): these three pages stay untouched until then.
const E1 = new Set(["door-hardware-hs-codes-2026", "door-preparation-161-and-86-2026", "glass-door-thickness-and-cutouts-2026"]);
const FIELDS = ["seoDescription", "seoDescriptionEs", "seoDescriptionPt"] as const;

test("guide and news descriptions are at most 160 characters", () => {
  const over: string[] = [];
  for (const dir of ["content/guides", "content/news"]) {
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const record = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as Record<string, unknown>;
      if (E1.has(String(record.slug ?? file.replace(/\.json$/, "")))) continue;
      for (const field of FIELDS) {
        const value = record[field];
        if (typeof value === "string" && [...value].length > LIMIT) over.push(`${dir}/${file} ${field}: ${[...value].length}`);
      }
    }
  }
  assert.deepEqual(over, [], `Descriptions over ${LIMIT} characters:\n${over.join("\n")}`);
});
