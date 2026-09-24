import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error plain .mjs script without type declarations
import { scan } from "../../scripts/normalize-regional-terms.mjs";

/**
 * Spanish pages speak neutral Latin American trade Spanish and Portuguese pages speak Brazilian
 * Portuguese — TODO-MASTER item 8, decided 2026-09-24.
 *
 * On that day the site printed the peninsular `manilla` 805 times (the glossary's own header
 * said `manija`), the guides' Portuguese was European (« », "tem de", "aro", "sítio"), and newer
 * translations had drifted the other way into Mexican (`jaladera`, `cédula`, `alberca`). Every
 * rule and its reason is in scripts/normalize-regional-terms.mjs; this test only fails when a
 * rejected form comes back, and names the file and the rule so the fix is one command:
 *
 *   node scripts/normalize-regional-terms.mjs --write
 */
test("Spanish and Portuguese copy uses the Latin American / Brazilian register", () => {
  const changes: { file: string; tally: Record<string, number> }[] = scan();
  const report = changes
    .slice(0, 10)
    .map((c) => `${c.file.replace(/\\/g, "/").split("/").slice(-2).join("/")}: ${Object.entries(c.tally).map(([k, n]) => `${k} ×${n}`).join(", ")}`)
    .join("\n");
  assert.equal(changes.length, 0, `Regional variants found — run node scripts/normalize-regional-terms.mjs --write\n${report}`);
});
