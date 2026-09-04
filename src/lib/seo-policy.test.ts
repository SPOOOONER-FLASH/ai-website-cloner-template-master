import assert from "node:assert/strict";
import test from "node:test";
import { buildLocaleSitemapEntries, buildRobotsRules } from "./seo-policy.ts";
import { hasSpanishMirror } from "./spanish-mirror.ts";
import { localisedHref } from "./spanish-mirror.ts";

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
  declared for paths that exist in both languages.

  UPDATED 2026-09-04, on the client's instruction to finish the Spanish side rather than
  wait for Codex. /faq, /downloads, /certifications, /compare, /collections and
  /configurator all now have Spanish routes, so the assertions that they must NOT mirror
  were locking a decision that has been deliberately reversed. /news is the one that still
  holds: eight technical articles of long-form prose, which is real translation rather
  than data rendering, and a machine-translated article about EN 1125 is worse than an
  English one.
*/
test("the Spanish catalogue mirrors /products, and hreflang stops where the routes do", () => {
  assert.equal(hasSpanishMirror("/products"), true);
  assert.equal(hasSpanishMirror("/products/lock-cases"), true);
  assert.equal(hasSpanishMirror("/products/lock-cases/lc8520ps-lock-case"), true);
  assert.equal(hasSpanishMirror("/products/argentina-ar4"), true);

  // Shipped 2026-09-03/04.
  assert.equal(hasSpanishMirror("/faq"), true);
  assert.equal(hasSpanishMirror("/downloads"), true);
  assert.equal(hasSpanishMirror("/certifications"), true);
  assert.equal(hasSpanishMirror("/compare/deadbolts"), true);
  assert.equal(hasSpanishMirror("/collections/knob-locks-tubular-locks"), true);
  assert.equal(hasSpanishMirror("/configurator"), true);

  // Still English-only. An hreflang pointing at a 404 is worse than no hreflang.
  assert.equal(hasSpanishMirror("/news"), false);
  assert.equal(hasSpanishMirror("/product-finder"), false);
});

/*
  The navigation and hreflang must agree about which paths have a Spanish twin.

  They did not, and the failure was silent: `localisedHref` kept its own
  Set(["/company","/contact","/projects"]) while hreflang read spanish-mirror.ts. When
  the Spanish catalogue shipped, every one of the 459 Spanish pages declared a Spanish
  alternate in its head while its own menu linked back into the English tree. Nothing
  errored — the links resolved, they were just the wrong language.

  This asserts the two agree by construction rather than by coincidence.
*/
test("the navigation prefixes exactly the paths that have a Spanish mirror", () => {
  const mirrored = [
    "/products",
    "/company",
    "/contact",
    "/projects",
    "/faq",
    "/downloads",
    "/certifications",
    "/configurator",
  ];
  for (const href of mirrored) {
    assert.equal(hasSpanishMirror(href), true, `${href} should mirror`);
    assert.equal(localisedHref(href, "es"), `/es${href}`, `${href} should be prefixed`);
    assert.equal(localisedHref(href, "en"), href, `${href} must not be prefixed in English`);
  }

  // No Spanish route: a Spanish visitor gets the English page, never a 404.
  for (const href of ["/news", "/product-finder"]) {
    assert.equal(hasSpanishMirror(href), false, `${href} should not mirror`);
    assert.equal(localisedHref(href, "es"), href, `${href} must stay English`);
  }
});
