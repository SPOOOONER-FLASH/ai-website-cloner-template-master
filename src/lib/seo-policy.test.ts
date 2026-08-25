import assert from "node:assert/strict";
import test from "node:test";
import { buildLocaleSitemapEntries, buildRobotsRules } from "./seo-policy.ts";

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
