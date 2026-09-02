import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import moves from "../../content/taxonomy-moves.json" with { type: "json" };
import {
  canonicalProductCategory,
  getLegacyProductParams,
} from "./category-aliases.ts";

/**
 * The catalogue placements a colleague corrected on 2026-09-02, locked so they survive
 * the next bulk import.
 *
 * These are not opinions we can re-derive from the data — they are somebody looking at
 * the photograph and saying "that is a push bar, not a latch". A re-import that resets
 * `categoryPath` from a supplier sheet would silently undo all three, and nothing else in
 * the build would notice: every page would still render, just filed where the buyer will
 * not look. AGENTS.md's rule applies — if one of these should change, change it here in
 * the same commit so the override is deliberate.
 */

const product = (file: string) =>
  JSON.parse(readFileSync(`content/products/${file}.json`, "utf8"));

test("the 2026-09-02 review placements still hold", () => {
  assert.deepEqual(product("315-pry-latch").categoryPath, ["panic-exit-devices"]);
  assert.deepEqual(product("600-concealed-sliding-door-handle").categoryPath, [
    "stainless-steel-handles",
  ]);
  assert.deepEqual(product("ansi-grade-3-keyed-deadbolt-lock-set").categoryPath, [
    "grip-handle-sets",
  ]);
});

test("BH01 does not claim a door type, because it mounts on a wall", () => {
  const bh01 = product("bh01-bathroom-accessories");
  assert.ok(
    !bh01.doorTypes.includes("Bathroom"),
    '"Bathroom" is a room, not a door type — it told buyers a grab bar goes on a door',
  );
});

test("every move keeps its old URL resolving", () => {
  const legacy = getLegacyProductParams();
  for (const move of moves.productMoves) {
    assert.ok(
      legacy.some((p) => p.category === move.from && p.slug === move.slug),
      `${move.slug} must still be built at its old path or the URL 404s`,
    );
    assert.equal(canonicalProductCategory(move.from, move.slug), move.to);
    // The new path must not redirect to itself.
    assert.equal(canonicalProductCategory(move.to, move.slug), move.to);
  }
});

test("a move names two different, non-empty categories", () => {
  for (const move of moves.productMoves) {
    assert.ok(move.from && move.to, "both ends of a move must be named");
    assert.notEqual(move.from, move.to);
    assert.ok(move.why?.length > 20, `${move.slug} needs a reason a later reader can use`);
  }
});

test("the nginx conf is in step with the move table", () => {
  /*
    Generated file, checked rather than regenerated here: a test that rewrites its own
    input always passes. If this fails, run scripts/build-taxonomy-redirects.mjs.
  */
  const conf = readFileSync("deploy/nginx/taxonomy-redirects.conf", "utf8");
  for (const move of moves.productMoves) {
    const from = `/products/${move.from}/${move.slug}`;
    const to = `/products/${move.to}/${move.slug}/`;
    assert.ok(conf.includes(`location = ${from} {`), `missing 301 for ${from}`);
    assert.ok(conf.includes(`location = ${from}/ {`), `missing 301 for ${from}/`);
    assert.ok(conf.includes(`return 301 ${to};`), `missing destination ${to}`);
  }
});
