import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/*
  ProductCard defaults to locale "en", so a call that forgets the prop links a Korean or
  Spanish reader to the English product page. The finder's filtered results did exactly
  that until 2026-10-10 (seen in a Clarity recording: /ko/product-finder/ → English page).
*/
function tsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

test("every <ProductCard> is given the page's locale", () => {
  const missing = tsxFiles(join(process.cwd(), "src")).flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/<ProductCard\b[^>]*\/>/g)]
      .filter((match) => !/\blocale=/.test(match[0]))
      .map((match) => `${file}: ${match[0]}`),
  );
  assert.deepEqual(missing, []);
});
