import assert from "node:assert/strict";
import test from "node:test";
import { buildLocaleSitemapEntries, buildRobotsRules } from "./seo-policy.ts";
import { hasSpanishMirror } from "./spanish-mirror.ts";

test("the staging robots policy remains a hard site-wide block", () => {
  assert.deepEqual(buildRobotsRules(false), [{ userAgent: "*", disallow: "/" }]);
});

test("the launch robots policy keeps render assets crawlable and the CMS private", () => {
  const [rule] = buildRobotsRules(true);
  const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];

  assert.ok(disallow.includes("/admin/"));
  assert.equal(disallow.includes("/_next/"), false);
});

test("sitemap entries omit invented freshness unless a real date is supplied", () => {
  const common = {
    en: "https://example.test/projects/example/",
    es: "https://example.test/es/projects/example/",
    bilingual: true,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  };

  const withoutDate = buildLocaleSitemapEntries(common);
  assert.equal(withoutDate.every((entry) => !("lastModified" in entry)), true);

  const publishedAt = new Date("2026-08-20T00:00:00.000Z");
  const withDate = buildLocaleSitemapEntries({ ...common, lastModified: publishedAt });
  assert.equal(withDate.every((entry) => entry.lastModified === publishedAt), true);
});

/*
  This assertion previously locked the opposite: /products/argentina-ar4 mirrored while
  /products and /products/lock-cases did not, because only the Argentina collection had
  Spanish routes. The client approved the full Spanish catalogue on 2026-08-30 and
  src/app/es/products/ now builds the index, all fifteen canonical categories and every product
  detail, so the claim this test protects has genuinely changed.

  What it still protects is the rule that made it worth writing: hreflang is only
  declared for paths that exist in both languages. /downloads has no Spanish route and
  must stay false.
*/
test("the Spanish catalogue mirrors /products, and hreflang stops where the routes do", () => {
  assert.equal(hasSpanishMirror("/products"), true);
  assert.equal(hasSpanishMirror("/products/lock-cases"), true);
  assert.equal(hasSpanishMirror("/products/lock-cases/lc8520ps-lock-case"), true);
  assert.equal(hasSpanishMirror("/products/argentina-ar4"), true);

  assert.equal(hasSpanishMirror("/downloads"), false);
  assert.equal(hasSpanishMirror("/news"), false);
  assert.equal(hasSpanishMirror("/faq"), false);
});
