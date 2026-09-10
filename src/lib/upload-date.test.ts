import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { isoUploadDate } from "./upload-date.ts";

/*
  Google raised both of its complaints against one field on 2026-09-10:
  "uploadDate is missing timezone information" and "the uploadDate datetime value is
  invalid". A bare calendar date is both at once, because VideoObject.uploadDate is a
  DateTime and Google requires an offset. 191 product clips ride on this one string.
*/

test("a bare date gains midnight and the factory's offset", () => {
  assert.equal(isoUploadDate("2026-09-04"), "2026-09-04T00:00:00+08:00");
});

test("the offset is +08:00, not Z", () => {
  /*
    Not a validator-pleasing detail. Z would move every upload back eight hours and claim
    the factory published at 16:00 the day before. Zhongshan is UTC+8 year-round — no
    daylight saving in mainland China since 1991 — so a fixed offset is correct rather
    than a simplification that drifts twice a year.
  */
  const result = isoUploadDate("2026-09-04");
  assert.ok(result?.endsWith("+08:00"), result ?? "null");
  assert.ok(!result?.endsWith("Z"));
});

test("a value that already carries an offset is left alone", () => {
  /* Fixing bare dates must not restamp records a later import may store correctly. */
  assert.equal(isoUploadDate("2026-09-04T09:30:00+08:00"), "2026-09-04T09:30:00+08:00");
  assert.equal(isoUploadDate("2026-09-04T01:30:00Z"), "2026-09-04T01:30:00Z");
});

test("a datetime with no offset gets one", () => {
  assert.equal(isoUploadDate("2026-09-04T09:30"), "2026-09-04T09:30:00+08:00");
  assert.equal(isoUploadDate("2026-09-04T09:30:15"), "2026-09-04T09:30:15+08:00");
});

test("an unusable value returns null so the caller can drop the video", () => {
  /*
    A video absent from the markup is a lost rich result; a malformed one is an error on
    the page. Given the choice, omit.
  */
  assert.equal(isoUploadDate(undefined), null);
  assert.equal(isoUploadDate(""), null);
  assert.equal(isoUploadDate("   "), null);
  assert.equal(isoUploadDate("4 September 2026"), null);
  assert.equal(isoUploadDate("2026/09/04"), null);
});

test("every uploadDate in the catalogue normalises", () => {
  /*
    The real assertion. If any record carries a format this function cannot read, its
    video silently disappears from the markup — so the catalogue itself is the fixture.
  */
  const bad: string[] = [];
  for (const file of readdirSync("content/products")) {
    if (!file.endsWith(".json")) continue;
    const record = JSON.parse(readFileSync(`content/products/${file}`, "utf8"));
    for (const video of record.videos ?? []) {
      if (!video.uploadDate) continue;
      if (!isoUploadDate(video.uploadDate)) bad.push(`${file}: ${video.uploadDate}`);
    }
  }
  assert.deepEqual(bad, [], "these uploadDate values cannot be normalised");
});
