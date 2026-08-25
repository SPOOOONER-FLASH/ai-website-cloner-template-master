import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/**
 * Guards public/admin/config.yml.
 *
 * Decap parses this file in the browser and refuses to render the whole admin if
 * anything in it is malformed. Nothing else in the build reads it, so a broken config
 * produces a green CI, a successful deploy, and an admin panel that shows only
 * "Error loading the CMS configuration" — which is exactly what happened: commit
 * 5869a40f appended a rewritten block instead of replacing the old one, and the CMS was
 * dead for a week before anyone opened it.
 *
 * These checks are deliberately structural rather than a full YAML parse: the repository
 * has no YAML dependency, and the two faults that actually occur — a duplicate key and a
 * duplicated block — are both visible from the indentation.
 */
const CONFIG = "public/admin/config.yml";
const source = readFileSync(CONFIG, "utf8");
const lines = source.split(/\r?\n/);

/** Sibling keys at the same indent inside the same mapping. */
function duplicateKeys(): string[] {
  const stack: { indent: number; keys: Set<string> }[] = [];
  const dups: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^(\s*)(-\s*)?([A-Za-z_][\w-]*):/);
    if (!m) continue;

    const isItem = Boolean(m[2]);
    const indent = m[1].length + (isItem ? m[2].length : 0);
    const key = m[3];

    while (stack.length && stack[stack.length - 1].indent > indent) stack.pop();
    // A new list item starts a fresh mapping, so sibling scopes deeper than it are gone.
    if (isItem) {
      for (let k = stack.length - 1; k >= 0; k--) if (stack[k].indent >= indent) stack.splice(k, 1);
    }

    const top = stack[stack.length - 1];
    if (top && top.indent === indent) {
      if (top.keys.has(key)) dups.push(`line ${i + 1}: "${key}"`);
      top.keys.add(key);
    } else {
      stack.push({ indent, keys: new Set([key]) });
    }
  }
  return dups;
}

test("the CMS config has no duplicate sibling keys", () => {
  const dups = duplicateKeys();
  assert.deepEqual(
    dups,
    [],
    `Decap will refuse to load the admin.\n  ${dups.join("\n  ")}`,
  );
});

test("no collection name appears twice", () => {
  const names = lines
    .map((l) => l.match(/^ {2}- name: "([^"]+)"/)?.[1])
    .filter((n): n is string => Boolean(n));
  assert.deepEqual(
    names,
    [...new Set(names)],
    `A collection is defined twice: ${names.join(", ")}`,
  );
});

test("no content file is edited by two different entries", () => {
  const files = [...source.matchAll(/file: "([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set<string>();
  const twice = files.filter((f) => (seen.has(f) ? true : (seen.add(f), false)));
  assert.deepEqual(twice, [], `Two CMS entries write the same file: ${twice.join(", ")}`);
});

test("the promo panel edits the fields the site actually reads", () => {
  // The dialog is driven by cards + cooldownMinutes; an older single-card shape and an
  // hours-based cooldown both existed in this file at once.
  assert.ok(source.includes('name: "cards"'), "promo must expose the cards list");
  assert.ok(source.includes("cooldownMinutes"), "promo must expose cooldownMinutes");
  assert.ok(!source.includes("cooldownHours"), "cooldownHours was replaced by cooldownMinutes");
});
