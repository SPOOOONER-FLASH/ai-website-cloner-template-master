import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  categoryHrefOf,
  isSubsequence,
  matchRanges,
  score,
  startsWord,
  suggestRanges,
  type SearchIndexEntry,
} from "./search-matching.ts";

/**
 * Runs against the REAL built index, not a fixture.
 *
 * Every one of these cases came from somebody typing into the live box and telling us
 * what happened, and the failures were all about the catalogue's actual vocabulary —
 * "lv" living inside "silver", "d" living inside "Sliding". A fixture of three invented
 * products would pass every one of these assertions while the site stayed broken.
 */
const index: SearchIndexEntry[] = JSON.parse(
  readFileSync("public/search-index.json", "utf8"),
);

const terms = (q: string) => q.toLowerCase().trim().split(/\s+/).filter(Boolean);
const hits = (q: string) => index.filter((e) => score(e, terms(q)) > 0);

test("a two-letter term does not match the middle of a word", () => {
  /*
    "lv" returned nine products, all of them the middle of SILVER. A shopper who types a
    brand we do not carry must get an empty state, not a page of unrelated locks.
  */
  assert.equal(hits("lv").length, 0, "lv must match nothing");
  assert.ok(
    index.some((e) => e.text.includes("silver")),
    "the corpus still contains the word this guards against",
  );
});

test("two-letter finish codes still match, because they are whole words", () => {
  // The fix must not cost us SS / PB / AB, which buyers type constantly.
  for (const code of ["ss", "pb", "ab"]) {
    assert.ok(hits(code).length > 0, `${code} should still match products`);
  }
});

test("a three-letter-or-longer term may match inside a word", () => {
  // "bolt" has to keep finding "deadbolts" — this is why the cut-off is 3, not 4.
  const bolt = hits("bolt");
  assert.ok(bolt.length > 0);
  assert.ok(
    bolt.some((e) => e.text.includes("deadbolt")),
    "bolt must still reach deadbolts",
  );
});

test("matching ranges come from the range name, at a word start", () => {
  const d = matchRanges(index, terms("d")).map((e) => e.title);
  assert.ok(d.includes("Deadbolts"));
  assert.ok(d.includes("Door Closers"));

  /*
    The two rejected implementations, held here so nobody re-introduces them: body-text
    matching pulled in Grip Handle Sets (no "d" in the name at all), and plain substring
    matching on the name pulled in Sliding Hook Locks and Lock Cylinders — eleven of
    fifteen ranges, which tells the reader nothing.
  */
  assert.ok(!d.includes("Grip Handle Sets"), "name only, never the body text");
  assert.ok(!d.includes("Sliding Hook Locks"), "word start, not any position");
  assert.ok(!d.includes("Lock Cylinders"), "word start, not any position");
  assert.ok(d.length <= 6, `d matched ${d.length} ranges, too many to be a suggestion`);
});

test("an unambiguous range name matches exactly one range", () => {
  // This is what lets Enter broaden to a range without guessing between several.
  assert.deepEqual(
    matchRanges(index, terms("deadbolt")).map((e) => e.title),
    ["Deadbolts"],
  );
});

test("a term we do not stock still suggests the closest range by its letters", () => {
  // "lv" is how somebody abbreviates "lever"; its letters are inside "Lever Handles".
  const suggested = suggestRanges(index, "lv").map((e) => e.title);
  assert.deepEqual(suggested, ["Lever Handles"]);
});

test("gibberish suggests nothing rather than something arbitrary", () => {
  assert.equal(hits("zzzzz").length, 0);
  assert.deepEqual(suggestRanges(index, "zzzzz"), []);
});

test("a product href resolves to its category href", () => {
  const product = index.find((e) => e.model === "d101 ab");
  assert.ok(product, "the fixture model still exists in the catalogue");
  const href = categoryHrefOf(product.href);
  assert.equal(href, "/products/deadbolts/");
  assert.ok(
    index.some((e) => e.type === "category" && e.href === href),
    "the derived href is a real category page",
  );
});

test("category href derivation ignores anything that is not a product URL", () => {
  assert.equal(categoryHrefOf("/products/deadbolts/"), null);
  assert.equal(categoryHrefOf("/news/some-article/"), null);
  assert.equal(
    categoryHrefOf("/es/products/deadbolts/d101-ab-deadbolts/"),
    "/es/products/deadbolts/",
  );
});

test("word and subsequence helpers behave at the edges", () => {
  assert.equal(startsWord("polished silver brass", "lv"), false);
  assert.equal(startsWord("d101 ss deadbolt", "ss"), true);
  assert.equal(startsWord("deadbolt", "d"), true);

  assert.equal(isSubsequence("lv", "leverhandles"), true);
  assert.equal(isSubsequence("lv", "lockcylinders"), false);
  assert.equal(isSubsequence("", "anything"), true);
});
