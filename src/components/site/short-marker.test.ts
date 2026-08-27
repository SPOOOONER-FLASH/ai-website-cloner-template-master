import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const sourceRoot = join(process.cwd(), "src");
const css = readFileSync(join(sourceRoot, "app", "globals.css"), "utf8");

function tsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

test("the shared short marker is monochrome and keyboard-equivalent", () => {
  assert.match(css, /\.short-marker[\s\S]*background-color:\s*currentColor/);
  assert.match(css, /\.short-marker:focus-visible::after/);
  assert.match(css, /\.short-marker-group::after/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.short-marker/);
});

test("group markers belong only to an explicit interactive surface", () => {
  assert.doesNotMatch(css, /\.group:(?:hover|focus-within)\s+\.short-marker-group/);
  assert.match(css, /\.short-marker-surface:focus-visible\s+\.short-marker-group::after/);
  assert.match(css, /\.short-marker-surface:has\(:focus-visible\)\s+\.short-marker-group::after/);
  assert.match(css, /\.short-marker-surface:hover\s+\.short-marker-group::after/);

  const missingSurface = tsxFiles(sourceRoot).flatMap((path) => {
    const source = readFileSync(path, "utf8");
    if (!source.includes("short-marker-group") || path.endsWith("ArrowLink.tsx")) return [];
    return source.includes("short-marker-surface") ? [] : [path];
  });

  assert.deepEqual(missingSurface, []);
});

test("legacy underline utilities cannot recreate the double-line interaction", () => {
  const violations = tsxFiles(sourceRoot).flatMap((path) => {
    const source = readFileSync(path, "utf8");
    const tokens = [
      "hover:underline",
      "group-hover:underline",
      "hover:[&_a]:underline",
      " underline underline-offset",
      'className="underscore',
    ];
    return tokens.filter((token) => source.includes(token)).map((token) => `${path}: ${token}`);
  });

  assert.deepEqual(violations, []);
});
