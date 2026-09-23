import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * 2026-09-22: /es/ and /pt/ article pages were served in English whenever the translated
 * body's paragraph count differed from the English one — live on four pages, and about to
 * be forty after an English-only expansion. The rule is now "use the translation if there
 * is one"; this keeps it from quietly returning.
 */
const detail = readFileSync(join(process.cwd(), "src", "components", "site", "NewsDetail.tsx"), "utf8");

test("a translated article body is used whenever it exists, whatever its length", () => {
  assert.match(detail, /const body = localeBody\?\.length \? localeBody : article\.body;/);
  assert.doesNotMatch(detail, /localeBody\?\.length === article\.body\.length/);
});
