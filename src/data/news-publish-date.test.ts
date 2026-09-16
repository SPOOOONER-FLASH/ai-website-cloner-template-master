import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * Every article's `publishedAt` must be a bare YYYY-MM-DD.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS WORTH A TEST
 *
 * `getPublishedNews` filters with `article.publishedAt <= todayIso`, where `todayIso` is
 * `new Date().toISOString().slice(0, 10)` — ten characters. That is a STRING comparison,
 * so a full ISO timestamp never passes it:
 *
 *     "2026-09-16T09:00:00+08:00" <= "2026-09-16"   // false, always
 *
 * On 2026-09-16 ten new articles were written with timestamps instead of dates. Every
 * layer reported success: the records were valid JSON, the type accepted the string,
 * `npm test` passed 313 of 313, the build completed, and `seo:deadlinks` audited 1,370
 * pages without complaint. The articles simply were not among them, and the only way to
 * find out was to look for the files in `out/`.
 *
 * That is the same silent-failure shape as the `gallery` / `images` field-name bug in
 * September: a write that succeeds, a type that permits it, and a renderer that draws
 * nothing. The cheap guard is to pin the format the filter actually requires.
 *
 * A future date is allowed by this test and is a separate trap, documented on
 * getPublishedNews itself: nothing schedules a build, so a post-dated article stays
 * invisible until somebody rebuilds on or after that day.
 */
test("every news article's publishedAt is a bare date the publish filter can compare", () => {
  const dir = path.join(process.cwd(), "content/news");
  const offenders: string[] = [];

  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
    const article = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as {
      slug: string;
      publishedAt: string;
    };

    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.publishedAt)) {
      offenders.push(`${article.slug}: ${article.publishedAt}`);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    "publishedAt is compared as a string against a ten-character date; " +
      "a timestamp can never be <= it, so these articles would never publish",
  );
});
