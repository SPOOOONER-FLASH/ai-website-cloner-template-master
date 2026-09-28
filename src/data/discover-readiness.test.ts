import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

/*
  Google Discover readiness (client 2026-09-28): large images, a feed, no intrusive popup
  over an article on a phone. Each of these was checked by hand once; these keep it true.
*/

test("every article has a 1200×675 share image under 500 KB", () => {
  const manifest = JSON.parse(readFileSync("src/data/generated/article-share-images.json", "utf8")) as Record<string, { file: string }>;
  for (const section of ["guides", "news"]) {
    for (const f of readdirSync(`content/${section}`).filter((x) => x.endsWith(".json"))) {
      const a = JSON.parse(readFileSync(`content/${section}/${f}`, "utf8"));
      if (!a.heroImage?.src) continue;
      const entry = manifest[`${section}/${a.slug}`];
      assert.ok(entry, `${section}/${a.slug}: no share image — run node scripts/build-article-share-images.mjs`);
      const file = `public${entry.file}`;
      assert.ok(existsSync(file), `${file} missing`);
      assert.ok(statSync(file).size <= 500 * 1024, `${file} is over 500 KB`);
    }
  }
});

test("every locale layout allows large image previews for all engines, not only Googlebot", () => {
  for (const p of ["src/app/(en)/layout.tsx", "src/app/es/layout.tsx", "src/app/pt/layout.tsx", "scripts/scaffold-locale-routes.mjs"]) {
    assert.match(readFileSync(p, "utf8"), /index: true, follow: true, "max-image-preview": "large", googleBot/, p);
  }
});

test("the RSS feed exists and every English page declares it", () => {
  assert.ok(existsSync("src/app/feed.xml/route.ts"));
  assert.match(readFileSync("src/app/(en)/layout.tsx", "utf8"), /<link rel="alternate" type="application\/rss\+xml"[^>]*href="\/feed\.xml"/);
  assert.match(readFileSync("src/app/robots.ts", "utf8"), /absoluteUrl\("\/feed\.xml"\)/);
});

test("every locale has a feed route, declares it in its layout, and robots.txt lists all ten", () => {
  const robots = readFileSync("src/app/robots.ts", "utf8");
  assert.match(robots, /absoluteUrl\("\/feed\.xml"\)/);
  /*
    Asserted as a DERIVATION, not as ten literals.

    This began on 2026-09-28 as two literal checks, for /es/feed.xml and /pt/feed.xml, when
    those were the only translated feeds. The other seven locales got one the same day, and
    robots.ts now maps over `locales` instead of listing them. A hand-typed list is precisely
    what left 645 Portuguese pages unreachable from the language panel in September: a new
    surface does not announce itself to an old list. Matching the map means an eleventh
    locale cannot arrive without a feed.
  */
  assert.match(robots, /locales\s*\.filter\(\(l\) => l !== "en"\)\s*\.map\(\(l\) => absoluteUrl\(`\/\$\{l\}\/feed\.xml`\)\)/);
  for (const l of ["es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"]) {
    assert.ok(existsSync(`src/app/${l}/feed.xml/route.ts`), `${l} feed route missing`);
    assert.match(
      readFileSync(`src/app/${l}/layout.tsx`, "utf8"),
      new RegExp(`<link rel="alternate" type="application/rss\\+xml"[^>]*href="/${l}/feed\\.xml"`),
      l,
    );
  }
});

test("the author profile exists in all ten languages and the Article schema points at it", () => {
  assert.ok(existsSync("src/app/(en)/company/johnson-liu/page.tsx"));
  for (const l of ["es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"]) {
    assert.ok(existsSync(`src/app/${l}/company/johnson-liu/page.tsx`), `${l} author page missing`);
  }
  assert.match(readFileSync("src/components/site/JsonLd.tsx", "utf8"), /"@id": `\$\{siteUrl\}\$\{authorPath\(article\.author\)\}\/#person`/);
  assert.match(readFileSync("src/lib/site-sitemap.ts", "utf8"), /authorSlugs\(\)\.map/);
});

test("article edits are stamped: dateModified follows updatedAt, and the check runs in test:export", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  assert.match(pkg.scripts.content, /stamp-article-revisions\.mjs/);
  assert.match(pkg.scripts["test:export"], /stamp-article-revisions\.mjs --check/);
  assert.match(readFileSync("src/components/site/JsonLd.tsx", "utf8"), /dateModified: article\.updatedAt \?\? article\.publishedAt/);
});

test("no promo card over an article on a phone", () => {
  assert.match(readFileSync("src/components/site/PromoDialog.tsx", "utf8"), /surface === "news" && !forcedOpen\(\) && window\.matchMedia\("\(max-width: 639\.98px\)"\)\.matches/);
});
